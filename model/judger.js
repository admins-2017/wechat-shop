import { CellStatus } from "../core/enum";
import { Joiner } from "../utils/joiner";
/**处理sku的控制类 用来生成规格路径及处理 */ 
import { SkuCode } from "./sku-code";
import { SkuPending } from "./sku-pending";


class Judger{

  fenceGroup;
  pathDist=[]; //用于存放当前商品的所有sku的路径
  skuPending //用于保存用户已选cell

  constructor(fenceGroup){
    this.fenceGroup = fenceGroup
    this._initPathDict()
    this._initPending()
  }

  // 初始化路径字典
  _initPathDict(){
    // 获取每个sku
    this.fenceGroup.spu.sku_list.forEach( sku =>{
      // 获取sku code并对存在路径做处理
      const skuCode = new SkuCode(sku.code);
      // 将当前sku的所有路径合并到pathDist中
     this.pathDist = this.pathDist.concat(skuCode.allSegments)
    })
  }

  /**
   * 初始化SkuPending
   */
  _initPending(){
    this.skuPending = new SkuPending(this.fenceGroup.fences.length);
    // 获取默认的sku
    const defaultSku = this.fenceGroup.getDefaultSku();
    if(!defaultSku){
      return
    }
    this.skuPending.init(defaultSku);
    this._initDefaultSelectedCell();
    this.judge(null,null,null,true);
  }

  // 获取确定的sku
  getDeterminateSku(){
    const code = this.skuPending.getSkuCode()
    const sku = this.fenceGroup.getSku(code)
    return sku
  }

  // 用于确定用户是否已选中完整的sku
  isSkuIntact(){
    return this.skuPending.isIntact()
  }
  // 获取选中的规格值
  getCurrentValues(){
    return this.skuPending.getCurrentSpecValues()
  }

  // 获取missKeys 获取未选中的fence
  getMissingKeys(){
    const missingKeysIndex = this.skuPending.getMissingSpecKeys();
    return missingKeysIndex.map(i=>{
      return this.fenceGroup.fences[i].title
    })
  }

  /**
   * 初始化默认的sku
   */
  _initDefaultSelectedCell(){
    this.skuPending.pending.forEach(cell => {
      this.fenceGroup.updateCellStatusById(cell.id,CellStatus.SELECTED)
    });
  }

  /**
   * 寻找所有的sku路径 并且判断是否存在
   * @param {*} cell cell
   * @param {*} row 行号
   * @param {*} clo 列号
   * @param {*} inInit 是否为初始化
   */
  judge(cell , row ,clo ,inInit=false){
    // 如果不是初始化就执行
    if(!inInit){
      this._changeCurrentCellStatus(cell,row,clo)
    }
    
    // 调用fenceGroup的eachCell回调函数
    this.fenceGroup.eachCell((cell,x,y)=>{
       const path = this._findPotentialPath(cell,x,y)
      //  如果path不存在 为空
       if(!path){
        return
       }
       const isIn = this._isInDict(path)
      //  如果潜在路径在路径字典中存在
       if(isIn){
        this.fenceGroup.updateCellStatusByRowAndClo(x,y,CellStatus.WAITING)

       }else {
      this.fenceGroup.updateCellStatusByRowAndClo(x,y,CellStatus.FORBIDDEN)

       }
    })
    
  }

  /**
   * 判断潜在路径是否在路径字典中
   * @param {} path 潜在路径
   */
  _isInDict(path){
    return this.pathDist.includes(path)
  }

  /**
   * 查找cell的潜在路径
   * 潜在路径的匹配规则 当前行的cell和其他行已选中的cell组合
   * @param {*} cell 用户选中的cell
   * @param {*} row 行号
   * @param {*} clo 列号
   */
  _findPotentialPath(cell , row ,clo){
    const joiner = new Joiner('#');
    for(let i =0;i<this.fenceGroup.fences.length;i++){
      const selected = this.skuPending.findSelectedCellByRow(i)
      // 确认是否为当前行
      if(row === i){
        // 判断当前cell是否为选中 选中则跳过
        if(this.skuPending.isSelected(cell,row)){
          return
        }
        // 如果为当前行就将cell的id组合加入到潜在路径中
        const cellCode = this._getCellCode(cell.spec)
        joiner.join(cellCode)
      }
      else{
        // 判断其他行是否有已选元素
        if(selected){
          // 将id组合加入潜在路径
          const selectedCellCode = this._getCellCode(selected.spec)
          joiner.join(selectedCellCode)

        }
      }
    }
    // 将潜在路径返回
    return joiner.getStr();
  }

  _getCellCode(spec){
    return spec.key_id+'-'+spec.value_id
  }

  // 改变当前获取的cell状态为选中
  _changeCurrentCellStatus(cell, row ,clo){
    // 判断当前cell状态是选中还是可选
    if(cell.status === CellStatus.WAITING){
      // cell.status= CellStatus.SELECTED
      // 为cell更改状态
      this.fenceGroup.updateCellStatusByRowAndClo(row,clo,CellStatus.SELECTED)
      // 将cell添加到pending中
      this.skuPending.insertCell(cell,row)
    }
    if(cell.status === CellStatus.SELECTED){
      // cell.status = CellStatus.WAITING
      this.fenceGroup.updateCellStatusByRowAndClo(row,clo,CellStatus.WAITING)
      // 将cell移除pending中
      this.skuPending.removeCell(row)

    }
  }
}

export {
  Judger
}