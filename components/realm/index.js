const { Cell } = require("../../model/cell")
const { FenceGroup } = require("../../model/fence-group")
const { Judger } = require("../../model/judger")
const { Spu } = require("../../model/spu")
const { Cart } = require("../../model/cart")


// components/realm/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    spu: Object,
    previewImg:String,
    price:Number,
    discountPrice:Number,
    stock:Number,
    noSpec:Boolean,
    skuIntact:Boolean,
    orderWay:String
  },

  /**
   * 组件的初始数据
   */
  data: {
    judger:Object,
    currentCount:Cart.SKU_MIN_COUNT,
    outStock:Boolean
  },
  // 监听器  监听spu
  observers:{
    'spu':function (spu){
      // spu不存在则直接返回
      if(!spu){
        return
      }
      // 判断商品是否存在规格
      // 处理无规格的商品
      if(Spu.inNoSpec(spu)){
        this.processnospec(spu)
      }else{
        this.processHasSpec(spu)
      }
      this.triggerSpecEvent()
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 处理无规格的spu
    processnospec(spu){
      this.setData({
        noSpec:true,
      })
      this.bindSkuData(spu.sku_list[0]);
      this.setStockStatus(spu.sku_list[0].stock,this.data.currentCount)
    },
    // 处理存在规格的spu
    processHasSpec(spu){
      const fenceGroup = new FenceGroup(spu)
      fenceGroup.initFenceGroupTranspose()
      const judger = new Judger(fenceGroup)
      this.data.judger =judger
      const defaultSku = fenceGroup.getDefaultSku();
      if(defaultSku){
        this.bindSkuData(defaultSku)
        // 判断当前库存
        this.setStockStatus(defaultSku.stock,this.data.currentCount)
      }else{
        this.bingSpuData()
      }
      this.bindTipData()
      this.bindInitData(fenceGroup)
    },

    // 绑定sku数据
    bingSpuData(){
      this.setData({
        previewImg:this.properties.spu.img,
        title:this.properties.spu.title,
        price:this.properties.spu.price,
        discountPrice:this.properties.spu.discount_price,
      })
    },
    bindSkuData(sku){
      this.setData({
        previewImg:sku.img,
        title:sku.title,
        price:sku.price,
        discountPrice:sku.discount_price,
        stock:sku.stock,
      })
    },

    bindTipData(){
      this.setData({
        skuIntact: this.data.judger.isSkuIntact(),
        currentValues: this.data.judger.getCurrentValues(),
        missingKeys: this.data.judger.getMissingKeys()
      })

    },

    // 向上级组件传递数据
    triggerSpecEvent(){
      const noSpec = Spu.inNoSpec(this.properties.spu)
      if(noSpec){
        this.triggerEvent("changespec",{
          noSpec 
        })
      }else{
        this.triggerEvent("changespec",{
          noSpec:Spu.inNoSpec(this.properties.spu),
          skuIntact: this.data.judger.isSkuIntact(),
          currentValues: this.data.judger.getCurrentValues(),
          missingKeys: this.data.judger.getMissingKeys() 
        })
      }
     },

    // 数据绑定
    setStockStatus(stock,currentCount){
      this.setData({
        outStock:this.isOutOfStock(stock,currentCount)
      })
    },

    /**
     * 判断库存
     * @param {*}} stock 库存数量 
     * @param {*} currentCount 用户购买数量
     */
    isOutOfStock(stock,currentCount){
      return stock < currentCount
    },

    // 绑定初始数据
    bindInitData(fenceGroup){
      this.setData({
        fences:fenceGroup.fences,
      })
    },

    noSpec(){
      const spu = this.properties.spu 
      return Spu.inNoSpec(spu);
    },

    // 接受counter组件返回事件的值
    onSelectCount(event){
      const currentCount = event.detail.count
      this.data.currentCount = currentCount
      // 判断是否有规格
      if(this.noSpec()){
        // 无规格
        this.setStockStatus(this.getNoSpecSku().stock,currentCount);
      }else{
        if(this.data.judger.isSkuIntact()){
          // 有规格
          // 判断用户当前是否已经完整的选中了sku
          const sku = this.data.judger.getDeterminateSku()
          this.setStockStatus(sku.stock,currentCount)
        }
      }
    },

    // 处理cell组件传递的参数
    onCelltap(event){
      const data = event.detail.cell
      const row = event.detail.row;
      const clo = event.detail.clo;

      // 将数据转换成cell对象
      const cell = new Cell(data.spec)
      cell.status = data.status
      const judger =this.data.judger;
      judger.judge(cell,row,clo)
      // 判断用户是否完成规格选择
      const skuIntact = judger.isSkuIntact()
      // 如果是完整的sku
      if(skuIntact){
        const currentSku = judger.getDeterminateSku()
        this.bindSkuData(currentSku) 
        this.setStockStatus(currentSku.stock,this.data.currentCount)
      }
      // 绑定选择的规格
      this.bindTipData()
      // 重新加载矩阵
      this.bindInitData(judger.fenceGroup)
      
      this.triggerSpecEvent()

      // this.setData({
      //   // 重新加载矩阵
      //   fences:judger.fenceGroup.fences
      // })
    },

    /**
     * 添加购物车或立即购买 
     * @param {*} event 
     */
    onBuyOrCart(event){
      console.log("执行onBuyOrCart")
      //判断该商品是否存在规格   
      if(Spu.inNoSpec(this.properties.spu)){
        this.shoppingNoSpec()
      }
      else{
        this.shoppingVarious()
      }   
    },

    shoppingVarious(){
      console.log("执行shoppingVarious")
      const intact = this.data.judger.isSkuIntact();
      // 判断用户是否选中完整的sku
      if(!intact){
        // 如果未选择完整的sku
        const missKeys = this.data.judger.getMissingKeys()
        wx.showToast({
          icon: "none",
          title: `请选择:${missKeys.join(',')}`,
          duration: 3000
        })
        return 
      }
      this._triggerShoppingEvent(this.data.judger.getDeterminateSku())
    },

    shoppingNoSpec(){
      console.log("执行shoppingNoSpec")
      this._triggerShoppingEvent(this.getNoSpecSku())
    },

    getNoSpecSku(){
      return this.properties.spu.sku_list[0]
    },

    // 向父类抛出事件
    _triggerShoppingEvent(sku){
      /**
       * 向父类抛出事件
       * orderWay 方式 加入购物车或立即购买
       * spuId 商品id
       * skuId 选中规格
       * skuCount 购买数量
       */
      this.triggerEvent('shopping',{
        orderWay: this.properties.orderWay,
        spuId: this.properties.spu.id,
        sku:sku,
        skuCount:this.data.currentCount,
      })
    }
  }
})
