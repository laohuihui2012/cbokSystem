### 1.时间格式转换
```
function dateFormat(date, format) {
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    format = format.replace(/yyyy/, year);
    format = format.replace(/MM/, month);
    format = format.replace(/dd/, day);
    return format
}

dateFormat(new Date('2020-12-01'), 'yyyy/MM/dd') // 2020/12/01
dateFormat(new Date('2020-04-01'), 'yyyy/MM/dd') // 2020/04/01
dateFormat(new Date('2020-04-01'), 'yyyy年MM月dd日') // 2020年04月01日
```
### 2.实现数组元素求和
 * 2.1 arr=[1,2,3,4,5,6,7,8,9,10]，求和

```
let arr=[1,2,3,4,5,6,7,8,9,10];
let sum = arr.reduce((total, index) => {
        total += index;
    }, 0)

// 递归
let arr=[1,2,3,4,5,6,7,8,9,10];
function add(arr) {
    if(arr.length === 1) return arr[0];
    return arr[0] + add(arr.slice(1));
}
```

 * 2.2 arr=[1,2,3,[[4,5],6],7,8,9]，求和
 ```
let arr = [1,2,3,[[4,5],6],7,8,9]
let sum = arr.toString().split(',').reduce((total, index) => total += Number(index), 0);
console.log(sum)

 ```
### 3. 实现数组的扁平化
 * （1）递归
 ```
let arr = [1, [2, [3, 4, 5]]];
function flatArray(arr) {
    let res = [];
        for(let i = 0; i < arr.length; i++) {
        if(Array.isArray(arr[i])) {
            res = res.concat(flatArray(arr[i]));
        } else {
            res.push(arr[i]);
        }
        }
        return res;
}
console.log(flatArray(arr)); 

// 使用reduce简化
let arr = [1, [2, [3, 4]]];
function flatten(arr) {
    return arr.reduce(function(prev, next){
        return prev.concat(Array.isArray(next) ? flatten(next) : next)
    }, [])
}
console.log(flatten(arr));//  [1, 2, 3, 4，5]
 ```

 * （2）使用some和展开运算符
```
    let arr = [1, [2, [3, 4, 5]]];
    function flatten(arr) {
        while(arr.some(item => Array.isArray(item))) {
            arr = [].concat(...arr);
        }
        return arr;
    }
    console.log(flatten(arr)); //  [1, 2, 3, 4，5]
```
 * （3）split 和 toString 
可以通过 split 和 toString 两个方法来共同实现数组扁平化，由于数组会默认带一个 toString 的方法，所以可以把数组直接转换成逗号分隔的字符串

```
let arr = [1, [2, [3, 4, 5]]];
function flatten(arr) {
    return arr.toString().split(',');
}
console.log(flatten(arr)); //  [1, 2, 3, 4，5]
```
 * （4）ES6 中的 flat
  - ES6 中的 flat 方法来实现数组扁平化。flat 方法的语法：arr.flat([depth])
  - 其中 depth 是 flat 的参数，depth 是可以传递数组的展开深度（默认不填、数值是 1），即展开一层数组。如果层数不确定，参数可以传进 Infinity
 ```
 let arr = [1, [2, [3, 4]]];
function flatten(arr) {
  return arr.flat(Infinity);
}
console.log(flatten(arr)); //  [1, 2, 3, 4，5]
 ```
### 4. 实现数组去重
 * 使用map
```
const array = [1, 2, 3, 5, 1, 5, 9, 1, 2, 8];
    function uniqueArray(arr) {
        let map = {},
            res = [];
        for(let i = 0; i < arr.length; i++) {
            console.log([arr[i]]);
            if(!map.hasOwnProperty(arr[i])) {
                map[arr[i]] = 1;
                res.push(arr[i]);
            }
        }
        return res;
    }

    console.log(uniqueArray(array)); 
```
 * 使用Set
  - Array.from 将伪数组或者Set和Map结构的数据转换成真数组
 ```
 const array = [1, 2, 3, 5, 1, 5, 9, 1, 2, 8];
 Array.from(new Set(array)) // [1, 2, 3, 5, 9, 8]
 ```
