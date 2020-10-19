// 1.闭包和this
var x = 3,
    obj = {x: 5};
obj.fn = (function () {
    this.x *= ++x;
    return function (y) {
        this.x *= (++x)+y;
        console.log(x);
    }
})();
var fn = obj.fn;
obj.fn(6);
fn(4);
console.log(obj.x, x);
```
全局  x => 3  obj => x001 => { x: 5 }
              x001 => {  //x: 5,
                  fn:funtion(){this.x *= (++x)+y;
                    console.log(x);}
                } 

    EC(obj.fn)  X002 => function (y) {
        this.x *= (++x)+y;
        console.log(x);
    }

    EC(G) x = 12  X001 x = 5

    X = 5  5*(12+1+6) = 95

    EC(G)  x =  13  X001 x = 95

       13*(13+1 + 4) = 234


       obj.fn(6);//13
       fn(4);//95
       console.log(obj.x, x);//95,234

```
/ 2.
console.log(a, b, c);
var a = 12,
    b = 13,
    c = 14;
function fn(a) {
    console.log(a, b, c);
    a = 100;
    c = 200;
    console.log(a, b, c);
}
b = fn(10);
console.log(a, b, c);

undefined,undefined,undefined
10,13,14
100,13,200

12,undefined,200

```
EC(G) a => 12 b => 13 c => 14  fn => X000   

      EC(Fn) => X001  a => 10
      
      //undefined,undefined,undefined
      //10,13,14
      //100,13,200

EC(G) a => 12 b => fn(10) c => 200  fn => X000       
      //12,undefined,200
     
```
3.
var i = 0;
function A() {
    var i = 10;
    function x() {
        console.log(i);
    }
    return x;
}
var y = A();
y();
function B() {
    var i = 20;
    y();
}
B();

```
EC(G)  i => 0  A => function(){...} 
       EC(A)   i => 10  x(){ console.log(i);}

EC(G)  i => 0  A => function(){...}  y=> function x(){console.log(i);}

       //10
EC(G)  i => 0  A => function(){...}  y=> function x(){console.log(i);}  B => function B() {var i = 20;y();}
       EC(B)   i => 20  x(){ console.log(i);}
      //10
```



4.

var a=1;
var obj ={
   name:"tom"
}
function fn(){
   var a2 = a;
   obj2 = obj;
   a2 =a;
   obj2.name ="jack";
}
fn();
console.log(a);
console.log(obj);

```
EC(G) a => 1 obj => X000 {name:"tom"}  fn => X001 

     EC(fn)  a2 => 1  obj2 => X000    X000 {name:"jack"} 

    //1
    //{name:"jack"} 
```




5.
var a = 1;
function fn(a){
    console.log(a)
    var a = 2;
    function a(){}
}
fn(a);
```
EC(G) a => 1  fn => X000 
       EC(fn) a => 2

      // function a(){}
```




6.
console.log(a); 
var a=12; 
function fn(){
    console.log(a); 
    var a=13;   
}
fn();   
console.log(a);

```
EC(G)  a => fn => x0001  a = 12
       EC(fn) a =>12

        //undefined
        //undefined
       //12
```
// ----

console.log(a); 
var a=12;
function fn(){
    console.log(a);
    a=13;
}
fn();
console.log(a);
```
EC(G)  a => fn => x0001  a = 12
       EC(fn) a =>12

        //undefined
        //12
       //13

```

// ----

console.log(a);
a=12;
function fn(){
    console.log(a);
    a=13;   
}
fn();
console.log(a);
```
EC(G)  a => fn => x0001  a = 12
       EC(fn) a =>12

        //"a" is not undefined
        //12
       //13

```




// 7.
var foo='hello'; 
(function(foo){
   console.log(foo);
   var foo=foo||'world';
   console.log(foo);
})(foo);
console.log(foo);
```
EC(G)  foo => 'hello' 
       //'hello'
       //'hello'
       //'hello'
```
8.
{
    function foo() {}
    foo = 1;
}
console.log(foo);
```
//1
```
// ----

{
    function foo() {}
    foo = 1;
    function foo() {}
}
console.log(foo);
```
//1
```
// ----

{
    function foo() {}
    foo = 1;
    foo = 2;
    function foo() {}
    
}
console.log(foo);
```
//2
```


9.
var x = 1;
function func(x,y=function anonymous1(){x=2}){
      x = 3;
      y();
      console.log(x);
}


func(5);
console.log(x);

// ```
// EC(G)  x => 1  x = 3
//       //3
//       //3
// ```


var x = 1;
function func(x,y=function anonymous1(){x=2}){
      var x = 3;
      y();
      console.log(x);
}

func(5);
console.log(x);

// ```
// EC(G)  x => 1  x = 3
//       //3
//       //1
// ```

var x = 1;
function func(x,y=function anonymous1(){x=2}){
      var x = 3;
      var y = function anonymous1(){x=4};
      console.log(x);
}

func(5);
console.log(x);

// EC(G)  x => 1  x = 3
//       //3
//       //1

