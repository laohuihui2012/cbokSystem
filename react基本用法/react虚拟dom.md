### 虚拟Dom
React 的核心思想

内存中维护一颗虚拟DOM树，数据变化时（setState），自动更新虚拟 DOM，得到一颗新树，然后 Diff 新老虚拟 DOM 树，找到有变化的部分，得到一个 Change(Patch)，将这个 Patch 加入队列，最终批量更新这些 Patch 到 DOM 中。

我们常说的虚拟Dom是通过JS对象模拟出DOM节点，然后通过DOM diff 计算操的DOM变化

react涉及的虚拟DOM主要包括三部分：

- 1.把render中jsx转化成虚拟DOM
- 2.状态或属性改变后重新计算虚拟DOM并生成一个补丁对象(domDiff)
- 3.通过补丁更新视图

#### 实现更新的思路

首先用JS模拟DOM节点，当DOM节点发生变化的时候，通过DOM diff策略计算出补丁对象(patches),然后再同过补丁对象记录的差异化信息，对旧的DOM进行操作。然后将操作后的DOM更新为新DOM。

### react diff 策略

传统 diff 算法通过循环递归对节点进行依次对比，效率低下，算法复杂度达到 O(n^3)，其中 n 是树中节点的总数。
这种指数型的性能消耗对于前端渲染场景来说代价太高。

diff 策略主要有三个：

- 1.Web ui中DOM节点跨层级的移动操作的特别少，直接忽略不计（tree diff）

- 2.拥有相同类的两个组件会生成类似的树状结构，拥有不同类的两个组件会生成不一样的树状结构 (component diff)

- 3.对于同一层级的一组子节点，通过唯一的id来区分


#### tree diff
react对树进行分层比较，只会对树的同一层级的节点比较。

既然 DOM 节点跨层级的移动操作少到可以忽略不计，针对这一现象，React 通过 updateDepth 对 Virtual DOM 树进行层级控制，

只会对相同层级的 DOM 节点进行比较，即同一个父节点下的所有子节点。当发现节点已经不存在，

则该节点及其子节点会被完全删除掉，不会用于进一步的比较。这样只需要对树进行一次遍历，便能完成整个 DOM 树的比较。
```
updateChildren: function(nextNestedChildrenElements, transaction, context) {
  updateDepth++;
  var errorThrown = true;
  try {
    this._updateChildren(nextNestedChildrenElements, transaction, context);
    errorThrown = false;
  } finally {
    updateDepth--;
    if (!updateDepth) {
      if (errorThrown) {
        clearQueue();
      } else {
        processQueue();
      }
    }
  }
}
```
注意:React 官方建议不要进行 DOM 节点跨层级的操作。

#### component diff
React 是基于组件构建应用的，对于组件间的比较所采取的策略也是简洁高效

- 如果是同一类型的组件，按照原策略继续比较 virtual DOM tree

- 如果不是，则将该组件判断为 dirty component，从而替换整个组件下的所有子节点。

- 对于同一类型的组件，有可能其 Virtual DOM 没有任何变化，如果能够确切的知道这点那可以节省大量的 diff 运算时间，
因此 React 允许用户通过 shouldComponentUpdate() 来判断该组件是否需要进行 diff。

#### element diff
当节点处于同一层级时，React diff 提供了三种节点操作，分别为：INSERT_MARKUP（插入）、MOVE_EXISTING（移动）和 REMOVE_NODE（删除）

- 1.INSERT_MARKUP，新的 component 类型不在老集合里， 即是全新的节点，需要对新节点执行插入操作。

- 2.MOVE_EXISTING，在老集合有新 component 类型，且 element 是可更新的类型，
generateComponentChildren 已调用 receiveComponent，这种情况下 prevChild=nextChild，就需要做移动操作，可以复用以前的 DOM 节点。

- 3.REMOVE_NODE，老 component 类型，在新集合里也有，但对应的 element 不同则不能直接复用和更新，需要执行删除操作，或者老 component 不在新集合里的，也需要执行删除操作。

总结：
```
React 通过制定大胆的 diff 策略，将 O(n3) 复杂度的问题转换成 O(n) 复杂度的问题；

React 通过分层求异的策略，对 tree diff 进行算法优化；

React 通过相同类生成相似树形结构，不同类生成不同树形结构的策略，对 component diff 进行算法优化；

React 通过设置唯一 key的策略，对 element diff 进行算法优化；

建议，在开发组件时，保持稳定的 DOM 结构会有助于性能的提升；

建议，在开发过程中，尽量减少类似将最后一个节点移动到列表首部的操作，当节点数量过大或更新操作过于频繁时，在一定程度上会影响 React 的渲染性能。
```
[此文详细介绍](https://zhuanlan.zhihu.com/p/20346379)

### Fiber
浏览器一帧内的工作

一帧内需要完成如下六个步骤的任务：

 - 处理用户的交互

 - JS 解析执行

 - 帧开始。窗口尺寸变更，页面滚去等的处理

 - rAF(requestAnimationFrame)

 - 布局

 - 绘制

如果这六个步骤中，任意一个步骤所占用的时间过长，总时间超过 16ms 了之后，用户也许就能看到卡顿。

把渲染更新过程拆分成多个子任务，每次只做一小部分，做完看是否还有剩余时间，如果有继续下一个任务；如果没有，挂起当前任务，将时间控制权交给主线程，等主线程不忙的时候在继续执行。这种策略叫做 Cooperative Scheduling（合作式调度），操作系统常用任务调度策略之一。


 - 低优先级任务由requestIdleCallback处理；

 - 高优先级任务，如动画相关的由requestAnimationFrame处理；

 - requestIdleCallback可以在多个空闲期调用空闲期回调，执行任务；

 - requestIdleCallback方法提供 deadline，即任务执行限制时间，以切分任务，避免长时间执行，阻塞UI渲染而导致掉帧；

#### 什么是 Fiber
Fiber 代表一种工作单元。 Fiber 是一种数据结构(堆栈帧)，也可以说是一种解决可中断的调用任务的一种解决方案，它的特性就是时间分片(time slicing)和暂停(supense)。

#### Fiber 是如何工作的

 - ReactDOM.render() 和 setState 的时候开始创建更新。

 - 将创建的更新加入任务队列，等待调度。

 - 在 requestIdleCallback 空闲时执行任务。

 - 从根节点开始遍历 Fiber Node，并且构建 WokeInProgress Tree。

 - 生成 effectList。

 - 根据 EffectList 更新 DOM。

[fiber一](https://mp.weixin.qq.com/s/dONYc-Y96baiXBXpwh1w3A)
[fiber二](https://juejin.im/post/6844903901590716429)