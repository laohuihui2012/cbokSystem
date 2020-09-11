#### 1.redux是什么？
redux是一个状态管理器，redux和react没有任何关系，它可以应用到很多框架中。（react-redux是将redux再次封装处理架构）
#### 2.什么时候需要用到redux？
如果是普通的小型应用，视图层只有单一的数据来源。根本就不需要使用redux，因为这样反而使得我们的项目结构复杂，而且增加了不必要的代码。

那么什么时候需要使用redux呢，以下几种情况你可以考虑。

1.当一些数据在很多个不同的页面和组件中都需要使用到，例如：用户信息，登陆状态等

2.当一个组件要改变全局状态或者是改变其他不相关组件的状态时
#### 3.redux基本原理
redux将所有的状态装在一个对象里（store），视图层与状态一一对应。

redux可以创建一个store(存储所以状态，全局只有一个)，然后store有三个属性方法：getState、dispatch、subscribe。getState是用来获取数据的，dispatch是用来通知改变数据的，subscribe是监听数据的改变等一些列操作的。

##### 3.1 store.getState
某一时刻的store的状态就是state。下面state就是取得某一时刻的store状态
```
import { createStore } from 'redux';
const store = createStore(fn);

const state = store.getState();
```
##### 3.1 store.dispatch
在说dispatch之前我们得先知道action
###### action
Action 就是 View 发出的通知，表示 State 应该要发生变化了

state 的变化，会导致 View 的变化，但是用户接触不到state.那么我们想要改变state就要有action通知。
action必须有一个type属性，它表示当前发生了什么变化
```
const action = {
  type: 'ADD_TODO',
  payload: 'Learn Redux'
};
```
视图层就是通过dispatch发出action来告诉store需要怎么改变数据

```
import { createStore } from 'redux';
const store = createStore(fn);

store.dispatch({
  type: 'ADD_TODO',
  payload: 'Learn Redux'
});
```
#### 4.Reducer
Reducer是什么呢，在redux中store自己是不处理数据的。当store接到视图层发来的actio要改变数据时，store会把当前的state和这个action传给Reducer，然后Reducer处理完数据返回一个新的state给到store。store.subscribe()监听到了数据的改变，再调用相应的方法重新渲染视图层。（比如react中的render方法或是setState）

说白了Reducer就state的计算过程。
下面是一个实际reducer例子

```

const defaultState = 0;
const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case 'ADD':
      return state + action.payload;
    default: 
      return state;
  }
};

const state = reducer(1, {
  type: 'ADD',
  payload: 2
});
```

注意点:reducer必须得是一个纯函数，因为reducer必须得保证相同的state必须得到同样的view。

纯函数的特征是只要是同样的输入，必定得到同样的输出。因此在reducer中

1.不能使用Date.now()或者Math.random()等不纯的方法，因为每次会得到不一样的结果

2.不得改写参数

3.不能调用系统 I/O 的API

也正因为这一点，Reducer 函数里面不能改变 State，必须返回一个全新的对象，请参考下面的写法。

```
// State 是一个对象
function reducer(state, action) {
  return Object.assign({}, state, { thingToChange });
  // 或者
  return { ...state, ...newState };
}

// State 是一个数组
function reducer(state, action) {
  return [...state, newItem];
}
```

####  5.store.subscribe()
这个使用的是发布者订阅模式。

Store 允许使用store.subscribe方法设置监听函数，一旦 State 发生变化，就自动执行这个函数。

包括后面我们使用的中间件，都是在这里面调用实现他们的功能的

```
store.subscribe(() => {
  let state = store.getState();
  console.log(state.count);
});
```

#### 6.createStore的简单实现
首先createStore要为store创建三个方法：store.getState()、store.dispatch()、store.subscribe()。
```
const createStore = (reducer) => {
  let state;
  let listeners = [];

  const getState = () => state;

  const dispatch = (action) => {
    state = reducer(state, action);
    //遍历调用每个监听（当然也可以是其他操作）
    listeners.forEach(listener => listener());
  };

  const subscribe = (listener) => {
    listeners.push(listener);
    return () => {//返回的这个函数是用来取消订阅的
      listeners = listeners.filter(l => l !== listener);
    }
  };

  dispatch({});

  return { getState, dispatch, subscribe };
};
```
#### 7.reducer的拆分
前面说过，一般大型复杂的项目才需要使用我们的redux，项目一大那么reducer肯定会很多，我们不能把它全部放到一个文件中，这样不便于维护，我们可以按模块或者按业务类型拆分成一个个的reducer
(例如订单下单模块，或者是会员模块)，最后利用redux提供的combineReducers合并成一个大的reducer。


```
const chatReducer = (state = defaultState, action = {}) => {
  return {
    chatLog: chatLog(state.chatLog, action),
    statusMessage: statusMessage(state.statusMessage, action),
    userName: userName(state.userName, action)
  }
};

利用combineReducers合并上面的三个reducer

import { combineReducers } from 'redux';

const chatReducer = combineReducers({
  chatLog,
  statusMessage,
  userName
})

export default todoApp;
```
##### combineReducers()的简单实现
处理逻辑是：先将所有的reducer放到一个reducers数组中，然后用reduce遍历处理每一个reducer返回新的state，将state合并成一个大的state返回
```
const combineReducers = reducers => {
  return (state = {}, action) => {
    return Object.keys(reducers).reduce(
      (nextState, key) => {
        nextState[key] = reducers[key](state[key], action);
        return nextState;
      },
      {} 
    );
  };
};
```
如果上面看不懂可以看下面这个例子

