/** 商品规格具体的每一栏的对象 */

import { Cell } from "./cell";

class Fence {
  // 单元格对象集合
  cells= [];
  specs ;
  title; //规格名
  id; //规格id

  constructor(specs){
    this.specs = specs
    this.title =specs[0].key
    this.id =specs[0].key_id
  }

  // 初始化
  init(){
    this._initCells();
  }

  // 初始化cell
  _initCells(){
    // 将数据保存到单元格对象中 
    this.specs.forEach(s=>{
      // 判断cells数组中是否已经有了相同的cell 
      // some遍历 只要符合下面的表达式就返回结果
      const isExit= this.cells.some( cell => {
        // 判断是否有相同的id 返回true 或 false
        return cell.id === s.value_id
      })
      if(isExit){
        return
      }
      const cell = new Cell(s)
      this.cells.push(cell)
    })
  }

  // pushValueTitle(title){
  //   // 将矩阵中的每一个元素（同一列的元素）追加到同一数组(同一栏)中 
  //   this.valueTile.push(title)
  // }

  // 遍历存在可视规格的fence 下的cell
  setFenceSketch(skuList){
    this.cells.forEach(cell => {
      this._setCellSkuImg(cell,skuList)
    })
  }

  // 将可视化规格的fence下的cell img保存
  _setCellSkuImg(cell,skuList){
    const specCode = cell.getCellCode()
    // 判断是否包含可视规格的code
    const matchedSku = skuList.find(s=>s.code.includes(specCode))
    if(matchedSku){
      cell.skuImg = matchedSku.img
    }
  }

}

export {
  Fence
}
