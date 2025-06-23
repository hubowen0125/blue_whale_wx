<script lang="ts" setup>
import card_1 from "@/manufacturer/images/orderCard/card_1.png"
import card_2 from "@/manufacturer/images/orderCard/card_2.png"
import arrow_right from "@/static/images/arrow_right.png"
import { useUserStore } from '@/store/modules/user';


const emit = defineEmits(['setTabBarIndex'])

const useUser = useUserStore()
const { proxy } = getCurrentInstance() as any;

const roderCardList = [
    {
        title: '发送订货卡给批发商',
        titleEn: 'Send order cards to wholesalers',
        image: card_1,
        key: 1,
        path: `/manufacturer/selectProduct/index?type=orderCard`
    },
    {
        title: '选择货架商品进行订货',
        titleEn: 'Select shelf products for ordering',
        image: card_2,
        key: 2,
        path: ''
    },
]

const tabBarIndex = inject("tabBarIndex") as Ref<number>
/**
 * 设置页面跳转
 * @param path 
 */
const toPageFu = (item: { path: string }) => {
    const { path } = item
    if (!path) {
        return emit('setTabBarIndex', 3)
    }
    uni.navigateTo({
        url: path
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