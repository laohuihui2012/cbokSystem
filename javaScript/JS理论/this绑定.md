### this指向
在之前我对this指向的认识停留在一句话：谁调用，this就指向谁
后面发现有些复杂的问题是很难用这个看出this的指向

接下来我们分几种情况来看

#### 1.全局对象的this
全局对象的this不管实在严格模式下、非严格模式都指向的是全局对象
```
// 通过this绑定到全局对象
this.a2 = 20;

// 通过声明绑定到变量对象，但在全局环境中，变量对象就是它自身
var a1 = 10;

// 仅仅只有赋值操作，标识符会隐式绑定到全局对象
a3 = 30;

// 输出结果会全部符合预期
console.log(a1);
console.log(a2);
console.log(a3);
```
#### 2.函数中的this
在函数执行上下文中，this由调用者提供，由函数调用的方式来确定

如果调用者函数被一个对象所拥有，那么函数调用时内部的this指向该对象。如果函数独立调用，那么函数内部的this指向undefined(在非严格模式下，当this指向undefined时，它会被自动指向window)
```
// 为了能够准确判断，我们在函数内部使用严格模式，因为非严格模式会自动指向全局
function fn() {
  'use strict';
  console.log(this);
}

fn();  // fn是调用者，独立调用
window.fn();  // fn是调用者，被window所拥有
```

接下来我们看几个例子
```
var a = 20;
var foo = {
  a: 10,
  getA: function () {
    return this.a;
  }
}
console.log(foo.getA()); // 10 对象属性调用

var test = foo.getA;
console.log(test());  // 20 函数独立调用
```
#### 构造函数中的this
其实想想构造函数中new的作用就知道了

1.创建一个新的对象；

2.将构造函数的this指向这个新对象；

3.指向构造函数的代码，为这个对象添加属性，方法等；

4.返回新对象。
```
function Person(name, age) {
     'use strict';
    // 这里的this指向了谁?
    this.name = name;
    this.age = age;   
}

Person.prototype.getName = function() {
   
    // 这里的this又指向了谁
    console.log(this);
    return this.name;
}

// 上面的2个this，是同一个吗，他们是否指向了原型对象？

var p1 = new Person('Nick', 20);
console.log(p1)
p1.getName(); // 指向新对象p1
var fn = p1.getName
fn() // 指向window
```
上边对函数中this的定义，p1.getName()中的getName为调用者，他被p1所拥有，因此getName中的this，也是指向了p1。

#### 那么我们怎么在执行上下文中让this的指向不变呢？

比如下面这个例子，是getA被obj调用时，this指向obj，但是由于匿名函数的存在导致了this指向的丢失，在这个匿名函数中this指向了全局
```
var obj = {
  a: 20,
  getA: function () {
    setTimeout(function () {
      console.log(this.a)
    }, 1000)
  }
}

obj.getA();
```
1.用一个变量将this的引用保存起来
```
var obj = {
  a: 20,
  getA: function () {
    var self = this;
    setTimeout(function () {
      console.log(self.a)
    }, 1000)
  }
}
```
2.借助闭包与apply方法，封装一个bind方法
```
function bind(fn, obj) {
  return function () {
    return fn.apply(obj, arguments);
  }
}

var obj = {
  a: 20,
  getA: function () {
    setTimeout(bind(function () {
      console.log(this.a)
    }, this), 1000)
  }
}

obj.getA();
```
3.利用箭头函数
```
var obj = {
  a: 20,
  getA: function () {
    setTimeout(() =>{
      console.log(this.a)
    }, 1000)
  }
}
obj.getA(); //20
```

### 使用call，apply显示指定this
fn并不属于obj的方法，但是通过call可以将fn内部的this绑定为obj
```
function fn(num1, num2) {
  console.log(this.a + num1 + num2);
}
var obj = {
  a: 20
}

fn.call(obj, 100, 10); // 130
fn.apply(obj, [20, 10]); // 50
```
call与applay后面的参数，都是向将要执行的函数传递参数。其中call以一个一个的形式传递，apply以数组的形式传递。

##### 应用场景
##### 1.将类数组对象转换为数组
```
function exam(a, b, c, d, e) {

  // 先看看函数的自带属性 arguments 什么是样子的
  console.log(arguments);

  // 使用call/apply将arguments转换为数组, 返回结果为数组，arguments自身不会改变
  var arg = [].slice.call(arguments);

  console.log(arg);
}

exam(2, 8, 9, 10, 3);

// result:
// { '0': 2, '1': 8, '2': 9, '3': 10, '4': 3 }
// [ 2, 8, 9, 10, 3 ]
//
// 也常常使用该方法将DOM中的nodelist转换为数组
// [].slice.call( document.getElementsByTagName('li') );
```
原理：[].slice.call(arguments)类似于Array.prototype.slice.call(arguments)，因为类数组不是数组，它原型上面没有slice方法，
Array.prototype.slice.call(arguments)能将具有length属性的对象转成数组.可以看下面源码：只要具有length属性就好了
```
function slice(start, end) { 
   var len = ToUint32(this.length), result = []; 
   for(var i = start; i < end; i++) { 
     result.push(this[i]); 
    } 
    return result; 
} 
```
```
var args = [];
for (var i = 1; i < arguments.length; i++) {
args.push(arguments[i]);
}
```

##### 2.根据自己的需要灵活修改this指向
```
var foo = {
  name: 'joker',
  showName: function () {
    console.log(this.name);
  }
}
var bar = {
  name: 'rose'
}
foo.showName.call(bar);
```
##### 3.实现构造继承
```
// 定义父级的构造函数
var Person = function (name, age) {
  this.name = name;
  this.age = age;
  this.gender = ['man', 'woman'];
}

// 定义子类的构造函数
var Student = function (name, age, high) {

  // use call
  Person.call(this, name, age);
  this.high = high;
}
Student.prototype.message = function () {
  console.log('name:' + this.name + ', age:' + this.age + ', high:' + this.high + ', gender:' + this.gender[0] + ';');
}

new Student('xiaom', 12, '150cm').message();

// result
// ----------
// name:xiaom, age:12, high:150cm, gender:man;
```
#### 深入底层原理了解this
从ECMAScript规范解读this：https://github.com/mqyqingfeng/Blog/issues/7