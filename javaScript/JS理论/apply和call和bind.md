 ### 1.call、apply、bind
   * 这三个方法可以显示的指定this的指向
    - call(obj, ...arg): call第一个参数是this绑定的对象,后面的参数是传入执行函数的参数
    - apply(obj, []): 第二个参数为一个带下标的集合，可以是数组也可以是伪数组
    - bind():bind 方法通过传入一个对象，返回一个 this 绑定了传入对象的新函数。
 
 
 ### apply的实现
 ```
 var obj = {
    name: "jawil",
    sayHello: function (age) {
         console.log("hello, i am ", this.name + " " + age + " years old");
     }
};

var  obj1 = {
    name: "lulin",
};

obj.sayHello.apply(obj1);

// hello, i am lulin 24 years old
```
原理就是：
先通过obj1.fn = obj.sayHello;将sayHello作为obj1的一个临时属性fn存储，然后执行fn,执行完毕后删除fn.

例如下面obj.sayHello.call(obj1, 24)
```
// 第一步
obj1.fn = obj.sayHello
// 第二步
obj1.fn()
// 第三步
delete obj1.fn
```
##### 实现一个apply
 *步骤
   - 判断调用对象是否为函数
   - 判断传入的上下文对象是否存在
   - 处理传入的参数
   - 将函数作为上下文对象的一个属性
   - 使用上下文调用函数，并保存函数执行的结果
   - 删除刚新增的属性
   - 返回保存的结果
```
Function.prototype.MyApply = function (context) {
    // 判断调用对象
    if(typeof this !== 'function') {
        console.error('type error');
    }
    let res = null;
    // 判断context是否传入, 没传入就设置为window
    context = context || window;
    // 将调用函数设置上下文对象的属性
    context.fn = this;
    // 调用函数
    if(arguments[1]) {
      res = context.fn(...arguments[1]);
    } else {
      res = context.fn();  
    }
    delete context.fn;
    return res;
}
```
 * 如果不能使用es6的话，就用下面方法
```
//原生JavaScript封装apply方法，第三版
Function.prototype.apply = function(context) {
    var context = context || window

    var args = arguments[1] //获取传入的数组参数

    context.fn = this //假想context对象预先不存在名为fn的属性

    if (args == void 0) { //没有传入参数直接执行
        return context.fn()
    }

    var fnStr = 'context.fn('
    for (var i = 0; i < args.length; i++) {
       //得到"context.fn(arg1,arg2,arg3...)"这个字符串在，最后用eval执行
        fnStr += i == args.length - 1 ? 'args[' + i + ']' : 'args[' + i + ']' + ','
    }
    fnStr += ')'

    var returnValue = eval(fnStr) //原生的apply 支持 参数是对象 如果用eval模拟要完全用字符串拼接  fnStr必须要是字符串
    delete context.fn //执行完毕之后删除这个属性
    return returnValue
}
```
##### 实现一个call
步骤和实现apply只有处理参数的不同
```
Function.prototype.MyCall = function (context) {
    // 判断调用对象
    if(typeof this !== 'function') {
        console.error('type error');
    }
    // 获取参数
    let args = [...arguments].slice(1), 
        res = null;
    // 判断context是否传入, 没传入就设置为window
    context = context || window;
    // 将调用函数设置上下文对象的属性
    context.fn = this;
    // 调用函数
    res = context.fn(...args);
    delete context.fn;
    return res;
}


##### 通过apply实现一个简单的bind
```
// 第一版 修改this指向，合并参数
Function.prototype.bindFn = function bind(thisArg){
    if(typeof this !== 'function'){
        throw new TypeError(this + 'must be a function');
    }
    // 存储函数本身
    var self = this;
    // 去除thisArg的其他参数 转成数组
    var args = [].slice.call(arguments, 1);
    var bound = function(){
        // bind返回的函数 的参数转成数组
        var boundArgs = [].slice.call(arguments);
        // apply修改this指向，把两个函数的参数合并传给self函数，并执行self函数，返回执行结果
        return self.apply(thisArg, args.concat(boundArgs));
    }
    return bound;
}
```
更加详情的实现：https://github.com/jawil/blog/issues/16

https://juejin.im/post/6844903718089916429 bind new等的实现