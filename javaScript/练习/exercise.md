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
### 2. 无重复字符的最长子串
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
