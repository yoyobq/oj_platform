/*
 * mjson，m代表manange，或者my
 * 因为在交换数据时需要处理各种json字符串或obj的情况越来越多
 * 因此添加了这个私有的json api
 * code by alex @2018
*/

// f: JSONobj遍历，用于测试api可用性
const f = (jsonObj) => {
  for (let index in jsonObj) {
    console.log(index)
  }
}

// 合并json代码，时间长远懒得看，先弃用
// computePermission (permission) {
//   permission = JSON.parse(permission)
//   // console.log(permission)
//   let result = permission[0]
//   for (let i = 1; i < permission.length; i++) {
//     result = {...result, ...permission[i]}
//   }
//   // console.log(typeof result)
//   return JSON.stringify(result)
// }

// _.map()
// 将数组或对象中的所有项转换为项的新数组。
// Underscore/Lodash
// ES6 已有 map
/*
var array1 = [1, 2, 3]
var array2 = _.map(array1, function (value, index) {
  return value * 2
})
console.log(array2)
// output: [2, 4, 6]

// Native
var array1 = [1, 2, 3]
var array2 = array1.map(function (value, index) {
  return value * 2
})
console.log(array2)
// output: [2, 4, 6]
*/

// 计算数组中特定值出现的次数
const countOccurences = (arr, value) => arr.reduce((a, v) => v === value ? a + 1 : a + 0, 0)

// export {
//   mergeObjArr
// }
export default {
  f: function (jsonObj) {
    return f(jsonObj)
  },
  // mergeArr: function (arr1, arr2) {
  //   return mergeArr(arr1, arr2)
  // }
  countOccurences: function (arr, value) {
    if (arr === null) {
      arr = [10, 0, 0, 0, 0, 20]
    }
    return countOccurences(arr, value)
  }
}
