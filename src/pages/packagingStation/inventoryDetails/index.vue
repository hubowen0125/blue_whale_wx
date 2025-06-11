<script lang="ts" setup>
import arrow_right from "@/static/images/arrow_right.png"

const inventoryDetail = [
    {
        title: '订单号: ',
        orderNo: 'GuLang008',
        value: '2025-05-05 11:26',
        arrow: true
    },
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
        title: '客户仓位',
        value: 'A1',
    },
    {
        title: '订单数量(手)',
        value: '20',
    },
    {
        title: '核点数量(手)',
        value: '30',
        button: true
    },
]
const popupData = {
    popupTitle: '修改核点数量',
    pupupType: 'input',
    popupContent: [
        {
            text: '原核点数量: ',
            desc: '20手'
        },
    ],
    cancelText: '取消',
    confirmText: '确认',
    placeholder: '请输入数量',
}
const popupCom = ref()

const modifyFu = () => {
    popupCom.value.showPopup()
}


/**
 * 确认选择
 */
const confirmPopupFu = () => {
    console.log('324324');
    // popupData.value = popupList[1]
    // setTimeout(() => {
    //     popupCom.value.showPopup()
    // }, 200);
}

</script>


<template>
    <view class="container flex_column">
        <view class="bg"></view>
        <com-header header-title="入库详情" :backColor="false" :titleColor="true"></com-header>
        <view class="main_con flex_1">
            <view class="inventory_details">
                <view class="inventory_details_item flex_align flex_between" v-for="item, index in inventoryDetail"
                    :key="index">
                    <view class="flex_align inventory_details_item_title">
                        <text :class="{ 'order_title': item.arrow }">{{ item.title }}</text>
                        <template v-if="item.arrow">
                            <text class="order_no">{{ item.orderNo }}</text>
                            <image class="arrow_right" :src="arrow_right"></image>
                        </template>
                    </view>
                    <view class="flex_1  inventory_details_item_value" :class="{ 'flex_align flex_end': item.button }">
                        <view>{{ item.value }}</view>
                        <view v-if="item.value1">{{ item.value1 }}</view>
                        <button class="inventory_details_item_button" v-if="item.button" @click="modifyFu">修改</button>
                    </view>
                </view>
            </view>
            <view class="operation_record">操作记录</view>
            <view class="operation_record_list flex_column">
                <view class="operation_record_item flex_align" v-for="item in 10" :key="item">
                    <view class="flex_column flex_1">
                        <view>陈冠希</view>
                        <view class="operation_record_item_color">2025-05-05 11:26</view>
                    </view>
                    <view class="flex_column flex_align">
                        <view>20</view>
                        <view class="operation_record_item_color">原数据</view>
                    </view>
                    <view class="flex_column flex_align operation_record_item_modify">
                        <view>20</view>
                        <view class="operation_record_item_color">修改后</view>
                    </view>
                </view>
            </view>
        </view>
        <view class="footer_con">
            <button class="delete_record_button">删除记录</button>
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
        padding: 50rpx 24rpx 30rpx;
        position: relative;
        overflow-x: hidden;
        overflow: auto;

        .inventory_details {
            background: #FFFFFF;
            border-radius: 24rpx;
            padding: 0 28rpx;

            .inventory_details_item {
                padding: 34rpx 0;
                border-bottom: 1rpx solid #EFEFEF;

                .inventory_details_item_title {
                    font-weight: 500;
                    font-size: 28rpx;
                    color: #202020;

                    .order_title {
                        font-size: 32rpx;
                        color: #202020;
                    }

                    .order_no {
                        font-size: 32rpx;
                        color: #0C62FF;
                    }

                    .arrow_right {
                        width: 28rpx;
                        height: 28rpx;
                    }
                }

                .inventory_details_item_value {
                    font-weight: 400;
                    font-size: 28rpx;
                    color: #7C8191;
                    text-align: right;

                    .inventory_details_item_button {
                        padding: 16rpx 18rpx;
                        background: rgba(12, 104, 255, 0.05);
                        border-radius: 12rpx;
                        border: 1rpx solid #8CBAFF;
                        font-weight: 500;
                        font-size: 26rpx;
                        color: #0C62FF;
                        line-height: 1;
                        margin-left: 20rpx;
                    }
                }
            }
        }

        .operation_record {
            font-weight: bold;
            font-size: 32rpx;
            color: #202020;
            margin-top: 48rpx;
            margin-bottom: 24rpx;
        }

        .operation_record_list {
            gap: 20rpx;

            .operation_record_item {
                padding: 46rpx 28rpx;
                background: #FFFFFF;
                border-radius: 24rpx;
                font-weight: bold;
                font-size: 30rpx;
                color: #202020;
                gap: 102rpx;

                .operation_record_item_modify {
                    position: relative;
                    font-weight: bold;
                    font-size: 36rpx;
                    color: #0C62FF;

                    &::after {
                        content: '';
                        position: absolute;
                        width: 2rpx;
                        height: 34rpx;
                        background: #DBDBDB;
                        left: -51rpx;
                        top: 50%;
                        transform: translateY(-50%);
                    }

                }

                .operation_record_item_color {
                    font-weight: 400;
                    font-size: 26rpx;
                    color: #7C8191;
                }

            }
        }
    }

    .delete_record_button {
        height: 96rpx;
        background: rgba(255, 12, 12, 0.04);
        border-radius: 48rpx;
        border: 1rpx solid #F9ABAB;
        font-weight: 500;
        font-size: 30rpx;
        color: #FF0C0C;
        line-height: 96rpx;
    }
}
</style>