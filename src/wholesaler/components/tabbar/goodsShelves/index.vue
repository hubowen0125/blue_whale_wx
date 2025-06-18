<script lang="ts" setup>
import { useUserStore } from '@/store/modules/user';

const useUser = useUserStore()
const { proxy } = getCurrentInstance() as any;


const tabBarIndex = inject("tabBarIndex") as Ref<number>

/**
 * 立即订货
 */
const handleBuyFu = () => {
    uni.navigateTo({
        url: '/wholesaler/orderNow/index'
    })
}

</script>


<template>
    <view class="goods_shelves_con flex_column">
        <view class="goods_shelves_title">货架</view>
        <com-searchInput placeholder="搜索厂家"></com-searchInput>
        <view class="main_con flex_1 flex_column">
            <view class="companys_list flex_column">
                <view class="companys_item flex_column" v-for="items in 3" :key="items">
                    <view class="companys_item_title flex_align flex_between">
                        <view>上海蓝鲸童装有限公司</view>
                        <button class="btn_buy" @click="handleBuyFu">立即订货</button>
                    </view>
                    <view class="product_list flex_column">
                        <template v-for="item in 4" :key="item">
                            <com-orderInfo></com-orderInfo>
                        </template>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>


<style lang="scss" scoped>
.goods_shelves_con {
    width: 100%;
    height: 100%;
    padding: v-bind('`${useUser.navHeight + (useUser.statusBarHeight / 2)}px`') 30rpx 30rpx 30rpx;
    box-sizing: border-box;
    gap: 32rpx;

    .goods_shelves_title {
        font-weight: bold;
        font-size: 48rpx;
        color: #202020;
    }

    .main_con {
        gap: 20rpx;
        padding-bottom: 24rpx;
        overflow-x: hidden;
        overflow-y: auto;

        .companys_list {
            gap: 20rpx;

            .companys_item {
                background: #FFFFFF;
                border-radius: 24rpx;
                gap: 32rpx;
                padding: 28rpx;

                .companys_item_title {
                    font-weight: bold;
                    font-size: 32rpx;
                    color: #202020;

                    .btn_buy {
                        background: rgba(12, 104, 255, 0.03);
                        border-radius: 16rpx;
                        border: 1rpx solid #CDE1FF;
                        padding: 18rpx 24rpx;
                        font-weight: 500;
                        font-size: 26rpx;
                        color: #0C62FF;
                    }
                }

                .product_list {
                    gap: 56rpx;
                }
            }
        }
    }
}
</style>