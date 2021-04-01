/** 用于提示用户 */
const showToast = function (title){
  wx.showToast({
    icon:"none",
    duration:2000,
    title
  })
}

export{
  showToast
}