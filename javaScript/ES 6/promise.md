#### 1.promise是什么？
在刚开始接触到promise的时候，对它是很模糊的概念。只知道它经常是用来解决异步编程的

以前我们处理异步编程很麻烦，需要一层层的嵌套回调，有了promise我们就能更合理更清晰的处理异步编程了。

简单的来说，promise是一个对象，它里面包含了各种api,可以用来处理异步编程。promise有以下特点：

1.promise有三种状态：pending-未完成状态，fulfilled-已成功状态，rejected-已失败

2.promise的状态变更之后就不可再改变，只有pending到fulfilled，或是pending到rejected。当状态改变之后就已经定型resolved（resolved）

3.promise接受一个执行函数, 这个执行函数默认立即执行, 并且这个函数参数为两个函数: resolve和reject

// resolve调用时, promise状态变为fulfilled, 并且给then方法的成功回调传递一个终值value

// reject调用时, promise状态变为rejected, 并且给then方法的失败回调传递一个拒因reason

// 注意: 执行函数中抛出错误也走reject的逻辑

#### 2.promise有哪些api和属性

##### 2.1.Promise.prototype.then()方法
promise.then(onFulfilled, onRejected)的作用是为Promise实例添加 状态改变时的回调函数，onFulfilled是resolved状态的回调函数，onRejected是rejected状态的回调函数

###### .then方法是如果实现链式调用的呢？
.then方法返回一个新的promise，并延迟执行获取到这个promise,将上一步的值 通过reslove和reject透传出去。这样就实现了可以多次调用.then(),并且上一步的输出作为下一步的输入


##### 2.2 Promise.prototype.catch()
Promise.prototype.catch()方法是.then(null, rejection)或.then(undefined, rejection)的别名，用于指定发生错误时的回调函数。

```
getJSON('/posts.json').then(function(posts) {
  // ...
}).catch(function(error) {
  // 处理 getJSON 和 前一个回调函数运行时发生的错误
  console.log('发生错误！', error);
});
```
注意：Promise 对象的错误具有“冒泡”性质，会一直向后传递，直到被捕获为止。也就是说，错误总是会被下一个catch语句捕获。

```
getJSON('/post/1.json').then(function(post) {
  return getJSON(post.commentURL);
}).then(function(comments) {
  // some code
}).catch(function(error) {
  // 处理前面三个Promise产生的错误
});
```
##### 2.3Promise.prototype.finally()
finally()方法用于指定不管 Promise 对象最后状态如何，都会执行的操作.


```
promise
.then(result => {···})
.catch(error => {···})
.finally(() => {···});
```
不管promise最后的状态，在执行完then或catch指定的回调函数以后，都会执行finally方法指定的回调函数。


promise还有很多api：Promise.all()
Promise.race()
Promise.allSettled()
Promise.any()
Promise.resolve()
Promise.reject()
Promise.try()

详情请看https://es6.ruanyifeng.com/#docs/promise#Promise-prototype-finally

#### 3.手写一个简单的promise
```
const STATUS = {
    pending:"pending",
    fulfilled:"fulfilled",
    rejected:"rejected"
}

class Promise = {
    //每个实例接受一个执行函数
    constructor(executor) {
        //初始化个个状态

        this.status = STATUS.pending;
        this.value = null;
        this.reason = null;
        this.onFulfilledCbs = [];
        this.onRejectedCbs = [];

        //默认立即执行executor,其中resolve和reject回调函数需要事先定义
        try {
            executor(this.resolve,this.reject);
        } catch(error) {// 执行代码出错也走 reject逻辑, 所以要cathc一下
            this.reject(error)
        }
    }

    resolve = (value) => {
        //resolve只能调用一次，所以需要对实例化状态进行判断
        if(this.status === STATUS.pending){
            this.status = STATUS.fulfilled;
            this.value = value;
            // 自动执行then的回调
            this.onFulfilledCbs.forEach(cd => cd())
        }
    }

    reject = (err) => {
        if(this.status === STATUS.pending){
            this.status = STATUS.rejected;
            this.reason = err;

            this.onRejectCbs.forEach(cd => cd())
        }
    }

    then = (onFulfilled, onRejected) {
        // 参数校验 onFulfilled, onRejected 为可选形参
        onFulfilled = typeof onFulfilled !== 'function' ? val => val : onFulfilled;
        onRejected = typeof onRejected !== 'function' ? reason => { throw reason } : onRejected;

         // then方法调用时机: 状态变更, 即执行函数中调用了resolve或者reject
         if(this.status === STATUS.fulfilled) {
             onFulfilled(this.value)
         }
         if(this.status === STATUS.rejected) {
             onRejected(this.reason)
         }

        // 要是没有调用resolve或者reject呢? 我们将存到各自的回调队列里
        // 等到resolve时我们就全部取出来执行
        if(this.status === STAUTS.pending) {
            this.onfulfilledCbs.push(()=> {
                onfulfilled(this.value);
            })

            this.onRejectedCbs.push(() => {
                onRejected(this.reason);
            })
        }
    }
}

module.exports = Promise;
```
上面只是一个很简单很简单的写法，.then()方法返回一个新的promise和resolvePromise都还没有实现。

