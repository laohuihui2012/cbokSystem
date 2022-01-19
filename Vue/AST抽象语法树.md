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
### 手写简单的抽象语法树

```
    function parse(templateString) {
        // 指针
        var index = 0;
        // 剩余字符串
        var rest = '';
        // 准备两个栈
        var stack1 = [];
        var stack2 = [{'children': []}];

        // 匹配开始标签的正则
        var startReg = /^\<([a-z]+[1-6]?)(\s[^\<]+)?\>/;
        // 匹配结束标签的正则
        var endReg = /^\<\/([a-z]+[1-6]?)\>/;
        // 匹配结束标签前文字的正则
        var wordReg = /^([^\<]+)\<\/[a-z]+[1-6]?\>/;

        while (index < templateString.length - 1) {
          // 截取剩余未遍历字符串 
          rest = templateString.substring(index);
          // 匹配开头是不是开始标签
          if(startReg.test(rest)) {
              // 获取得到开始标签名
              var tag = rest.match(startReg)[1];
              var attrStr = rest.match(startReg)[2];
              // 将标签名推入栈1
              stack1.push(tag);
              // 将空数组推入栈2中
              stack2.push({'tag': tag, 'children': [], 'attrs': parseAttrsString(attrStr)});
              // 因为标签上可能没有类名，所以
              var attrLength = attrStr != null ? attrStr.length : 0; 
              // 指针移动的长度等于标签名的长度加'<'和'>'的长度,再加上attrStr的长度
              index += tag.length + 2 + attrLength;
          } else if (endReg.test(rest)) {
              // 匹配到结束标签
              var tag = rest.match(endReg)[1];
              // 匹配到结束标签，标签出栈
              var pop_tag = stack1.pop();
              // 此时结束tag和栈1的栈顶的标签肯定是一样的
              if (tag === pop_tag) {
                  // 栈2栈顶项出栈
                  let pop_arr = stack2.pop();
                  console.log(pop_arr)
                  // 将出栈的项放入栈顶的内部,当然需要判断此时栈里还存在子项
                  if(stack2.length > 0) {
                    stack2[stack2.length - 1].children.push(pop_arr);
                  }
              } else {
                  throw new Error(pop_tag + '标签没有闭合!');
              }
              // 指针移动tag名长度加'</>'的长度
              index += tag.length + 3
          } else if (wordReg.test(rest)) {
              // 匹配到标签中间的文字
              let word = rest.match(wordReg)[1];
              // 看获取到的文字是否全部为空
              if(!/^\s+$/.test(word)) {
                  // 不全是空
                  // 将文字放到stack2栈顶的数组children中
                  console.log(stack2)
                  stack2[stack2.length - 1].children.push({'text': word, 'type': 3});
              }
              console.log(word);  
              index += word.length;
          } else {
              index++;
          }
        }
        return stack2[0].children[0]
    }


    var templateString = `<div>
            <h3 class="aa bb cc" data-n="7" id="mybox">你好</h3>
            <ul>
                <li>A</li>
                <li>B</li>
                <li>C</li>
            </ul>
        </div>`;

    const ast = parse(templateString);
    console.log(ast);

```
#### 解析attrs
 * 在上面的例子中我们没有解析attrStr
 * 我们需要将得到的 'class="aa bb cc" data-n="7" id="mybox"' 属性字符串解析成[{name:k, value:v}, {name:k, value:v}, {name:k,value:v}]
```
    function parseAttrsString(attrStr) {
        // 如果是undefiend，返回空数组
        if(attrStr == undefined) return [];
        // 准备一个变量，判断标记是否在引号里面
        var isInYinHao = false;
        // 断点
        var point = 0;
        // 结果数组
        var result = [];

        // 遍历attrStr
        for (let i = 0; i < attrStr.length; i++) {
            let charStr = attrStr[i];
            if(charStr == '"') {
                // 第一个 '"'表示进入引号（在引号里面），再次碰到'"'表示出了引号
                isInYinHao = !isInYinHao;
            } else if (charStr == " " && !isInYinHao) {
                // 不在引号里面的空格，可以用来分割属性
                if(!/^\s*$/.test(attrStr.substring(point, i))) {
                    // 排除第一个为空的
                    result.push(attrStr.substring(point, i).trim());
                    // 移动断点
                    point = i;
                }
            }
        }
        // 循环之后，还剩下一个k="v"的属性
        result.push(attrStr.substring(point));

        // 到了此时数组里面是这样的：['k=v', 'k=v', 'k=v'],
        // 我们需要将它变成[{name: k, value: v}, {name: k, value: v}, {name: k, value: v},]
        result = result.map(item => {
            // 根据等号拆分
            let c = item.match(/^(.+)="(.+)"$/);
            return {
                name: c[1],
                value: c[2],
            }
        })
        console.log(result);
        return result;
    }
```
