#### 1.如何获取 DOM 节点信息？
获取 DOM 节点的位置或是大小是经常需要用到的。在hook中我们可以使用 callback ref完成。每当 ref 被附加到一个另一个节点，React 就会调用 callback。

```
function MeasureExample() {
  const [height, setHeight] = useState(0);

  const measuredRef = useCallback(node => {
    if (node !== null) {
      setHeight(node.getBoundingClientRect().height);
    }
  }, []);

  return (
    <>
      <h1 ref={measuredRef}>Hello, world</h1>
      <h2>The above header is {Math.round(height)}px tall</h2>
    </>
  );
}
```
在这里很多人可能会想到使用useRef，但是当ref是一个对象时，它不会把当前ref值的变化告诉我们。使用callback ref 可以确保即使子组件延迟显示被测量的节点，我们也能够在父组件中收到通知，以便更新测量结果

在这里我们还可以把这个逻辑抽出来作为一个可以复用的hook

```
function MeasureExample() {
  const [rect, ref] = useClientRect();
  return (
    <>
      <h1 ref={ref}>Hello, world</h1>
      {rect !== null &&
        <h2>The above header is {Math.round(rect.height)}px tall</h2>
      }
    </>
  );
}

function useClientRect() {
  const [rect, setRect] = useState(null);
  const ref = useCallback(node => {
    if (node !== null) {
      setRect(node.getBoundingClientRect());
    }
  }, []);
  return [rect, ref];
}
```
#### 2.实现子组件向父组件传值（避免向下传递回调）
za9i大型组件中，我们可以通过 context 用 useReducer 往下传一个 dispatch 函数：

```
const TodosDispatch = React.createContext(null);

function TodosApp() {
  // 提示：`dispatch` 不会在重新渲染之间变化
  const [todos, dispatch] = useReducer(todosReducer);

  return (
    <TodosDispatch.Provider value={dispatch}>
      <DeepTree todos={todos} />
    </TodosDispatch.Provider>
  );
}
```
TodosApp 内部组件树里的任何子节点都可以使用 dispatch 函数来向上传递 actions 到 TodosApp：
从维护的角度来这样看更加方便（不用不断转发回调），同时也避免了回调的问题。
```
function DeepChild(props) {
  // 如果我们想要执行一个 action，我们可以从 context 中获取 dispatch。
  const dispatch = useContext(TodosDispatch);

  function handleClick() {
    dispatch({ type: 'add', text: 'hello' });
  }

  return (
    <button onClick={handleClick}>Add todo</button>
  );
}
```


#### 3.获取上一轮的props或者是state
目前可以通过ref来手动实现

```
function Counter() {
  const [count, setCount] = useState(0);
  const prevCount = usePrevious(count);
  return <h1>Now: {count}, before: {prevCount}</h1>;
}

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
```
#### 4.实现 shouldComponentUpdate
用 React.memo 包裹一个组件来对它的 props 进行浅比较

```
const Button = React.memo((props) => {
  // 你的组件
});
```
React.memo 等效于 PureComponent，但它只比较 props。（你也可以通过第二个参数指定一个自定义的比较函数来比较新旧 props。如果函数返回 true，就会跳过更新。）

#### 5.实现forceUpdate

如果前后两次的值是相同的，如果前后两次的值相同，useState 和 useReducer Hook 都会放弃更新。原地修改 state 并调用 setState 不会引起重新渲染。

通常，你不应该在 React 中修改本地 state。然而，作为一条出路，你可以用一个增长的计数器来在 state 没变的时候依然强制一次重新渲染：

```
 const [ignored, forceUpdate] = useReducer(x => x + 1, 0);

  function handleClick() {
    forceUpdate();
  }
```