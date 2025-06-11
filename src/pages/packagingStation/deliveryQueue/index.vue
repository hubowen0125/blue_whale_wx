<script lang="ts" setup>
import wait_icon from "@/static/images/wait_icon.png";

const { proxy } = getCurrentInstance() as any;

const orderDetails = [
    {
        title: '厂家',
        value: '上海蓝鲸童装有限公司',
        value1: '13601805978',
    },
    {
        title: '批发商',
        value: '陈冠希-上海',
        value1: '15618257147',
    },
    {
        title: '仓位信息',
        value: 'A1',
    },
    {
        title: '总数量(手)',
        value: '60',
    },
    {
        title: '订单号',
        value: '5655892019801',
    },
    {
        title: '创建时间',
        value: '2025-05-05 11:26',
    },
    {
        title: '备注',
        value: '轻拿轻放, 感谢',
    },
]

</script>

<template>
    <view class="container flex_column">
        <view class="bg"></view>
        <com-header :backColor="false"></com-header>
        <view class="wait_con">
            <view class="flex_align flex_center">
                <image class="wait_icon" :src="wait_icon"></image>
                <text>待配送</text>
            </view>
            <view class="wait_num">已发货0/60</view>
        </view>
        <view class="main_con flex_1">
            <view class="order_details">
                <view class="order_details_item flex_align flex_between" v-for="item, index in orderDetails"
                    :key="index">
                    <view class="flex_align order_details_item_title">{{ item.title }}</view>
                    <view class="flex_1  order_details_item_value">
                        <view>{{ item.value }}</view>
                        <view v-if="item.value1">{{ item.value1 }}</view>
                    </view>
                </view>
            </view>
            <view class="inventory_information">入库信息</view>
            <view class="inventory_list flex_column">
                <view class="inventory_item flex_align flex_between" v-for="item in 10" :key="item">
                    <view class="flex_align">
                        <text>入库数量: </text>
                        <text class="inventory_num">30</text>
                    </view>
                    <view class="inventory_time">2025-05-05 11:26</view>
                </view>
            </view>
        </view>
    </view>
</template>

<style lang="scss" scoped>
.container {
    background: #F2F1F5;

    .bg {
        width: 750rpx;
        height: 524rpx;
        background: linear-gradient(136deg, #0D5DFF 0%, #00AAFF 100%);
        clip-path: ellipse(100% 100% at 50% 100%);
        /* 底部椭圆裁剪 */
        transform: scaleY(-1);
        position: fixed;
        left: 0;
        top: 0;
    }

    .wait_con {
        font-weight: bold;
        font-size: 48rpx;
        color: #FFFFFF;
        text-align: center;
        position: relative;

        .wait_icon {
            width: 48rpx;
            height: 48rpx;
            margin-right: 6rpx;
        }

        .wait_num {
            font-weight: 400;
            font-size: 26rpx;
            color: #BAE1FF;
            margin-top: 10rpx;
        }
    }

    .main_con {
        padding: 24rpx;
        position: relative;
        overflow-x: hidden;
        overflow: auto;

        .order_details {
            background: #FFFFFF;
            border-radius: 24rpx;
            padding: 0 28rpx;

            .order_details_item {
                padding: 34rpx 0;
                border-bottom: 1rpx solid #EFEFEF;

                .order_details_item_title {
                    width: 200rpx;
                    font-weight: 500;
                    font-size: 28rpx;
                    color: #202020;
                }

                .order_details_item_value {
                    font-weight: 400;
                    font-size: 28rpx;
                    color: #7C8191;
                    text-align: right;
                }
            }
        }

        .inventory_information {
            font-weight: bold;
            font-size: 32rpx;
            color: #202020;
            margin-top: 48rpx;
            margin-bottom: 24rpx;
        }

        .inventory_list {
            gap: 20rpx;

            .inventory_item {
                background: #FFFFFF;
                border-radius: 24rpx;
                padding: 34rpx 28rpx;
                font-weight: 500;
                font-size: 28rpx;
                color: #202020;

                .inventory_num {
                    color: #0C62FF;
                }

                .inventory_time {
                    font-weight: 400;
                    font-size: 26rpx;
                    color: #7C8191;
                }
            }
        }
    }
}
</style>