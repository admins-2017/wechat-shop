import {Http} from "../utils/http";

class Coupon {
    /**
     * 领取优惠券
     * @param {*} cid 优惠券id 
     */
    static async collectCoupon(cid) {
        return await Http.request({
            method: 'POST',
            url: `/coupon/collect/${cid}`,
            // 向调用方抛出异常
            throwError: true
        })
    }

    /**
     * 根据状态获取我的优惠券
     * @param {*} status 
     */
    static getMyCoupons(status) {
        return Http.request({
            url: `/coupon/myself/by/status/${status}`
        })
    }

    /**
     * 获取分类下所有适用的优惠券
     * @param {*} cid 分类id
     */
    static async getCouponsByCategory(cid) {
        return await Http.request({
            url: `/coupon/by/category/${cid}`,
        })
    }

    /**
     * 获取我的优惠券
     */
    static async getMySelfWithCategory() {
        return Http.request({
            url: `/coupon/myself/available/with_category`
        })
    }

    /**
     * 根据分类id 获取优惠券展示到商品详情页 只返回俩条数据
     * @param {*} cid 分类id
     */
    static async getTop2CouponsByCategory(cid) {
        // 获取优惠券
        let coupons = await Http.request({
            url: `/coupon/by/category/${cid}`,
        })
        if (coupons.length === 0) {
            // 获取全场券
            const otherCoupons = await Coupon.getWholeStoreCoupons()
            // 截取俩张优惠券
            return Coupon.getTop2(otherCoupons)
        }
        if (coupons.length >= 2) {
            return coupons.slice(0, 2)
        }
        if (coupons.length === 1) {
            const otherCoupons = await Coupon.getWholeStoreCoupons()
            coupons = coupons.concat(otherCoupons)
            return Coupon.getTop2(coupons)
        }
    }

    static getTop2(coupons) {
        if (coupons.length === 0) {
            return []
        }
        if (coupons.length >= 2) {
            return coupons.slice(0, 2)
        }
        if (coupons.length === 1) {
            return coupons
        }
        return []
    }


    static async getWholeStoreCoupons() {
        return Http.request({
            url: `/coupon/whole_store`
        })
    }
}

export {
    Coupon
}