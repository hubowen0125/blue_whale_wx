<script lang="ts" setup>


// 查看订单详情
const viewOrderDetailFu = () => {
  console.log('查看订单详情')
  uni.navigateTo({
    url: '/manufacturer/orderDetails/index?order_id=GuLang008'
  })
}

</script>


<template>
    <view class="order_item flex_column" @click="viewOrderDetailFu">
        <view class="order_item_title flex_align">
            <view class="order_unpaid">未付清</view>
            <view class="flex_1">订单号: GuLang008</view>
            <view class="order_item_status">待发货</view>
        </view>
        <view class="order_item_info flex">
            <view>陈冠希</view>
            <view class="flex_1 order_item_info_address">上海</view>
            <view>23手</view>
        </view>
        <view class="flex_align order_item_price">
            <view class="flex_1">下单时间: 2025-05-05 11:26</view>
            <view class="order_item_price_old">¥100</view>
            <view class="flex_align">
                <text>已收:</text>
                <text class="order_item_price_new">¥100</text>
            </view>
        </view>
    </view>
</template>

<style lang="scss" scoped>
.order_item {
    background: #FFFFFF;
    border-radius: 24rpx;
    padding: 28rpx;
    gap: 24rpx;
    font-weight: 400;
    font-size: 26rpx;
    color: #7C8191;

    .order_item_title {
        .order_unpaid {
            padding: 12rpx 16rpx;
            font-weight: 400;
            font-size: 26rpx;
            color: #F73030;
            background: rgba(247, 48, 48, 0.04);
            border-radius: 12rpx;
            margin-right: 16rpx;
        }

        .order_item_status {
            font-weight: 500;
            font-size: 26rpx;
            color: #FF840C;
        }
    }

    .order_item_info {
        padding-top: 24rpx;
        font-weight: bold;
        font-size: 32rpx;
        color: #202020;
        gap: 12rpx;
        border-top: 1rpx solid #EFEFEF;
        align-items: baseline;

        .order_item_info_address {
            font-weight: 400;
            font-size: 26rpx;
            color: #346BCF;
        }
    }

    .order_item_price {
        font-size: 24rpx;
        gap: 28rpx;

        .order_item_price_old {
            font-weight: 500;
            font-size: 26rpx;
            color: #202020;
        }

        .order_item_price_new {
            color: #F73030;
        }
    }
}
</style>