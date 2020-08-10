### 1.react 路由的使用

传参有两种方式：
##### 1.params

```
//路由中设置
<Route path="/newsdetail/:newsId" component={NewsDetail}/>
```
编程式导航：this.props.history.push('/layout')
```
组件中传值
<li><Link to="/newsdetail/1001">哈哈哈哈</Link></li>
```

在/newsdetail/1001页面接收参数

```
this.props.match.params.newsId
```
##### 2.query/search

```
//路由设置
<Route path="/newsdetail" component={NewsDetail}/> 
```

```
组件中传值
//search
<li><Link to={{pathname:'/newsdetail',search:'?newsId=1001'}}>嘻嘻嘻嘻嘻</Link></li>
//query
<li><Link to={{pathname:'/newsdetail',query:{newsId:1001}}>哈哈哈哈</Link></li>
```
在/newsdetail/1001页面接收参数

```
//search
const newsId = new URLSearchParams(props.location.search).get('newsId')
//query
一刷新newId就没有了
```
总结：

```
// 如果是通过params传值，我在子组件中 props/this.props.match.params.newsId
    // Vue中获取params的值 this.$route.params.newsId

    // 如果是通过search传值，在组件中处理，比较麻烦 new URLSearchParams(props.location.search).get('newsId')
    // Vue中通过 this.$route.query.newsId
```



###### 1.1首先需要下载react-router-dom，再导入路由

mpn i react-router-dom
```
import React from 'react'

import {BrowserRouter,Link,Route,Switch,Redirect} from 'react-router-dom'
```

```
export default class Basic extends React.Component{
    render(){
    //需要使用<BrowserRouter>包着
        return <BrowserRouter>
         <p>
         //声明式导航
            <Link to="/newslist">新闻列表</Link>&nbsp;&nbsp;
            {/* <Link to="/">新闻列表</Link>&nbsp;nbsp; */}
            <Link to="/foodslist">食品列表</Lik>
            </p>
            <hr/>
             <div>
                <Switch>
                    <Route path="/newslist" component={NewsList} />
                    {/* <Route exact path="/" component={NewsList} /> */}
                    <Route path="/foodslist" render={props => {
                        return <ul>
                            <li>西兰花炒蛋</li>
                            <li>金拱门</li>
                            <li>黄焖鸡米饭</li>
                        </ul>
                    }}/>
                    {/* /newsdetail/1001 */}
                    {/* params传参时候的设置 */}
                    {/* <Route path="/newsdetail/:newsId" component={NewsDetail}/> */}
                    {/* query传参时候的设置 */}
                    <Route path="/newsdetail" component={NewsDetail}/> 
                    {/* 要写在to的规则后面 */}
                    <Redirect exact from="/" to="/foodslist" />

                     {/* 404 匹配一定要放在最后 */}
                    <Route component={NotFound} />
                </Switch>
            </div>
        </BrowserRouter>
    }
}
```
#### 定义组件
```
// 定义组件
const NewsList = props => {
    return <ul>
        {/* params传参 */}
        {/* <li><Link to="/newsdetail/1001">啦啦啦啦啦啦</Link></li> */}
        {/* search & query传参 */}
        {/* <li><Link to={{pathname:'/newsdetail',search:"?newsId=1001"}}>嘻嘻嘻嘻嘻</Link></li> */}
        <li><Link to={{pathname:'/newsdetail',search:'?newsId=1001'}}>哈哈哈哈</Link></li>
        <li>Ⅰ型大城市 落户</li>
        {/* <li><Link to="/newsdetail/1003">雷军年薪百亿</Link></li> */}
        <li><Link to={{pathname:'/newsdetail',search:'?newsId=1003'}}>雷军年薪百亿</Link></li>
    </ul>
}

const NewsDetail = props => {
    // console.log(props)
    
    console.log(props)

    const newsId = new URLSearchParams(props.location.search).get('newsId')
    console.log(newsId)
    // 如果是通过params传值，我在子组件中 props/this.props.match.params.newsId
    // Vue中获取params的值 this.$route.params.newsId

    // 如果是通过search传值，在组件中处理，比较麻烦 new URLSearchParams(props.location.search).get('newsId')
    // Vue中通过 this.$route.query.newsId
    return <div>
        我是新闻详情组件
    </div>
}
```
#### 2.重定向和404页面

```
 <Switch>
                   
   <Route path="/foodslist" render={props => {
       return <ul>
               <li>西兰花炒蛋</li>
                <li>金拱门</li>
                <li>黄焖鸡米饭</li>
                </ul>
            }}/>
     {/* 要写在to的规则后面 */}
       <Redirect exact from="/" to="/foodslist" />

        {/* 404 匹配一定要放在最后 */}
         <Route component={NotFound} />
</Switch>
```
#### 3.嵌套路由

react路由4.0以后嵌套路由不能像vue那样抽成一个文件

处理方法：在父组件中先配置路由，子组件中要嵌套的话，在子组件中再配置路由就好了


父组件中
```
import React from 'react'

// 导入路由相关
import { HashRouter as Router, Route,Redirect,Switch } from "react-router-dom"

// 导入子组件
import Login from './Login'
import Layout from './Layout'
import NotFound from './NotFound'

export default class Nested extends React.Component{
    render(){
        return <Router>
            <Switch>
                <Route path="/login" component={Login}/>
                <Route path="/layout" component={Layout}/>
                <Redirect exact from="/" to="/login"/>
                <Route component={NotFound}/>
            </Switch>
        </Router>
    }
}
```

子组件中

```
import React from 'react'
import './Layout.css'

import { Link,Route,Switch,Redirect } from "react-router-dom"

const Menu1 = props => {
    return <div>
        我是右边的菜单1组件
    </div>
}

const Menu2 = props => {
    return <div>
        我是右边的菜单2组件
    </div>
}

export default class Layout extends React.Component{
    render(){
        return <div className="layout">
            {/* 左边 */}
            <div className="left">
                 左边菜单 <br/>
                <br />
                <Link to="/layout/menu1">菜单1</Link><br/>
                <Link to="/layout/menu2">菜单2</Link><br/>
            </div>

            {/* 右边 */}
            <div className="right">
                <div className="content">
                    <Switch>
                        <Route path='/layout/menu1' component={Menu1}/>
                        <Route path='/layout/menu2' component={Menu2}/>
                        <Redirect from="/layout/" to="/layout/menu1" />
                    </Switch>
                </div>
            </div>
        </div>
    }
}
```
写在一个文件中
```
React.render((
  <Router>
    <Route path="/" component={App}>
      <IndexRoute component={Dashboard} />
      <Route path="about" component={About} />
      <Route path="inbox" component={Inbox}>
        <Route path="/messages/:id" component={Message} />

        {/* 跳转 /inbox/messages/:id 到 /messages/:id */}
        <Redirect from="messages/:id" to="/messages/:id" />
      </Route>
    </Route>
  </Router>
), document.body)
```





