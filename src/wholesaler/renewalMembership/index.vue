<script lang="ts" setup>
import member_icon from "@/static/images/member_icon.png"
import icon_1 from "@/static/images/wholesaler/renewalMembership/icon_1.png"
import icon_2 from "@/static/images/wholesaler/renewalMembership/icon_2.png"
import icon_3 from "@/static/images/wholesaler/renewalMembership/icon_3.png"


const interestsList = [
    {
        icon: icon_1,
        text: '可查看完整订单详情、订单状态'
    },
    {
        icon: icon_2,
        text: '订货卡功能'
    },
    {
        icon: icon_3,
        text: '货架商品功能'
    },
]

</script>


<template>
    <view class="container flex_column">
        <view class="bg"></view>
        <com-header header-title="续费会员" :backColor="false" :titleColor="true"></com-header>
        <view class="member_title_con flex_between flex_align">
            <view>
                <view>使用有效期至</view>
                <view class="member_title_date">2026-05-16</view>
            </view>
            <button class="member_title_btn">续费记录</button>
        </view>
        <view class="renewal_fee_con flex_align flex_between">
            <view>续费费用</view>
            <view class="flex_align">
                <text class="renewal_fee_price">¥300</text>
                <text>/年</text>
            </view>
        </view>
        <view class="main_con flex_1">
            <view class="member_benefits_con">
                <view class="flex_align">
                    <image class="member_icon" :src="member_icon"></image>
                    <text class="member_name">会员权益</text>
                </view>
                <view class="member_desc">付费会员将会拥有以下权益</view>
                <view class="interests_list flex_column">
                    <view class="interests_item flex_align" v-for="(item, index) in interestsList" :key="index">
                        <image class="interests_icon" :src="item.icon"></image>
                        <view>{{ item.text }}</view>
                    </view>
                </view>
            </view>
        </view>
        <view class="footer_con"><button class="button_defalut">立即续费</button></view>
    </view>
</template>


<style lang="scss" scoped>
.container {
    background: #F2F1F5;

    .bg {
        width: 750rpx;
        height: 408rpx;
        background: linear-gradient(136deg, #0D5DFF 0%, #00AAFF 100%);
        position: fixed;
        left: 0;
        top: 0;
    }

    .member_title_con {
        padding: 24rpx;
        font-weight: 400;
        font-size: 28rpx;
        color: #DFEFFF;
        position: relative;
        margin: 22rpx 0;

        .member_title_date {
            font-weight: bold;
            font-size: 40rpx;
            color: #FFFFFF;
            margin-top: 12rpx;
        }

        .member_title_btn {
            width: 168rpx;
            height: 72rpx;
            border-radius: 48rpx;
            border: 1rpx solid #FFFFFF;
            font-weight: 500;
            font-size: 26rpx;
            color: #FFFFFF;
            line-height: 72rpx;
            display: none;
        }
    }

    .renewal_fee_con {
        padding: 34rpx 28rpx;
        margin: 0 24rpx;
        font-weight: 500;
        font-size: 28rpx;
        color: #202020;
        position: relative;
        background: #FFFFFF;
        border-radius: 24rpx;

        .renewal_fee_price {
            color: #FF840C;
        }
    }

    .main_con {
        padding: 24rpx;
        margin-top: 20rpx;

        .member_benefits_con {
            font-weight: 400;
            font-size: 28rpx;
            color: #202020;
            padding: 34rpx 28rpx;
            background: #FFFFFF;
            border-radius: 24rpx;

            .member_icon {
                width: 34rpx;
                height: 34rpx;
                margin-right: 12rpx;
            }

            .member_name {
                font-weight: bold;
                font-size: 32rpx;
                color: #202020;
            }

            .member_desc {
                font-size: 24rpx;
                color: #7C8191;
                margin-top: 16rpx;
                margin-bottom: 30rpx;
            }

            .interests_list {
                gap: 20rpx;

                .interests_item {
                    background: #F2F6FF;
                    border-radius: 20rpx;
                    padding: 40rpx;
                }

                .interests_icon {
                    width: 76rpx;
                    height: 76rpx;
                    margin-right: 20rpx;
                }
            }
        }
    }
}
</style>