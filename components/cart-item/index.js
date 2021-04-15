import { Cart } from '../../model/cart';
import {parseSpecValue} from '../../utils/sku'

const cart = new Cart()

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item:Object
  },

  /**
   * 组件的初始数据
   */
  data: {
    online:Boolean,
    specStr:String,
    soldOut:Boolean,
    discount:Boolean,
    stock: Cart.SKU_MAX_COUNT,
    skuCount:1
  },

  observers:{
    'item':function(item){
      if(!item){
        return 
      }
      const specStr = parseSpecValue(item.sku.specs);
      const discount = item.sku.discount_price? true:false;
      const online = Cart.isOnline(item);
      const soldOut = Cart.isSoldOut(item);
      this.setData({
        specStr,
        discount,
        online,
        soldOut,
        stock:item.sku.stock,
        skuCount:item.count
      })
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onOurNumber(event){

    },

    // 监听数量改变的事件
    onSelectCount(event){
      let newCount = event.detail.count
      cart.replaceItemCount(this.properties.item.skuId,newCount)
      // 抛出事件
      this.triggerEvent('countfloat',{

      })
    },
    onDelete(event){
      const skuId = this.properties.item.sku.id
      const cart = new Cart()
      cart.removeItem(skuId)
      this.setData({
        item: null
      })
      this.triggerEvent('deleteitem',{
        skuId
      })
    },

    // 修改checkbox状态
    checkItem(event){
      // 获取修改后的状态
      const checked = event.detail.checked
      // 将缓存中的item状态改变
      cart.checkItem(this.properties.item.skuId)
      // 将组件内的状态改变
      this.properties.item.checked = checked
      // 返回上级
      this.triggerEvent('itemcheck',{

      })
    }
  }
})
