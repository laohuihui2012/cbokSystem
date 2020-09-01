
#### 主要步骤
- 配置开发环境
- 开发组件
- 打包组件，并在测试项目中引入打包组件模块，验证组件功能
- 发布到 NPM

#### 初始化
开始一个最基本的 React 工程，我们至少需要以下几项配置：

- React: 用于开发组件
- React dom: 渲染组件
- Babel: 用于转义 JSX
- webpack: 打包组件
我在这个例子里面做了一个叫做 react-lhh-autosuggest 的组件。首先创建 project 并且初始化。

然后写好自己需要的组件

在package.json中配置
```
"main": "dist/bundle.js",//这里是我们组件的入口文件。开发者在 import 我们的组件的时候会引入这里 export 的内容
"files": ["dist"],//申明将要发布到 npm 的文件。如果省略掉这一项，所有文件包括源代码会被一起上传到 npm
"scripts": {//申明命令行可用的各种指令。
    "start": "webpack-dev-server --config webpack.dev.config.js",
    "dev": "webpack-dev-server --config webpack.dev.config.js",
    "build": "webpack --config webpack.prod.config.js"
  },

```
接下来安装依赖,接下来配置 webpack。这里分成两份配置，一份用于开发环境(development)，一份用于单独打包组件用于生产环境(production)

这些就和我们平时写项目一项了，根据自己的需求配置。

#### 组件测试和验证
组件开发好了，我们需要自己拿到其他项目或者是在本项目测试，确定没有问题了就打包
```
// At development directory
npm run build
npm link

cd [test project folder]
npm link react-tiny-autosuggest
```
打包组件，只需要运行 npm run build 就可以了。
接下来可以通过 npm link 把打包之后的组件引入到 global node_modules 中，然后在验证 demo 中再通过 npm link react-tiny-autosuggest 引入这个组件，并验证是否符合预期。

接下下 demo 里面就可以直接 import AutoSuggest from 'react-tiny-autosuggest'了。

#### 发布到 NPM
在发布前，你得注册号一个npm 账号，然后在登录npm login

输入账号和密码和注册邮箱
发布组件到 npm: npm publish（注意，第一次发布需要去qq邮箱验证下）

取消发布: npm unpublish


中文转繁体插件
```
function CN() {
  return '啊阿埃挨哎唉哀皑癌蔼矮艾碍爱隘鞍氨安';
}

function HK() {
  return '啊阿埃挨哎唉哀皚癌藹矮';
}

function traditionlize_HK(target) {
  var str = '';
  for (var i = 0; i < target.length; i++) {
    if (CN().indexOf(target.charAt(i)) !== -1) {//判断CN(中文中)是否存中
      str += HK().charAt(CN().indexOf(target.charAt(i)));//是中文就返回查出在中文中的位置index，利用index然后去繁体中查出来拼接
    } else {
      str += target.charAt(i);//不是中文就直接拼接
    }
  }
  return str;
}

traditionlize_HK("哈")

module.exports = traditionlize_HK
```