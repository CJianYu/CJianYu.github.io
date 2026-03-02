---
title: "用css实现单行截断与多行截断，最后以省略号结尾"
date: 2019-06-06T16:12:34+08:00
draft: false
tags: [Css]
categories: [Note]
---

有个很常见的业务场景，就是实现单行截断或者使用多行截断，最后要以省略号结尾。比如某个商品的标题太长，在有限区域内不能完全展示，如果要全部展示，页面就会很丑，所以要单行或多行截断。这里记录一下常见的解决办法。

<!--more-->

1. 单行截断

   * 文本溢出我们用text-overflow能很容易解决，达到单行文本溢出省略的效果，这里如果不是block元素，比如span，要设置display: inline-block：

     ``` css
     div {
       white-space: nowrap;
       overflow: hidden;
       text-overflow: ellipsis;
     }
     ```

2. 多行截断

   * 实现多行截断有多种方法，比较常见的解决方式是：-webkit-line-clamp 实现

     ```css
     div {
       width: 200px;
       text-overflow: ellipsis; // 超出时使用省略号
       display: -webkit-box; // 必须使用这个才生效，将对象作为弹性伸缩盒子模型显示
       overflow: hidden;// 必须使用，超出隐藏
       -webkit-line-clamp: 4; // 必须设置，多少行
       -webkit-box-orient: vertical; // 设置或检索伸缩盒对象的子元素的排列方式
     }
     ```

     这种方式只有 webkit 内核的浏览器才支持，因为-webkit-line-clamp一个不规范的属性，没有出现在 CSS 规范草案中，所以兼容性不太好。

   * 如果你知道内容一定会超出，可以用伪类after实现

     ```css
     p{
        position: relative;
        height: 30px;
        overflow: hidden;
        line-height: 18px;  
     }
     p::after{
          content: '...';
          position: absolute;
          bottom:0;
          right: 0;
     }
     ```

     这种感觉不太实用，因为不是响应式的，当内容不会超出限制的时候，省略号还是存在。但也不是没有解决方法，可以用js判断是否内容有超出限制，但这样做就太麻烦了。

     

     

