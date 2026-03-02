---
title: "几个前端笔试题"
date: 2025-03-31T23:04:52+08:00
draft: false
tags: [interview]
categories: [engineer]
---

最近面试，有几个笔试题出现的频率很高，记录一下，给在找工作的朋友们一些参考。

## 实现前端的并发控制，用AI写的代码如下：

```js
/**
 * Request Controller for managing concurrent API requests
 * @param {number} maxConcurrent Maximum number of concurrent requests allowed
 */
class RequestController {
  constructor(maxConcurrent = 5) {
    this.maxConcurrent = maxConcurrent;
    this.queue = [];
    this.runningCount = 0;
  }

  /**
   * Add a request task to the queue
   * @param {Function} requestFn Function that may or may not return a Promise
   * @returns {Promise} Promise that resolves with the request result
   */
  addRequest(requestFn) {
    return new Promise((resolve, reject) => {
      // Add request task to queue
      this.queue.push({
        requestFn,
        resolve,
        reject
      });
      
      // Try to execute queued requests
      this.runNext();
    });
  }

  /**
   * Execute the next request in the queue
   */
  runNext() {
    // If we haven't reached max concurrency and there are pending requests
    if (this.runningCount < this.maxConcurrent && this.queue.length > 0) {
      // Get the next request task from queue
      const { requestFn, resolve, reject } = this.queue.shift();
      this.runningCount++;
      
      try {
        // Execute the request function
        const result = requestFn();
        
        // Handle the result based on whether it's a Promise or not
        if (result instanceof Promise) {
          // If it's a Promise, wait for it to resolve
          result
            .then(finalResult => {
              resolve(finalResult);
              this.runningCount--;
              this.runNext(); // After completion, try to run next request
            })
            .catch(error => {
              reject(error);
              this.runningCount--;
              this.runNext(); // After failure, try to run next request
            });
        } else {
          // If it's not a Promise, resolve immediately
          resolve(result);
          this.runningCount--;
          this.runNext(); // After completion, try to run next request
        }
      } catch (error) {
        // Handle synchronous errors
        reject(error);
        this.runningCount--;
        this.runNext(); // After failure, try to run next request
      }
    }
  }

  /**
   * Add multiple requests and wait for all to complete
   * @param {Array<Function>} requestFns Array of functions that may or may not return Promises
   * @returns {Promise<Array>} Promise that resolves with all request results
   */
  async batchRequest(requestFns) {
    const promises = requestFns.map(fn => this.addRequest(fn));
    return Promise.all(promises);
  }
  
  /**
   * Clear the request queue
   */
  clear() {
    const error = new Error('Request cancelled');
    this.queue.forEach(item => {
      item.reject(error);
    });
    this.queue = [];
  }
  
  /**
   * Dynamically adjust the maximum concurrency
   * @param {number} maxConcurrent New maximum concurrency value
   */
  setMaxConcurrent(maxConcurrent) {
    this.maxConcurrent = maxConcurrent;
    // Try to execute queued requests after adjustment
    this.runNext();
  }
}

// Usage examples
const controller = new RequestController(3); // Max 3 concurrent requests

// Example with functions that return Promises
function mockAsyncRequest(id, delay) {
  return () => new Promise(resolve => {
    console.log(`Async request ${id} started`);
    setTimeout(() => {
      console.log(`Async request ${id} completed`);
      resolve(`Result of async request ${id}`);
    }, delay);
  });
}

// Example with functions that return regular values (not Promises)
function mockSyncRequest(id) {
  return () => {
    console.log(`Sync request ${id} executed`);
    return `Result of sync request ${id}`;
  };
}

// Example with functions that throw errors
function mockErrorRequest(id) {
  return () => {
    console.log(`Error request ${id} executed`);
    throw new Error(`Error in request ${id}`);
  };
}

// Mixed request types example
async function mixedRequestsExample() {
  try {
    // Add async requests
    controller.addRequest(mockAsyncRequest('A', 1000))
      .then(result => console.log(`Got async result: ${result}`));
    
    // Add sync requests
    controller.addRequest(mockSyncRequest('B'))
      .then(result => console.log(`Got sync result: ${result}`));
    
    // Add error request
    controller.addRequest(mockErrorRequest('C'))
      .then(result => console.log(`Got result: ${result}`))
      .catch(err => console.error(`Caught error: ${err.message}`));
    
    // Batch mixed requests
    const mixedRequests = [
      mockAsyncRequest('D', 800),
      mockSyncRequest('E'),
      mockAsyncRequest('F', 1200)
    ];
    
    const results = await controller.batchRequest(mixedRequests);
    console.log('Batch results:', results);
  } catch (error) {
    console.error('Example error:', error);
  }
}

mixedRequestsExample();

```

