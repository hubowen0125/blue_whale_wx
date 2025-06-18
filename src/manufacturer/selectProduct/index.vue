<script lang="ts" setup>
import order_fixed from "@/static/images/wholesaler/order_fixed.png"
import off_icon from "@/static/images/off_icon.png"

const value = 100;
const popupRef = ref();

/**
 * 跳转到订货卡详情页
 */
const viewOrderCardDetailFu = () => {
    uni.navigateTo({
        url: '/manufacturer/orderCard/index?id=123456'
    })
}

</script>


<template>
    <view class="container flex_column">
        <view class="bg"></view>
        <com-header header-title="立即订货" :backColor="false" :titleColor="true"></com-header>
        <view class="search_con ">
            <com-searchInput placeholder="搜索商品"></com-searchInput>
        </view>
        <view class="main_con flex_1">
            <view class="product_lsit flex_column">
                <view v-for="item in 10" :key="item">
                    <com-orderInfo>
                        <template #button>
                            <template v-if="item % 2 === 0">
                                <button class="add_btn">加入订货单</button>
                            </template>
                            <template v-else>
                                <button class="btn_after">已加入</button>
                            </template>
                        </template>
                    </com-orderInfo>
                </view>
            </view>
        </view>
        <view class="order_fixed" @click="viewOrderCardDetailFu">
            <uni-badge class="uni-badge-left-margin" :text="value" absolute="rightTop" :offset="[3, 3]" size="small">
                <image class="order_fixed_img" :src="order_fixed"></image>
            </uni-badge>
        </view>
    </view>
</template>

<style lang="scss" scoped>
.container {
    background: #F2F1F5;

    .bg {
        width: 750rpx;
        height: 318rpx;
        background: linear-gradient(136deg, #0D5DFF 0%, #00AAFF 100%);
        position: fixed;
        left: 0;
        top: 0;
    }

    .search_con {
        margin: 32rpx 24rpx 52rpx;
    }

    .main_con {
        overflow-x: hidden;
        overflow-y: auto;
        padding: 24rpx;

        .product_lsit {
            background: #FFFFFF;
            border-radius: 24rpx;
            padding: 28rpx;
            gap: 56rpx;

            .add_btn {
                width: 154rpx;
                height: 48rpx;
                background: rgba(12, 104, 255, 0.03);
                border-radius: 12rpx;
                border: 1rpx solid #CDE1FF;
                font-weight: 400;
                font-size: 26rpx;
                color: #0C62FF;
                line-height: 48rpx;
            }

            .btn_after {
                width: 102rpx;
                height: 48rpx;
                background: rgba(183, 183, 183, 0.05);
                border-radius: 12rpx;
                border: 1rpx solid #C9C9C9;
                font-weight: 400;
                font-size: 26rpx;
                color: #7C8191;
                line-height: 48rpx;
            }
        }
    }

    .order_fixed {
        width: 92rpx;
        height: 92rpx;
        position: fixed;
        right: 30rpx;
        bottom: 192rpx;

        .order_fixed_img {
            width: 92rpx;
            height: 92rpx;
        }
    }
}
</style>