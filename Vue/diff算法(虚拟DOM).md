### 1.虚拟DOM
 * 虚拟dom本质上是一个用来描述真实DOM的JavaScript对象；
 * 框架的性能优化主要之一就是：避免操作真实DOM，当DOM结构变化了，用diff算法通过新旧虚拟DOM的对比，形成最终的DOM结构，然后再批量的去更新DOM结构；
 
 DOM变成虚拟DOM就是h函数实现的
### 2.h函数
 * h函数的作用就是产生虚拟节点
 比如调用 h 函数：h("a", { props: { class: "box" } }, "woshilaohuihui!") 得到的虚拟节点：
 ```
 { 
    sel: "a", 
    data: { props: { class: "box" } }, 
    children: undefined, 
    text: "woshilaohuihui!", 
    elm: undefined, // 挂载到真实 DOM 树上了才有值
    key: undefined
}

 ```
 * vnode函数
 // vnode函数很简单，就是传入：sel, data, children, text, elm五个属性，返回一个组合的对象
    export default function vnode(sel, data, children, text, elm) {
        return { sel, data, children, text, elm }
    }
#### h函数的实现
    // 源码中是可以传1-3个参数，第二个参数可以不传入，打三个参数可以是文本和数字或者h函数的执行，也可以是数组；还可以嵌套h函数返回值。
    // 为了简化，我们只写主要的流程，去掉一些
    // 接下来的实现规定是：只能传入3个参数，且第三个参数为数组的话，数组的元素只能是h函数
```
    export default function h(sel, data, c) {
        if(arguments.length !== 3) {
            throw Error('请传入3个参数');
        }

        // 如果第三个参数为数字或者字符串，那么返回值中children为undefined，
        if(typeof c === 'number' || typeof c === 'string') {
            return vnode(sel, data, undefined, c, undefined);
        } else if( Array.isArray(c) && c.length) { // 如果第三个参数为数组，且不为空
            const children = [];
            // 遍历c,收集children
            for (let i = 0; i < c.length; i++) {
                if(!(typeof c[i] === 'object' && c[i].hasOwnProperty('sel')))
                    // 这里说明传入的数组中有不是h函数的执行，抛出异常
                    throw Error('传入的数组参数中有项不是h函数')
                    // 因为下面传入的都是h函数的执行，所以直接收集就好了
                    children.push(c[i]);
            }
            return vnode(sel, data, children, undefined, undefined);
        } else if(typeof c[i] === 'object' && c.hasOwnProperty('sel')) { // 说明c是传入h的执行
            vnode(sel, data, [c], undefined, undefined) // 直接把 h 函数的执行结果对象放入数组中作为 children 
        } else {
            throw Error('第 3 个参数不正确')
        }
    }
```
### DOM diff算法的特点
 * 1.key值是作为节点的标识，判断修改前后是否属于同一DOM。
 * 2.只有是同一个虚拟节点才进行精细化比较
 * 3.只进行同层比较，不进行跨层比较

 DOM diff算法是通过patch函数实现的，那么我们先看一下patch函数主要做了哪些事情。
  * 1.主要会判断是否是虚拟节点，不是就将其包装成虚拟节点；
  * 2.通过sameVnode判断是否是同一个节点；（不是同一个节点就创建插入新节点，删除老节点）
  是同一节点就调用patchVnode(oldVnode, newVnode)
#### patch函数的实现
```
    import vnode from './vnode.js'
    import createElement from './createElement.js'
    import patchVnode from './patchVnode.js'
    // 传入新老节点
    export default function patch(oldVnode, newVnode) {
        //判断传入的第一个参数是否是虚拟节点，
        if(oldVnode.sel === '' || oldVnode.sel === undefined) {
            // 包装成虚拟节点
            oldVnode = vnode(oldVnode.tagName.toLowerCase(), {}, [], undefined, oldVnode);
        }
        
        // 判断oldVnode和newVnode是否是同一节点
        if(oldVnode.key === newVnode.key && oldVnode.sel === newVnode.key) {
            // 同一节点
            patchVnode(oldVnode, newVnode);
        } else {
            // 不是同一节点就创建插入新节点，删除老节点
            let newVnodeElm = createElement(newVnode);
            // 插入到老节点之前
            if(newVnodeElm && oldVnode.elm.parentNode) {
                oldVnode.elm.parentNode.insertBefore(newVnodeElm, oldVnode.elm);
            }

            // 删除老节点
            oldVnode.elm.parentNode.removeChild(oldVnode.elm);
        }
    }
```
#### createElement函数
 ```
  // 真正创建节点。将vnode创建为DOM
    export default function createElement(vnode) {
        let domNode = document.createElement(vnode.sel)  // 创建一个节点，此时节点还没上树（孤儿节点）
        // 判断该节点有子节点是有文本
        if(vnode.text !== '' && (vnode.children === undefined || vnode.children.length === 0)) {
            // 内部是文本
            domNode.innerText = vnode.text;
        } else if( Array.isArray(vnode.children) && vnode.children.length > 0 ) {
            for(let i = 0; i < vnode.children.length; i++) {
                let ch = vnode.children[i];
                // 创建出子节点的DOM，此时也是还没上树
                let chdomNode = createElement(ch);
                // 上树
                domNode.appendChild(chdomNode)
            }
        }
        // 补充elm属性
        vnode.elm = domNode;
        // 返回elm，elm属性是一个纯DOM对象
        return vnode.elm;
    }
 ```
### patchVnode函数进行精细比较
  注意点: 为了简化手写过程，虚拟节点里 children 属性和 text 属性是互斥的，二者有且只有一个有值
  所以就是分三种情况处理
  1. 新节点有文本属性
    - 此时旧节点是text属性还是children属性，直接通过innerText赋值（在innerText写入时会删除所有的子节点）
  2. 新节点有children属性
    - 旧节点有text属性（清空oldVnode的text属性，把newVnode的children添加到DOM中）
    - 旧节点有children属性（进行四种查找，循环遍历等）
```
    import createElement from "./createElement";
    import updateChildren from './updateChildren.js';
    
    export default function patchVnode(oldVnode, newVnode) {
        // 判断是否时同一个对象
        if(oldVnode === newVnode) return; // 同一对象不处理
        // 判断新节点有没有text属性
        if(newVnode.text !== undefined && (newVnode.children === undefined || newVnode.children.length === 0)) {
            // 老节点也有text属性
            if(newVnode.text !== oldVnode.text) {
                // 新旧节点的text不同，直接让新节点的text写入老的elm中，如果老节点是有children节点，也会被清掉
               oldVnode.elm.innerText = newVnode.text; 
            } 
        } else {
            // 新节点有children属性
            if(oldVnode.children.length > 0 && oldVnode.children !== undefined) {
                // 老节点有children属性
                // 调用updateChildren，对新老节点的children进行更优雅的比较
                updateChildren(oldVnode.elm, oldVnode.children, newVnode.children);
            } else {
                // 老节点有text属性
                oldVnode.elm.innerHTML = ''; // 清空老节点上的文本内容
                // 遍历新节点的，创建子节点的DOM，上树
            }
        }
    }
```

