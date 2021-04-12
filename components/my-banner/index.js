// components/my-banner/index.js
import {User} from "../../model/user";
import {promisic} from "../../utils/util";

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        couponCount:Number
    },

    /**
     * 组件的初始数据
     */
    data: {
        showLoginBtn: false,
        couponCount:Number
    },

    // 页面加载判断是否有用户信息
    lifetimes: {
        async attached() {
            // 如果没有用户信息
            if (!await this.hasAuthUserInfo()) {
                this.setData({
                    showLoginBtn: true
                })
            }
        }
    },

    observers:{
        'couponCount':function (couponCount) {
        }
    },

    /**
     * 组件的方法列表
     */
    methods: {
        async onAuthUserInfo(event) {
            // 判断用户是否授权查询用户信息
            if (event.detail.userInfo) {
                const success = await User.updateUserInfo(event.detail.userInfo)
                this.setData({
                    showLoginBtn:false
                })
            }
        },

        /**
         * 获取用户授权
         */
        async hasAuthUserInfo() {
            const setting = await promisic(wx.getSetting)();
            // 判断是否有用户信息授权
            const userInfo = setting.authSetting['scope.userInfo']
            // 是否存在用户信息
            return !!userInfo;
        },

        onGotoMyCoupon(event) {
            wx.navigateTo({
                url:`/pages/my-coupon/my-coupon`
            })
        },

        aboutUs(event) {
            wx.navigateTo({
                url:`/pages/about/about`
            })
        }
    }
})
