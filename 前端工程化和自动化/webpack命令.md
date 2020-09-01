#### webpack和webpack-cli的安装和卸载
#### 删除全局webpack-cli
webpack4.x开始官方文档是说要安装cli所以如果的在用4.+就需要卸载cli

npm uninstall -g webpack-cli
- 注释给我这种小白提供参考
- 卸载 uninstall  可以简写成 un  
- 全局 -g 的完整写法是 --global
- 现在问题来了这样真的卸载了webpack-cli吗？
- 答案是没有。到现在为止我还没有发现那个webpack-cli是全局安装的，至少官方文档没看到。
- 那就看下面怎么删除局部webpack-cli

#### 删除本地（局部）webpack-cli
npm uninstall webpack-cli
- 仔细看你会发现去掉全局参数 -g
- 这时候你的命令行会快速滚动一些删除信息。
- webpack-cli删除成功
#### 删除全局webpack
npm uninstall -g webpack
- 这个注释还是给小白看的
- 为什么要局部全局删除webpack
- 因为你可能在安装webpack时不确定自己是全局安装
- 还是本地安装，所以建议先执行全局删除命令
- 然后在执行下面的本地删除命令

#### 删除本地webpack
npm un webpack
- 这时候小白的webpack是删除完成了
- 还没完看下面怎么说
检查webpack残余文件
ls
- 用ls命令查看一下是否有这几个文件
- node_modules
- package-lock.json
- package.json
- 有是最好的，如果没有那你可能还没找到自己本地安装webpack的准确位置
- 有时候我也找不到了
- 现在说有的事
rm -rf node_modules package-lock.json package.json
- 上面这行命令是删除这些文件的意思
- 同学你的webpack 彻底删除干净了
- 但是小白一定要好好去了解一下 rm 和 rm -rf 的区别，在这里我不科普怕说错。

#### 安装webpack
接下来让我告诉你安装webpack4.+的正确方式
其实官方文档说的很清楚了，但是有点细节要注意。

1.创建一个新的本地项目目录名为webpack-demo

mkdir webpack-demo
进入目录

2.cd webpack-demo
创建package.json文件

3.npm init -y
安装webpack

- 要安装最新版本或特定版本，请运行以下命令之一：
- 第一个安装方式默认安装最新版本
npm install --save-dev webpack
- 第二个安装方式是安装你需要的版本
npm install --save-dev webpack@<version>
#### 安装webpack-cli

npm install --save-dev webpack-cli
- 不要忘记webpack4.+开始webpack-cli是必备的哦
检查webpack是否安装成功

node_modules/.bin/webpack -v
- 执行了这个命令以后会输出一个版本号
- 我的是4.11.1,因为webpack在不断更新所以我们的版本号会有点区别，不是什么问题