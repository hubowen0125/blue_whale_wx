<script lang="ts" setup>
import wait_icon from "@/static/images/wait_icon.png";
import del_icon from "@/static/images/del_icon.png";

const { proxy } = getCurrentInstance() as any;

const orderDetails = [
    {
        title: '厂家',
        value: '上海蓝鲸童装有限公司',
        value1: '13601805978',
    },
    {
        title: '总件数',
        value: '60手/100件',
    },
    {
        title: '核点',
        value: '60手/100件',
    },
    {
        title: '总金额',
        value: '100.00',
        type: 'price',
    },
    {
        title: '已收金额',
        value: '100.00',
        type: 'price',
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
const popupData = {
    popupTitle: '作废订单',
    pupupType: 'default',
    popupContent: [
        {
            text: '是否作废该订单',
        },
    ],
    cancelText: '取消',
    confirmText: '确定'
}

const popupCom = ref()

/**
 * 查看操作记录
 */
const viewRecordsFu = () => {
    uni.navigateTo({
        url: '/pages/wholesaler/operationRecord/index'
    })
}

// 未发货退单
const refundOrderFu = () => {
    uni.navigateTo({
        url: '/pages/wholesaler/returnOrder/index'
    })
}

// 确认弹窗
const confirmPopupFu = () => {
    console.log('1111');

}

</script>


<template>
    <view class="container flex_column">
        <view class="bg"></view>
        <com-header :backColor="false"></com-header>
        <view class="main_con flex_1 flex_column">
            <view class="wait_con">
                <view class="flex_align flex_center">
                    <image class="wait_icon" :src="wait_icon"></image>
                    <text>待配送</text>
                </view>
                <view class="wait_num">已发货0/60</view>
            </view>
            <view class="order_details">
                <view class="order_details_item flex_align flex_between" v-for="item, index in orderDetails"
                    :key="index">
                    <view class="flex_align order_details_item_title">{{ item.title }}</view>
                    <view class="flex_1  order_details_item_value">
                        <view v-if="item.type === 'price'" class="order_details_item_value_price">¥{{ item.value }}
                        </view>
                        <view v-else>{{ item.value }}</view>
                        <view v-if="item.value1">{{ item.value1 }}</view>
                    </view>
                </view>
            </view>
            <view class="order_info">
                <view class="order_info_title">商品信息</view>
                <view class="table_con flex_column">
                    <template v-for="item in 10" :key="item">
                        <com-orderTable></com-orderTable>
                    </template>
                </view>
            </view>
        </view>
        <view class="footer_con flex_align flex_between">
            <view class="del_btn flex_column flex_align">
                <image class="del_icon" :src="del_icon"></image>
                <text>删除</text>
            </view>
            <button class="records_btn" @click="viewRecordsFu">操作记录</button>
            <button class=" button_defalut" @click="refundOrderFu">未发货退单</button>
        </view>
    </view>
    <com-popup_com ref="popupCom" :popupData="popupData" @confirmPopupFu="confirmPopupFu"></com-popup_com>
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

    .main_con {
        padding: 24rpx;
        position: relative;
        overflow-x: hidden;
        overflow: auto;
        gap: 20rpx;


        .wait_con {
            font-weight: bold;
            font-size: 48rpx;
            color: #FFFFFF;
            text-align: center;
            position: relative;
            margin-bottom: 16rpx;

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

                    .order_details_item_value_price {
                        font-weight: 500;
                        color: #FF840C;
                    }
                }
            }
        }

        .order_info {
            background: #FFFFFF;
            border-radius: 24rpx;
            padding: 36rpx 28rpx;

            .order_info_title {
                font-weight: bold;
                font-size: 32rpx;
                color: #202020;
                margin-bottom: 24rpx;
            }

            .table_con {
                gap: 60rpx;
            }
        }
    }

    .footer_con {
        font-weight: 400;
        font-size: 20rpx;
        color: #7C8191;

        .del_btn {
            margin-right: 16rpx;

            .del_icon {
                width: 38rpx;
                height: 38rpx;
            }
        }

        .records_btn {
            width: 212rpx;
            height: 96rpx;
            background: rgba(12, 104, 255, 0.05);
            border-radius: 48rpx;
            border: 1rpx solid #8CBAFF;
            font-weight: 500;
            font-size: 30rpx;
            color: #0C62FF;
            line-height: 96rpx;
        }

        .button_defalut {
            width: 392rpx;
        }
    }
}
</style>