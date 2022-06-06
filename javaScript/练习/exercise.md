### 1. 两数之和
给定一个整数数组 nums 和一个整数目标值 target，请你在该数组中找出 和为目标值 target  的那 两个 整数，并返回它们的数组下标。

你可以假设每种输入只会对应一个答案。但是，数组中同一个元素在答案里不能重复出现。

你可以按任意顺序返回答案。

 

示例 1：

输入：nums = [2,7,11,15], target = 9
输出：[0,1]
解释：因为 nums[0] + nums[1] == 9 ，返回 [0, 1] 

 * 暴力解法
```
const sum = function (nums, target) {
    const len = nums.length;
    
    for (let i = 0; i < len - 1; i++) {
        for (let j = i + 1; j < len; j++) {
            if(nums[i] + nums[j] === target) {
                return [i, j];
            }
        }
    }
} 
```
 * 哈希表
```
const sum = function (nums, target) {
    const len = nums.length;
    var map = new Map();
    for (let i = 0; i < len; i++) {
        const needNum = target - nums[i];
        if(map.has(needNum)) {
            return [i, map.get(needNum)];
        }
        map.set(nums[i], i);
    }
}
```
