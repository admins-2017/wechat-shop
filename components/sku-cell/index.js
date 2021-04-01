// components/cell/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    cell:Object,
    row:Number,
    clo:Number
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
    onTap(event){
      // 自定义触发事件 triggerEvent子组件向父组件传参的方法
      /**
       * celltap：事件名称
       * 第二个参数: 传递的参数
       * 第三个参数: 自定义传递类型
       */
      this.triggerEvent('celltap',{
        cell: this.properties.cell,
        row: this.properties.row,
        clo:this.properties.clo
      }
      ,{
        // 当前组件顺序 realm -> sku-fence -> sku-cell 
        // 如果cell需要直接给realm传值 而不需要fence监听 则开启冒泡和跨越组件
        bubbles:true, //开启冒泡事件
        composed:true //开启跨越组件 向更上一次的父组件传值 
      }
      )
    }
  }
})
