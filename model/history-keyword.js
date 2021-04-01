/**
 * 用户历史搜索实体类
 * 1.写入缓存
 * 2.控制记录数量
 * 3.重复数据不添加
 * 
 */
class HistoryKeyWord{
  static MAX_ITEM_COUNT = 20 //最多存入20条历史记录
  static KEY = "keywords"
  keywords =[]

  // 实例化 每次创建HistoryKeyWord对象都是从缓存中获取 相当于单例模式
  constructor(){
    // 单例模式写法
    // 判断每次新创建的对象是不是object类型 如果不是object 说明还没有实例化成对象
    // if(typeof HistoryKeyWord.instance === 'object'){
      // 如果相同 直接返回对象 不需要new
    //   return HistoryKeyWord.instance
    // }
    // HistoryKeyWord.instance = this
    // 每次用户重新进入小程序 则重新从缓存中取出keywords
    this.keywords = this._getLocalKeyWords()
    // 保证用户每一次new的对象都是同一个
    // return this
  }

  save(keyWord){
    // 查找当前的keywords是否有keyWord
    const items = this.keywords.filter(k=>{
      return k === keyWord
    })
    // 如果存在
    if(items.length !== 0){
      return
    }
    // 判断是否超出数组长度 如果超出数组设定长度 则新的keyword 放在数组第一个元素
    // 最后一个元素被踢出数组 （队列模式 先进先出）
    if(this.keywords.length >= HistoryKeyWord.MAX_ITEM_COUNT){
      // 将数组最后一个元素踢出数组
      this.keywords.pop()
    }
    // 将keyWord 添加到数组的第一个元素
    this.keywords.unshift(keyWord)
    this._refreshLocal()
  }

  get(){
    return this.keywords
  }

  // 清空缓存
  clear(){
    this.keywords = []
    this._refreshLocal()
  }

  // 刷新缓存
  _refreshLocal(){
    // 写入缓存
    wx.setStorageSync(HistoryKeyWord.KEY, this.keywords)
  }

  _getLocalKeyWords(){
    const keywords = wx.getStorageSync(HistoryKeyWord.KEY)
    // 判断是否有缓存 如果没有则返回空数组
    if(!keywords){
      wx.setStorageSync(HistoryKeyWord.KEY, [])
      return []
    }
    return keywords;
  }
}

export{
  HistoryKeyWord
}