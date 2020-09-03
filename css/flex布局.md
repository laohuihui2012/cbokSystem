## 1.基本概念
采用 Flex 布局的元素，称为 Flex 容器。它的所有子元素自动成为容器成员，称为 Flex 项目

容器默认存在两根轴：水平的主轴（main axis）和垂直的交叉轴（cross axis）。主轴的开始位置（与边框的交叉点）叫做main start，结束位置叫做main end；交叉轴的开始位置叫做cross start，结束位置叫做cross end。
### 2.作用在上容器的属性

```
1.flex-direction：（ row（水平从左向右） | row-reverse | column（垂直从下向上） | column-reverse;）属性决定主轴的方向
2.flex-wrap：nowrap（不换行）| wrap（换行，第一行在上面）| wrap-reverse（默认项目都排一条线，如何换行。）
3.flex-flow：flex-direction属性和flex-wrap的简写
4.justify-content:定义了项目在主轴上的对齐方式。
5.align-items：定义项目在交叉轴上如何对齐
6.align-content：定义了多根轴线的对齐方式。如果项目只有一根轴线，该属性不起作用。
```

- justify-content属性 （主轴）

```
flex-start（默认值）：左对齐
flex-end：右对齐
center： 居中
space-between：两端对齐，项目之间的间隔都相等。
space-around：每个项目两侧的间隔相等。所以，项目之间的间隔比项目与边框的间隔大一倍。
```

- align-items属性 （副轴）
```
flex-start：交叉轴的起点对齐。
flex-end：交叉轴的终点对齐。
center：交叉轴的中点对齐。
baseline: 项目的第一行文字的基线对齐。
stretch（默认值）：如果项目未设置高度或设为auto，将占满整个容器的高度。拉伸
```

-  align-content属性 (与justify-content类似得属性，只有多根轴得时候才起作用)
```
flex-start：与交叉轴的起点对齐。
flex-end：与交叉轴的终点对齐。
center：与交叉轴的中点对齐。
space-between：与交叉轴两端对齐，轴线之间的间隔平均分布。
space-around：每根轴线两侧的间隔都相等。所以，轴线之间的间隔比轴线与边框的间隔大一倍。
stretch（默认值）：轴线占满整个交叉轴。
```
## 2.作用在上项目的属性（设置在项目上）

```
order：定义项目的排列顺序。数值越小，排列越靠前，默认为0。
flex-grow：定义项目的放大比例
flex-shrink：定义了项目的缩小比例，默认为1
flex-basis：定义了在分配多余空间之前，项目占据的主轴空间（main size）
flex：flex-grow, flex-shrink 和 flex-basis的简写
align-self：允许单个项目有与其他项目不一样的对齐方式
```


- flex-grow属性

```
定义了项目的缩小比例，默认为1，即如果空间不足，该项目将缩小。
如果所有项目的flex-shrink属性都为1，当空间不足时，都将等比例缩小。
如果一个项目的flex-shrink属性为0，其他项目都为1，则空间不足时，前者不缩小。
```
- flex-shrink属性

```
定义了项目的缩小比例，默认为1，即如果空间不足，该项目将缩小。
如果所有项目的flex-shrink属性都为1，当空间不足时，都将等比例缩小。
如果一个项目的flex-shrink属性为0，其他项目都为1，则空间不足时，前者不缩小。
```
- flex-basis属性

```
定义了在分配多余空间之前，项目占据的主轴空间（main size）。
浏览器根据这个属性，计算主轴是否有多余空间。它的默认值为auto，即项目的本来大小。
它可以设为跟width或height属性一样的值（比如350px），则项目将占据固定空间。
```
- align-self属性

```
性允许单个项目有与其他项目不一样的对齐方式，可覆盖align-items属性。
默认值为auto，表示继承父元素的align-items属性，如果没有父元素，则等同于stretch。
```

##### flex
flex属性是flex-grow，flex-shrink和flex-basis的缩写。
```
flex默认值等同于flex:0 1 auto；
flex:none等同于flex:0 0 auto；
flex:auto等同于flex:1 1 auto；
```

[详细请看：](https://www.zhangxinxu.com/wordpress/2018/10/display-flex-css3-css/)