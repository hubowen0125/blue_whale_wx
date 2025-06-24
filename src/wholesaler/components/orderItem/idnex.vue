<script lang="ts" setup>
import long_arrow from "@/static/images/long_arrow.png"
import { dateStrToDateFormat, formatNumber } from "@/utils/utils";

const props = defineProps({
    orderData: {
        type: Object,
        required: true,
        default: () => ({})
    }
})

const viewDetailFu = () => {
    uni.navigateTo({
        url: `/wholesaler/orderDetails/index?orderNo=${props.orderData.orderNo}`
    })
}

</script>


<template>
    <view class="order_item flex_column" @click="viewDetailFu">
        <view class="order_item_title flex_align flex_between">
            <view>订单号: {{ orderData?.orderNo }}</view>
            <view class="order_item_status">{{ orderData?.statusMsg }}</view>
        </view>
        <view class="order_item_info flex_align">
            <view class="flex_1">{{ orderData?.manufacturer?.leader }}</view>
            <image class="long_arrow" :src="long_arrow"></image>
            <view class="flex_column flex_align">
                <view>{{ orderData?.checkHandNum }}手</view>
                <view class="order_item_info_title">核点</view>
            </view>
            <view class="flex_column flex_align">
                <view>{{ orderData?.totalHandNum }}手</view>
                <view class="order_item_info_title">厂家</view>
            </view>
        </view>
        <view class="flex_align order_item_price">
            <view class="flex_1">下单时间: {{ dateStrToDateFormat(orderData?.createTime, ' ') }}</view>
            <view class="order_item_price_old">¥{{ formatNumber(orderData?.totalAmount) }}</view>
            <view class="flex_align">
                <text>已付:</text>
                <text class="order_item_price_new">¥{{ formatNumber(orderData?.paymentAmount) }}</text>
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

        .order_item_status {
            font-weight: 500;
            font-size: 26rpx;
            color: #FF840C;
        }
    }

    .order_item_info {
        padding: 24rpx 28rpx;
        background: #F7F8FA;
        border-radius: 20rpx;
        font-weight: 500;
        font-size: 32rpx;
        color: #202020;
        gap: 40rpx;

        .long_arrow {
            width: 102rpx;
            height: 28rpx;
            margin-right: 20rpx;
        }

        .order_item_info_title {
            font-weight: 400;
            font-size: 24rpx;
            color: #7C8191;
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