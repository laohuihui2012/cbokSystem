###### 热更新是用于开发环境下，在我们修改了一些样式的或者数据更新的时候，不刷新页面

#### 1.安装react-hot-loader

```
npm install react-hot-loader
```

#### 2.在webpack中加入--hot
在ppack.json文件中加入--hot
```
"start": "webpack-dev-server --config webpack.config.dev.js --progress --open --hot",
```
#### 3. 在跟组件app.jxs（index.jxs）中导入

```
import { hot } from 'react-hot-loader/root'

//导出的时候使用hot包着APP
export default hot(APP)
```