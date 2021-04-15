/** 商品对象 */
import {Http} from '../utils/http'

class Spu {

  // 判断spu是否是无规格的
  static inNoSpec(spu){
    if(spu.sku_list.length===1 && spu.sku_list[0].specs.length=== 0){
      return true
    }
    return false
  }
  static getDetail(spuId){
    return Http.request({
      url: `/spu/id/${spuId}/detail`
    })
  }

  static async getRecommendSpu(){
    return await Http.request({
      url:"/spu/latest"
    }) 
  }

  static async getSpuListByCategory(categoryId,isRoot){
    return await Http.request({
      url: `/spu/by/category/${categoryId}`,
      data:{
        'is_root':isRoot
      }
    })
  }
}

export {
  Spu
}