## 构造函数
在说到class类之前，我们生成实例化对象都是用的构造函数，我们先来了解下构造函数

#### 1.构造函数的定义

构造函数的定义与普通函数大致差不多
```
function 类型名称 (配置参数) {
    this.属性1 = 属性值1;
    this.属性2 = 属性值2;
    ...
    this.方法1 = function () {
        //处理代码
    };
    ...
    //其他代码，可以包含return语句
}
```
构造函数，它提供模板，用来生成实例对象。

构造函数的特点：
1.构造函数是使用this引用将要生成的实例化对象
2.生成实例化对象必须使用new关键字

#### 2.构造函数的调用
使用 new 命令可以调用构造函数，创建实例，并返回这个对象。
```
unction Point (x, y) {  //构造函数
    this.x = x;  //私有属性
    this.y = y;  //私有属性
    this.sum = function () {  //私有方法
        return this.x +this.y;
    }
}
var p1 = new Point(100, 200);  //实例化对象1
var p2 = new Point(300, 400);  //实例化对象2
console.log(p1.x);  //100
console.log(p2.x);  //300
console.log(p1.sum());  //300
console.log(p2.sum());  //700
```
（直接调用就相当于是普通函数，this代表函数对象，在客户端指代全局对象 window，但是在严格模式下会报错）

#### 3.构造函数的返回值
如果构造函数使用了return语句且后面跟的是简单值，则被忽略，直接返回this指代的实例化对象
如果return语句后面跟的是对象，会覆盖this指向的实例化对象，返回该对象

```
function Point (x, y) {  //构造函数
    this.x = x;  //私有属性
    this.y = y;  //私有属性
    return {x : true, y : false}
}
var p1 = new Point(100, 200);  //实例化对象1
console.log(p1.x);  //true
console.log(p1.y);  //false
```

###### new关键字在生成实例的解析过程
1.当用new关键字调用构造函数时，先会生成一个空对象作为实例的返回值
2.设置实例化的原型，指向构造函数的prototype属性
3.设置构造函数内的this，指向实例化
4.开始执行构造函数内代码
5.返回该对象


## class
class 本质上是构造函数的语法糖，形式上更像传统的面向对象编程语言，让新入门的更加容易接受

class 的定义与规则
定义：对一类具有共同特征的事物的抽象 
(类本身指向构造函数，所有的方法都定义在prototype上，可以看作是构造函数的另外一种写法）

具有的方法：
  constructor()：构造函数,是类的默认方法，new命令生成实例时自动调用。（如果没有显式定义自动添加一个空的constructor方法）
  super：表示父类的构造函数，用来新建父类的this对象
  static:定义静态属性方法，（静态属性和方法不能被实例继承，只能通过类调用）
  get:取值函数，拦截属性的取值行为
  set:存值函数，拦截属性的存值行为

静态属性：定义类完成后赋值属性，该属性不会被实例继承，只能通过类来调用
静态方法：使用static定义方法，该方法不会被实例继承，只能通过类来调用(方法中的this指向类，而不是实例)

##### 继承：
ES5：构造继承=》将父类的方法和属性给的子类的实例:先创建子类实例的this，再将父类的方法和属性添加到this上 (parent.call(this))

ES6: 本质上是调用super()先将父类实例的属性方法加到this上，再用子类构造函数(constructor)修改this
注意：子类使用父类的属性方法时，必须在构造函数中调用super()，否则得不到父类的this;


super的使用：
1.作为函数调用时，代表父类的构造函数（虽然代表的时父类的构造函数，但是返回的是子类的实例，所以super内部的this指向子类的实例）
2.作为对象调用时，在普通方法中调用，指向父类的原型对象，在静态方法中调用指向父类

作为函数使用，this指向子类的实例
```
class A {
  constructor() {
    console.log(new.target.name);
  }
}
class B extends A {
  constructor() {
    super();
  }
}
new B() // B
```

作为对象使用：在普通方法中使用，指向父类对象原型
```
class A {
  p() {
    return 2;
  }
}

class B extends A {
  constructor() {
    super();
    console.log(super.p()); // 2
  }
}

let b = new B();
```
那么父类实例的方法和属性super就无法调用

```
class A {
  constructor() {
    this.p = 2;
  }
}


class B extends A {
  get m() {
    return super.p;
  }
}

let b = new B();
b.m // undefined
```