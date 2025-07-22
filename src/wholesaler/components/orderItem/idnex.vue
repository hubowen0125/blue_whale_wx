<script lang="ts" setup>
import long_arrow from "@/static/images/long_arrow.png"
import cancel_icon from "@/static/images/cancel_icon.png"
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
    <view class="order_item flex_column" :class="`order_item_${orderData.status}`" @click="viewDetailFu">
        <view class="order_item_title flex_align flex_between">
            <view>订单号: {{ orderData?.orderNo }}</view>
            <view class="order_item_status" :class="`order_item_status_${orderData.status}`">{{ orderData?.statusMsg }}
            </view>
        </view>
        <view class="order_item_info flex_align">
            <view class="flex_1">{{ orderData?.manufacturer?.deptName }}</view>
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
        <image v-if="orderData.status === 6" class="cancel_icon" :src="cancel_icon"></image>
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

        .order_item_status_3,
        .order_item_status_4,
        .order_item_status_6 {
            color: #A9A9A9;
        }

        .order_item_status_2 {
            color: #52B73C;
        }

        .order_item_status_1,
        .order_item_status_5,
        .order_item_status_0 {
            color: #EF4747;
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

.order_item_6 {
    background-color: #f9f9f9;
    opacity: 0.7;
    position: relative;

    .cancel_icon {
        width: 132rpx;
        height: 132rpx;
        position: absolute;
        top: 16rpx;
        left: 358rpx;
    }
}
</style>