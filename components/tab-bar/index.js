// components/tab-bar/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    cartItemCount:Number
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    //响应点击事件
    onGoToHome(event){
      this.triggerEvent('gohome',{
      })
    },
    //响应点击事件
    onGoToCart(event){
      this.triggerEvent('gocart',{
      })
    },
    //响应点击事件
    onAddToCart(event){
      this.triggerEvent('addtocart',{
      })
    },
    //响应点击事件
    onBuy(event){
      this.triggerEvent('buy',{
        
      })
    }
  }
})