## 上一题的变种，传入的是一个URL的数组跟最大并发数，并且返回的数组结果的顺序必须跟传入的数组的元素顺序保持一致

同样，用AI帮我们写代码：
```js
/**
 * Execute multiple async tasks with concurrency control while preserving original order
 * @param {Array<Function|string>} tasks Array of async functions or URLs to process
 * @param {number} maxConcurrent Maximum number of concurrent tasks allowed
 * @param {Object} options Optional configuration
 * @returns {Promise<Array>} Promise that resolves with results in the same order as input tasks
 */
function concurrentTasks(tasks, maxConcurrent = 5, options = {}) {
  return new Promise((resolve, reject) => {
    if (!tasks || !Array.isArray(tasks) || tasks.length === 0) {
      resolve([]);
      return;
    }

    const defaultOptions = {
      failOnError: false,
      fetchOptions: {},
      timeout: 30000 // 30 seconds timeout
    };

    const config = { ...defaultOptions, ...options };
    
    // Create a copy of the tasks array
    const tasksToProcess = [...tasks];
    // Array to store results in the correct order
    const results = new Array(tasks.length);
    // Track completed tasks count
    let completed = 0;
    // Track active tasks count
    let active = 0;
    // Track if any error occurred
    let hasError = false;

    /**
     * Convert a URL string to a fetch function
     * @param {string} url URL to fetch
     * @returns {Function} Function that returns a Promise
     */
    function urlToFetchFn(url) {
      return () => {
        const controller = new AbortController();
        const signal = controller.signal;
        
        // Set timeout if specified
        const timeoutId = setTimeout(() => controller.abort(), config.timeout);
        
        return fetch(url, { ...config.fetchOptions, signal })
          .then(response => {
            clearTimeout(timeoutId);
            if (!response.ok) {
              throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
            }
            return response.json();
          })
          .finally(() => clearTimeout(timeoutId));
      };
    }

    /**
     * Process the next task in the queue
     */
    function processNext() {
      // If all tasks have been started, just return
      if (tasksToProcess.length === 0) {
        return;
      }

      // If we've reached max concurrency, wait for some tasks to complete
      if (active >= maxConcurrent) {
        return;
      }

      // Get the next task and its index in the original array
      const task = tasksToProcess.shift();
      const originalIndex = tasks.indexOf(task);
      active++;

      // Convert task to function if it's a URL string
      const taskFn = typeof task === 'string' ? urlToFetchFn(task) : task;

      // Create a promise with timeout
      const timeoutPromise = new Promise((_, timeoutReject) => {
        const timeoutId = setTimeout(() => {
          timeoutReject(new Error(`Task timed out after ${config.timeout}ms`));
        }, config.timeout);
        
        return () => clearTimeout(timeoutId);
      });

      // Execute the task
      Promise.race([
        Promise.resolve().then(() => taskFn()),
        timeoutPromise
      ])
        .then(data => {
          // Store the result at the correct position
          results[originalIndex] = data;
          completed++;
          active--;

          // If all tasks are completed, resolve the promise
          if (completed === tasks.length) {
            resolve(results);
          } else {
            // Otherwise, try to process more tasks
            processNext();
          }
        })
        .catch(error => {
          // Store the error at the correct position
          results[originalIndex] = { error: error.message };
          completed++;
          active--;

          // Mark that an error occurred
          hasError = true;

          // If all tasks are completed, resolve or reject based on error flag
          if (completed === tasks.length) {
            if (config.failOnError && hasError) {
              reject(new Error('One or more tasks failed'));
            } else {
              resolve(results);
            }
          } else {
            // Otherwise, try to process more tasks
            processNext();
          }
        });

      // Try to process more tasks immediately if possible
      processNext();
    }

    // Start processing tasks
    for (let i = 0; i < Math.min(maxConcurrent, tasks.length); i++) {
      processNext();
    }
  });
}

// Usage examples

// Example 1: Using URLs
const urls = [
  'https://jsonplaceholder.typicode.com/posts/1',
  'https://jsonplaceholder.typicode.com/posts/2',
  'https://jsonplaceholder.typicode.com/posts/3',
  'https://jsonplaceholder.typicode.com/posts/4',
  'https://jsonplaceholder.typicode.com/posts/5'
];

concurrentTasks(urls, 2)
  .then(results => {
    console.log('URL results in original order:', results);
  })
  .catch(error => {
    console.error('Error:', error);
  });

// Example 2: Using custom async functions
const customTasks = [
  () => new Promise(resolve => setTimeout(() => resolve('Task 1 result'), 1000)),
  () => new Promise(resolve => setTimeout(() => resolve('Task 2 result'), 500)),
  () => new Promise((_, reject) => setTimeout(() => reject(new Error('Task 3 failed')), 800)),
  () => new Promise(resolve => setTimeout(() => resolve('Task 4 result'), 1200)),
  () => new Promise(resolve => setTimeout(() => resolve('Task 5 result'), 300))
];

concurrentTasks(customTasks, 3, { failOnError: false })
  .then(results => {
    console.log('Custom task results in original order:', results);
  })
  .catch(error => {
    console.error('Error:', error);
  });

// Example 3: Mixed URLs and functions
const mixedTasks = [
  'https://jsonplaceholder.typicode.com/posts/1',
  () => new Promise(resolve => setTimeout(() => resolve('Custom task result'), 800)),
  'https://jsonplaceholder.typicode.com/posts/3'
];

concurrentTasks(mixedTasks, 2)
  .then(results => {
    console.log('Mixed task results in original order:', results);
  })
  .catch(error => {
    console.error('Error:', error);
  });
```
## 实现一个深拷贝，必须考虑特殊情况

