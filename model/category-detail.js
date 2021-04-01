import { Http } from "../utils/http"

class CategoryDetail{
  roots= [] //保存一级分类
  subs = [] //保存二级分类
  async getAll(){
    const data = await Http.request({
      url:`/category/all`
    })
    this.roots = data.roots
    this.subs = data.subs
  }

  getRoots(){
    return this.roots;
  }

  // 根据父级分类id 获取2级分类
  getSubs(parentId){
    return this.subs.filter(sub=>sub.parent_id == parentId)
  }

  getRoot(rootId){
    return this.roots.find(r=>r.id == rootId)
  }
}

export {
  CategoryDetail
}
