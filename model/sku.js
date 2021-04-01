import {Http} from '../utils/http'
class Sku {
  static async getSkuByIds(ids){
    const res = await Http.request({
      url:`/sku?ids=${ids}`
    })
    return res
  }
}

export{
  Sku
}