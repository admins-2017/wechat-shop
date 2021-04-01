import {Http} from '../utils/http'
class Tag{
  static async getSearchTags(){
    return await Http.request({
      url: `/tag/type/1`
    })
  }
}

export{
  Tag
}