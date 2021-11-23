### Vue 源码之指令、双向绑定
1.大体的思路
  - 在vue的class类中会有一步是：对传入的el内容进行编译（模板编译）,
 在这里面获取到字符串模板（el 里的内容）的所有子节点，通过nodeType判断是元素节点还是文本节点,
 元素节点调用compileElement处理，文本节点在compileText处理
```
 new Compile(options.el, this)
```
#### vue类的创建
在vue类的创建主要会做以下几个事情：
 - 1.把定义的option赋值给vue实例
 - 2.把option的data赋值到vue实例_data上
 - 3.调用observe(this._data)将data变成响应式的
 - 4.调用 _initWatch() 处理 options 里面定义的每个watch
 - 5.对传入的 el 内容进行编译

vue类的创建
```
import Compile from "./Compile.js";
import observe from './observe.js';
import Watcher from './Watcher.js';

export default class vue {
    constructor(options) {
        this.$options = options || {} // Vue 实例的用户能拿到 options
        this._data = options._data || undefined
        // 初始化定义data
        this._initData(); 
        // 将数据变成响应式
        observe(this._data);
        // 处理每个实例上定义的watch
        this._initWatch();
        // 模板编译
        new Compile(options.el, this);
    }

    _initData() {
        Object.keys(this._data).forEach(e => {
            Object.defineProperty(this, e, {
                configurable: true,
                enumerable: true,

                get: function getter() {
                    return this._data[e]
                },

                set: function setter(newVal) {
                    this._data[e] = newVal
                }

            })
        });
    }

    _initWatch() {
        const watch = this.$options.watch
        Object.keys(watch).forEach(item => {
            new Watcher(this, item, watch[item])
        })
    }
}
```
#### Fragment 的生成，再模板编译
在vue中是通过AST进行操作的。为了简化学习步骤，这里用文档片段（DocumentFragment）进行编译处理

*Compile类
```
export default class compile {
    constructor(el, vue) {
        this.$vue = vue; // vue实例
        // 获取挂载点
        this.$el = document.querySelector(el);
        if(this.$el) { 
            // 如果用户传入了挂在点，调用node2Fragment函数，让节点变为fragment（类似 mustache 里的 tokens）
            const $fragment = this.node2Fragment(this.$el);
            // 对文档片段进行编译
            this.compile($fragment);
            // 将文档片段上树
            this.$el.appendChid($fragment)
            
        }
    }

    node2Fragment(el) {
        var fragment = document.createDocumentFragment()
        var child;
        while(child = el.firstChild) { // 这里是一个赋值操作，在fragment.appendChild第一个child之后，
            // 第二个就变成第一个了，直到全部加入
            fragment.appendChild(child)
        }
        return fragment
    }

    compile(el) {
        // 得到子元素
        var childNodes = el.childNodes
        var _self = this
        var reg = /\{\{(.*)\}\}/;
        childNodes.forEach(node => {
            var text = node.textContent
            if(node.nodeType === 1){
                _self.compileElement(node)
            }else if(node.nodeType === 3 && reg.test(text)){
                var name = text.match(reg)[1]
                _self.compileText(node, name)
            }
        })
    }

    // 这里处理文本元素
    compileText() {

    }
    //这里处理节点元素
    compileElement() {

    }

    }
```




