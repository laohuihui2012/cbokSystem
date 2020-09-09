### 常规操作
安装包
npm install xxx 本地
npm i xxx -g  //全局
npm i xxx@xx.xx //安装指定版本号
npm i xxx@latest //安装最新版本号

卸载包
npm uninstall xxx 卸载包

npm root -g查看所以安装的依赖位子
npm view xxx versions > xxx.version.json

生成一个xxx.version.json，保存这个依赖所以的版本


#### 全局的优缺点

1.所有项目都能用

2.可以使用命令（【window下】，安装在全局的模块，会生成xxx.cmd的可执行命令文件）

3.本版冲突

4.安装在全局的模块不能基于CommonJS等模块规范导入

#### 安装在本地的优缺点
1.安装在本地的模块可以基于CommonJS等模块规范导入，实现对应的效果

2.没有本版冲突

3.不能使用命令

4.只对当前项目可用

## 优化npm下载速度

1.安装一个cnpm(淘宝镜像)

2.yarn


3.切源
使用npm 安装nrm  npm i nrm -g

然后执行nrm ls命令，查看有哪些下载源。

然后想使用那个源下载就nrm use xxx(yarn,cnpm等) 。这样之后虽然还是执行npm命令下载，但是用的源是我们选择的（yarn、cnpm等）

