import { Paging } from "../utils/paging"


class SpuPaging {
  static async nextPaging(){
    return new Paging({
      url:"/spu/latest"
    },0,10)
  }
}

export {
  SpuPaging
}