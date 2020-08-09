###### 自定义hook就是抽取重复复用的状态逻辑，之前的解决方法是使用高阶组件和渲染属性（render props）

下面我们以一个监听好友是否在线的功能来写一个自定义hook

```
import React, { useState, useEffect } from 'react';

function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(null);

  function handleStatusChange(status) {
    setIsOnline(status.isOnline);
  }

  useEffect(() => {
    ChatAPI.subscribeToFriendStatus(friendID, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(friendID, handleStatusChange);
    };
  });

  return isOnline;
}
```
这里把订阅好友现在抽出一个复用的组件，通过传入不同好友ID来实现返回不同状态
这样你在很多组件中都能复用到

好友状态组件中使用
```
function FriendStatus(props) {
  const isOnline = useFriendStatus(props.friend.id);

  if (isOnline === null) {
    return 'Loading...';
  }
  return isOnline ? 'Online' : 'Offline';
}
```

好友列表中使用
```
function FriendListItem(props) {
  const isOnline = useFriendStatus(props.friend.id);

  return (
    <li style={{ color: isOnline ? 'green' : 'black' }}>
      {props.friend.name}
    </li>
  );
}
```
不过需要注意的是：自定义 Hook 必须以 “use” 开头，不遵循的话，由于无法判断某个函数是否包含对其内部 Hook 的调用，React 将无法自动检查你的 Hook 是否违反了 Hook 的规则。

很多人会以为在两个组件中使用相同的 Hook 会共享 state 。其实不会，自定义 Hook 是一种重用状态逻辑的机制(例如设置为订阅并存储当前值)，每次使用自定义hook，state和副作用都是不一样的