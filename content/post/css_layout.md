---
title: "聊聊css布局"
date: 2019-03-24T00:17:03+08:00
draft: false
tags: [Css]
categories: [ Tech ]
---

### 从normal flow说起
我们知道，书本印刷的排版是从上而下，从左到右，一行装不下换行，依次排列的规则，css中正常流也是这种规则。不同的是，css标准中有格式化上下文的概念。

*Css标准中，规定如何排布文字或盒的算法，这个算法依赖一个排版的“当前现状”，css把这个当前状态称为“格式化上下文”。*

格式化上下文又分为块级格式化上下文和行内级格式化上下文。块级格式化上下文从上到下依次排列，行内级格式化上下文从左到右依次排列，排不下换行。

所以，遇到一个元素需要排版，一般有以下三种情况：
* 遇到块级盒，排入块级格式化上下文
* 遇到行内级盒或文字，排入行内级格式化上下文，排不下创建一个行盒排版，行盒会创建一个行内级格式化上下文。（行盒是块级，所以又到上一种情况）
* 遇到float盒，将float盒的顶部盒当前行内级上下文上边缘对齐，float方向的那条边对齐，重新排版
<!--more-->
除了以上的排版规则，css有一部分还会在其内部创建新的块级格式化上下文（BFC），一般有如下几种情况：
* 浮动元素
* 绝对定位元素
* 能包含块级元素的非块级容器（如table、table-cell、inline-block，其实display与table有关的都是）
* 能包含块级元素的块级容器，并且其overflow属性不能是visible

### 再说说position
说完了正常流，我们聊聊css中的position属性，常用的position
有如下几种：
* static：默认属性，设置此定位后left、right、top、bottom、z-index属性不生效。
* absolute：绝对定位，相对于static 定位以外的第一个父元素进行定位。
* relative：相对定位，通过top，bottom，left，right的设置相对于其正常（原先本身）位置进行定位
* fixed：固定定位，相对于浏览器窗口定位。
* sticky：粘性定位，可以被认为是相对定位和固定定位的混合。元素在跨越特定阈值前为相对定位，之后为固定定位。

### 实战
问题：固定高度的三栏布局有哪些布局方案？

浮动布局、绝对定位布局、flex布局、表格布局、grid布局等
各个布局实现代码见[布局代码](https://github.com/CJianYu/webnotes/blob/master/layout/layout.html)

问题延展：如果高度不固定，以上哪种布局失效了？

Flex布局、表格布局、grid布局还有效，另外两个失效了

问题延展：它们的延展性如何，在实际业务中哪个实用呢？或者说它们各自的优缺点是什么，适用于什么样的场景呢？

####  浮动布局
缺点： 脱离文档流，如果处理不好，会出现很多问题
优点： 兼容性好（如果清除了浮动，将浮动元素与周边元素的关系处理好的话，兼容性是比较好的）

延展话题： 如何清除浮动，清除浮动有哪些方法？

#### 绝对定位
缺点： 脱离文档流，导致子元素也脱离文档流，可使用性差
好处： 快捷，不容易出问题

#### flex布局
缺点： 不兼容ie8以下的浏览器
优点： 解决以上两种布局的缺陷而产生的，相对完美，移动端经常会用到

#### 表格布局
缺点： 其中某个单元格超出，其他也要跟着调整
优点： 在很多场景是可以用，兼容性好，flex解决不了的话，可以尝试

#### 网格布局
缺点：相对较新，兼容性不是很好
优点： 很强大，比flex还强大，因为它其实是二维的布局

### 其他

#### margin collapse
我们可以把margin理解为元素自身周围至少需要的空间距离，这样就非常容易理解了。

#### baseline
可以参考如下这张图：
![baseline](http://ww1.sinaimg.cn/large/007Gv6lPly1g1gnwp34lij30k006k0t0.jpg)

再看看vertical-align属性中baseline以及兄弟属性的意义，除了sub、super没有对应之外，其他属性两张图都有对应关系。
![](http://ww1.sinaimg.cn/large/007Gv6lPly1g1gnzutnstj30k0078t96.jpg)

#### 关于writing mode
虽然比较不常用到，但，很逆天。了解更多可以参考这篇文章[张鑫旭关于writing mode的blog](https://www.zhangxinxu.com/wordpress/2016/04/css-writing-mode/)

#### 最后了解下unicode-bidi
[w3school中关于unicode-bidi的介绍](https://www.w3schools.com/cssref/pr_text_unicode-bidi.asp)