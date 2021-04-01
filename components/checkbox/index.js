// components/checkbox/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    checked:Boolean
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
    onCheck(event){
      console.log('执行oncheck')
      // 获取状态
      let checked = this.properties.checked
      // 对状态进行取反并重新赋值
      checked = !checked
      this.setData({
        checked
      })
      // 向上传递修改后的状态
      this.triggerEvent('check',{
        checked
      },{bubbles:true,composed:true})
    }
  }
})
