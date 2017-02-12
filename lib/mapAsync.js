const co = require('co');

function mapAsync(arr, iteratee) {
  return co(function* () {
    const newArr = [];
    for (let index = 0; index < arr.length; index += 1) {
      newArr.push(yield iteratee(arr[index], index));
    }
    return newArr;
  });
}

module.exports = mapAsync;
