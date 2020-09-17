#### 1.常见定位方案
- 普通流 (normal flow)
在普通流中，元素按照其在 HTML 中的先后位置至上而下布局，在这个过程中，行内元素水平排列，

直到当行被占满然后换行，块级元素则会被渲染为完整的一个新行，除非另外指定，否则所有元素默认都是普通流定位，

也可以说，普通流中元素的位置由该元素在 HTML 文档中的位置决定。

- 浮动 (float)

在浮动布局中，元素首先按照普通流的位置出现，然后根据浮动的方向尽可能的向左边或右边偏移，其效果与印刷排版中的文本环绕相似。

- 绝对定位 (absolute positioning)

在绝对定位布局中，元素会整体脱离普通流，因此绝对定位元素不会对其兄弟元素造成影响，而元素具体的位置由绝对定位的坐标决定。

#### 2.BFC 概念
Formatting context(格式化上下文) 是 W3C CSS2.1 规范中的一个概念。它是页面中的一块渲染区域，

并且有一套渲染规则，它决定了其子元素将如何定位，以及和其他元素的关系和相互作用。
```
具有 BFC 特性的元素可以看作是隔离了的独立容器，容器里面的元素不会在布局上影响到外面的元素，
并且 BFC 具有普通容器所没有的一些特性。
```
#### 3.触发BFC的条件
- 1.根元素
- 2.设置position为absolute、fixed的元素
- 3.设置了display:inline-block、table-cellsd、flex
- 4.设置了overflow:除了visible以外的值(hidden、scroll、auto)

#### 4.BFC的特性
1. 同一个 BFC 下外边距会发生折叠
```
<head>
div{
    width: 100px;
    height: 100px;
    background: lightblue;
    margin: 100px;
}
</head>
<body>
    <div></div>
    <div></div>
</body>
```
本来两个div的距离是200px,折叠之后只有100px

如果想要避免外边距的重叠，可以将其放在不同的 BFC 容器中。
```
<div class="container">
    <p></p>
</div>
<div class="container">
    <p></p>
</div>
.container {
    overflow: hidden;
}
p {
    width: 100px;
    height: 100px;
    background: lightblue;
    margin: 100px;
}
```
#### BFC的应用
###### 1.清除浮动
```
<div style="border: 1px solid #000;">
    <div style="width: 100px;height: 100px;background: #eee;float: left;"></div>
</div>
```
子盒子因为浮动脱离了文档流，导致父盒子没有撑开只剩2px border
```
<div style="border: 1px solid #000; overflow:hidden">
    <div style="width: 100px;height: 100px;background: #eee;float: left;"></div>
</div>
```
这样就BFC 可以包含浮动的元素，撑开父盒子
##### 2.BFC 不与浮动元素重叠
```
<div style="height: 100px;width: 100px;float: left;background: lightblue">我是一个左浮动的元素</div>
<div style="width: 200px; height: 200px;background: #eee">我是一个没有设置浮动, 
也没有触发 BFC 元素, width: 200px; height:200px; background: #eee;</div>
```
如果想避免元素被覆盖，可触第二个元素的 BFC 特性，在第二个元素中加入 overflow: hidden

图片请看image
