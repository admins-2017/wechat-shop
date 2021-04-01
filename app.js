const { Cart } = require("./model/cart")

// app.js
App({
  onLaunch() {
    // 实例化购物车
    const cart = new Cart()
    // 判断购物车是否为空
    if(!cart.isEmpty()){
      // 如果不为空就将tabbar的第三个元素设置红点
      wx.showTabBarRedDot({
        index: 2,
      })
    }
  },
  globalData: {
    userInfo: null
  }
})
