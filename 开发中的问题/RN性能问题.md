### 1.下拉加载更多的列表（猜你喜欢、首页产品推荐）
 * 在做'猜你喜欢',一个下拉更多可能出现几十页数据的时候，最开始使用的是rn官方提供的高性能列表组件：
   - FlatList  
 但是FlatList在老的机型上有性能问题，当下拉的时候会出现页面越卡现象，页面图像出现较慢

 * 后面找到了一个更好的高性能RN列表组件： 
   - RecyclerListView
#### 1.1 ListView、FlatList和RecyclerListView区别
 * ListView：会一次性创建所有的列表单元格——cell。如果列表数据比较多，则会创建很多的视图对象，而视图对象是非常消耗内存的。所以ListView组件对于这种几十页的数据的业务基本上是不可以用的。


 * FlatList：它之所以比ListView性能好，是因为它会回收不在可视区域的视图，然后根据页面的滚动创建现在可视区域的视图。
   - 1) FlatList是将不可见的视图回收，从内存中清除了，下次需要的时候再重新创建。
   - 2) 这样就需要设备在页面滚动时能快速创建出可见的视图，老的设备因为老化和本身硬件性能等原因，计算力等跟不上，导致创建视图的速度达不到使列表流畅滚动的要求(卡顿)。


 * RecyclerListView: 为什么RecyclerListView的性能更好呢
   - RecyclerListView和FlatList一样仅创建可见区域的视图
   - 重用单元格，RecyclerListView对不可见视图对象进行缓存及重复利用

 * RecyclerListView 通过对不可见视图对象进行缓存及重复利用，一方面不会创建大量的视图对象，另一方面也不需要频繁的创建视图对象和垃圾回收。

RecyclerListView使用请参考：[Flipkart/recyclerlistview](https://github.com/Flipkart/recyclerlistview/blob/afd7d80c13bad68ddbb60849ccda47ccef3ecda2/src/core/RecyclerListView.tsx#L488-L566)

### 2.关于rn列表组件与ScrollView嵌套产生的坑
 * 其实这个坑也是在猜你喜欢时发现的，这一块其实是两个性能问题，一个是FlatList导致的，一个是列表组件与ScrollView嵌套导致的
   - 当FlatList外部嵌套了一层可滑动布局时，下拉加载一次数据页面变得反应慢了，老机型上面则是更加明显，拉来android开发一看，内存占用过高导致。后面查资料定位到是因为当外层嵌套滑动布局时，FlatList的不可视区域回收复用机制将失效。

 * 解决方案：
   - 1.将组件整个瀑布流上面的部分封装成一个头部组件，下拉加载更多后面的部分封装成footer组件，这两个组件作为瀑布流组件的两个属性传入，这样就可以取消外层的ScrollView


