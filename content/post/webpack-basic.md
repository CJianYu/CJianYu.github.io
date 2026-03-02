---
title: "Webpack入门教程"
date: 2019-07-18T23:50:22+08:00
draft: false
tags: [Webpack]
categories: [Note]
---

### 为什么要用构建工具

转换es6、转换jsx、css前缀补全/预处理器、压缩混淆、图片压缩

### 初识webpack

webpack默认文件是webpack.config.js，当然，你也可以根据自己的需要进行更改，通过：webpack       — config 指定配置文件，webpack一般包含以下内容：

```javascript
module.exports = {
  entry: './src/index.js', // 打包的入口文件
  output: './dist/main.js', // 打包的输出
  mode: 'production', // 环境
  module: {
    rules: [
      {test: /\.text/, use: 'raw-loader'}  // Loader配置
    ]
  },
  plugin: [                                   // plugin配置
    new HtmlWebpackPlugin({
        template: './src/index.html', // 所用的模版
        filename: 'index.html', // 打包后的文件名
        minify: {  // 压缩html
          removeAttributeQuotes: true, // 去掉双引号
          collapseWhiteSpace: true, // 变成一行
        },
        hash: true, // 添加hash
      })
  ]
}
```
<!--more-->
### 安装webpack与webpack-cli

首先要搭建具有node、npm的环境，然后执行以下命令就好了：

```javascript
npm install webpack webpack-cli 
```

### 核心概念之entry

单入口的时候，entry是一个字符串；

多入口的时候(适合多页应用)，entry是一个对象，如下：

```javascript
// 单入口
module.exports = {
  entry: './path/to/file/index.js'
}
// 多入口
module.exports = {
  entry: {
    app: './src/app.js',
    adminApp: './src/adminApp.js'
  }
}

```

### 核心概念之output

用于输出文件。多入口的时候，要将文件名用占位符表示，如下：

```javascript
let path = require('path')

module.exports = {
    entry: {
        index: './src/index.js',
        hello: './src/hello.js'
    },
    output: {
        filename: '[name].js', // 单文件的时候，就直接是类似bundle.js这样的文件名
        path: path.resolve(__dirname, 'dist')
    },
    mode: 'production'
}
```

### 核心概念之loader

loader本身是一个函数，接受源文件作为参数，返回转换结果。webpack开箱即用只支持js和json文件，通过loader去支持其他文件，将它们转化成有效的模块，并可以添加到依赖图。

常见的loader：babel-loader, css-loader, less-loader, file-loader, thread-loader。用法举例：

```javascript
module.exports = {
  entry: './src/index.js', // 打包的入口文件
  output: './dist/main.js', // 打包的输出
  mode: 'production', // 环境
  module: {
    rules: [
      {test: /\.text/, use: 'raw-loader'}  // test指定匹配规则，use用来指定使用的loader名称
    ]
  },
}
```

### 核心概念之plugin

基本上所有loader不能解决的，plugin都可以解决。用于bundle文件优化，资源管理、环境变量注入等。

常用的plugin：CommonChunkPlugin、HtmlWebpackPlugin、UglifyjsWebpackPlugin等。

使用的时候，将用到的plugin放进plugin数组里面就可以了，使用举例：

```javascript
module.exports = {
  entry: './src/index.js', // 打包的入口文件
  output: './dist/main.js', // 打包的输出
  plugin: [                                   // plugin配置
    new HtmlWebpackPlugin({
        template: './src/index.html', // 所用的模版
        filename: 'index.html', // 打包后的文件名
        minify: {  // 压缩html
          removeAttributeQuotes: true, // 去掉双引号
          collapseWhiteSpace: true, // 变成一行
        },
        hash: true, // 添加hash
      })
  ]
}
```

loader跟plugin的区别：

loader，它是一个转换器，将A文件进行编译成B文件，比如：将A.less转换为A.css，单纯的文件转换过程。

plugin是一个扩展器，它丰富了webpack本身，针对是loader结束后，webpack打包的整个过程，它并不直接操作文件，而是基于事件机制工作，会监听webpack打包过程中的某些节点，执行广泛的任务，比如打包优化、文件管理、环境注入等……

### 核心概念之mode

用来指定当前的构建环境，有三个默认的可选：production（默认）、development、none。

指定mode可以使用webpack的一些内置函数。

### 基础用法

#### 解析ES6

1.安装一下安装必要插件与loader, 在命令行输入：

```shell
npm install @babel/core @babel/preset-env babel-loader -D
```

2.添加babel-loader配置文件（ 解析es6需要用到babel-loader，配置文件是 .babelrc ），并输入以下配置：

```json
{
  "presets": [
    "@babel/preset-env"
  ]
}
```

3.在webpack中配置module

```javascript
module.exports = {
  // ...other config
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader'
      }
    ]
  }
}
```

#### 解析css、Less、Sass

1.安装css-loader、style-loader、 less、less-loader

```shell
npm i style-loader css-loader -D
```

