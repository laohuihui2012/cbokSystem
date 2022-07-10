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
    if(typeof(constructor) !== 'function') {
        console.error('type error');
        return;
    }

    // 新建一个对象
    newObject = Object.create(constructor.prototype);
    // 执行构造函数
    let res = constructor.apply(newObject, arguments);
    // 判断构造函数执行的结果
    let flag = res && (typeof(res) === 'function' || typeof(res) === 'object');
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
// 该版本第一个的n秒内点击不会触发
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
        }pre
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

  