数据类型和基础知识
1.
let result = 100 + true + 21.2 + null + undefined + "Tencent" + [] + null + 9 + false;
console.log(result);
```
100 + number(true) + 21.2 + number(null) + number(undefined) + "Tencent" + [] + null + 9 + false;

100 + 1 + 21.2 + 0+ NAN + "Tencent" + [] + null + 9 + false;

NAN + "Tencent" + [] + null + 9 + false;

"NANTencent" + "" + "null" + "9" + "false"

"NANTencentnull9false"
```
2.
{}+0?alert('ok'):alert('no');
0+{}?alert('ok'):alert('no');
```
ToPrimitive({}, number) + 0

{}.valueOf => {}   {}.toString =>  "[object Object]" + "0"

"[object Object]0"
"0[object Object]"

//alert('ok')
//alert('ok')
```
3.
let res = Number('12px');
if(res===12){
    alert(200);
}else if(res===NaN){
    alert(NaN);
}else if(typeof res==='number'){
    alert('number');
}else{
    alert('Invalid Number');
}
```
res = Number('12px') => NaN

//alert('number');
```

4.
let arr = [27.2,0,'0013','14px',123];
arr = arr.map(parseInt);
console.log(arr);
```

```
三、闭包作用域的作业
1.
var a = 10,
    b = 11,
    c = 12;
function test(a) {
    a = 1;
    var b = 2;
    c = 3;
}
test(10);
console.log(a, b, c);
```
EC(G) => a => 10 b => 11 c => 12  test => x000
     EC(test) a   b => 2 

     //10,11,3
```
2.
var a = 4;
function b(x, y, a) {
    console.log(a);
    arguments[2] = 10;
    console.log(a);
}
a = b(1, 2, 3);
console.log(a);
```
EC(G) => a => 4 b => x000
     EC(b) a  

  //3
  //10
  //undefined
```
3.
var a = 9;
function fn() {
    a = 0;
    return function (b) {
        return b + a++;
    }
}
var f = fn();
console.log(f(5));
console.log(fn()(5));
console.log(f(5));
console.log(a);
```
EC(G) a => 9 fn => x000  f => x001
    EC(fn) b x002
     
    5+0 //5
    5+0 //5
    5+1 //6
    //2
```
4.
var test = (function (i) {
    return function () {
        alert(i *= 2);
    }
})(2);
test(5);
```
EC(G)  test => x000
    EC(func) i => 2

//4
```
5.
var x = 4;
function func() {
    return function(y) {
        console.log(y + (--x));
    }
}
var f = func(5);
f(6);
func(7)(8);
f(9);
console.log(x);
```
EC(G)  x => 4 fnc => x000   f =>x001
    
   6 + (--4) //9

   8 + (--3) //10

   9 + (--2) //10

  //1
```
6.
var x = 5,
    y = 6;
function func() {
    x += y;
    func = function (y) {
        console.log(y + (--x));
    };
    console.log(x, y);
}
func(4);
func(3);
console.log(x, y);
```
EC(G) x => 5 y => 6 func => x000

EC(G) x => 11 y => 6 func => x001

   //11,6

   3 + (--11)//13

   //10,6
    
```
7.
function fun(n, o) {
    console.log(o);
    return {
        fun: function (m) {
            return fun(m, n);
        }
    };
}
var c = fun(0).fun(1);
c.fun(2);
c.fun(3);
```
EC(G)  fun => x000 c => x001
    EC(fun) n => 0   o
    EC(C)  m => 1
    
    //undefined
     
    c => fun(1, 0)
    //0

    //1

```
//下面代码输出的结果是多少，为什么？如何改造一下，就能让其输出 20 10？
var b = 10;
(function b() {
    b = 20;
    console.log(b);
})();
console.log(b);

```
var b = 10;
(function b() {
   var b = 20;
    console.log(b);
})();
console.log(b);
```
11. //实现函数fn，让其具有如下功能（百度二面）
let res = fn(1,2)(3);
console.log(res); //=>6  1+2+3
```
function fn(x,y){
    let a = x + y
    return function (b){
        a + b
    }
}
```
THIS的作业题
1.
var num = 10;
var obj = {
    num: 20
};
obj.fn = (function (num) {
    this.num = num * 3;
    num++;
    return function (n) {
        this.num += n;
        num++;
        console.log(num);
    }
})(obj.num);
var fn = obj.fn;
fn(5);
obj.fn(10);
console.log(num, obj.num);
```
EC(G) num => 10 obj => x000 => {num:20}
       x000 => {num:20,fn:x001}
       x001 => function (n) {this.num += n;num++;console.log(num);}
    EC(func)  num => 20  
    EC(G) num => 60 obj =>  x000 => {num:20,fn:x001}
    EC(func)  num => 21

    EC(G) num => 65 obj =>  x000 => {num:20,fn:x001}
    
    EC(func)  num => 22 
    //22
    22 + 10 = 32
    EC(func)  num => 33
    //31
    //65,31
```
2
let obj = {
    fn: (function () {
        return function () {
            console.log(this);
        }
    })()
};
obj.fn();
let fn = obj.fn;
fn();
```
//obj.fn
//window
```
3.
var fullName = 'language';
var obj = {
    fullName: 'javascript',
    prop: {
        getFullName: function () {
            console.log(thiss);
            return this.fullName;
        }
    }
};
console.log(obj.prop.getFullName());
var test = obj.prop.getFullName;
console.log(test());
//undefined
//'language';

4.
var name = 'window';
var Tom = {
    name: "Tom",
    show: function () {
        console.log(this.name);
    },
    wait: function () {
        var fun = this.show;
        fun();
    }
};
Tom.wait();
//window
5.
window.val = 1;
var json = {
    val: 10,
    dbl: function () {
        this.val *= 2;
    }
}
json.dbl();
var dbl = json.dbl;
dbl();
json.dbl.call(window);
alert(window.val + json.val);
//24
6.
(function () {
    var val = 1;
    var json = {
        val: 10,
        dbl: function () {
            val *= 2;
        }
    };
    json.dbl();
    alert(json.val + val);
})();
//21