### 5.实现数组的flat方法
```
function myFlat(arr, depth) {
    if(!Array.isArray(arr) || depth <= 0) {
        return arr;
    }

    return arr.reduce((prev, cur) => {
        if(Array.isArray(cur)) {
            return prev.concat(myFlat(cur, depth - 1));
        } else {
            return prev.concat(cur);
        }
    }, [])    
}
``` 
### 6.实现数组的push方法
```
Array.prototype.myPush = function() {
    for(let i = 0; i < this.length; i++) {
        this[this.length] = arguments[i];
    }
    return this.length;
}

```
### 7. 实现数组的filter方法
```
Array.prototype.myFliter = function(fn) {
    if(typeof fn !== 'function') {
        throw Error('fn must be a function');
    }
    
    const res = [];
    for( let i = 0; i < this.length; i++) {
        fn(this[i]) && res.push(this[i]);
    }
    return res;
}
```
### 8. 实现数组的map方法
```
Array.prototype.myFliter = function(fn) {
    if(typeof fn !== 'function') {
        throw Error('fn must be a function');
    }
    
    const res = [];
    for( let i = 0; i < this.length; i++) {
        res.push(fn(this[i]));
    }
    return res;
}
```
### 9.实现字符串的repeat方法
```
 String.prototype.myRepeat = function(s, n) {
    return (new Array(n + 1)).join(s);
}

String.prototype.myRepeat = function(s, n) {
    return n > 0 ? s.concat(myRepeat(s, --n)) : '';
}
```
### 10. 实现字符串翻转
```
String.prototype.myReverse = function name(s) {
    return s.length > 0 ? s.split('').reverse().join('') : '';
}

let obj = new String();
let res = obj.myReverse('hello')
console.log(res);
```
### 11.将数字每千分位用逗号隔开
```
function formatNum(num) {
    let str = num && num.toString(); // 先转成字符串
    let len = str.length;
    let decimals = '';
    // 判断是否有小数点
    str.indexOf('.') > -1 ? decimals = str.split('.')[1] : null;
    if(len <= 3) {
        return str;
    } else {len
        let remainder = len % 3,
            temp = '';
        decimals ? temp = '.' + decimals : null;
        if(remainder > 0) { // 长度不是3的整数倍
            return str.slice(0, remainder) + ',' + str.slice(remainder, len).match(/\d{3}/g).join(',') + temp;
        } else {
            return str.slice(0, len).match(/\d{3}/g).join(',') + temp;
        }
    }
}

console.log(formatNum(312323.33));  // '2,312,323.33'
```
### 12.实现非负大整数相加
 *思路：
    ● 首先用字符串的方式来保存大数，这样数字就不会发生变化
    ● 初始化res，temp来保存中间的计算结果，并将两个字符串转化为数组，以便进行每一位的加法运算
    ● 将两个数组的对应的位进行相加，两个数相加的结果可能大于10，所以可能要仅为，对10进行取余操作，将结果保存在当前位
    ● 判断当前位是否大于9，也就是是否会进位，若是则将temp赋值为true，因为在加法运算中，true会自动隐式转化为1，以便于下一次相加
    ● 重复上述操作，直至计算结束
```
// 相加
function sumBigNumber(a, b) {
    let res = '',
    temp = 0;
    a = a.split('');
    b = b.split('');
    while (a.length || b.length || temp) {
        temp += ~~a.pop() + ~~b.pop();
        res = (res % 10) + res;
        temp = temp > 9;            
    }
    return res.replace(/^0+/, '');
} 
```
### 13.实现add(1)(2)(3)
 柯里化解决
 * 参数长度固定
```
function add() {
    // 第一次执行时，定义一个数组专门用来存储所有的参数
    var _args = Array.prototype.slice.call(arguments);

    // 在内部声明一个函数，利用闭包的特性保存_args并收集所有的参数值
    var _adder = function() {
        _args.push(...arguments);
        return _adder;
    };

    // 利用toString隐式转换的特性，当最后执行时隐式转换，并计算最终的值返回
    _adder.toString = function () {
        return _args.reduce(function (a, b) {
            return a + b;
        });
    }
    return _adder;
}
```
 * 参数长度不固定
```
function currying(fn) {
    let args = [];
    return function temp(...newArgs) {
        if( newArgs.length ) {
            args = [
                ...args,
                ...newArgs
            ];
            return temp;
        } else {
            let res = fn.apply(this, args);
            args = [];
            return res;
        }
    }
}

function add(...args) {
    return args.reduce((a, b) => a + b)
}
```
### 14.为数组转数组
 *(1)利用call调用数组的slice方法
```
Array.prototype.slice.apply(arrayLike)
```
 *(2)利用call调用数组的splice方法
