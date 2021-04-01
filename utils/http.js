//封装wx.request请求
import { config } from '../config/config'
import { promisic } from '../utils/util'

class Http {
    // 使用async修饰的函数 表示最后一定返回一个promisic
    static async request({ url, data, method = 'GET' }) {
      //将await的结果return出去
      //处理返回结果    
      const res = await promisic(wx.request)({
            // 拼接请求地址
            url: `${config.baseUrl}${url}`,
            data: data,
            header: {
                'appkey': config.appkey // 默认值
            }
            // 使用promisic封装的原生Api不在需要success来获取返回值
            // success(res) {
            //     callback(res.data)
            // }
        })
        // 返回处理后的结果
        return res.data
    }
}

// // 将小程序原生的wx.requestAPI(函数) 传入到promisic函数中
// promisic(wx.request)({
//     // 大括号内 传递参数 小程序原生API需要什么参数就传什么

// })

export {
    Http
}