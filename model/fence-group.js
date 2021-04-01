import { Fence } from "./fence";
/** 商品规格栏组对象 */

import { Matrix } from "./matrix";

class FenceGroup{
   spu
   skuList=[]
   fences=[]
  // 构造器
  constructor(spu){
    this.spu = spu;
    this.skuList=spu.sku_list
  }

  // 获取默认的sku id
  getDefaultSku(){
    const defaultSkuId = this.spu.default_sku_id;
    // 判断是否存在default sku id
    if(!defaultSkuId){
      return
    }
    // 根据默认的skuid查找sku
    return this.skuList.find(s => s.id===defaultSkuId)
  }

  // 获取sku code
  getSku(skuCode){
    // 拼接spu id到skucode中
    const fullSkuCode = this.spu.id+"$"+skuCode
    const sku= this.spu.sku_list.find(s=>s.code === fullSkuCode)
    return sku?sku:null
  }

  // 初始化sku的矩阵(二维数组) foreach写法 
  initFenceGroupForEach(){
    const matrix = this._createMatrix(this.skuList)
    // 新建新的矩阵来保存修改后的二维数组
    const fences = []
    // 当前列号
    let currentCloNumber= -1
    // 获取矩阵的foreach方法返回的每一个元素
    // element每个元素 i 元素在矩阵的行号 j 元素在矩阵的列号
    matrix.forEach((element,i,j)=>{
      // 判断当前遍历的列号是否等于 j 
      // 如果不等于就表示开始了新一列的循环
      if(j!==currentCloNumber){
        // 如果开启新的一列 当前列号更新
          currentCloNumber = j
          // 每当开启新一列的循环则新创建一个fence对象加入到新的矩阵中
          fences[currentCloNumber] = this._createFence(element)
      }
      // 将每次遍历结果添加到新的二维数组的对应数组中
      fences[currentCloNumber].pushValueTitle(element.value)
    })
  }

  // 转置写法
  initFenceGroupTranspose(){
    const matrix = this._createMatrix(this.skuList)
    const fences = []
    // 获取新的矩阵
    const AT = matrix.transpose()
    // 矩阵遍历将specs的value属性赋值给fence 并添加到fences数组中
    AT.forEach( s => {
        const fence = new Fence(s)
        fence.init()
        // 判断当前的fence是否包含可视规格 和 当前fence是否是可视规格 
        if(this._hasSketchFence()&& this._isSketchFence(fence.id)){
          fence.setFenceSketch(this.skuList)
        }
        fences.push(fence)
    })
    this.fences =fences
  }

  // 获取所有的cell
  eachCell(cb){
    // 遍历fenceGroup中的每一个fence
    for(let i = 0 ; i < this.fences.length;i++){
      // 遍历fence下每一个cell
      for(let j = 0; j<this.fences[i].cells.length;j++){
        // 获取cell
        const cell = this.fences[i].cells[j]
        cb(cell,i,j)
      }
    }
  }

  // 实例化fence对象
  _createFence(element){
    const fence = new Fence()
    return fence
  }

  // 创建原始矩阵
  _createMatrix(skuList){
    const m = []
    // 将规格遍历 添加到新的数组中
    skuList.forEach(sku =>{ 
      m.push(sku.specs)
    })
    // 返回矩阵操作对象
    return new Matrix(m) 
  }

  updateCellStatusById(cellId,status){
    this.eachCell( (cell)=>{
      if(cell.id === cellId){
        cell.status = status
      }
    })
  }

  /**
   * 修改cell状态 根据行列号
   * @param {*} row 行号
   * @param {*} clo 列号
   * @param {*} status 状态
   */
  updateCellStatusByRowAndClo(row,clo,status){
    this.fences[row].cells[clo].status = status
  }

  /**
   * 判断是否有可视规格 */ 
  _hasSketchFence(){
    return this.spu.sketch_spec_id?true:false
  }

  /**
   * 判断是否是可视的fence
   * @param {*} fenceKeyId 规格的id
   */
  _isSketchFence(fenceId){
    return this.spu.sketch_spec_id === fenceId?true:false
  }
}

export {
  FenceGroup
}