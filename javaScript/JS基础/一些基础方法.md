## 1.字符串的方法
#### indexOf() 
- indexOf()  返回字符串中指定内容出现的索引位子(首次出现的位置)，如果str不包含指定的字符串则返回 -1
- lastIndexOf() 返回指定内容在字符串中最后一次出现的索引
```
let str = "laohuihui is haha xixi is";
let index = str.indexOf("is");// 10 记得时从0开始计算

//还可以接收第二个参数，就是查找的开始位置

let index = str.indexOf("is", 12); //从索引12开始查找

var str = "The full name of China is the People's Republic of China.";
var pos = str.search("China");//17
```
//indexOf() 与 search()的区别
search() 方法无法设置第二个开始位置参数。
indexOf() 方法无法设置更强大的搜索值（正则表达式）


______________________
#### slice、subString、subStr
这三个方法都是截取字符串使用的

返回的是截取的字符串
 * slice(start,end) //start和end可以为负数(表示尾部倒序的索引)
   ** 例如slice(1, -1) 表示1到（包含）倒数第二个,不包含索引为1的
 * subString(start,end) 索引不能为负数 (不包含start)
 * substr(start,length) 截取的长度，不穿默认到最后 (不包含start)

start:表示截取的起始索引(不包含)  
end:表示结束的位置(包含)
```
let str = "aplle huawei xiaomi"
let res = str.slice(6,12) //huawei
```
####  replace()

替换字符串中的指定值
```
let str = "laohuihui haha xixi"
str.replace("haha","yaya")  //前者被后者替换

```
注意：replace对大小写是敏感的
如需执行大小写不敏感的替换，请使用正则表达式 /i（大小写不敏感）
默认只替换第一个，如需替换所有匹配，请使用正则表达式的 g 标志
```
str = "Please visit my house my";
var n1 = str.replace(/MY/i, "you");  // 不分大小写，只替换第一个
var n2 = str.replace(/my/g, "you"); // 替换所有匹配 Please visit you house you
var n2 = str.replace(/my/gi, "you"); // 不分大小写全部替换
```
#### toUpperCase()和toLowerCase()

toUpperCase() 把小写转化成大写
toLowerCase() 把大写转化成小写

```
var text1 = "Hello lHH!";       // 字符串
var text2 = text1.toLowerCase(); //hello lhh
var text3 = text1.toUpperCase(); //HELLO　LHH
```
#### concat()
拼接字符串,concat() 方法用于连接两个或多个字符串。string.concat(string1, string2, ..., stringX)
(该方法没有改变原有字符串，但是会返回连接两个或多个字符串新字符串)
```
const str = 'lao huihui'
const str2 = 'hahah'
str.concat(str2) // 'lao huihuihahah'
```
#### split()
该方法用于把字符串分割成数组
string.split(separator,limit) 
limit: 表示指定返回的数组最大长度
```
var str="How are you doing today?";
var n=str.split(" "); //['How','are','you','doing','today?']
```
### includles
用于判断字符串是否包含指定的字符串，包含字符串则返回 true，否则返回 false
string.includes(searchvalue, start)
start表示开始的位子
注意： 区分大小写
```
var str = "Hello world, welcome to the China。";
var n = str.includes("world");
```

#### repeat()
repeat() 方法字符串复制指定次数
```
var str = "Runoob";
str.repeat(2);
```
#### endsWith()
判断字符串是否以指定的子字符串结尾（区分大小写）
```
let str = "Hello world";
str.endsWith("world")   // 返回 true
str.endsWith("World")   // 返回 false
```
ch
#### charAt()和charCodeAt()
charAt() 方法可返回指定位置的字符。
(第一个字符位置为 0, 第二个字符位置为 1,以此类推.)
```
var str = "HELLO WORLD";
var n = str.charAt(2) // L
```
charCodeAt() 返回字符串第一个字符的 Unicode 编码

