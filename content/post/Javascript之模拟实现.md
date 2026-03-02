---
title: "Javascript之模拟实现"
date: 2021-06-27T23:24:34+08:00
draft: false
tags: [JavaScript]
categories: [Note]
---

### 模拟实现call

```javascript
Function.prototype.myCall = function(context) {
  // 判断调用call的函数（也就是this）是否是函数
  if(typeof this === 'function') {
    throw new TypeError('Error')
  }
  context = context || window
  context.fn = this
  const args = [...argumments].slice(1)
  const result = context.fn(args)
  delete context.fn
  return result
}
```

实现说明：

* 当传入的函数为null的时候，this默认指向window
* 函数是可以有返回值的，这也是要有一个result的意义

### 模拟实现apply

```javascript
Function.prototype.myApply = function(context) {
  if(typeof this === 'function') {
    throw new TypeError('Error')
  }
  context = context || window
  context.fn = this
  let result
  if(arguments[1]) {
    result = context.fn(arguments[1])
  } else {
    result = context.fn()
  }
  return result
}
```

实现说明：

* 实现跟call的实现差不多，唯一的区别是传入的参数不一样

### 模拟实现bind

```javascript
Function.prototype.bind2 = function (context) {

    if (typeof this !== "function") {
      throw new Error("Function.prototype.bind - what is trying to be bound is not callable");
    }

    var self = this;
    var args = Array.prototype.slice.call(arguments, 1);

    var fNOP = function () {};

    var fBound = function () {
        var bindArgs = Array.prototype.slice.call(arguments);
        return self.apply(this instanceof fNOP ? this : context, args.concat(bindArgs));
    }

    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();
    return fBound;
}
```

### 模拟实现new

```javascript
function myNew() {
  let obj = {}
  // shift会改变原数组，所以arguments第一个元素会被去除，后面直接使用
  let Contructor = [].shift.call(arguments)
  // 继承
  obj.__proto__ = Contructor.prototype
  // 绑定this
  let result = Contructor.apply(obj, arguments)
  return typeof result === 'object'? result : obj
}
```

实现说明：

* 创建一个新对象
* 取出传入的第一个参数（构造函数）
* 将新对象的原型指向构造函数，使新对象可以访问构造函数原型中的属性
* 改变构造函数的this指向，使新对象可以访问构造函数的属性
* 确保返回的是对象

### 模拟实现instanceof

```javascript
function myInstanceof(left, right) {
  let prototype = right.prototype
  left = left.__proto__
  while(true) {
    if(left === null || left === underfined) {
      return false
    }
    if(left === prototype) {
      return true
    }
    left = left.__prototype__
  }
}
```

实现说明：

* 拿到对象（left）与类型（right）的原型
* 循环判断两者是否相等，直到left为null





