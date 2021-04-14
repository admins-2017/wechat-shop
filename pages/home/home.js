// pages/home/home.js
import { Theme } from "../../model/theme";
import { Banner } from "../../model/banner";
import { Category } from "../../model/category";
import { Activity } from "../../model/activity";
import { SpuPaging } from "../../model/spu-paging";
import {CouponCenterType} from "../../core/enum";


Page({
  /**
   * 页面的初始数据
   */
  data: {
    locationA: "",
    bannerList: [],
    grids: [],
    activity: null,
    locationE:null,
    locationESup:[],
    loactionF:null,
    locationG:null,
    spuPading:null, //用于保存spuPading对象
    loadingType: 'loading'
  },

  onLoad: async function (options) {
    this.initAllData();
    this.initHomeBottomSpuList();
  },

  
  async initHomeBottomSpuList(){
    // 获取paging对象
    this.data.spuPading = await SpuPaging.nextPaging();
    // 获取分页数据
    const data = await this.data.spuPading.getMoreData();
    // 如果data不存在直接返回 
    if(!data){
      return 
    } 
    // 使用lin-ui提供的函数传递数据
    // 参数一： 传递data 数据的数组
    //参数二 ：refresh 是否刷新数据（删除之前累加的数据，重新渲染)
    // 瀑布流会自动累加数据 不需要手动累加 
    wx.lin.renderWaterFlow(data.items)
  },

  async initAllData() {
    // 实例化Theme对象
    const theme = new Theme();
    // 调用获取全部的函数 并将数据赋值到属性themes中
    await theme.getThemes();
    // 执行方法获取过滤后的数据
    const locationA = await theme.getHomeLocationTopImage();
    // 执行方法获取过滤后的数据
    const locationE = await theme.getHomeLocationE();
    // home页展现的部分商品信息
    let locationESup= [];
    // 判断主题是否为上架状态
    // 只有在上架状态才查询主题详情 节省http请求次数
    if(locationE.online){
      const data = await theme.getHomeLocationESpu();
      // 判断结果是否存在
      if(data){
        // 截取数组 从0开始 截取6个
        locationESup = data.spu_list.slice(0,8)
      }
    }
    const loactionF = await theme.getHomeLocationF();
    const bannerList = await Banner.getHomeLocationTopBanner();
    const grids = await Category.getGridByHome();
    const activity = await Activity.getActivityEntranceImg();
    const locationG = await Banner.getHomeLocationGBanner();
    const locationH = await theme.getHomeLocationH();

    this.setData({
      locationA,
      bannerList,
      grids,
      activity,
      locationE,
      locationESup,
      loactionF,
      locationG,
      locationH,
    });
  },

  // 跳转到优惠券页面
  onGoToCoupons(event) {
    const name = event.currentTarget.dataset.aname
    wx.navigateTo({
        url: `/pages/coupon/coupon?name=${name}&type=${CouponCenterType.ACTIVITY}`
    })
  },


  // 触底事件
  onReachBottom:async function () {
    const data = await this.data.spuPading.getMoreData()
    // 判断data是否存在
    if(!data){
      return
    }
    wx.lin.renderWaterFlow(data.items)
    // 如果没有下一页数据  则将页底的加载中改为没有更多
    if(!data.moreData){
      this.setData({
        loadingType: 'end'
      })
    }
  },

  openTheme(event){
    const themeName = event.currentTarget.dataset.theme.name
    wx.reLaunch({
      url: `/pages/themes/themes?name=${themeName}`
    })
  },

  goThemeOrDetail(event){
    const item = event.currentTarget.dataset.item
    console.log(item)
    const keyword = item.keyword
    if(item.type == 3){
      wx.reLaunch({
        url: `/pages/themes/themes?name=${keyword}`
      })
    }else{
      wx.navigateTo({
        url: `/pages/detail/detail?spuId=${keyword}`
      })
    }
    
  }

});

/** 
 * 抽象节点 相当于抽象类
 * 抽象节点提供给部分固定的样式，而不固定的内容(节点)交给调用者来确定使用什么自定义组件
 * 抽象节点相当于占位符(插槽) 组件知道这里需要放自定义组件 但是不知道具体组件
 */