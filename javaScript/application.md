### 1.小孩报数
 * 有40个小孩儿，编号从1-30，围成一圈依此报数，1、2、3 数到 3 的小孩儿退出这个圈， 然后下一个小孩 重新报数 1、2、3，问最后剩下的那个小孩儿的编号是多少?

```
function childNumber(num, count) {
    let allChild = [];
    for (let i = 0; i < num; i++) {
        allChild[i] = i + 1;
    }

    let leaveCount = 0, // 离开的人数
        curIndex = 0, // 当前下标
        curCount = 1; // 当前报数
        while(leaveCount < num - 1 ) {
        if(allChild[curIndex] !== 0) curCount++;

        if(curCount === count) { // 当报数的数等于3时，又重开始报数,移除的下标值为0
            curCount = 1;
            allChild[curIndex] = 0;
            leaveCount++;
        }
        curIndex++;
        if(curIndex === num) {
            curIndex = 0;
        }
        }
        
        for (let i = 0; i < num; i++) {
        if(allChild[i] !== 0) {
            return allChild[i];
        }
        }
}

console.log(childNumber(40, 3)); 
```
### 2.循环打印红黄绿

 * 下面来看一道比较典型的问题，通过这个问题来对比几种异步编程方法：红灯 3s 亮一次，绿灯 1s 亮一次，黄灯 2s 亮一次；如何让三个灯不断交替重复亮灯？
 * 三个亮灯函数
 ```
 function red() {
    console.log('red');
 }

 function green() {
    console.log('green');
 }

 function yellow() {
    console.log('yellow');
 }
 ```
 ##### (1)callBack
 ```
 function task(color, time, callback) {
        setTimeout(() =>{
            if(color === 'red') {
                red();
            } else if(color === 'green') {
                green();
            } else if(color === 'yellow') {
                yellow();
            }
            callback();
        }, time)
    }

    const step = () => {
        task('red', 3000, () => {
            task('green', 2000, () => {
                task('yellow', 1000, step);
            });
        })
    }
    step();
 ```
##### (2)用promise实现
```
 const task = (color, time) => {
        return new Promise((resolve, reject) => {
            setTimeout(() =>{
                if(color === 'red') {
                    red();
                } else if(color === 'green') {
                    green();
                } else if(color === 'yellow') {
                    yellow();
                }
                resolve();
            }, time)
        })
    }

    const step = () => {
        task('red', 3000)
        .then(() => task('green', 2000))
        .then(() => task('yellow', 1000))
        .then(step)
    }

    step()
```
##### (3)用 async/await 实现
```
const step = async () => {
    await task('red', 3000);
    await task('green', 2000);
    await task('yellow', 1000);
    step()
}
step()
```
### 3.发布订阅(模拟dom 2级事件)
```
class EventCenter {
    // 定义一个事件池
    let ponds = {};

    // 添加事件  参数:事件名  事件方法
    addEventListener(eventType, handler) {
        // 如果没有该类型事件，创建新得事件数组容器
        if(!this.ponds[eventType]) {
            this.ponds[eventType] = [];
        }
        // 如果有则存入事件
        this.poonds[eventType].push(handler);
    }

    // 触发事件 参数：事件名 事件参数
    dispatchEvent(eventType, params) {
        if(!this.ponds[eventType]) {
            return new Error('此事件无效哦');
        }
        this.ponds[eventType].foreach(handler => {
            handler(params);
        })
    }

    // 移除事件 参数：事件名 要删除得事件方法 
    removeEventListener(eventType, handler) {
        if(!this.ponds[eventType]) {
            return new Error('无效事件哦');
        }
        // 若第二个参数未穿，移除整个事件容器
        if(!handler) {
            delete this.ponds[eventType];
        } else {
            const index = this.ponds[eventType].findIndex(e => e === handler);
            if(index === -1)  return new Error('没有绑定该事件');
            this.ponds[eventType].splice(index, 1);
            this.ponds[eventType].length === 0 ? delete this.ponds[eventType] : null;
        }
    }
}
```
### 4. 使用 setTimeout 实现 setInterval
 * setInterval的作用：它真正的作用是每隔一段时间将事件加入事件队列中去，只有当当前的执行栈为空的时候，才能去从事件队列中取出事件执行。
 * 有时候执行栈执行的时间很长，导致执行栈积累了多个定时器加入的事件，当执行栈空闲时，这些事件辉依次执行，所以就不能严格的按照间隔一段时间执行的效果

 实现思路是使用递归函数，不断地去执行 setTimeout 从而达到 setInterval 的效果
