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
    // 源码中是可以穿1-3个参数，第二个参数可以不传入，打三个参数可以是文本和数字或者h函数的执行，也可以是数组；还可以嵌套h函数返回值。
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
                if(!(typeof c[i] === 'object' && c.hasOwnProperty('sel')))
                    // 这里说明传入的数组中有不是h函数的执行，抛出异常
                    throw Error('传入的数组参数中有项不是h函数')
                    // 因为下面传入的都是h函数的执行，所以直接收集就好了
                    children.push(c[i]);
            }
        } else if(typeof c[i] === 'object' && c.hasOwnProperty('sel')) { // 说明c是传入h的执行
            vnode(sel, data, [c], undefined, undefined) // 直接把 h 函数的执行结果对象放入数组中作为 children 
        } else {
            throw Error('第 3 个参数不正确')
        }
    }
```