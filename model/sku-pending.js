import { Joiner } from "../utils/joiner";
import { Cell } from "./cell"

// 记录用户选择的cell
class SkuPending {
  // 已选中的cell数组
  pending=[]
  size //完整的sku规格数 例如 颜色+图案+尺码 3个
  
  constructor(size){
    this.size =size
  }

  // 获取当前已选的规格值 values 规格值
  getCurrentSpecValues(){
    const values = this.pending.map(cell =>{
      // 判断cell是否存在 如果存在返回value 不存在返回空
        return cell?cell.spec.value:null
    })
    return values
  }

  //查找未选中的specKey在peding中的那一列
  getMissingSpecKeys(){
    const keysIndex = []
    for(let i=0;i<this.size;i++){
      // 如果为空值 保存到keysIndex中
      if(!this.pending[i]){
        keysIndex.push(i)
      }
    }
    return keysIndex
  }

  init(sku){
    // this.size = sku.specs.length
    for(let i=0;i<sku.specs.length;i++){
      const cell = new Cell(sku.specs[i]);
      this.insertCell(cell, i);
    }
  }

  // 获取sku 根据code
  getSkuCode(){
    const joiner = new Joiner('#')
    this.pending.forEach(cell =>{
      const cellCode = cell.getCellCode()
      joiner.join(cellCode)
    })
    return joiner.getStr()
  }

  /**
   * 判断用户是否已确定完整的sku
   */
  isIntact(){
    // 如果sku的长度和用户选择的不一致 表示用户未完成选择
    if(this.size !== this.pending.length){
      return false
    }
    for(let i=0;i<this.size;i++){
      if(this._isEmptyPart(i)){
        return false
      }
    }
    return true
  }

  // 判断数组元素是否为null或者为undfiend
  _isEmptyPart(index){
    return this.pending[index]?false:true
  }

  /**
   * 将用户选择的cell保存 
   * @param {*} cell 选中的cell
   * @param {*} index 数据角标
   */ 
  insertCell(cell,index){
    this.pending[index] = cell
  }

  /**
   * 将用户取消选中的cell移除
   * @param {} cell 选中的cell
   * @param {*} index 数据角标
   */
  removeCell(index){
    this.pending[index] =null
  }

  /**
   * 根据行号查找已选cell
   * @param {} row 行号
   */
  findSelectedCellByRow(row){
    return this.pending[row]
  }

  /**
   * 保证同一行的cell只有一个被选中
   * @param {*} cell 
   * @param {*} index 
   */
  isSelected(cell,index){
    // 如果当前元素是否存在
    const pendingCell = this.pending[index]
    if(!pendingCell){
      return false
    }
    return pendingCell.id === cell.id
  }
}

export{
  SkuPending
}