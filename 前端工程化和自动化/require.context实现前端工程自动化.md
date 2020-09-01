### require.context
在了解写插件前，我们先wepack的一个api（require.context）

通过执行require.context函数获取一个特定的上下文,主要用来实现自动化导入模块。

equire.context函数接受三个参数

- directory {String} -读取文件的路径

- useSubdirectories {Boolean} -是否遍历文件的子目录

- regExp {RegExp} -匹配文件的正则

```
语法: require.context(directory, useSubdirectories = false, regExp = /^.//);

例子：require.context('./test', false, /.test.js$/);
//上面的代码遍历当前目录下的test文件夹的所有.test.js结尾的文件,不遍历子目录
```
##### 值得注意的是require.context函数执行后返回的是一个函数,并且这个函数有3个属性
- 1.resolve {Function} -接受一个参数request,request为test文件夹下面匹配文件的相对路径,返回这个匹配文件相对于整个工程的相对路径

- 2.keys {Function} -返回匹配成功模块的名字组成的数组

- 3.id {String} -执行环境的id,返回的是一个字符串,主要用在module.hot.accept

```
const files = require.context('.', false, /\.js$/);

let configRouters = [];

files.keys().forEach(key => {
    if( key === '.index.js' ) return
    configRouters =  configRouters.concat(files(key).default)//读取文件中default模块
})

export default configRouters //抛出一个router的结构数组
```

优化版本
```
//自动注册路由
const files = require.context(".", false, /\.js$/);

let configRoutes = [];
/**
 * inject routers
 */
files
  .keys()
  .filter(key => key !== "./index.js")
  .forEach(key => {
    configRoutes = configRoutes
      .concat(files(key).default)
      .sort((a, b) => (a.sort ? a.sort - b.sort : -1)); // 读取出文件中的default模块
  });

export default configRoutes; // 抛出一个Vue-router期待的结构的数组
```
然后在vue.app 
```
import Router from "vue-router";
import configRoutes from "./modules";

Vue.use(Router);

const commonRoutes = [
  {
    path: "/",
    name: "index",
    redirect: "/example/index"
  },
  {
    path: "/404",
    component: () =>
      import(/* webpackChunkName:"notFound" */ "@/views/notFound")
  },
  { path: "*", redirect: "/404" }
];

const router = new Router({
  routes: [...configRoutes, ...commonRoutes] //合并上面两个路由
});
```
