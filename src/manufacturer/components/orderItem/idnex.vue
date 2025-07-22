<script lang="ts" setup>
import cancel_icon from "@/static/images/cancel_icon.png"
import { dateStrToDateFormat, formatNumber } from '@/utils/utils'

const props = defineProps({
    orderData: {
        type: Object as () => {
            orderNo: string,
            status: number,
            totalHandNum: number,
            totalNum: number,
            totalAmount: number,
            paymentAmount: number,
            createTime: string,
            statusMsg: string,
            paymentStatusMsg: string
            wholesale: {
                deptName: string,
                cityName: string
            }
        },
        default: () => ({})
    }
})


// 查看订单详情
const viewOrderDetailFu = () => {
    console.log('查看订单详情')
    uni.navigateTo({
        url: `/manufacturer/orderDetails/index?orderNo=${props.orderData.orderNo}`
    })
}

</script>


<template>
    <view class="order_item flex_column" :class="`order_item_${orderData.status}`" @click="viewOrderDetailFu">
        <view class="order_item_title flex_align">
            <view class="order_unpaid">{{ orderData.paymentStatusMsg }}</view>
            <view class="flex_1">订单号: {{ orderData.orderNo }}</view>
            <view class="order_item_status" :class="`order_item_status_${orderData.status}`">{{ orderData.statusMsg }}
            </view>
        </view>
        <view class="order_item_info flex">
            <view class="order_item_info_address">{{ orderData?.wholesale?.cityName }}</view>
            <view class="flex_1 ">{{ orderData?.wholesale?.deptName }}</view>
            <view>{{ orderData.totalHandNum }}手</view>
        </view>
        <view class="flex_align order_item_price">
            <view class="flex_1">下单时间: {{ dateStrToDateFormat(orderData.createTime, '') }}</view>
            <view class="order_item_price_old">¥{{ formatNumber(orderData.totalAmount) }}</view>
            <view class="flex_align">
                <text>已收:</text>
                <text class="order_item_price_new">¥{{ formatNumber(orderData.paymentAmount) }}</text>
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