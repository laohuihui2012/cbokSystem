### 1.1自定义指令
 * 自定义指令是以v-开头的行内属性，除了核心功能默认内置的指令 (v-model 和 v-show)，
 Vue 也允许注册自定义指令来完成我们的需求

 * 自定义指令有下面几种
```
//会实例化一个指令，但这个指令没有参数 
`v-xxx`
 
// -- 将值传到指令中
`v-xxx="value"`  
 
// -- 将字符串传入到指令中，如`v-html="'<p>内容</p>'"`
`v-xxx="'string'"` 
 
// -- 传参数（`arg`），如`v-bind:class="className"`
`v-xxx:arg="value"` 
 
// -- 使用修饰符（`modifier`）
`v-xxx:arg.modifier="value"` 
```

### 1.2 自定义指令的注册方式
 * 全局注册和局部注册
##### 1.2.1 全局注册
 * 全局注册主要是用过Vue.directive方法进行注册
   - Vue.directive第一个参数是指令的名字（不需要写上v-前缀），第二个参数可以是对象数据，也可以是一个指令函数
```
// 注册一个全局自定义指令 `v-focus`
Vue.directive('focus', {
  // 当被绑定的元素插入到 DOM 中时……
  inserted: function (el) {
    // 聚焦元素
    el.focus()  // 页面加载完成之后自动让输入框获取到焦点的小功能
  }
})
```
##### 1.2.2 举报注册
 * 局部注册通过在组件options选项中设置directive属性(只能再组件内使用)
```
directives: {
  focus: {
    // 指令的定义
    inserted: function (el) {
      el.focus() // 页面加载完成之后自动让输入框获取到焦点的小功能
    }
  }
}
// 使用
<input v-focus />
```
### 2.自定义指令的钩子函数和参数
 * 自定义指令的有5个钩子函数：
    - bind：只调用一次，指令第一次绑定到元素时调用。在这里可以进行一次性的初始化设置
    - inserted：被绑定元素插入父节点时调用 (仅保证父节点存在，但不一定已被插入文档中)
    - update：所在组件的 VNode 更新时调用，但是可能发生在其子 VNode更新之前。指令的值可能发生了改变。（可以通过比较更新前后的值来忽略不必要的模板更新）
    - componentUpdated：指令所在组件的 VNode 及其子 VNode 全部更新后调用
    - unbind：只调用一次，指令与元素解绑时调用
 * 所有钩子函数都有两个参数el和binding
   - el: 指令所绑定的元素，可以用来直接操作 DOM
   - binding：一个对象
 
 * binding参数包含以下属性：
 ```
 
`name`：指令名，不包括 v- 前缀。

`value`：指令的绑定值，例如：v-my="2 + 5" 中，绑定值为 7。

`oldValue`：指令绑定的前一个值，仅在 update 和 componentUpdated 钩子中可用。无论值是否改变都可用。

`expression`：字符串形式的指令表达式。例如 v-my-directive="1 + 1" 中，表达式为 "1 + 1"。

`arg`：传给指令的参数，可选。例如 v-my-directive:foo 中，参数为 "foo"。

`modifiers`：一个包含修饰符的对象。例如：v-my-directive.foo.bar 中，修饰符对象为 { foo: true, bar: true }

`vnode`：Vue 编译生成的虚拟节点

`oldVnode`：上一个虚拟节点，仅在 update 和 componentUpdated 钩子中可用

 ```
  * 注意：除了 el 之外，其它参数都应该是只读的，切勿进行修改。如果需要在钩子之间共享数据，
  建议通过元素的 dataset 来进行

### 3.应用场景
 * 
  - 代码复用和抽象的主要形式是组件。
  - 当需要对普通 DOM 元素进行底层操作，此时就会用到自定义指令

 * 拖拽 (局部注册)
```
<div ref="a" id="bg" v-drag></div>

  directives: {
    drag: {
      inserted(el) {
        el.onmousedown = (e) => {
          let x = e.clientX - el.offsetLeft;
          let y = e.clientY - el.offsetTop;
          document.onmousemove = (e) => {
            let xx = e.clientX - x + "px";
            let yy = e.clientY - y + "px";
            el.style.left = xx;
            el.style.top = yy;
          };
          el.onmouseup = (e) => {
            document.onmousemove = null;
          };
        };
      },
    },
  }
```
* 时间转换(全局注册)
```
<span v-relativeTime="time"></span>
<script>
    new Vue({
    el: '#app',
    data: {
        time: 1565753400000
    }
    })

    Vue.directive('relativeTime', {
    bind(el, binding) {
            // formatTime() 省略
            el.innerHTML = formatTime(binding.value)
            el.__timeout__ = setInterval(() => {
            el.innerHTML = Time.getFormatTime(binding.value)
        }, 6000)
    },
    unbind(el) {
            clearInterval(el.innerHTML)
            delete el.__timeout__
       }
    })
</script>

```
