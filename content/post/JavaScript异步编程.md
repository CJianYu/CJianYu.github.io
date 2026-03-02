---
title: "JavaScript异步编程"
date: 2019-11-13T17:18:18+08:00
draft: false
tags: [JavaScript]
categories: [Note]
---

在讲JavaScript异步编程之前我们先来了解并发和并行的区别。

### 并发和并行的区别

Erlang 之父 Joe Armstrong用一张图解释了并发和并行的区别：

![undefined](http://ww1.sinaimg.cn/large/007Gv6lPgy1g8oozqewr8j30go0cj0t7.jpg)

并发是宏观概念，如果有任务AB，通过任务间的切换完成了这两个任务，我们可以称之为并发。

并行是微观概念，如果某个系统可以同时执行AB任务，我们就说这个系统是并行的。同时完成两个或多个任务的情况我们称之为并行。

### 回调函数

在JavaScript中处理异步返回结果的函数，我们称之为callback函数，常见的如下例子：

```javascript
ajax(url, () => {
  // do something
})
```

但如果多个请求存在依赖性，我们很容易写出这样的代码：

```javascript
ajax(url, () => {
  ajax(url1, () => {
    ajax(url2, () => {
      // ...
    })
  })
})
```

这就是回调地狱，这样写会导致两个问题：

1. 代码耦合性高，牵一发而动全身，不利于维护
2. 嵌套函数多，不利于处理错误

了解更多回调地狱的内容请参考： http://callbackhell.com/

那么，如何解决回调地狱的问题？

### Generator + function*

Generator的特点是可以控制函数的执行，用法示例如下：

```javascript
function *gen(x) {
  let y = 2 * (yield (x + 1))
  let z = yield y / 3
  return (x + y + z)
}

let result = gen() // 返回迭代器
console.log(result.next()) // => { value: 6, done: false}  第一次next()会忽略传参，函数停留在yield(5 + 1)
console.log(result.next(12)) // => { value: 8, done: false} 第二次next要传入上一次yield的返回值，否则yield永远返回undefined。因为这里传的是12，所以y=2*12=24
console.log(result.next(13)) // => { value: 42, done: true} z = 13, x = 5, y = 24
```

### Promise

Promise 的特点是什么，分别有什么优缺点？什么是 Promise 链？Promise 构造函数执行和 then 函数执行有什么区别？手写promise（内部如何实现）

#### Promise的特点

* Promise对象的状态不受外界影响 ，只有异步操作的结果，可以决定当前是哪一种状态
* 一旦状态确定，就不会再变

#### Promise对象的缺点

* 构造Promise的时候，构造函数内部的代码是立即执行，无法取消
* 错误需要通过回调函数捕获

#### Promise 构造函数执行和 then 函数执行的区别

Promise构造函数是同步执行的，then方法是异步执行的

#### 手写简易Promise（Promise实现原理）

```javascript
const PENDING = 'pending'
const RESOLVE = 'resolve'
const REJECT = 'reject'
function MyPromise(fn) {
  const _this = this
  _this.state = PENDING
  // value 用来保存resolve或reject传入的参数
  _this.value = null 
  _this.resolveCallbacks = []
  _this.rejectCallbacks = []
  function resolve(value) {
    // 只有pending状态的时候可以改状态
    if(_this.state === PENDING) {
      _this.state = RESOLVE
      _this.value = value
      // 执行保存起来的函数
      _this.resolveCallbacks.map(cb => cb(value))
    }
  }
  function reject(value) {
    if(_this.state === PENDING) {
      _this.state = REJECT
      _this.value = value
      _this.rejectCallbacks.map(cb => cb(value))
    }
  }
  try{
    fn(resolve, reject)
  } catch(e) {
    reject(e)
  }
}
// then的实现
MyPromise.ptototype.then = function(onFullFilled, onRejected) {
  const that = this
  onFullFilled = type onFullFilled === 'function' ? onFullFilled : v => v
  onRejected = type onRejected === 'function' ? onReject : e => throw e
  // 当状态不为成功或失败，将函数保存起来，执行resolve或reject的时候再调用
  if(that.status === PENDING) {
    that.resolveCallbacks.push(onFullFilled)
    that.rejectCallbacks.push(onRejected)
  }
  if(that.status === RESOLVE) {
    onFullFilled(that.value)
  }
  if(that.status === REJECT) {
    onRejected(that.value)
  }
}
```

### async/await

async/await是generate的语法糖，但async函数返回的是一个promise，所以也可以用then方法。async函数内部如果抛出错误，会导致promise对象变为reject状态：

```javascript
async function test() {
  throw new Error('报错了')
}

test.then(res => {
  console.log(res)
}, error => {
  console.log(error)
})

// Error：报错了
```

#### 优点与缺点

* 优点：处理 `then` 的调用链，能够更清晰准确的写出代码，并且也能优雅地解决回调地狱问题
* 缺点：因为 `await` 将异步代码改造成了同步代码，如果多个异步代码没有依赖性却使用了 `await` 会导致性能上的降低。

#### await内部原理

`await` 内部实现了 `generator`，其实 `await` 就是 `generator` 加上 `Promise` 的语法糖，且内部实现了自动执行 `generator`。

