/** 获取小程序相关的属性 及用户手机屏幕属性 */
import {promisic} from "./util"

const getSystemSize= async function(){

  const res =await promisic(wx.getSystemInfo)()
  return {
    windowHeight:res.windowHeight,
    windowWidth:res.windowWidth
  }
} 

export{
  getSystemSize
}