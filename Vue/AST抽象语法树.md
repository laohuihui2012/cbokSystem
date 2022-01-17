### 1.什么是抽象语法树？
* 抽象语法树本质上是一个JS对象，vue模板语法变成页面的过程如下
  模板语法 =>（解析）抽象语法树 =>经过函数渲染（h函数）处理 =>虚拟DOM节点 =>页面

### 2.先来一个题目
试编写“智能重复”smartRepeat函数，实现:
• 将3[abc]变为abcabcabc
• 将3[2[a]2[b]]变为aabbaabbaabb
• 将2[1[a]3[b]2[3[c]4[d]]]变为abbbcccddddcccddddabbbcccddddcccdddd

不用考虑输入字符串是非法的情况，比如：
• 2[a3[b]]是错误的，应该补一个1，即2[1[a]3[b]]
• [abc]是错误的，应该补一个1，即1[abc]
```
    function smartRepeat(templateStr) {
        // 先准备一个指针
        var index = 0;
        // 再准备两个栈,一个存放数字，一个存放字符串
        var stack1 = [];
        var stack2 = [];
        // 剩余的字符串
        var restStr = templateStr;
        // 使用while遍历时因为指针可能不止只跑1
        while (index < templateStr.length - 1) {
            // 剩余部分
            restStr = templateStr.slice(index);
            console.log(restStr)

            // 看当前剩余字符串是不是以数字和[开头('3[')
            if(/^\d+\[/.test(restStr)) {
                // 获取数字
                console.log(restStr.match(/^(\d+)\[/))
                var repeatTimes = Number(restStr.match(/^(\d+)\[/)[1]);
                // 将数字推入栈1,同时将一个空字符串推入栈2
                stack1.push(repeatTimes);
                stack2.push('');
                // 加1是算上[的长度
                index += repeatTimes.toString().length + 1
            } else if(/^\w+\]/.test(restStr)) { // 当前剩余字符串是以字母和]开头('a]')
                // 获取开头字母
                console.log(restStr.match(/^(\w+)\]/));
                var word = restStr.match(/^(\w+)\]/)[1];
                // 将栈2栈顶空字符串改成该字母
                stack2[stack2.length - 1] = word;
                // 指针后移word的长度
                index += word.length 
            } else if(restStr[0] === ']') {
                // 当剩余字符串是以']'开头,将stack1栈顶数字出栈,stack2栈顶字符重复repeatTimes次
                var repeatTimes = stack1.pop();
                var word = stack2.pop();
                // 将stack2栈顶的字符串拼接word重复repeatTimes次字符串
                stack2[stack2.length - 1] += word.repeat(repeatTimes);
                index++;
            }
        }
        console.log(index, stack1, stack2)
        // 当循环结束，stack1、stack2各还剩一项，将剩余的一项出栈重复stack1最后一项的次数，然后返回
        return stack2[0].repeat(stack1[0]);
    }
```