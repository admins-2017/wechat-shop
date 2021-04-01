import { HistoryKeyWord } from "../../model/history-keyword"
import { Tag } from "../../model/tag"
import { Search } from "../../model/search"
import { showToast } from "../../utils/ui"

const history = new HistoryKeyWord
Page({

  /**
   * 页面的初始数据
   */
  data: {
    historyTags:Array,
    hotTags:Array,
    bottomLoading:true,
    loadingType:null,
    paging:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:async function (options) {
    const historyTags = history.get()
    const hotTags = await Tag.getSearchTags()
    this.setData({
      historyTags,
      hotTags
    })
  },

  onDeleteHistory(event){
    history.clear()
    this.setData({
      historyTags:[]
    })
  },

  // 绑定input框用户输入
  async onSearch(event){
    this.setData({
      search:true,
      items:[]
    })
    // 获取用户输入的商品名 
    // 如果用户输入的存在 keyWord就等于用户输入的 
    // 如果是点击标签进行查询 keyWord等于tag的name
    const keyWord = event.detail.value || event.detail.name
    // 判断用户输入是否为空
    if(!keyWord){
      showToast('请输入关键字')
      return
    }
    history.save(keyWord)
    this.setData({
      historyTags:history.get()
    })
    this.data.paging = Search.search(keyWord)
    // 在页面中添加loading标签 打开loading
    wx.lin.showLoading({
      color:"#157658",
      type:"flash",
      fullScreen:true
    })
    const data = await this.data.paging.getMoreData()
    if(!data){
      return
    }
    // 数据加载完成 关闭loading
    wx.lin.hideLoading()
    this.bindItems(data)
    if(!data.moreData){
      this.setData({
        loadingType: 'end'
      })
    }
  },

  bindItems(data){
    if(data.allItems.length !== 0){
      this.setData({
        items:data.allItems
      })
    }
  },

  onCancel(event){
    this.setData({
      search:false
    })
  },
  // 触底事件
  onReachBottom:async function () {
    const data = await this.data.paging.getMoreData()
    // 判断data是否存在
    if(!data){
      return
    }
    this.bindItems(data)
    // // 如果没有下一页数据  则将页底的加载中改为没有更多
    if(!data.moreData){
      this.setData({
        loadingType: 'end'
      })
    }
  }
})