下面是比较完整的写法：

```
class Promise {
  constructor(executor) {
    // 形参校验
    if (typeof executor !== 'function') throw new TypeError(`Promise resolver ${executor} is not a function`)
    // 初始化
    this.init();

    try {
      executor(this.resolve, this.reject);
    } catch (e) {
      this.reject(e)
    }

  }

  // 初始化值
  init() {
    this.value = null; // 终值
    this.reason = null; // 拒因
    this.status = Promise.PENDING; // 状态
    this.onFulfilledCbs = []; // 成功回调
    this.onRejectedCbs = []; // 失败回调
    // 将 resolve 和 reject 中的 this 绑定到 Promise 实例
    this.resolve = this.resolve.bind(this)
    this.reject = this.reject.bind(this)
  }

  resolve(val) {
    // 成功后的一系列操作（状态改变，成功回调的执行）
    if (this.status === Promise.PENDING) {
      this.status = Promise.FULFILLED;
      this.value = val;
      this.onFulfilledCbs.forEach(fn => fn(this.value));
    }
  }

  reject(err) {
    // 失败后的一系列操作（状态改变， 失败回调的执行）
    if (this.status === Promise.PENDING) {
      this.status = Promise.REJECTED;
      this.reason = err;
      this.onRejectedCbs.forEach(fn => fn(this.reason));
    }
  }

  then(onFulfilled, onRejected) {
    // 参数校验 onFulfilled, onRejected 为可选形参
    onFulfilled = typeof onFulfilled !== 'function' ? val => val : onFulfilled;
    onRejected = typeof onRejected !== 'function' ? reason => { throw reason } : onRejected;

    // 返回一个新的实例来实现链式调用
    let promise2 = new Promise((resolve, reject) => {
      // 同步操作（最开始的状态改变为同步）
      if (this.status === Promise.FULFILLED) {
        // setTimeout 模拟微任务异步 
        // 只有异步后 才能在里面取到 new 好的 promise2
        setTimeout(() => {
          try { // 重新添加try-catch，settimeout 内为异步，无法被外层constructor中的try-catch捕获
            // 以终值作为参数执行 onFulfilled 函数
            let x = onFulfilled(this.value);
            // 分析执行结果 x 与 promise 的关系
            // resolve(x);
            Promise.resolvePromise(promise2, x, resolve, reject);
          } catch (e) { reject(e) }
        })
      }

      if (this.status === Promise.REJECTED) {
        // 以拒因作为参数执行 onRejected 函数
        setTimeout(() => {
          try {
            let x = onRejected(this.reason)
            Promise.resolvePromise(promise2, x, resolve, reject);
          } catch (e) { reject(e) }
        });
      }

      // 异步操作（最开始状态改变为异步，如 settimeout 内包含 resolve）使用发布订阅
      if (this.status === Promise.PENDING) {
        this.onFulfilledCbs.push(value => {
          setTimeout(() => {
            try {
              let x = onFulfilled(value)
              Promise.resolvePromise(promise2, x, resolve, reject);
            } catch (e) { reject(e) }
          })
        });
        this.onRejectedCbs.push((reason) => {
          setTimeout(() => {
            try {
              let x = onRejected(reason)
              Promise.resolvePromise(promise2, x, resolve, reject);
            } catch (e) { reject(e) }
          })
        });
      }
    })

    return promise2
  }

}

Promise.PENDING = 'pending';
Promise.FULFILLED = 'fulfilled';
Promise.REJECTED = 'rejected';
```
```
Promise.resolvePromise = function (promise2, x, resolve, reject) {
  // x 与 promise2 相等 -> 报错
  if (promise2 == x) {
    return reject(new TypeError('Chaining cycle detected for promise'))
  }
  let called; // 防止多次调用 成功 和 失败
  // // x 是否是 promise 类
  // if (x instanceof Promise) {
  //   x.then(value => {
  //     Promise.resolvePromise(promise2, value, resolve, reject);
  //   }, err => {
  //     reject(err)
  //   })
  //   // x 是函数或者对象
  // } else 
  if (x !== null && typeof x == 'object' || typeof x == 'function') {
    try { // 取 x.then 可能报错
      // 如果 x 有 then 方法
      let then = x.then;
      // 如果 then 是一个函数
      if (typeof then == 'function') {
        // 用 call 调用 then 方法指向 x，防止再次取 x.then 报错
        then.call(x, value => {
          if (called) return;
          called = true;
          Promise.resolvePromise(promise2, value, resolve, reject);
        }, err => {
          if (called) return;
          called = true;
          reject(err)
        })
      } else {
        if (called) return;
        called = true;
        resolve(x);
      }
    } catch (e) {
      if (called) return
      called = true
      reject(e)
    }
  } else {
    // x 为基本类型值
    resolve(x);
  }
}

Promise.defer = Promise.deferred = function () {
  let dfd = {};
  dfd.promise = new Promise((resolve, reject) => {
    dfd.resolve = resolve;
    dfd.reject = reject;
  })
  return dfd;
}

module.exports = Promise;
```