```
Array.prototype.splice(arrayLike, 0)
```
*(3)利用apply调用数组的contcat方法
```
Array.prototype.apply([], arrayLike)
```
*(4)Array.from
```
Array.from(arrayLike)
```
### 15.将数组对象转化为树形结构
```
// 转换前：
source = [{
            id: 1,
            pid: 0,
            name: 'body'
          }, {
            id: 2,
            pid: 1,
            name: 'title'
          }, {
            id: 3,
            pid: 2,
            name: 'div'
          }]
// 转换为: 
tree = [{
          id: 1,
          pid: 0,
          name: 'body',
          children: [{
            id: 2,
            pid: 1,
            name: 'title',
            children: [{
              id: 3,
              pid: 1,
              name: 'div'
            }]
          }
        }]
```
```
function listToTree(data) {
    if(!Array.isArray(data)) {
        return data;
    }
    let map = new Map();
    data.forEach( item => {
        map.set(item.id, item);
    })
    let res = [];
    data.forEach(item => {
        let parent = map.get(item.pid);
        parent ? (parent.children || (parent.children = [])).push(item) : res.push(item);
    })
    console.log(res);
    return res;
}
```
### 数据组合
```
const obj = {
    data: [
        ['xiaoming', 'male', '18', 'beijing', '2020-01-02'],
        ['xiaofang', 'female', '18', 'shanghai', '2020-03-02']
    ],
    columns: [
        { name: 'name', note: '' },
        { name: 'gender', note: '' },
        { name: 'age', note: '' },
        { name: 'address', note: '' },
        { name: 'registerTime', note: '' },
    ]
};
输出下面结果 
[
    { name: 'xiaoming', 'gender': 'male', age: '18', address: 'beijing', registerTime: '2020-01-02' },
    { name: 'xiaofang', 'gender': 'female', age: '18', address: 'shanghai', registerTime: '2020-03-02' }
]
```

```
const combine = function combine(obj) {
    let { data, columns } = obj,
        columnsKeys = {};
    // 先把columns变为 {name:0,gender:1,...} 这种格式
    columns.forEach((item, index) => {
        columnsKeys[item.name] = index;
    });
    // 外层迭代数据DATA
    return data.map(item => {
        // item: ['xiaoming', 'male', '18', 'beijing', '2020-01-02']
        // columnsKeys: {name: 0, gender: 1, age: 2, address: 3, registerTime: 4}
        // 想要的结果 { name: 'xiaoming', 'gender': 'male', age: '18', address: 'beijing', registerTime: '2020-01-02' }
        let obj = {};
        _.each(columnsKeys, (index, key) => {
            obj[key] = item[index];
        });
        return obj;
    });
};

```

```

const combine = function combine(obj) {
    let { data, columns } = obj;
    // 把columns按照每列的字段名扁平化
    columns = columns.map(item => item.name);
    // console.log(columns); //['name', 'gender', 'age', 'address', 'registerTime']
    return data.map(item => {
        // item: ['xiaoming', 'male', '18', 'beijing', '2020-01-02']
        // 想要的结果 { name: 'xiaoming', 'gender': 'male', age: '18', address: 'beijing', registerTime: '2020-01-02' }
        let obj = {};
        columns.forEach((key, index) => {
            obj[key] = item[index];
        });
        return obj;
    });
};
```
```
const obj = {
    data: [
        ['xiaoming', 'male', '18', 'beijing', '2020-01-02'],
        ['xiaofang', 'female', '18', 'shanghai', '2020-03-02']
    ],
    columns: [
        { name: 'name', note: '' },
        { name: 'gender', note: '' },
        { name: 'age', note: '' },
        { name: 'address', note: '' },
        { name: 'registerTime', note: '' },
    ]
};
console.log(combine(obj))
```

### 实现数组的乱序输出
* 主要的实现思路就是：
 - 去除第一个元素，随机生成一个索引，将第一个元素和该索引对应的值对换
 - 第二次取出数据数组第二个元素，随机产生一个除了索引为1的之外的索引值，并将第二个元素与该索引值对应的元素进行交换
 - 按照上面直到遍历完成

```
var arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
for(var i = 0; i < arr.length; i++) {
    const randomIndex = Math.round(Math.random() * (arr.length - 1 - i)) + i;
    [arr[i], arr[randomIndex]] = [arr[randomIndex], arr[i]];
}
```
* 倒序遍历
```
let arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
let len = arr.length,
    temp,
    randomIndex;
while(len) {
    randomIndex = Math.floor(Math.random() * len--);
    temp = arr[len];
    arr[len] = arr[randomIndex];
    arr[randomIndex] = temp; 
}
```
