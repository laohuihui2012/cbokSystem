### 1.render里面尽量减少新建变量和bind函数
```
constructor (props) {
    super(props)
    this.state = {}
    this.handleClick = this.handleClick.bind(this);
  }
<button onClick={this.handleClick}>btn1</button>
<button onClick={this.handleClick.bind(this)}>btn2</button>
<button onClick={() => this.handleClick()}>btn1</button>
```
 * 第一种是在构造函数中绑定this,构造函数每次渲染只会执行一遍；

 * 第二种是在render()函数里绑定this,每次render()都会重新执行一遍函数；

 * 第三种使用箭头函数，每次render()都会生成一个新的箭头函数
### 2.定制shouldComponentUpdate函数
通过定制shouldComponentUpdate，自己判断哪些变量的变化才让组件重写渲染；

### 3.使用React.PureComponent
 * React.PureComponent 与 React.Component 很相似。
   - 两者的区别: React.PureComponent实现了 shouldComponentUpdate()，而 React.PureComponent 中以浅层对比 prop 和 state 的方式来实现了该函数。
### 4.使用React.memo来缓存组件
 * React.memo是一个高阶组件，高阶组件（HOC）是参数为组件，返回值为新组件的函数
   - React.memo 仅检查 props 变更。如果函数组件被 React.memo 包裹，且其实现中拥有 useState，useReducer 或 useContext 的 Hook，当 state 或 context 发生变化时，它仍会重新渲染。
   - 默认情况下其只会对复杂对象做浅层对比，如果你想要控制对比过程，那么请将自定义的比较函数通过第二个参数传入来实现
```

  const childCom = (props) => {
    // 使用props渲染
  }

  const areEqual = (prevProps, nextProps) => {
    // 通过对比nextProps和preveProps结果，结果一致返回true，不一致返回false
  }

  export default React.memo(childCom, areEqual)
```
### 5.使用useMemo缓存函数
### 6.正确使用列表 key
  * 进行列表渲染时，React 会要求你给它们提供 key，让 React 识别更新后的位置变化，避免一些不必要的组件树销毁和重建工作。
    - 比如你的第一个元素是 div，更新后发生了位置变化，第一个变成了 p。如果你不通过 key 告知新位置，React 就会将 div 下的整棵树销毁，然后构建 p 下的整棵树，非常耗费性能。
    - 如果你提供了位置，React 就会做真实 DOM 的位置移动，然后做树的更新，而不是销毁和重建。

如果你想深入了解 key，可以看我写的这篇文章：《React 中的列表渲染为什么要加 key ？》
### 7.避免使用内联对象
 * 原因：使用内联对象时，react会在每次渲染时重新创建对此对象的引用，这会导致接收此对象的组件将其视为不同的对象,因此，该组件对于prop的浅层比较始终返回false,导致组件一直重新渲染。
   - 解决方法：我们可以保证该对象只初始化一次，指向相同引用。
   - 另外一种情况是传递一个对象，同样会在渲染时创建不同的引用，也有可能导致性能问题，我们可以利用ES6扩展运算符将传递的对象解构。这样组件接收到的便是基本类型的props，组件通过浅层比较发现接受的prop没有变化，则不会重新渲染。示例如下：
```
// Don't do this!
function Component(props) {
  const aProp = { someProp: 'someValue' }
  return <AnotherComponent style={{ width: 42px; height: 42px; margin-bottom: 5px;}} aProp={aProp} />  
}

// Do this instead :)
const styles = { width: 42px; height: 42px; margin-bottom: 5px;};
function Component(props) {
  const aProp = { someProp: 'someValue' }
  return <AnotherComponent style={styles} {...aProp} />  
}
```
