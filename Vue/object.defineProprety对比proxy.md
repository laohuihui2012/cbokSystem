### 1.object.defineProprety不能监听数组得变化？
其实这话不完全对，把数组的索引当作key,刚开始就有的属性变化是可以检测到的，只是数组有些方法可以增加新的属性，
新增的属性无法被监听到，需要手动observe
* 1.通过访问索引或设置值时，会触发getter和setter方法；
* 2.它监听数组和监听对象的效果表现一样的,只是数组的有些方法会增加新的属性(push和unshift)，新增加的无法监听。需要手动observe；
* 3.通过pop和shfit删除元素，会删除和更新索引，也会触发getter和setter；

可以通过下面的例子来说明
```
 function defineRactive(data, key ,value) {
     function defineRactive(data, key ,value) {
        Object.defineProprety(data, key, {
            enumerable: true,
            configurable: true,
            set: function setter(params) {
                console.log(`get key: ${key}, vaule:${value} `);
                return value;
            },
            get:function getter(newval) {
              console.log(`set key:${key}, value:${newval}`); 
              value = newval; 
            }
        })
    }
     function observer(data) {
         Object.keys(data).forEach(key => {
            defineReactive(data, key, data[key]);
         });
     }
 }

 let arr = [4,5,6];
```
##### 1.以下操作和控制台输出
```
arr[1] // get key: 1,vaule: 5
arr[1] = 1 // set key:1, value: 1
通过索引获取某个元素会触发 getter 方法, 设置某个值会触发 setter 方法

arr.push(7) // 7
arr.unshfit(0)
输出：
get key: 2 value: 6
VM72:6 get key: 1 value: 1
VM72:10 set key: 2 value: 1
VM72:6 get key: 0 value: 4
VM72:10 set key: 1 value: 4
VM72:10 set key: 0 value: 0

证明push和unshift会增加新的属性，并未触发setter和getter，而unshift操作会导致索引发生变化，接下来我们一个个获取索引值
arr[0]
VM72:6 get key: 0 value: 0
0
arr[1]
VM72:6 get key: 1 value: 4
4
arr[2]
VM72:6 get key: 2 value: 1
1
arr[3]
6
arr[4]
7

此时会发现原有的索引获取或者改变值还是会触发getter和setter，新增的不会
arr 数组初始值为 [1, 2, 3]，即只对索引为 0，1，2 执行了 observe 方法，所以无论后来数组的长度发生怎样的变化，
依然只有索引为 0、1、2 的元素发生变化才会触发。


arr.pop()
7
arr.pop()
6
arr.pop()
VM72:6 get key: 2 value: 1
1

pop也是会触发getter方法的
```
### 2.Vue 对数组的方法重写
core/observer/index.js
core/observer/array.js
* 被重写的方法有：
push、pop、unshfit、shfit、splice、sort、reverse
具体可以看[响应式原理](https://github.com/laohuihui2012/cbokSystem/blob/master/Vue/%E5%93%8D%E5%BA%94%E5%BC%8F%E5%8E%9F%E7%90%86.md)
### 3.Object.defineProperty VS Proxy

 1. Object.defineProperty 只能劫持对象的属性，而 Proxy 是直接代理对象。
 * 由于 Object.defineProperty 只能对属性进行劫持，需要遍历对象的每个属性，如果属性值也是对象，则需要深度遍历。而 Proxy 直接代理对象，不需要遍历操作。
 2. Object.defineProperty 对新增属性需要手动进行 Observe。
* 由于 Object.defineProperty 劫持的是对象的属性，所以新增属性时，需要重新遍历对象，对其新增属性再使用 Object.defineProperty 进行劫持。
所以在vue中给data新增属性时需要使用vm.$set才能是新增的属性也是响应式的

#### 4.Vue 的 set 方法是如何实现的
```
export function set (target: Array<any> | Object, key: any, val: any): any {
  // 如果 target 是数组，且 key 是有效的数组索引，会调用数组的 splice 方法，
  // 数组的 splice 方法会被重写，重写的方法中会手动 Observe
  // 所以 vue 的 set 方法，对于数组，就是直接调用重写 splice 方法
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.length = Math.max(target.length, key)
    target.splice(key, 1, val)
    return val
  }
  // 对于对象，如果 key 本来就是对象中的属性，直接修改值就可以触发更新
  if (key in target && !(key in Object.prototype)) {
    target[key] = val
    return val
  }
  // vue 的响应式对象中都会添加了 __ob__ 属性，所以可以根据是否有 __ob__ 属性判断是否为响应式对象
  const ob = (target: any).__ob__
  // 如果不是响应式对象，直接赋值
  if (!ob) {
    target[key] = val
    return val
  }
  // 调用 defineReactive 给数据添加了 getter 和 setter，
  // 所以 vue 的 set 方法，对于响应式的对象，就会调用 defineReactive 重新定义响应式对象，defineReactive 函数
  defineReactive(ob.value, key, val)
  ob.dep.notify()
  return val
}
```

### 5.Proxy
Proxy 对象用于创建一个对象的代理，从而实现基本操作的拦截和自定义（如属性查找、赋值、枚举、函数调用等）。
* 使用方式
```
const p = new Proxy(target, handler)
// target是要包装的对象， handler是一个通常以函数作为属性的对象，定义了在执行各种操作时代理 p 的行为
```
* 我们使用 proxy来完成拦截对象属性的设置
```
const handler = {
    set: function setter(target, key, value) {
       console.log('set',key)
       target[key] = value;
       return true;
    }
}

const Obj = {};
const p = new Proxy(Obj, handler);

p.name = 'laohuihui'
// set name
// 'laohuihui'
```
* 我们使用 proxy来完成拦截数组（key）属性的设置
```
const handler = {
    set: function setter(target, key, value) {
       console.log('set',key)
       target[key] = value;
       return true;
    }
}

const arr = [];
const p = new Proxy(arr, handler);

p.push('laohuihui')
// set 0
// VM107:3 set length
// 1
```
Proxy除了可以setter和getter可以拦截外，还支持很多拦截操作
具体用法请看[MDN-Proxy](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy)
