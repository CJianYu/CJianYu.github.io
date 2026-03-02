---
title: "Document, don't create"
date: 2021-03-10T22:29:44+08:00
draft: true
tags: [Newsletter]
categories: [Life]

---

### Store

``` javascript
const store = createStore(reducer)
```

有三个方法：getState（获取），dispatch（更改），subscribe（订阅）

### Actions

行为，

### Reducer

接收两个参数：state，action

根据action.type判断是否执行相应的逻辑，返回：新的state

![image-20220216221115280](https://cdn.jsdelivr.net/gh/CJianYu/PictureBed/BlogImg/20220216221115.png)

### 常用的工具函数

combineReducers

bindActionCreators

### react-redux

假设有个组件

```javascript
class componentsA extends Component {
  
}
```



mapStateToProps

```javascript
// 映射state中的部分值，传递给组件
// 不全部传，因为性能问题，store的任何变化都会促发组件更新
function mapStateToProps(state) {
    return {
      xx: state.xx,
      yy: state.yy
    }
}
```

mapDispatchToProps：将actions绑定到组件中

``` javascript
function mapDispatchToProps(actions) {
  return {
    bindActionCreators({ ...actions }, dispatch)
    // bindActionCreators({ actionA, actionB }, dispatch)
  }
}
```

然后用connect将state、actions接收后，形成一个函数，此函数再调用这个组件，形成高阶组件

```javascript

export default connect(mapStateToProps, mapDispatchToProps)(componentA);
```

### 异步的action

![image-20220216234139840](https://cdn.jsdelivr.net/gh/CJianYu/PictureBed/BlogImg/20220216234139.png)

中间件截获、发出action