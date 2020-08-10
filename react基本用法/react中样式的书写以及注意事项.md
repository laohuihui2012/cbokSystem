#####  1.在react的jsx文件中写行内式时，不能直接写成（style="color：red;"

这样写会被当成字符串，应该这样写{{width:300,height:300}}，注意：中间用逗号隔开，并且里面使用的时驼峰命名法
```
<img style={{color:'red',fontSize:'20px'}} src={this.state.imgPath}/>
```
##### 2.使用外部导入的css文件
创建一个style.css文件夹

导入import './style.css' 但是此时不能识别CSS文件夹，需要在webpack.config.dev.js中配置一下：style-loader和css-loader
```
{
        test: /\.css$/,
        use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
      },
```
##### 注意在我们使用外部文件导入CSS的时候，不能使用class。得使用className

#### 3.如果使用less就需要导入less和less-loader
在webpack.config.dev.js中配置

```
 {
        test: /\.less$/,
        use: [{
          loader: 'style-loader' // creates style nodes from JS strings
        }, {
          loader: 'css-loader' // translates CSS into CommonJS
        }, {
          loader: 'less-loader' // compiles Less to CSS
        }]
      }
```



