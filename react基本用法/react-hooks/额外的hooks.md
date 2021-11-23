##### 1.useRef
useRef 返回一个可变的 ref 对象，其 .current 属性被初始化为传入的参数（initialValue）。注意：返回的 ref 对象在组件的整个生命周期内保持不变

刚开始从class组件转过来时，DOM节点的访问,可以用到useRef
```
function TextInputWithFocusButton() {
  const inputEl = useRef(null);
  const onButtonClick = () => {
    // `current` 指向已挂载到 DOM 上的文本输入元素
    inputEl.current.focus();
  };
  return (
    <>
      <input ref={inputEl} type="text" />
      <button onClick={onButtonClick}>Focus the input</button>
    </>
  );
}
```
没有了this,函数内部定义的定时器在外部无法访问，我们也可以把定时器useRef。cu


```
const Detail = () => {

  const timer=useRef(null);

  const start = () => {
     timer.current = setInterval(() => {}, 1000)
  }

  useEffect(() => {
    start()
    return () => {
      clearInterval(timer.current)
    }
  })

  return (
    ....
  )
}

export default Detail
```
##### 2.useReducer
用 reducer 重写 useState 一节的计数器示例：

使用 useReducer 还能给那些会触发深更新的组件做性能优化，因为你可以向子组件传递 dispatch 而不是回调函数 
```
const initialState = {count: 0};

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return {count: state.count + 1};
    case 'decrement':
      return {count: state.count - 1};
    default:
      throw new Error();
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <>
      Count: {state.count}
      <button onClick={() => dispatch({type: 'decrement'})}>-</button>
      <button onClick={() => dispatch({type: 'increment'})}>+</button>
    </>
  );
}
```
##### 3.useCallback
这个可以做性能优化，当一些复杂的函数，我们不需要它经常计算更新，设置函数依赖的变量，只有当变量改变时才更新
```
const memoizedCallback = useCallback(
  () => {
    doSomething(a, b);
  },
  [a, b],
);
```
##### 4.useMemo
useCallback(fn, deps) 相当于 useMemo(() => fn, deps)

注意：传入 useMemo 的函数会在渲染期间执行。请不要在这个函数内部执行与渲染无关的操作，诸如副作用这类的操作属于 useEffect

```
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```
把“创建”函数和依赖项数组作为参数传入 useMemo，它仅会在某个依赖项改变时才重新计算 memoized 值。这种优化有助于避免在每次渲染时都进行高开销的计算。

##### 5.useLayoutEffect
其函数签名与 useEffect 相同，但它会在所有的 DOM 变更之后同步调用 effect。可以使用它来读取 DOM 布局并同步触发重渲染。在浏览器执行绘制之前，useLayoutEffect 内部的更新计划将被同步刷新。