<script lang="ts" setup>
import checkbox from "@/static/images/checkbox.png"
import checkbox_active from "@/static/images/checkbox_active.png"
import pay_1 from "@/static/images/payMethod/pay_1.png"
import pay_2 from "@/static/images/payMethod/pay_2.png"
import pay_3 from "@/static/images/payMethod/pay_3.png"
import pay_4 from "@/static/images/payMethod/pay_4.png"
import pay_5 from "@/static/images/payMethod/pay_5.png"

const payMathodList = [
    {
        name: "银联支付",
        text: '由网易支付提供服务',
        icon: pay_1,
        select: false
    },
    {
        name: "支付宝",
        text: '支付宝安全支付',
        icon: pay_2,
        select: false
    },
    {
        name: "微信支付",
        text: '亿万用户的选择，更快更安全',
        icon: pay_3,
        select: false
    },
    {
        name: "信用卡支付",
        text: '信用卡安全支付',
        icon: pay_4,
        select: false
    },
    {
        name: "现金",
        text: '现金支付',
        icon: pay_5,
        select: false
    }
]

</script>


<template>
    <view class="container flex_column">
        <view class="bg"></view>
        <com-header header-title="收银" :backColor="false" :titleColor="true"></com-header>
        <view class="main_con flex_column flex_1">
            <view class="customer_info">
                <view class="customer_info_item flex_align flex_between">
                    <view>客户名称</view>
                    <view class="customer_info_item_content flex_1">上海-陈冠希</view>
                </view>
                <view class="customer_info_item flex_align flex_between">
                    <view>累计欠款</view>
                    <view class="flex_1">
                        <text class="price">0.00 </text>
                        <text class="debt_price">(含本单:350.00)</text>
                    </view>
                </view>
                <view class="customer_info_item flex_align flex_between">
                    <view>本单金额</view>
                    <view class="flex_1">
                        <text class="price">350.00 </text>
                        <text class="received_price">(已收:350.00) </text>
                    </view>
                </view>
            </view>
            <view class="pay_method_con">
                <view>选择支付方式</view>
                <view class="flex_align pay_item" v-for="item in payMathodList" :key="item.name">
                    <image class="pay_item_icon" :src="item.icon"></image>
                    <view class="flex_align pay_item_content flex_between flex_1">
                        <view>
                            <view class="pay_item_name">{{ item.name }}</view>
                            <view>{{ item.text }}</view>
                        </view>
                        <image class="pay_item_select" :src="item.select ? checkbox_active : checkbox"></image>
                    </view>
                </view>
            </view>
        </view>
        <view class="footer_con"><button class="button_defalut">确认收款 ¥350</button></view>
    </view>
</template>


<style lang="scss" scoped>
.container {
    width: 100%;
    height: 100%;
    background: #F2F1F5;

    .bg {
        width: 750rpx;
        height: 304rpx;
        background: linear-gradient(136deg, #0D5DFF 0%, #00AAFF 100%);
        transform: scaleY(-1);
        position: fixed;
        left: 0;
        top: 0;
    }

    .main_con {
        padding: 24rpx;
        gap: 20rpx;
        position: relative;

        .customer_info {
            background: #FFFFFF;
            border-radius: 24rpx;
            padding: 0 28rpx;

            .customer_info_item {
                padding: 34rpx 0;
                border-bottom: 1rpx solid #EFEFEF;
                font-weight: 500;
                font-size: 28rpx;
                color: #202020;
                text-align: right;

                .customer_info_item_content {
                    font-weight: 400;
                    font-size: 28rpx;
                    color: #7C8191;
                }

                .price {
                    font-size: 36rpx;
                }

                .debt_price {
                    font-size: 28rpx;
                    color: #7C8191;
                }

                .received_price {
                    font-size: 28rpx;
                    color: #FF840C;
                }
            }
        }

        .pay_method_con {
            padding: 36rpx 28rpx 16rpx;
            background: #FFFFFF;
            border-radius: 24rpx;
            font-weight: bold;
            font-size: 32rpx;
            color: #202020;

            .pay_item {
                .pay_item_icon {
                    width: 64rpx;
                    height: 64rpx;
                    margin-right: 22rpx;
                }

                .pay_item_content {
                    padding: 38rpx 0;
                    border-bottom: 1rpx solid #EFEFEF;
                    font-weight: 400;
                    font-size: 24rpx;
                    color: #7C8191;

                    .pay_item_name {
                        font-weight: 500;
                        font-size: 28rpx;
                        color: #202020;
                    }

                    .pay_item_select {
                        width: 40rpx;
                        height: 40rpx;
                        margin-right: 20rpx;
                    }
                }

                &:last-child {
                    .pay_item_content {
                        border-bottom: none;
                    }
                }
            }
        }
    }
}
</style>