2.配置webpack

```javascript
module.exports = {
  // ...other config
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader','css-loader'] // 这里是链式调用，遵循从右到左，从上到下的执行顺序。style-loader的作用是将css插入到html的head里面
      },
      // 下面是配置less
      {
        test: /.less$/,
        use: ['style-loader','css-loader','less-loader']
      }
    ]
  }
}
```

3.Sass同理

#### 解析图片与文字

1.安装file-loader

```shell
npm i file-loader -D
```

2.配置webpack

```javascript
module.exports = {
  // ...other config
  module: {
    rules: [
      // 图片
      {
        test: /.(png|jpg|jpeg|gif)$/,
        use: 'file-loader'
      },
      // 字体
      {
        test: /.(woff|woff2|eot|ttf|otf)$/,
        use: 'file-loader'
      },
    ]
  }
}
```

3.也可以使用url-loader去解析图片与字体，可以设置使小文件自动转为base64

#### 文件监听

项目源码发生变化的时候，我们希望项目自动重新构建输出新的文件，用webpack开启监听模式有两种方式：

- 在启动webpack命令后加上 —watch 参数（每次需要手动刷新浏览器）

```javascript
// package.json文件
{
  // ... other config 
  "script": {
    "build": "webpack",
    "watch": "webpack --watch" //add this line
  }
}

```

- 配置webpack.config.js，设置watch为true

文件监听的原理是轮询判断最后编辑时间是否变化，我们可以对其进行配置

```javascript
module.exports = {
  // ... other config
  // 监控变动自动打包
  watch:true,
  watchOptions:{ // 监控的选项
    poll:1000, // 每秒问我 1000次
    aggregateTimeout:500, // 防抖 一直输入代码 
    ignored:/node_modules/ // 不需要进行监控哪个文件
  }
}
```

#### 热更新（webpack-dev-server）

我们通过watch进行文件监听有一个问题就是每次都要手动刷新浏览器，为了可以自动展示最新的效果所以引入了热更新的方法。WDS（webpack-dev-server）不刷新浏览器，不输出文件而是保存在内存中，使用了HotModuleReplacementPlugin插件。使用方法：

1.在package.json添加命令：

```javascript
{
  // ... other config 
  "script": {
    "build": "webpack",
    "watch": "webpack --watch",
    "dev": "webpack-dev-server --open"//add this line
  }
}
```

2.配置webpack.config.js

```javascript
// 所用HotModuleReplacementPlugin插件是webpack自带的，这里引入webpack
const webpack = require('webpack')

module.exports = {
  // ... other config
  plugin: [
    new webpck.HotModuleReplacementPlugin()
  ],
  // 配置一下devServer
  devServer: {
    contentBase: './dist',  // 集成存放的路径
    hot: true // 开启热更新
  }
}
```

#### 代码压缩

1.css的压缩

css的压缩可以用optimize-css-assets-webpack-plugin，同时需要使用cssnano预处理器，在webpack中可以这样设置

```javascript
// 引入插件
module.exports = {
  // ... other config
  plugin: [
    new OptimizeCssAssetsWebpackPlugin({
      assetsNameRegExp: /\.css$/,
      cssProcessor: require('cssnano')
    })
  ],
}
```
2.html的压缩

使用出名的html-webpack-plugin，配置一下参数即可。在命令行安装一下插件` yarn  add html-webpack-plugin `，然后在webpack.config.js配置

```javascript
let path = require('path')
let HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
  entry: './index.js', 
  output: {
    mode: 'development', 
    filename: 'bundle.[hash:7].js', // 这里添加hash可以每次打包出不同的文件防止覆盖,：7表示只显示7位，可去掉
    path: path.resolve(_dirname, 'dist'),
    // plugin是一个数组，存放所有插件
    plugin: [
      // 一般而言，一个页面对应一个HtmlWebpackPlugin
      new HtmlWebpackPlugin({
        template: './src/index.html', // 所用的模版
        filename: 'index.html', // 打包后的文件名
        minify: {  // 压缩html
          removeAttributeQuotes: true, // 去掉双引号
          collapseWhiteSpace: true, // 变成一行
        },
        hash: true, // 添加hash
      })
    ]
  }
}
```

3.js的压缩

当模式为生产模式的时候，webpack内置了uglifyjs-webpack-plugin，会自动压缩js代码，所以不需要额外添加操作。

### loader和plugin的区别

loader 用于加载某些资源文件。因为 webpack 只能理解 JavaScript 和 JSON 文件，对于其他资源例如 css，图片，或者其他的语法集，比如 jsx， coffee，是没有办法加载的。 这就需要对应的loader将资源转化，加载进来。从字面意思也能看出，loader是用于加载的，它作用于一个个文件上。plugin 用于扩展webpack的功能。它直接作用于 webpack，扩展了它的功能。当然loader也是变相的扩展了 webpack ，但是它只专注于转化文件（transform）这一个领域。而plugin的功能更加的丰富，而不仅局限于资源的加载。