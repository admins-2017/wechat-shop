/** sku code解析器 */

import { combination } from "../utils/util";

class SkuCode{
  code;
  spuId;
  allSegments=[]; //用于存放当前sku的所有路径
  constructor(code){
    this.code = code
    this._splitToSegments()
  }

  /** 拆分code */
  _splitToSegments(){
    // 将code中spuid和sku拆分 codeid 示例 2$1-44#3-9#4-14
    const spuAndspec = this.code.split('$');
    this.spuId= spuAndspec[0]
    // 拆分sku
    const specCodeArray = spuAndspec[1].split('#');
    const length = specCodeArray.length;

    // 使用combination进行组合 参数：specCodeArray 需要组合的数组，i组合次数
    for(let i = 1 ; i <= length ; i++){
      const segment = combination(specCodeArray,i)
      //创建新的数组来保存处理后的数组 例 ["1-45", "3-9"] 处理后 "1-45#3-9"
      const newSegments = segment.map(segs => {
        return segs.join('#')
      })
      // 将处理后的skucode数组合并到allSegments中
      this.allSegments = this.allSegments.concat(newSegments)
    }

  }
}

export {
  SkuCode
}