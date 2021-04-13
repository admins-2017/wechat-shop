// pages/my/my.js
import {Coupon} from "../../model/coupon";
import {promisic} from "../../utils/util";
import {AuthAddress, CouponStatus} from "../../core/enum";

Page({

    /**
     * 页面的初始数据
     */
    data: {
        couponCount: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function (options) {
        // 获取当前可用的优惠券
        const coupons = await Coupon.getMyCoupons(CouponStatus.AVAILABLE)
        this.setData({
            couponCount: coupons.length
        })
    },

    onGotoMyCoupon(event) {
        wx.navigateTo({
            url: "/pages/my-coupon/my-coupon"
        })
    },

    onGotoMyOrder(event) {
        wx.navigateTo({
            url: "/pages/my-order/my-order?key=0"
        })
    },

    async onMgrAddress(event) {
        const authStatus = await this.hasAuthorizedAddress()
        // 如果未授权显示授权窗口
        if (authStatus === AuthAddress.DENY) {
            this.setData({
                showDialog: true
            })
            return
        }
        this.openAddress()
    },

    /**
     * 获取用户授权
     */
    async hasAuthorizedAddress() {
        const setting = await promisic(wx.getSetting)();
        // 获取微信收货地址授权
        const addressSetting = setting.authSetting['scope.address']
        if (addressSetting === undefined) {
            return AuthAddress.NOT_AUTH
        }
        if (addressSetting === false) {
            return AuthAddress.DENY
        }
        if (addressSetting === true) {
            // 返回已授权
            return AuthAddress.AUTHORIZED
        }
    },

    /**
     * 打开微信地址
     */
    async openAddress() {
        let res;
        res = await promisic(wx.chooseAddress)();
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})