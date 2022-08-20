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