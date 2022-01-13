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
  1. 新节点有文本属性:
    - 此时旧节点是text属性还是children属性，直接通过innerText赋值（在innerText写入时会删除所有的子节点）
  2. 新节点有children属性:
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
 ### diff 算法优化策略，对新老节点的children进行更优雅的比较
  在这一部分比较里面，先会进行四种情况查找，根据命中的情况做处理。
  都没有命中之后会，遍历然后判断情况处理
  1. 新前与旧前:
    - 如果命中, 由patchVnode 函数处理新老节点，新前和旧前指针下移
  2. 新后与旧后:
    - 如果命中, 由patchVnode 函数处理新老节点，新后和旧后指针上移
  3. 新后与旧前:
    - 如果命中,将旧前指向节点移动到旧后指向的节点之后，然后旧前指针下移，新后指针上移
  4. 新前与旧后:
    - 如果命中,将旧后指向节点移动到旧前指向的节点之后，然后旧前指针上移，新前指针下移
```
    import patchVnode from './patchVnode.js';
    import createElement from './createElement.js';

    // 判断是否是同一个虚拟节点
    function checkSameVnode(a, b) {
        return a.sel == b.sel && a.key == b.key;
    };

    export default function updateChildren(parentElm, oldCh, newCh) {
        // 准备四个指针
        let oldStartIdx = 0; // 旧前
        let oldEndIdx = oldCh.length - 1; //旧后
        let newStartIdx = 0; // 新前
        let newEndIdx = newCh.length - 1; // 新后
        let oldStartVnode = oldCh[0]; // 旧前节点
        let oldEndVnode = oldCh[oldEndIdx]; // 旧后节点
        let newStartVnode = newCh[0]; // 新前节点
        let newEndVnode = newCh[newEndIdx]; // 旧后节点

        let keyMap = null;

        // 循环
        while (oldEndIdx >= oldStartIdx || newEndIdx >= newStartIdx) {
            // 首先不是判断四种命中，而是略过加undefined标记的东西
            if(oldStartVnode === null || oldCh[oldStartIdx] === undefined) {
                oldStartVnode = oldCh[++oldStartIdx];
            } else if(newStartVnode === null || newCh[newStartIdx] === undefined) {
                newStartVnode = newCh[++newStartIdx];
            } else if(oldEndVnode === null || oldCh[oldEndIdx] === undefined) {
                oldEndVnode = oldCh[--oldEndIdx];
            } else if(newEndVnode === null || newCh[newEndIdx] === undefined) {
                newEndVnode = newCh[--newEndIdx];
            } else if(checkSameVnode(newStartVnode, oldStartVnode)) {
                // 命中新前与旧前
                patchVnode(newStartVnode, oldStartVnode);
                newStartVnode = newCh[++newStartIdx];
                oldStartVnode = oldCh[++oldStartIdx];
            } else if(checkSameVnode(newEndVnode, oldEndVnode)) {
                // 命中新后与旧后
                patchVnode(newEndVnode, oldEndVnode);
                newEndVnode = newCh[--newEndIdx];
                oldEndVnode = oldCh[--oldEndIdx];
            } else if(checkSameVnode(newEndVnode, oldStartVnode)){
                // 命中新后与旧前
                patchVnode(newEndVnode, oldStartVnode);
                // 将旧前指向的节点移动到旧后指向的节点之后，（注意这里是旧后指向的节点，有可能已经有移动到他之后的节点了）
                parentElm.insertBefore(oldStartVnode.elm, oldEndVnode.elm.nextSibing);
                newEndVnode = newCh[--newEndIdx];
                oldStartVnode = oldCh[++oldStartIdx];
            } else if(checkSameVnode(newStartVnode, oldEndVnode)) {
                // 命中新前与旧后
                patchVnode(newStartVnode, oldEndVnode);
                // 将旧后指向的节点移动到旧前指向的节点之前（注意是旧前指向的节点之前，原因和上面一样）
                parentElm.insertBefore(oldEndVnode.elm, oldStartVnode.elm);
                oldEndVnode = oldCh[--oldEndIdx];
                newStartVnode = newCh[++newStartIdx];
            } else {
                // 这里是四种都没有命中的情况
                // 遍历旧前到旧后制作keyMap一个映射对象{key: i},这样只需要遍历一次
                let keyMap = {};
                for (let i = oldStartIdx; i < oldEndIdx; i++) {
                    let key = oldCh[i]?.key 
                    if(key) keyMap[key] = i
                }

                // 然后寻找当前项key是否存在keyMap映射种
                let idInOld = keyMap[newStartVnode.key]

                //如果idInOld存在则证明该节点存在旧DOM中，只需要移动就好了
                if(idInOld) {
                    // 先将需要移动的节点暂存起来
                    const elmToMove = oldCh[idInOld];
                    // 然后通过patchVnode处理
                    patchVnode(elmToMove, newStartVnode);

                    // 将要处理过的节点设置为undefined
                    oldCh[idInOld] = undefined;
                    // 移动节点
                    parentElm.insertBefore(elmToMove.elm, oldStartVnode.elm);
                } else {
                    // idInOld不存在，则证明是新增节点，创建该节点插入新前之前
                    parentElm.insertBefore(createElement(newStartVnode), oldStartVnode.elm);
                }
                // 注意的是：在上面的操作之后，需要将新前节点下移
                newStartVnode = newCh[++newStartIdx];
            }
        }
        // 当while循环结束后只有两种情况
        // oldStartIdx > oldEndIdx 或者 newStartIdx > newEndIdx
        // 1.oldStartIdx > oldEndIdx 则表示有新增节点
        if(oldStartIdx > oldEndIdx) {
            // 遍历剩下新增的节点
            // 需要注意的是，因为我们这里是阉割版的，所以newCh[newEndIdx + 1]的elm是undefined，所以我们直接到旧前之前
            //let before = newCh[newEndIdx + 1] === null ? null : newCh[newEndIdx + 1]

            for (let i = newStartIdx; i < newEndIdx; i++) {
                // insertBefore方法可以自动识别null，如果是null就会自动排到队尾去,和appendChild是一致了。
                // parentElm.insertBefore(createElement(newCh[i]), before);
                
               parentElm.insertBefore(createElement(newCh[i]), oldCh[oldStartIdx].elm); 
            }
        } else if(oldStartIdx > oldEndIdx) { 
            // 2.newStartIdx > newEndIdx 则表示有删除节点
            // 删除老节点中要删除的节点

            for (let i = oldStartIdx; i < oldEndIdx; i++) {
                parentElm.removeChild(old[i].elm);
            }
        }
    }
```