```js
/**
 * Deep clone function that handles special cases
 * @param {any} obj Object to be deeply cloned
 * @param {WeakMap} hash Used to handle circular references
 * @returns {any} Deeply cloned object
 */
function deepClone(obj, hash = new WeakMap()) {
  // Handle primitive types and null
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  // Handle circular references
  if (hash.has(obj)) {
    return hash.get(obj);
  }
  
  // Handle Date objects
  if (obj instanceof Date) {
    return new Date(obj);
  }
  
  // Handle RegExp objects
  if (obj instanceof RegExp) {
    return new RegExp(obj.source, obj.flags);
  }
  
  // Handle Map objects
  if (obj instanceof Map) {
    const result = new Map();
    hash.set(obj, result);
    obj.forEach((value, key) => {
      result.set(deepClone(key, hash), deepClone(value, hash));
    });
    return result;
  }
  
  // Handle Set objects
  if (obj instanceof Set) {
    const result = new Set();
    hash.set(obj, result);
    obj.forEach(value => {
      result.add(deepClone(value, hash));
    });
    return result;
  }
  
  // Handle Arrays
  if (Array.isArray(obj)) {
    const result = [];
    hash.set(obj, result);
    obj.forEach((value, index) => {
      result[index] = deepClone(value, hash);
    });
    return result;
  }
  
  // Handle regular objects
  const result = Object.create(Object.getPrototypeOf(obj));
  hash.set(obj, result);
  
  // Handle Symbol keys
  const symbolKeys = Object.getOwnPropertySymbols(obj);
  symbolKeys.forEach(symKey => {
    result[symKey] = deepClone(obj[symKey], hash);
  });
  
  // Handle regular keys
  Object.keys(obj).forEach(key => {
    result[key] = deepClone(obj[key], hash);
  });
  
  return result;
}

// Usage example
const original = {
  name: 'Test Object',
  info: {
    date: new Date(),
    regex: /test/g
  },
  arr: [1, 2, { a: 3 }],
  func: function() { console.log('test'); },
  [Symbol('id')]: 123,
  map: new Map([['key', 'value']]),
  set: new Set([1, 2, 3])
};

// Create circular reference
original.self = original;

const cloned = deepClone(original);
console.log(cloned);

```

