var twoSum = function (nums, target) {
    for (let i = 0; i < nums.length; i++) {
        for (let j = i + 1; j < nums.length; j++) {
            if (nums[i] + nums[j] === target) {
                return [i, j];
            }
        }
    }
};


/**
 * @param {number[]} nums
 * @return {number}
 */
var pivotIndex = function (nums) {
    let totalSum = nums.reduce((a, b) => a + b, 0);
    let leftSum = 0;
    for (let i = 0; i < nums.length; i++) {
        let rightSum = totalSum - leftSum - nums[i];
        if (rightSum == leftSum) {
            return i;
        }
        leftSum += nums[i];
    }
    return -1;
};
console.log(pivotIndex([1, 7, 3, 6, 5, 6]));
console.log(pivotIndex([1, 2, 3]));
console.log(pivotIndex([2, 1, -1]));


/**
 * @param {string[]} strs
 * @return {string}
 */
var longestCommonPrefix = function (strs) {
    let firstWord = strs[0];
    for (let i = 1; i < strs.length; i++) {
        while (strs[i].indexOf(firstWord) !== 0) {
            firstWord = firstWord.slice(0, -1);
            if (firstWord == "") return "";
        }
    }
    return firstWord;
};
console.log(longestCommonPrefix(["flowers", "flow", "flute"]));


/**
 * @param {string} s
 * @return {number}
 */
var firstUniqChar = function (s) {
    let char = {};
    for (let i of s) {
        char[i] = (char[i] || 0) + 1;
    }
    for (let i = 0; i < s.length; i++) {
        if (char[s[i]] == 1) {
            return i;
        }
    }
    return -1;
};
console.log(firstUniqChar("harsha"));
console.log(firstUniqChar("vardhan"));
console.log(firstUniqChar("reddy"));
console.log(firstUniqChar("aravind"));


/**
 * @param {number[]} nums
 * @return {void} Do not return anything, modify nums in-place instead.
 */
var moveZeroes = function (nums) {
    let j = 0;
    for (let i = 0; i < nums.length; i++) {
        if (nums[i] !== 0) {
            [nums[i], nums[j]] = [nums[j], nums[i]];
            j++;
        }
    }
    return nums;
};

console.log(moveZeroes[12, 0, 23, 11, 0, 1]);




/**
 * @param {number[]} nums
 * @param {number} k
 * @return {void} Do not return anything, modify nums in-place instead.
 */
var rotate = function (nums, k) {
    let n = nums.length;
    k = k % n;

    reverse(nums, 0, n - 1);
    reverse(nums, 0, k - 1);
    reverse(nums, k, n - 1);
};

function reverse(arr, left, right) {
    while (left < right) {
        [arr[left], arr[right]] = [arr[right], arr[left]];
        left++;
        right--;
    }
}


/**
 * @param {number[]} nums
 * @return {number}
 */
var maxSubArray = function (nums) {
    let maxSum = nums[0];
    let curSum = nums[0];
    for (let i = 1; i < nums.length; i++) {
        curSum = Math.max(nums[i], nums[i] + curSum);
        maxSum = Math.max(curSum, maxSum);
    }
    return maxSum;
};
console.log(maxSubArray([5, 4, -1, 3, 42, 12, 34]));


/**
 * @param {string} s
 * @param {string} t
 * @return {boolean}
 */
var isAnagram = function (s, t) {
    if (s.length !== t.length) {
        return false;
    }
    let freq = {};
    for (let ch of s) {
        freq[ch] = (freq[ch] || 0) + 1;
    }
    for (let ch of t) {
        if (!freq[ch]) return false;
        freq[ch]--;
    }
    return true;
};


/**
 * @param {string} s
 * @return {string}
 */
var reverseWords = function (s) {
    return s.trim().split(/\s+/).reverse().join(' ');
};
console.log(reverseWords(" the sky is blue "));




/**
 * @param {string} s
 * @return {boolean}
 */
var isPalindrome = function (s) {
    let onlychars = s.toLowerCase().replace(/[^a-z0-9]/g, "");
    let rev = onlychars.split("").reverse().join("");
    return rev === onlychars;
};

