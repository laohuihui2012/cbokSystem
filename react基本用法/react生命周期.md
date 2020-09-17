react的生命周期钩子分为三大类；

1.初始化时的钩子  2.更新时的钩子  

// getDefaultProps：接收初始props
// getInitialState：初始化state
#### 1.初始化时的钩子
###### 1.1 componentWillMount 组件挂载前 在这里面我们可以拿到父组件穿过来的props更新state
```
 componentWillMount(){
      //这个生命周期，是除了初始化之外，唯一一个能够直接同步修改state的地方
      //在react 17中废弃
    }
```
#### 1.2 static getDerivedStateFromProps(nextProps, nextState)    react16.3之后新增
组件每次被rerender的时候都会调用，包括在组件构建之后(虚拟dom之后，实际dom挂载之前)，每次获取新的props或state之后；

每次接收新的props之后都会返回一个对象作为新的state，返回null则说明不需要更新state；

配合componentDidUpdate，可以覆盖componentWillReceiveProps的所有用法

常用于强制性的根据props来设置state

#### 1.3 render
创建虚拟dom，进行diff算法，更新dom树都在此进行。此时就不能更改state了。
这里是合成虚拟DOM，可以理解为，在这里实际上都还没有真实的dom。

###### 1.4 componentDidMount 组件已经挂载到root根元素上去了，在这里可以拿到DoM元素  
渲染真实的DOM浏览器，在这里才可以得到DOM。ajax请求一般都在这里进行。
```
 componentDidMount(){
       // 组件将要挂载，组件加载时调用，以后组件更新不调用，整个生命周期只调用一次，此时可以修改state
      // 已经可以读取到state数据
      // 已经在内存中产生虚拟DOM树 但是还没有显示在页面上  
    }
```
#### 2.更新时的钩子 
分为俩种情况，state改变和props改变

- 如果state改变，会直接进行到组件更新的第二个shouldComponentUpdate,
- 如果是props改变，会先走componentWillReceiveProps。
###### 2.1 componentWillReceiveProps react 17里面废弃
可以拿到父组件传过的来的新数据 
constructor里面根据props来初始化的state，constructor只会执行一次，所以要在componentWillReceiveProps来修正state
```
 componentWillReceiveProps(props){
        // 比如父组件给我传递了新的id，拿着id发送网络请求
        console.log(props)
    }
```
###### 2.2 shouldComponentUpdate(nextProps, nextState)  性能优化
这个生命周期用于react的性能优化，接收俩个参数(nextProps,nextState)通常会根据这俩个参数和this.state,this.props来进行diff算法对比，

根据比较的结果来return true或者false,如果return的是false，将不会再执行后面的生命周期。
```
shouldComponentUpdate(){
       // 组件接收到新的props或者state时调用，return true就会更新dom（使用diff算法更新），return false能阻止更新（不调用render）
    
      // 该方法并不会在初始化渲染或当使用forceUpdate()时被调用。
    }
```
###### getSnapshotBeforeUpdate(prevProps, prevState)
触发时间: update发生的时候，在render之后，在组件dom渲染之前；返回一个值，作为componentDidUpdate的第三个参数；

配合componentDidUpdate, 可以覆盖componentWillUpdate的所有用法

// 该函数在最新的渲染输出提交给DOM前将会立即调用。它让你的组件能在当前的值可能要改变前获得它们。

这一生命周期返回的任何值将会 作为参数被传递给componentDidUpdate()。
###### 2.3 componentWillUpdate react 17废弃
再次组件更新渲染前
```
 componentWillUpdate(nextProps, nextState){
     / shouldComponentUpdate返回true或者调用forceUpdate之后，componentWillUpdate会被调用。
      // 数据修改，接着执行render
      
    }
```
###### 2.4 componentDidUpdate 
组件加载时不调用，组件更新完成后调用

```
 componentDidUpdate(nextProps, nextState){
         // 数据修改成功，组件更新完成后调用
       // 除了首次render之后调用componentDidMount，其它render结束之后都是调用componentDidUpdate。
       // 通过prevProps和prevState访问修改之前的props和state
    }
```
#### 销毁时的钩子
###### 1.componentWillUnmount
在销毁前
```
componentWillUnmount(){
      // 在组件被卸载和销毁之前立刻调用。可以在该方法里处理任何必要的清理工作，例如解绑定时器，取消网络请求，
      清理任何在componentDidMount环节创建的DOM元素。
    }
```

##### componentDidCatch(error，info)
```
// 该函数称为错误边界，捕捉发生在子组件树中任意地方的JavaScript错误，打印错误日志，并且显示回退的用户界面。
 // Tip：错误边界只捕捉树中发生在它们之下组件里的错误。一个错误边界并不能捕捉它自己内部的错误
 
```

#### componentWillReceiveProps废弃的原因


componentWillReceiveProps的触发时间
顾名思义即props发生变化时触发，但是实际上当父组件重新渲染，子组件的componentWillReceiveProps即会触发。so, componentWillReceiveProps不单单只是在props变化才触发。

componentWillReceiveProps的使用
有时我们的state是依赖于props，因为我们setState可能是在这个时候执行。但注意setState这个操作是个异步的，而state变化也会触发新的render

componentWillReceiveProps中如果执行副作用，存在内存溢出的风险，比如发起异步action，更新redux状态数据，进而引发组件props更新，循环触发componentWillReceiveProps
基于以上的问题，官方废弃该函数，那么如上的需求我们又该如何去做呢。

应该如何去做
比如state的更新依赖于props，那么我们可以使用新的静态函数getDerivedStateFromProps
如果是副作用，应该在didUpdate,didMount及用户交互操作中去执行

Read more at: https://1991421.cn/2020/06/15/e5374ca5/
注意：***千万不能在render中修改数据，这样会造成死循环，一直修改一直渲染***