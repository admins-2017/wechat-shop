/**
 * ---分页对象---
 * 分页需要考虑的因素
 * 1.考虑数据是否为空
 * 2.考虑当前是否是最后一页
 * 3.获取的数据需要累加到数据的集合中，累加原因setData回清空上一次分页数据再次渲染新数据
 * 4.分页是的状态
 * 5.上滑触底后发送请求，要控制用户重复滑动 （数据锁）
 * 6.分页的页码和条数，页码要累加
 */

const { Http } = require("./http");

class Paging {
  //请求对象
  req; 
  //开启位置
  start; 
  //条数
  count; 
  locker= false;
  // 获取用户每次提交的原始url 防止参数重复拼接
  url ;
  moreData=true;
  //累加的结果集
  allItems = [];

  /**
   * 初始化构造器
   * 类的constructor 为构造器函数
   * req 请求对象
   * 
   */
  constructor(req, start = 0, count = 10) {
    this.req = req;
    this.start = start;
    this.count = count;
    this.url = req.url;
  }

  /**
   * 获取下一页数据
   */
  async getMoreData() {
    // 判断是否还有数据 如果没有数据则直接返回
    if(!this.moreData){
      return 
    }
    // 获取锁 并判断锁的状态
    if(!this._getLocker()){
      return ;
    }
    const data = await this._getData();
    this._releaseLocker();
    return data;
  }

  /**
   * 发送请求获取数据
   * empty 表示请求数据为空 没有一条数据
   * items 表示当前请求返回的结果集（当前分页请求的数据）
   * moreData 表示当前页是否为最后一页
   * allItems 表示数据累计的结果集，每次请求的结果(历史请求)累加的数据集，每次分页请求累加的数据 
   */
  async _getData(){
    // 获取封装后的请求对象
    const req = this._getCurrentReq();
    // 发送请求并获取
    let paging = await Http.request(req);
    // 如果paging对象不存在 则说明请求出了问题 直接返回空
    if(!paging){
      return null
    }
    // 如果paging.total等于0 表示当前分页没有数据
    if(paging.total === 0){
      return {
        empty:true ,
        items:[],
        moreData: false,
        allItems:[]
      }
    }
    // 判断当前页是否为最后一页 total_page总页数 page当前页
    this.moreData = Paging._isLastPage(paging.total_page,paging.page)

    //不为最后一页 还有数据
    if(this.moreData){
      // 累加start 记录位置
      this.start += this.count; 
    }

    this._accumulate(paging.items);

    return {
      empty: false ,
      items: paging.items,
      moreData: this.moreData,
      allItems: this.allItems
    }
  }


  /**
   * 对每次请求的结果集进行累加
   */
  _accumulate(items){
    // 将结果集进行合并
    this.allItems = this.allItems.concat(items);
  }


  /**
   * 是否为最后一页
   * totalPage 总页数
   * pageNum 当前页
   */
  static _isLastPage(totalPage,pageNum){
    return pageNum < totalPage -1
  }

  /**
   * 获取当前的请求对象
   */
  _getCurrentReq(){
    // 获取请求路径
    let url = this.url;
    const params= `start=${this.start}&count=${this.count}`;
    // 判断url中是否已经包含参数 
    if(url.includes('?')){
      url += '&'+params;
    }else {
      url += '?' +params;
    }
    this.req.url = url;
    return this.req;
  }

  /**
   * 获取锁函数
   * 下划线表示类的私有方法
   * 返回true就是可以发送请求 false表示请求上锁
   */
  _getLocker(){
    
    /**
     * 如果locker等于true
     * 表示请求是被上锁状态(请求正在进行) 不能重复请求 
     * 如果locker等于false
     * 表示请求未上锁可以发送请求，对请求上锁并返回
     */ 
    if(this.locker){
      return false
    }
    this.locker= true;
    return true

  } 

  /**
   * 释放锁
   */
  _releaseLocker(){
    this.locker = false
  }

}

export {
  Paging
}