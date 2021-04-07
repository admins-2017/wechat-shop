const { Address } = require("../../model/address")

// components/address/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },
  // lifetimes 组件的生命周期
  // attached 在组件实例进入页面节点树时执行
  lifetimes:{
    attached(){
      // 从缓存中获取用户地址
      const address = Address.getLoacl()
      // 判断缓存中是否有地址 如果有就绑定地址
      if (address) {
        this.setData({
            address,
            hasChosen: true
        })
        this.triggerEvent('address', {
            address
        })
    }

    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    address:Object,
    hasChosen:false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onChooseAddress(event){
      this.getUserAddress()
    },
    // 获取用户地址
    async getUserAddress(){
      // 调用小程序原生api获取用户地址
      let res
      try{
        res = await wx.chooseAddress({})

      }catch(e){
        console.error(e)
      }
      console.log(res)
      // 判断用户是否拒绝获取地址 如果选择了地址则绑定变量
      if(res){
        this.setData({
          address:res,
          hasChosen:true
        })
        Address.setLoacl(res)
        this.triggerEvent('address', {
          address: res
        })
      }
    }
  }
})
