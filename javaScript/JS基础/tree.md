```
// 这种方式得思想就是利用map数据结构，可以不用嵌套遍历，从而减小圈复杂度
const listToTree = function listToTree(data) {
    // 把data变成map数据结构
    let map = new Map(),
        result = []; //用来存储返回值
    data.forEach(e => {
        map.set(e.id, e); // map数据用set设置值，用get取值
    });

    // 迭代数组中得每一项，根据parentId做处理
    data.forEach(e => {
        let { parentId } = e,
        parent;
        // 如果parentId为null表示为第一层
        if(parentId === null) {
            result.push(e);
        }
        // parentId不是null，我们可以根据parentId找到parent,然后将该项作为children加入到parent中
        // 如果parent不存在children,我们为其添加children属性
        parent = map.get(parentId);
        parent.children ? parent.children.push(e) : parent.children = [e];
    })
    return result;
}
```