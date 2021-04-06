//封装wx.request请求
import { config } from '../config/config'
import { promisic } from '../utils/util'
import { codes } from '../config/exception-config'
import { HttpException } from '../core/http-exception'



class Http {
    // 使用async修饰的函数 表示最后一定返回一个promisic
        static async request({ url, data, method = 'GET',refetch = true,throwError = false}) {
      //将await的结果return出去
      //处理返回结果
      let res
      try{
        res = await promisic(wx.request)({
            // 拼接请求地址
            url: `${config.baseUrl}${url}`,
            data: data,
            method,
            header: {
                'content-type': 'application/json',
                'appkey': config.appkey, // 默认值
                // 携带用户token
                'authorization': `Bearer ${wx.getStorageSync('token')}`
            }
            // 使用promisic封装的原生Api不在需要success来获取返回值
            // success(res) {
            //     callback(res.data)
            // }
        })
        //  捕获断网的错误 catch无法捕获服务器异常 
      } catch(e){
        if (throwError) {
            throw new HttpException(-1, codes[-1])
        }
        Http.showError(-1)
        return null
      }   
    //   获取服务器返回的状态码
      const code = res.statusCode.toString()
    //   如果code码以2开头 表示请求成功
      if (code.startsWith('2')) {
        return res.data
    } else {
        if (code === '401') {
            // 二次重发
            if (data.refetch) {
                Http._refetch({
                    url,
                    data,
                    method
                })
            }
        } else {
            if (throwError) {
                throw new HttpException(res.data.code, res.data.message, code)
            }
            if (code === '404') {
                if (res.data.code !== undefined) {
                    return null
                }
                return res.data
            }
            const error_code = res.data.code;
            Http.showError(error_code, res.data)
        }
        // 403 404 500
    }
    // 返回处理后的结果
    return res.data
    }

    // 未登录状态 重新发送请求
    static async _refetch(data) {
        const token = new Token()
        await token.getTokenFromServer()
        // 避免二次请求登录
        data.refetch = false
        return await Http.request(data)
    }

    /**
     * 将服务器返回的错误信息展示给客户
     * @param {*} error_code  服务器错误码
     * @param {*} serverError 
     */
    static showError(error_code, serverError) {
        let tip
        if (!error_code) {
            tip = codes[9999]
        } else {
            if (codes[error_code] === undefined) {
                tip = serverError.message
            } else {
                tip = codes[error_code]
            }
        }

        wx.showToast({
            icon: "none",
            title: tip,
            duration: 3000
        })
    }
   
}

// // 将小程序原生的wx.requestAPI(函数) 传入到promisic函数中
// promisic(wx.request)({
//     // 大括号内 传递参数 小程序原生API需要什么参数就传什么

// })

export {
    Http
}