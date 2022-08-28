/*
 * let p1 = new Promise([executor])
 *   + Promise 是一个内置类
 *   + p1 是类的一个实例
 *   + executor 是回调函数函数(必须要传递)
 */

// let p1 = new Promise(); //Uncaught TypeError: Promise resolver undefined is not a function

 * Promise本身是同步的(管理异步编程)
    + new Promise的时候会立即把executor函数执行
       + resolve函数：函数执行会修改promie实例状态为成功，传递的值就是[[PromiseResult]]
       + reject函数：函数执行会修改promie实例状态为失败，传递的值就是[[PromiseResult]]
       + 这样我们一般会在executor函数中管理一个异步操作；异步操作成功，执行resolve，让实例状态是成功，并且获取成功的结果；异步操作失败，执行reject，让实例状态是失败，并且获取失败的原因；
       + 只要promise的状态从pending变为fulfilled或者rejected，则状态就不能再变化了

   + 创建一个Promise实例
       + [[PromiseState]] promise状态
           + pending 初始状态
           + fulfilled/resolved 成功状态（一般指的是异步请求成功）
           + rejected 失败状态（一般指的是异步请求失败）
       + [[PromiseResult]] promise结果/值
           + 初始值是undefined
           + 不论成功还是失败，成功的结果或者失败的原因都会赋值给他
```
let p1 = new Promise((resolve, reject) => {
    console.log('OK'); //1
});
console.log('NO'); //2 

let p1 = new Promise((resolve, reject) => {
    resolve(100); //改变状态后，下面再改变状态就无用了
    reject(0);
});
```
 * Promise.prototype
     + then([A],[B])：基于then方法存放两个回调函数A/B，当promise状态成功执行A，失败则执行B，并且把[[PromiseResult]]的值传递给对应的函数
     + catch
     + finally

 * Promise 
     + resolve 返回一个状态为成功的Promise实例
     + reject 返回一个状态为失败的Promise实例
     + all
     + race

 * 执行then方法会返回一个新的promise实例
     + 执行then是为了把当前实例成功执行的A以及失败执行的B存储起来
     + 同时返回一个新的promise实例 p2
       + p2状态/结果 上一个实例p1基于then存放的A/B函数执行决定
         + 不论是A还是B执行，只要执行不报错，则p2的状态都是成功，反之执行报错就是失败
         + p2的结果是A或者B函数执行的返回值，再或者是报错原因
         + 特殊情况：如果A/B返回的是一个新的Promise实例，则返回的Promise实例的成功失败以及结果，直接决定p2的状态和结果
    + p1的成功和失败也会受到executor执行是否报错影响，执行报错了，则p1的状态就是失败的，promiseResult的值是失败的原因；如果执行不报错，再看执行的是resolve/reject
```
let p1 = new Promise((resolve, reject) => {
    // 管理一个异步操作：根据需求控制promise成功还是失败
    setTimeout(() => {
        let ran = Math.random();
        ran < 0.5 ? reject('NO') : resolve('OK');
    }, 1000);
});


let p2 = p1.then(result => {
    console.log(`成功了 -> ${result}`);
    return result + '@@';
}, reason => {
    console.log(`失败了 -> ${reason}`);
    return reason + '@@';
});

```

 let p1 = new Promise((resolve, reject) => {
    resolve('OK');
});

p1.then(result => {
    console.log(`成功了 -> ${result}`);
}, reason => {
    console.log(`失败了 -> ${reason}`);
});
console.log('哈哈哈');


new Promise((resolve, reject) => {
    // resolve(10);
    reject(20);
}).then(result => {
    console.log(`成功了 -> ${result}`);
    return result * 10;
}, reason => {
    console.log(`失败了 -> ${reason}`);
    return reason / 10;
}).then(result => {
    console.log(`成功了 -> ${result}`);
    return Promise.reject(result * 10);
}, reason => {
    console.log(`失败了 -> ${reason}`);
    return reason / 10;
}).then(result => {
    console.log(`成功了 -> ${result}`);
    return result * 10;
}, reason => {
    console.log(`失败了 -> ${reason}`);
    return reason / 10;
});


 - then([A],[B])：如果其中一个函数没有传递，则会“顺延”
 -  + [A]没有传递：则找下一个THEN中的A函数
 -   + [B]没有传递：则找下一个THEN中的B函数
 -  catch：then(null,reason=>{...})
```
Promise.resolve(10).then(null /!* result=>{ return result; } *!/ , reason => {
    console.log(`失败了 -> ${reason}`);
    return reason / 10;
}).then(result => {
    console.log(`成功了 -> ${result}`); //成功->10
    return result * 10;
}, reason => {
    console.log(`失败了 -> ${reason}`);
    return reason / 10;
});
```

```
 Promise.reject(10).then(null, null /!* reason=>{ return Promise.reject(reason); } *!/ ).then(result => {
    console.log(`成功了 -> ${result}`);
    return result * 10;
}, reason => {
    console.log(`失败了 -> ${reason}`);
    return reason / 10;
});
```



 * 真实项目中：then只是处理成功的  catch处理失败(一般写在最后)
```
 Promise.resolve(10).then(result => {
    console.log(`成功了 -> ${result}`);
    return result * a;
}).then(result => {
    console.log(`成功了 -> ${result}`);
    return result * a;
}).catch(reason => {
    console.log(`失败了 -> ${reason}`);
});
```



// 返回失败状态的实例，但是没有做失败的处理，浏览器控制台有报错（但是不会影响其他代码执行）
// 再最后加catch解决这个问题
```
Promise.reject(10).then(result => {
    console.log(`成功了 -> ${result}`);
    return result * 10;
}).catch(reason => {});
setTimeout(() => {
    console.log('OK');
}, 1000);
```
// Promise.all管理多个promise实例，返回一个总的promise实例 P 
//   + 当所有实例都为成功，P状态才是成功（结果是一个数组，按照顺序依次存储了每一个实例成功的结果）
//   + 只要有一个实例失败的，P状态就是失败（结果就是当前实例失败的原因）
// Promise.all([promise1,promise2,...]).then(result=>{}).catch(reason=>{})

// Promise.race也是管理多个promise实例，但是它属于看所有实例谁先有结果（不论是失败还是成功），总实例以它为主