//将小程序内置非promise API转换为promise
// 需要success获取函数返回值的 都可以用promisic来进行二次封装

const promisic = function (func) {
  return function (params = {}) {
    return new Promise((resolve, reject) => {
      const args = Object.assign(params, {
        success: (res) => {
          resolve(res);
        },
        fail: (error) => {
          reject(error);
        }
      });
      func(args);
    });
  };
};

//  组合算法函数
const combination = function (arr, size) {
  var r = []; 

  function _(t, a, n) { 
      if (n === 0) {
          r[r.length] = t;
          return;
      }
      for (var i = 0, l = a.length - n; i <= l; i++) {
          var b = t.slice();
          b.push(a[i]);
          _(b, a.slice(i + 1), n - 1);
      }
  }

  _([], arr, size);
  return r;
};

export {
  promisic,
  combination
}