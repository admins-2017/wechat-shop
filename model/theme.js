//model存放业务逻辑 封装对应模块的方法
import { Http } from '../utils/http'

//创建Theme对象
class Theme {
    static homeLoactionA = "t-1";
    static homeLoactionE = "t-2";
    static homeLoactionF = "t-3";
    static homeLoactionH = "t-4";

    // 设置Theme的属性themes 用于保存数据
    themes = [];

    async getThemes() {
        const names = `${Theme.homeLoactionA},${Theme.homeLoactionE},${Theme.homeLoactionF},${Theme.homeLoactionH}`;
        this.themes = await Http.request({
            url: "/theme/by/names",
            data: { names }
        })
    }

    // 获取首页顶部图片 callback为返回值
    // async修饰 将函数异步执行
    async getHomeLocationTopImage() {
        // 调用async修饰的函数 需要使用await进行修饰 
        //将 await返回的数据 向上层调用的函数返回数据
        // return await Http.request({
        //     url:"/theme/by/names",
        //     data: {names: 't-1'}
        // 获取从Http中的request方法返回的参数并赋值给data
        // callback: data => {
        // 获取getHomeLocationTopImage 的返回值并返回上层 
        //     callBack(data)
        // }
        // })
        // 由于Theme的getThemes获取到了所有数据并赋值给属性themes 这里就不需要重新发送请求
        // 查找themes属性中 name属性等于t-1的对象并返回
        return  this.themes.find(t => t.name === Theme.homeLoactionA)
    }

    async getHomeLocationE() {
        return this.themes.find(theme => theme.name === Theme.homeLoactionE)
    }

    async getHomeLocationF() {
        return this.themes.find(theme => theme.name === Theme.homeLoactionF)
    }

    async getHomeLocationH() {
        return this.themes.find(theme => theme.name === Theme.homeLoactionH)
    }

    async getHomeLocationESpu(){
       return this.getSpuByTheme(Theme.homeLoactionE);
    }

    // async 强制保证方法返回promisic 
    // 如果只是返回http相应结果 http返回结果本身就是promisic类型 可以去掉async
    // 如果返回结果类型不是promisic 则需要async来包装成promisic返回 否则需要callback来返回数据给上层调用者
    async getSpuByTheme(name){
        // await 等待http请求返回结果 如果后续没有操作直接返回可以不写await 
        // 然后后续方法体内需要操作http请求的结果而不是直接返回 则需要await等待响应结果
       return await Http.request({
          url: `/theme/name/${name}/with_spu`  
        })
    }
}

//导出Theme对象
export {
    Theme
}