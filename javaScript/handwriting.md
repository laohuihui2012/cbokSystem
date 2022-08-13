## 1. object.create()
 * 思路：将传入的的对象作为原型
 注意：以 null 为原型的对象存在不可预期的行为，因为它未从 Object.prototype 继承任何对象方法。
 ```
 function myCreate(obj) {
     function Fn() {};
     Fn.prototype = obj;
     return new Fn();
 }
 ```
 ## 2.手写new操作符
  * 思路: 在我们调用new的时候会做四件事
    - 1.创建一个新的空对象；
    - 2.将构造函数的prototype对象设为空对象的原型；
    - 3.让构造函数的this指向空对象，并执行构造函数的代码，为新对象添加属性喝方法；
    - 4.返回结果，如果函数的返回值是值类型，就返回新对象，如果是引用类型就返回引用类型对象；
```
function newObject() {
    let newObject = null;
    // 传入的第一个参数为构造函数
    let constructor = Array.prototype.shift.call(arguments);
    // 判断传入的第一个参数是否为函数
    if(typeof constructor !== 'function') {
        console.error('type error');
        return;
    }

    // 新建一个对象
    newObject = Object.create(constructor.prototype);
    // 执行构造函数
    let res = constructor.apply(newObject, arguments);
    // 判断构造函数执行的结果
    let flag = res && (typeof res === 'function' || typeof res === 'object');
    return flag ? res : newObject;
}
```
## 3.手写防抖debounce()
 *思路：防抖是指事件在触发n秒后再执行，如果在这n秒内又触发，则重写计时
 ```
  function debounce(fn, delay) {
        let timer = null;
        return function(params) {
            let context = this,
                args = arguments;
            if(timer) {
                clearTimeout(timer);
                timer = null;
            }
            timer = setTimeout(() =>{
                fn.applay(context, args);
            }, delay)
        }
    }
 ```
## 4.手写节流throttle()
 * 思路：节流是指在指定的时间内，只执行一次函数，如果在这个时间内有多次触发，只有一次生效。
```
// 时间戳版
function throttle(fn, delay) {
    let preTime = new Date();
    return function() {
        let context = this,
        args = arguments,
        nowTime = new Date();
        // 如果两次时间间隔大于指定的时间，这执行该函数
        if(nowTime - preTime >= delay) {
            curTime = new Date();
            return fn.applay(context, args);
        }
    }
}

// 定时器版
function throttle(fn, delay) {
    let timer = null;
    return function() {
        let context = this,
        args = arguments,
        if(!timer) {
            timer = setTimeout(() => {
                fn.apply(context, args);
                timer = null;
            })
        }
    }
}
```
## 5.手写instanceof()
 * 思路: instanceof是判断构造函数的prototype是否出现在对象的原型链中
 ```
 function myInstanceof(left, right) {
    // 获取对象的原型
    let objProtot = Object.getPrototypeOf(left);
    // 获取构造函数的prototype对象
    let prototype = right.prototype;
    while (true) {
        if(!objProtot)  return false;
        if(prototype === objProtot)  return true;
        objProtot = Object.getPrototypeOf(objProtot);            
    }
}
 ```
## 6. call(this, ...args)实现
 * 思路：
   - 1.判断调用对象是否为函数
   - 2.判断上下文对象是否传入，没有则设置为window
   - 3.处理传入的参数
   - 4.将调用函数设置为上下文对象的一个方法
   - 5.使用上下文调用函数，并保存结果
   - 6.删除新增的方法
```
function myCall(context) {
    // 判断调用对象
    if( typeof this !== 'function') {
        console.error('type error');
    }
    // 判断上下文对象是否传入，没有则设置为window
    let context = context || window;
    let res = null;
    // 获取第一个参数后面的参数
    let args = [...arguments].slice(1);
    // 将调用函数设置为对象的方法
    context.fn = this;
    // 执行fn函数
    res = context.fn(...args);
    delete context.fn;
    return res;
}
```
## 7.apply(this, 数组) 实现
 * 思路：唯一与call不同的是参数的处理
```
function myApply(context) {
    // 判断调用对象
    if( typeof this !== 'function') {
        console.error('type error');
    }
    // 判断上下文对象是否传入，没有则设置为window
    let context = context || window,
        res= null;
    // 将调用函数设置为对象的方法
    context.fn = this;
    // 参数处理
    if(arguments[1]) {
        res = context.fn(arguments[1]);
    } else {
        res = context.fn();
    }
    delete context.fn;
    return res;
    }
```
## 8.bind(this) 实现
 * 思路
   - 1.判断调用对象是否为函数
   - 2.保存当前函数的引用
   - 3.创建一个函数返回
   - 4.函数内部通过apply来绑定函数的调用(判断函数是否为构造函数的情况，是的话则传入当前函数的this给apply调用，其他情况传入上下文对象)
```
function myBind(context) {
    // 判断调用对象
    if( typeof this !== 'function') {
        throw new TypeError('Error');
    }
    // 保存调用函数的引用
    let self = this;
    // 保存去掉context的参数
    let args = [].slice.call(arguments, 1);
    return function() {
        return self.apply(
            this instanceof self ? this : context,
            args.concat(...arguments)
        ) 
    }
}
```
### 9.手写深浅拷贝
 * 深拷贝：
    - 1.先判断传入的是对象还是基础值或者函数，不是则直接返回
    - 2.再判断传入的是对象还是数组，是数组则创建一个新数组，对象则创建一个新对象
    - 3.遍历传入的对象(只遍历自己的属性)，如果属性是对象,则递归遍历，不是直接赋值
```
 function deepCopy(obj) {
    if(!obj || typeof obj !== 'object') return;

    let newObject = Array.isArray(obj) ? [] : {};
    for(let key in obj) {
        if(obj.hasOwnProperty(key)) {
            newObject[key] = typeof obj[key] === 'object' ? deepCopy(obj[key]) : obj[key];
        }
    }
}
```
 * 浅拷贝:

 ```
 function shallowCopy(obj) {
    // 只拷贝对象
    if(!obj || typeof obj !== 'object') return;

    let newObject = Array.isArray(obj) ? [] : {};

    // 遍历 object，并且判断是 object 的属性才拷贝
    for(let key in obj) {
        if(obj.hasOwnProperty(key)) {
            newObject[key] = obj[key];
        }
    }
}
 ```
 ### 10. 实现Object.assign

 ```
 Object.defineProperty(Object, 'myAssign', {
    value: function(target, ... source) {
        if (target == null) {
            return new TypeError('Cannot convert undefined or null to object');
        }
        // 目标对象需要统一是引用数据类型，若不是会自动转换
        let to = Object(target);

        for(let i = i; i < source.length; i++) {
            // 每一个源对象
            const nextSource = source[i];
            if(nextSource !== null) {
            // 遍历
            for(const key in nextSource) {
                // 确保只复制本身的方法和属性
                if(Object.prototype.hasOwnProperty.call(nextSource, key)) {
                    to[key] = nextSource[key];
                }
            }
            }
        }
        return to;
    },
    // 不可枚举
    enumerable: false,
    writable: true,
    configurable: true,
})
 ```
### 11.Object.keys

```
Object.defineProperty(Object, 'getMyKeys', {
    value: function(obj) {
            const result =  []
            for (let key in obj){
                if (obj.hasOwnProperty(key)){
                    result.push(key)
                }
            }
            return result
        }
    // 不可枚举
    enumerable: false,
    writable: true,
    configurable: true,
})
```


  