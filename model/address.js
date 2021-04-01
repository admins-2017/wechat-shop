
// 地址实体类
class Address {
  // key name
  static STORAGE_KEY = 'address'
  // 获取缓存中的用户地址
  static getLoacl(){
    const address = wx.getStorageSync(Address.STORAGE_KEY)
    return address?address:null
  }

  // 将用户地址存入缓存
  static setLoacl(address){
    wx.setStorageSync(Address.STORAGE_KEY, address)
  }
}

export{
  Address
}