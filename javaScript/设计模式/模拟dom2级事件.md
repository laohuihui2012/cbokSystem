/*
 * 设计模式是一种思想：用来有效管理代码的思想 
 *  「经典设计模式：发布订阅」
 */
// subscribe -> sub
```
let sub = (function () {
    // 自定义事件池
    let pond = {};

    // 关于事件池中方法的管理
    const on = function on(type, func) {
        // 验证当前事件池中是否存在这个自定义事件:不存在则新增一个
        !pond.hasOwnProperty(type) ? pond[type] = [] : null;
        let arr = pond[type];
        // 重复验证
        // if (arr.includes(func)) return;
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] === func) {
                return;
            }
        }
        arr.push(func);
    };

    const off = function off(type, func) {
        let arr = pond[type] || [];
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] === func) {
                // 想要移除的
                // arr.splice(i, 1);
                // 防止数组塌陷，实现当前项的假删除
                arr[i] = null;
                break;
            }
        }
        // arr = arr.filter(item => item !== func);
    };

    const fire = function fire(type, ...params) {
        let arr = pond[type] || [];
        for (let i = 0; i < arr.length; i++) {
            let item = arr[i];
            if (typeof item === "function") {
                item(...params);
                continue;
            }
            // 如果当前项是null，在这里把它删除
            arr.splice(i, 1);
            i--;
        }
        // arr.forEach(item => item(...params));
    };

    // 暴露API
    return {
        on,
        off,
        fire
    };
})();


let box = document.querySelector('#box');
box.onclick = function (ev) {
    sub.fire('@A', 10, 20, ev);
};

function fn1(x, y, ev) {
    console.log(1, x, y, ev);
}
sub.on('@A', fn1);

function fn2() {
    console.log(2);
    sub.off('@A', fn1);
    sub.off('@A', fn2);
}
sub.on('@A', fn2);

function fn3() {
    console.log(3);
}
sub.on('@A', fn3);

function fn4() {
    console.log(4);
}
sub.on('@A', fn4);

function fn5() {
    console.log(5);
}
sub.on('@A', fn5);

/*
 扩展：基于面向对象的思想实现发布订阅
 let $plan=$.Callbacks();
 $plan.add(fn1);
 $plan.remove(fn2);
 $plan.fire() 
 */
```