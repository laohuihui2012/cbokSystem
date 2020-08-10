react的生命周期钩子分为三大类；

1.初始化时的钩子  2.更新时的钩子  3.销毁时的钩子

#### 1.初始化时的钩子
###### 1.1 componentWillMount 组件挂载前 在这里面我们可以拿到刚开始的默认数据发送请求
```
 componentWillMount(){
        // 发送网络请求
        console.log('---componentWillMount---')

        setTimeout(() => {
            this.setState({
                name:'张三',
                age:30
            })
        }, 2000);
    }
```
###### 1.2componentDidMount 组件已经挂载到root根元素上去了，在这里可以拿到Don元素  （在这之前会有一个初次渲染（render）数据是没改变前的数据）
```
 componentDidMount(){
        // 初次渲染完毕，可以操作dom
        console.log('---componentDidMount---')
        // console.log(document.getElementById('life'))
    }
```
#### 2.更新时的钩子 
###### 2.1 componentWillReceiveProps可以拿到父组件传过的来的新数据 （比如后台管理系统中，根据父组件传递过来新的组件id，显示对应ID组件页面）
```
 componentWillReceiveProps(props){
        // 比如父组件给我传递了新的id，拿着id发送网络请求
        console.log(props)
    }
```
###### 2.2 shouldComponentUpdate
在这里，可以控制页面是否刷新，监控数据是否改变，如果改变了返回true，重新render。没有改变着不执行render
```
shouldComponentUpdate(){
        // 如果请求回来的数据没有发生变化
        console.log("11111111")
        return true
        // if (变了) return true else { return false}
    }
```
###### 2.3 componentWillUpdate
再次渲染前
```
 componentWillUpdate(){
        // 再次渲染之前，可以做点其它的事情
        console.log("--componentWillUpdate--")
    }

```
###### 2.4 componentDidUpdate 再次渲染后
在这里面可以拿到再次渲染的Dom元素

```
 componentDidUpdate(){
        // 拿到再次渲染之后的dom 
        console.log("--componentWillUpdate--")
        // console.log(document.getElementById('life'))
    }
```
#### 销毁时的钩子
###### 1.componentWillUnmount
在销毁前
```
componentWillUnmount(){
        // 清理工作，比如清楚定时器
        console.log("----componentWillUnmount---")
    }
```

注意：***千万不能在render中修改数据，这样会造成死循环，一直修改一直渲染***