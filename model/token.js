import {config} from "../config/config";
import {promisic} from "../utils/util";

class Token {

  constructor() {
    this.tokenUrl = config.baseUrl + "/token"
    this.verifyUrl = config.baseUrl + "/token/verify"
}


  // 验证token是否存在
  async verify(){
    const token = wx.getStorageSync('token')
    // 如果token不存在则重新登录
    if(!token){
      await this.getTokenFromServer()
    }else{
      // 验证token是否过期
      await this._verifyFromServer(token)
    }
  }

  // 使用用户code换取令牌
  async getTokenFromServer(){
    // 获取用户code
    const r = await wx.login()
    const code = r.code

    // 换取服务器token令牌
    const res = await promisic(wx.request)({
        url: this.tokenUrl,
        method: 'POST',
        data: {
            account: code,
            type: 0
        },
    })
    console.log(res)
    // 写入缓存
    wx.setStorageSync('token', res.data.token)
    return res.data.token
  }

  // 验证token是否有效 
  async _verifyFromServer(token){
    const res = await promisic(wx.request)({
      url: this.verifyUrl,
      method: 'POST',
      data: {
          token
      }
    })

    const valid = res.data.is_valid
    // 如果验证不通过 则重新获取token
    if (!valid) {
        return this.getTokenFromServer()
    }
  }
}

export{
  Token
}