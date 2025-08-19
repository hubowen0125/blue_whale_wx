<script lang="ts" setup>
import card_1 from "@/static/images/wholesaler/orderCard/card_1.png"
import card_2 from "@/static/images/wholesaler/orderCard/card_2.png"
import arrow_right from "@/static/images/arrow_right.png"
import { useUserStore } from '@/store/modules/user';
import { useWholesalerStore } from "@/wholesaler/store/wholesaler"

const emit = defineEmits(['setTabBarIndex'])

const useWholesaler = useWholesalerStore()
const useUser = useUserStore()
const { proxy } = getCurrentInstance() as any;

const roderCardList = [
    {
        title: '发送订货卡给厂家',
        titleEn: 'Send the order card to the manufacturer',
        image: card_1,
        key: 1,
        path: '/wholesaler/orderInformation/index?type=shoppingCart'
    },
    {
        title: '选择货架商品进行订货',
        titleEn: 'Select shelf products for ordering',
        image: card_2,
        key: 2,
        path: ''
    },
]
const editInformationRef = ref()

const tabBarIndex = inject("tabBarIndex") as Ref<number>
/**
 * 设置页面跳转
 * @param path 
 */
const toPageFu = (item: { path: string, key: number }) => {
    const { path, key } = item
    console.log(path, 'path');
    if (!path) {
        return emit('setTabBarIndex', 3)
    }
    useWholesaler.setManufacturerIdFu('')
    useWholesaler.setShoppingCartFu([])
    if (key === 1) {
        if (!useUser.userInfo.dept.address) {
            editInformationRef.value.showPopupFu()
            return
        }
    }
    uni.navigateTo({
        url: path
    })
}

const editInformationFu = async (data: { address: string }) => {
    useUser.setUserInfoFu({ ...useUser.userInfo, dept: { ...useUser.userInfo.dept, address: data.address } })
    uni.navigateTo({
        url: '/wholesaler/orderInformation/index?type=shoppingCart'
    })
}
</script>


<template>
    <view class="order_card_con flex_column">
        <view class="order_card_title">订货卡</view>
        <view class="order_card_list flex_column">
            <view class="order_card_item flex" v-for="item in roderCardList" :key="item.key">
                <image class="order_card_icon" :src="item.image"></image>
                <view class="flex_column flex_1 ">
                    <view class="order_card_item_title">{{ item.title }}</view>
                    <view class="flex_1">{{ item.titleEn }}</view>
                    <button class="order_card_item_btn flex_align flex_center" @click="toPageFu(item)">
                        <text>立即进入</text>
                        <image class="order_card_item_btn_icon" :src="arrow_right"></image>
                    </button>
                </view>
            </view>
        </view>
    </view>
    <com-editInformation ref="editInformationRef" type="wholesaler"
        @editInformationFu="editInformationFu"></com-editInformation>
</template>

<style lang="scss" scoped>
.order_card_con {
    width: 100%;
    height: 100%;
    padding: v-bind('`${useUser.navHeight + (useUser.statusBarHeight / 2)}px`') 30rpx 30rpx 30rpx;
    box-sizing: border-box;

    .order_card_title {
        font-weight: bold;
        font-size: 48rpx;
        color: #202020;
    }

    .order_card_list {
        gap: 40rpx;
        margin-top: 60rpx;

        .order_card_item {
            gap: 52rpx;
            font-weight: 400;
            font-size: 20rpx;
            color: #AEB1BC;
            padding: 76rpx 44rpx;
            background: #FFFFFF;
            box-shadow: 0rpx 4rpx 12rpx 0rpx #DDE8FC;
            border-radius: 24rpx;

            .order_card_icon {
                width: 172rpx;
                height: 172rpx;
            }

            .order_card_item_title {
                font-weight: bold;
                font-size: 32rpx;
                color: #202020;
            }

            .order_card_item_btn {
                width: 172rpx;
                height: 72rpx;
                background: rgba(12, 104, 255, 0.03);
                border-radius: 48rpx;
                border: 1rpx solid #CDE1FF;
                font-weight: 500;
                font-size: 26rpx;
                color: #0C62FF;

                .order_card_item_btn_icon {
                    width: 26rpx;
                    height: 26rpx;
                }
            }
        }
    }
}
</style>