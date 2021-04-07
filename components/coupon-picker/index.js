import {getSlashYMD} from "../../utils/date";
import {CouponOperate} from "../../core/enum";

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        coupons: Array
    },


    observers: {
        'coupons': function (coupons) {
            if (coupons.length === 0) {
                return
            }
            const couponsView = this.convertToView(coupons)
            const satisfactionCount = this.getSatisfactionCount(coupons)
            console.log(couponsView)
            this.setData({
                _coupons: couponsView,
                satisfactionCount
            })
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        _coupons: [],
        currentKey: null,
        satisfactionCount: 0
    },

    /**
     * 组件的方法列表
     */
    methods: {
        /**
         * 将传入的优惠券转换为页面数据
         * @param {*} coupons  优惠券集合
         */
        convertToView(coupons) {
            const couponsView = coupons.map(coupon => {
                return {
                    id: coupon.id,
                    title: coupon.title,
                    startTime: getSlashYMD(coupon.startTime),
                    endTime: getSlashYMD(coupon.endTime),
                    satisfaction: coupon.satisfaction
                }
            })
            couponsView.sort((a, b) => {
                if (a.satisfaction) {
                    return -1
                }
            })
            return couponsView
        },

        /**
         * 获取可使用的优惠券
         * @param {*} coupons 优惠券集合
         */
        getSatisfactionCount(coupons) {
            return coupons.reduce((pre, coupon) => {
                if (coupon.satisfaction === true) {
                    return pre + 1
                }
                return pre
            }, 0)
        },

        /**
         * 点击事件
         * @param {*} event 
         */
        onChange(event) {
            console.log(event)
            const currentKey = event.detail.currentKey
            const key = event.detail.key
            this.setData({
                currentKey
            })
            const currentCoupon = this.findCurrentCoupon(currentKey, key)
            // 将事件抛出到order页面中 重新计算价格
            this.triggerEvent('choose', {
                // 当前选中的优惠券
                coupon: currentCoupon,
                // 获取当前操作是选中还是未选中
                operate: this.decidePickOrUnPick(currentKey)
            })
        },

        /**
         * 返回选中或者取消选中状态
         * @param {*} currentKey 优惠券id
         */
        decidePickOrUnPick(currentKey) {
            if (currentKey === null) {
                //取消选中
                return CouponOperate.UNPICK
            } else {
                // 选中
                return CouponOperate.PICK
            }
        },

        /**
         * 查找选中的优惠券
         * @param {*} currentKey 选中的优惠券id 如果未选中则为空
         * @param {*} key 优惠券id
         */
        findCurrentCoupon(currentKey, key) {
            // 未选中
            if (currentKey === null) {
                // 查找优惠券中取消的选中的优惠券id 
                return this.properties.coupons.find(coupon => coupon.id == key)
            }
            // 选中
            // 查找优惠券中选中的优惠券id
            return this.properties.coupons.find(coupon => coupon.id == currentKey)
        }

    }
})
