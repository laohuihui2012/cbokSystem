### 1.input受控组件实现双向数据绑定
数据驱动视图

```
constructor（）{
    super（）
    this.state = {
        username:'admin',
        password:''
    }
}

change = （e）=> {
    console.log(e.target)//事件触发源
    this.setState({
        //[e.target.name]是动态绑定的属性名，传过来的是username，那么就会解析成username:e.target.value
        [e.target.name]:e.target.value
    })
}
render(){
   //结构赋值将state中的数据绑定到视图上面
   const { username,password } = this.state
   {/* 相当于let this.state = { username:'admin', password:'' }; 
   username = this.state.username;password = this.state.password */}
   
    return(
    用户名：<input name="username" value={username} onChang={ this.change } type="text" /><br/>
    密码：<input name="password" value={password} onChang={ this.change } type="password" /><br/>
    )
}
```
### 2.Checkbox受控组件

```
constructor(){
    super()
    this.state = {
        values:['apple','orange','watermelon','lemon'],// 全部的水果
        svalues:['apple','orange'], // 选中的水果
    }
}

change = (e) =>{
    if(this.state.svalues.includes(e.target.value){//表示之前存在的，点击移除
       const newArray = this.state.svalues.filter((item) =>{
      item != e.target.value }) //filter遍历过滤旧数据，返回新数组。item ！= e.target.value 表示item等于其他的值，排除自己
      this.setState = {
          svalues:newArray
      }
    }else{//表示之前不存在，点击添加
      const newArray = [ ...this.state.svalues,e.target.value] 
      this.setState = {
          svalues:newArray
      }
    }
}

render(){
   const { values,svalues } = this.state
    return(<div>
    <form>
    喜欢的水果：
    {values.map((item,index) => {
        return <label key={index}>
        <input type="checkbox" value={item} checked={svalues.includes(item)} onChange={ this.change } />{item}&nbsp
        </label>
     })
    }
    </form>
    </div>
    )
}
```
### 3.radio受控组件

```
constructor(){
    super()
    this.state = {
        sexs:['male','female'],
        sex:['female']
    }
}

render(){
  const { sexs,sex } = this.state
    return（<form>
    性别:
    {sexs.map((item,index) => {
        return <label key={index}>
       <input type="radio" onChange={this.changeSex} checked={sex.includes(item)} value={item}/>{item}&nbsp;&nbsp;
            </label>
    })
   }
  </form>）
}

```


### 4.非受控组件实现图片上传
非受控组件就是通过拿操作DOM的方法来获取表单的值
注意，就算是通过操作DOM，也不要用document.getElementById('username')。使用ref

旧版ref拿Dom和Vue差不多
```
<input ref="usernameRef" type="text" />

//拿DOM
componentDidMount(){
  
        // 旧版本
        // console.log(this.refs.usernameRef)
        // this.refs.usernameRef.focus()

        // 新版本
        // console.log(this.usernNameRef.current)
        // this.usernNameRef.current.focus()
    }
```

```
import react,{ component } from 'react'
export default class RefAndDom extends component {
    constructor(){
        super()
        this.state = {
            ImgPath:null
        }
        
    this.fileRef = raect.creatRef()
    }
    
    render(){
        return(<div>
        文件:<input type="file" ref={ this.fileRef } /><br/>
        <bottom onClick={ this.upload }>文件上传</bottom><br/>
        //实现图片预览
        { this.state.ImgPath && <img style={{width:300,height:200}} src={ this.state.ImgPath }
        }
        </div>
        )
    }
    
    upload = () => {
        //新版的ref，拿到input文件上传Don
        const file = this.fileRef.current.files[0]
        //如果有图片，则发送请求提交
        if(file){
            //创建xhr
            var xhr = new XMLHttpRequest()
            //生产formData
            const formData = new FormData()
            //添加文件数据
            forData.append('file',file)
            //open
            xhr.open('post','http://127.0.0.1:8888/uploadFile')//后面上传请求URL
            //发送出去
            xhr.send(formData)
            //监听响应
            xhr.onreadysatechange = () => {
               if(xhr.readyState == 4 && xhr.status === 200){
               //得到响应的数据
                 var jsonStr = xhr.responseText
                 //转成json格式
                 var obj = JSON.parse(jsonStr)
                 // 实现图片预览
                    this.setState({
                        imgPath:obj.path
                    })
               }
            }
            
        }
    }
}
    
```