```

function combineReducers(reducers) {

  /* reducerKeys = ['counter', 'info']*/
  const reducerKeys = Object.keys(reducers)

  /*返回合并后的新的reducer函数*/
  return function combination(state = {}, action) {
    /*生成的新的state*/
    const nextState = {}

    /*遍历执行所有的reducers，整合成为一个新的state*/
    for (let i = 0; i < reducerKeys.length; i++) {
      const key = reducerKeys[i]
      const reducer = reducers[key]
      /*之前的 key 的 state*/
      const previousStateForKey = state[key]
      /*执行 分 reducer，获得新的state*/
      const nextStateForKey = reducer(previousStateForKey, action)

      nextState[key] = nextStateForKey
    }
    return nextState;
  }
}
```
##### 7.1 state 的拆分和合并
上面reducer按照模块拆分了，但是state还是写在一起的。分开写的话没有初始化，这个时候我们给createStore 函数调用dispatch({ type: Symbol() })，就都实现了初始化。原因：

createStore 的时候，用一个不匹配任何 type 的 action，来触发 state = reducer(state, action)

因为 action.type 不匹配，每个子 reducer 都会进到 default 项，返回自己初始化的 state，这样就获得了初始化的 state 树了。

#### 8.中间件middleware
前面的内容把redux基本的使用都包括了，如果我们想做一些其他的操作呢，例如打印state改变日志，还有抛出错误信息。

这就需要添加一些扩展了，但是在哪里添加呢，reducer中只能计算state，action只别人操作。想来想去只能在dispatch中添加扩展了

中间件就是其实就是一个函数，对dispatch进行改造，添加新的功能。


##### 8.1 中间件的使用

```
import { applyMiddleware, createStore } from 'redux';
import createLogger from 'redux-logger';
const logger = createLogger();

const store = createStore(
  reducer,
  applyMiddleware(logger)
);
```
上面代码中，redux-logger提供一个生成器createLogger，可以生成日志中间件logger。然后，将它放在applyMiddleware方法之中，传入createStore方法，就完成了store.dispatch()的功能增强。

使用中间件需要注意：

1.createStore方法可以接受整个应用的初始状态作为参数，那样的话，applyMiddleware就是第三个参数了。

```
const store = createStore(
  reducer,
  initial_state,
  applyMiddleware(logger)
);
```
2.中间件的次序有讲究。

```
const store = createStore(
  reducer,
  applyMiddleware(thunk, promise, logger)
);
```
##### 8.2 中间件的实现基本原理
在dispatch中添加扩展功能很容易，如下面：添加打印日志功能

```
let next = store.dispatch;
store.dispatch = function dispatchAndLog(action) {
  console.log('dispatching', action);
  next(action);
  console.log('next state', store.getState());
}
```
这样功能是实现了，但是这个是写死在dispatch中的，我们不能选择是否使用
所以中间件得抽取出来封装，实现需要 使用那个引入然后applyMiddleware(thunk, promise, logger)就能使用了。


抽取两个中间件的关键点在于：
1.一个中间件中使用到了另一个，解决方法就是把中间件当作一个参数传入
2.另外就是中间件中使用到了store，store也要作为参数传入
```
const store = createStore(reducer);
const next  = store.dispatch;

const loggerMiddleware = (store) => (next) => (action) => {
  console.log('this state', store.getState());
  console.log('action', action);
  next(action);
  console.log('next state', store.getState());
}

const exceptionMiddleware = (store) => (next) => (action) => {
  try {
    next(action);
  } catch (err) {
    console.error('错误报告: ', err)
  }
}

const logger = loggerMiddleware(store);
const exception = exceptionMiddleware(store);
store.dispatch = exception(logger(next));
```
##### 8.3中间件使用方式优化

```
import loggerMiddleware from './middlewares/loggerMiddleware';
import exceptionMiddleware from './middlewares/exceptionMiddleware';
import timeMiddleware from './middlewares/timeMiddleware';

...

const store = createStore(reducer);
const next = store.dispatch;

const logger = loggerMiddleware(store);
const exception = exceptionMiddleware(store);
const time = timeMiddleware(store);
store.dispatch = exception(time(logger(next)));
```
exception(time(logger(next)))这种使用方式有点乱，当使用的中间件更多的时候就更麻烦了。当然redux提供了一个applyMiddleware方法，我们只要这样使用applyMiddleware(thunk, promise, logger)。他会帮我们把一个个中间件按顺序调用

##### 8.4applyMiddleware的实现

```
const applyMiddleware = function (...middlewares) {
  /*返回一个重写createStore的方法*/
  return function rewriteCreateStoreFunc(oldCreateStore) {
     /*返回重写后新的 createStore*/
    return function newCreateStore(reducer, initState) {
      /*1. 生成store*/
      const store = oldCreateStore(reducer, initState);
      /*给每个 middleware 传下store，相当于 const logger = loggerMiddleware(store);*/
      /* const chain = [exception, time, logger]*/
      const chain = middlewares.map(middleware => middleware(store));
      let dispatch = store.dispatch;
      /* 实现 exception(time((logger(dispatch))))*/
      chain.reverse().map(middleware => {
        dispatch = middleware(dispatch);
      });

      /*2. 重写 dispatch*/
      store.dispatch = dispatch;
      return store;
    }
  }
}
```
更多实现请看：https://mp.weixin.qq.com/s/cYp-8zm-d1Rtn9qC7EF-Cw