// pages/about/about.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items:[
      {"name":"康东伟   赵佳旺","title":"作者"},
      {"name":"袁依群","title":"设计"},
      {"name":"LinUI   袁依群","title":"致谢"}
    ],
    list:[
      {"title":"小程序开源地址","url":"https://github.com/admins-2017/wechat-shop"},
      {"title":"后台系统开源地址","url":"https://github.com/admins-2017/springboot-shop"},
    ]
  }, 

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  copy(event){
    wx.setClipboardData({
      data: event.currentTarget.dataset.url,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: '复制成功'
            })
          }
        })
      }
    })
  },

  /**
   * 将公众号二维码进行保存
   * @param {*}} e 
   */
  saveQrcode(e){
    console.log(e)
    wx.showModal({
      title: '提示',
      content: '确定要保存这张图片吗？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.getImageInfo({
            src: '/imgs/qrcode.jpg',
            success: function (res) {
              console.log(res);
              var path = res.path;
              wx.saveImageToPhotosAlbum({
                filePath: path,
                success: function (res) {
                  console.log('图片已保存');
                },
                fail: function (res) {
                  console.log('保存失败');
                }
              })
            }
          });
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }
})