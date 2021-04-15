import { Paging } from "../utils/paging"


class SpuPaging {
  static async nextPaging(){
    return new Paging({
      url:"/spu/latest"
    },0,10)
  }

  static async nextPagingByCategory(categoryId,isRoot){
    return new Paging({
      url:`/spu/by/category/${categoryId}?is_root=${isRoot}`,
    },0,10)
  }
}

export {
  SpuPaging
}