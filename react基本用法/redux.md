###  1.redux的理解
1.redux中只有一个Store,Store中不会处理数据;(store.getState())

2.唯一改变 state 的方法就是触发 action,
```
store.dispatch({
  type: 'COMPLETE_TODO',
  index: 1
})

store.dispatch({
  type: 'SET_VISIBILITY_FILTER',
  filter: 'SHOW_COMPLETED'
})
```
3.reducers（纯函数）中修改数据（因为 reducer 只是函数，你可以控制它们被调用的顺序，传入附加数据，）
### react-redux的使用
##### 1.安装redux和react-redux
react-redux依赖于redux,但是react-redux是把store挂到props上去，我们通过props取值。然后react-redux也帮我们监控了数据的变化，不需要自己再写（store.subscribe(this.watchStore)）

##### 2.建立一个store文件夹
###### 2.1 建立一个index.js(创建一个store 数据处理不在这里)
```
import {createStore} from 'redux'

//导入一个reducer，处理数据的纯函数文件
import reducer from './reducers'

//创建仓库
const store = createStore(reducer,/* preloadedState, */ window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())

//导出仓库
export default store
```
###### 2.2 建立一个reducers.js(在这里处理数据)

```
const localState = JSON.parse(localStorage.getItem('MyCart') || '[]')
export default( state = localState,action)=>{
  
 switch (action.type) {
   case 'ADD_GOODS':
     const addGoodsList = JSON.parse(JSON.stringify(state))
  
     const addGoods = addGoodsList.find(item => { return item.id === action.goods.id })
  
     console.log(addGoods);
     
     if(addGoods){
       addGoods.num += action.goods.num
     }else{
      addGoodsList.push(action.goods)
     }
     
    
    console.log(addGoodsList);
    return addGoodsList

  case 'UPDATE_GOODS':
    //取出之前的数据
    const updateGoodsList = JSON.parse(JSON.stringify(state))

    const editGoods =  updateGoodsList.find(item => { return item.id === action.id })
    //修改点击产品的store里面的值
    editGoods.num = action.num
    return updateGoodsList 
    
  case 'DELETE_GOODS':
    //取出之前的数组
    const deleteGoodsList = JSON.parse(JSON.stringify(state))
    
    //根据id找到该索引
    const index = deleteGoodsList.findIndex(item => item.id === action.id )
    //删除当前点击的商品
    deleteGoodsList.splice(index,1)
    return deleteGoodsList
   default:
     return JSON.parse(JSON.stringify(state))
 }
}
```
#### 3.在组件中使用
###### 3.1先将store挂到props上去
在整个项目的入口index.js文件中
```
// 导包
import React from 'react'
// 针对Web平台
import ReactDOM from 'react-dom'

import {Provider} from 'react-redux'
// 导入根组件，如果不写配置，需要在webpack中进行配置
import App from './App'
import store from './components/redux/store/index'

// 使用ReactDOM渲染根组件中的内容到 id=root的div中去
ReactDOM.render(
//将APP组件及其子组件注入到prop中去
       <Provider store={store}>
         <App />
       </Provider>,
  document.getElementById("root"))
```
###### 3.2在其他组件中使用
(取值是使用this.props)
```
//导入react-redux

import { connect } from 'react-redux'

class Index extends Component {
  constructor(){
    super()
  }

  render() {
    return (
      <div>总量：{this.props.totalCount}</div>
    );
  }
}


 // 把仓库中的值，映射到组件的props属性上
 // state === store.getState()

const mapStateToProps  = state => {
  // 获取最新的总数
  const calcTotalCount = () => {
    let totalCount = 0
    state.forEach(item => {
      totalCount += item.num
    })

    return totalCount
  }
  return {
    goodsList:state,
    totalCount:calcTotalCount()
  }
}

const mapDispatchToProps = dispatch => {
  return {
    //修改商品数量
   changeNumber(goods,value){
     dispatch({
       type:'UPDATE_GOODS',
       id:goods.id,
       num:value
     })
   }

  }
}
//mapStateToProps是取数据用的   mapDispatchToProps是用来修改数据的
export default connect(mapStateToProps,mapDispatchToProps)(Index)
```