```
function mySetInterval(fn, timeout) {
    // 控制器，控制是否继续执行
    var timer = {
        falg: true,
    }
    
    // 设置递归，模拟setInterval执行
    function interval() {
        if(timer.falg) {
            fn();
            setTimeout(interval, timeout);
        }
    }
    // 启动定时器
    setTimeout(interval, timeout);
    return timer;
}
```
### 5.简写双向数据绑定
```

let obj = {};
    let input = document.getElementById('input');
    let text = document.getElementById('text');

    Object.defineProperty(obj, 'text', {
        enumerable: true,
        configurable: true,
        get() {
            console.log('你访问了obj的text属性')
            return val;
        },
        set(newVal) {
            if(val === newVal) return
            input.value = newVal;
            text.innerHTML = newVal;
        }
    })

    input.addEventListener('keyup', (e) => {
        obj.text = e.target.value;
    })
```

### 6.判断对象是否循环引用
 * 循环引用对象本来没有什么问题，但是序列化的时候就会发生问题，比如调用JSON.stringify()对该类对象进行序列化，就会报错: Converting circular structure to JSON.
```
function isCircularReference(obj, parent) {
    let parentArr = parent || [obj];
    for(let key in obj) {
        if(typeof obj[key] === 'object') {
            let flag = false;
            parentArr.forEach(innerObj => {
                if(innerObj === obj[key]) {
                    flag = true;
                }
            });
            if(flag) return true;
            flag = isCircularReference(obj[key], [...parentArr, obj[key]]);
            if(flag) return true;
        }
    }
    return false;
}


const a = 1;
const b = {a};
const c = {b};
const o = {d:{a:3},c}
o.c.b.aa = c;

console.log(isCircularReference(o))
```
### 7. 用Promise实现图片的异步加载
```
let imageAsnyc = (url) => {
    return new promise((resolve, reject) =>{
        let img = new Image();
        img.src = url;
        img.onload = (image) => {
            resolve(image);
        };
        img.onerror = (err) => {
            reject(err);
        }
    })
}

imageAsnyc(url).then(() => {
    console.log('加载成功');
}).catch((err) => {
    console.log('加载失败');
})
```
### 8.查找文章中出现频率最高的单词
```
function findMostWord(article) {
    if(!article) return;
    // 
    article = article.trim().toLowerCase();
    let wordList = article.match(/[a-z]+/g),
        visited = [],
        maxNum = 0,
        maxWord = '';
        console.log(wordList);
        console.log(article);
        article = " " + wordList.join("  ") + " ";
        console.log(article);
    wordList.forEach(item => {
        if(visited.indexOf(item) < 0) {
            visited.push(item);
            let word = new RegExp(' ' + item + ' ', 'g');
            num = article.match(word).length;
            if(num > maxNum) {
                maxNum = num;
                maxWord = item;
            }
        }
    });
    return maxWord + ' ' + maxNum;
 }
 let art = "Studying a subject that you feel pointless is never a fun or easy task. If you're study history, asking yourself the question why is history important is a very good first step. History is an essential part of human civilization. You will find something here that will arouse your interest, or get you thinking about the significance of history"
 findMostWord(art)
```
 ### 9. 实现每隔一秒打印 0,1,2,3,4
 ```
 // 使用let 形成块级作用域
for(let i = 0;i < 5; i++) {
    setTimeout(function(){
        console.log(i);
    }, i* 1000);
 }

 // 使用闭包实现
for(let i = 0;i < 5; i++) {
    (function(j){
        setTimeout(() => {
            console.log(j);
        }, j* 1000);
    })(i);
 }

 // 利用setTimeout的第三个参数   （它就是给setTimeout第一个函数的参数）

 for(let i = 0;i < 5; i++) {
    setTimeout(function(j){
        console.log(j);
    }, i* 1000, i);
 }
 ```
### 10. 无重复字符的最长子串
给定一个字符串 s ，请你找出其中不含有重复字符的 最长子串 的长度。
输入: s = "abcabcbb"
输出: 3 
解释: 因为无重复字符的最长子串是 "abc"，所以其长度为 3。
```
var lengthOfLongestSubstring = function(str) {
    // str长度小于等于1直接返回长度
    if(str.length <= 1) return str.length;
    // 准备两个指针
    let left = 0,
        right = 1,
        max = 0,
        temp = ''; // 用于存放当前截取的
    while(right < str.length) {
        temp = str.slice(left, right);
        if(temp.indexOf(str.charAt(right)) > -1) { 
            // 如果right指针指向的值存在temp中，此时出现重复
            // 此时将left指针移到right
            left = right;
        }
        right++;
        if(right - left > max){
            // 如果此时未重复长度比max大，改变max值
            max = right - left;
        } 
    }
    return max
};
```
### 11.简单实现json
```
function addScript(src) {
    const script = document.createElement('script');
    script.src = src;
    script.type = 'text/javascript';
    document.body.appendChild(script);
}

add('http://xxx.xxx.com/xxx.js?callback=handleRes')

// 一个接收处理返回数据的回调函数
function handleRes(res) {
    console.log(res);
}
// 接口返回的数据格式
handleRes({a: 1, b: 2});
```