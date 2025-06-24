<script lang="ts" setup>
import { orderShipRecordListApi, orderPaymentRecordListApi, orderOperationRecordListApi } from "@/http/api/order";
import QR_code_icon from "@/static/images/QR_code_icon.png"
import { dateStrToDateFormat, formatNumber } from "@/utils/utils";


const { proxy } = getCurrentInstance() as any;

const stateList = [
    {
        title: '发货记录',
        key: 0,
    },
    {
        title: '收银记录',
        key: 1,
    },
    {
        title: '其他记录',
        key: 2,
    },
]
const activeState = ref(0)
const orderNo = ref('')
const shipmentRecord = ref<Array<any>>([])
const cashierRecord = ref<Array<any>>([])
const otherRecords = ref<Array<any>>([])

onLoad((e: any) => {
    if (e.orderNo) {
        orderNo.value = e.orderNo
        orderShipRecordListFu()
    }
})

/**
 * 获取发货记录
 */
const orderShipRecordListFu = () => {
    proxy.$Loading()
    orderShipRecordListApi({ orderNo: orderNo.value }).then((res: any) => {
        const { code, data, msg, token } = res
        proxy.$CloseLoading();
        if (code == proxy.$successCode) {
            if (data && data.length > 0) {
                shipmentRecord.value = data
            }
        } else {
            proxy.$Toast({ title: msg })
        }
    }, (req => {
        proxy.$CloseLoading();
        proxy.$Toast({ title: req.msg })
    }))
}

/**
 * 获取收银记录
 */
const orderPaymentRecordListFu = () => {
    proxy.$Loading()
    orderPaymentRecordListApi({ orderNo: orderNo.value }).then((res: any) => {
        const { code, data, msg, token } = res
        proxy.$CloseLoading();
        if (code == proxy.$successCode) {
            if (data && data.length > 0) {
                cashierRecord.value = data
            }
        } else {
            proxy.$Toast({ title: msg })
        }
    }, (req => {
        proxy.$CloseLoading();
        proxy.$Toast({ title: req.msg })
    }))
}

/**
 * 查询订单操作记录
 */
const orderOperationRecordListFu = () => {
    proxy.$Loading()
    orderOperationRecordListApi({ orderNo: orderNo.value }).then((res: any) => {
        const { code, data, msg, token } = res
        proxy.$CloseLoading();
        if (code == proxy.$successCode) {
            if (data && data.length > 0) {
                otherRecords.value = data
            }
        } else {
            proxy.$Toast({ title: msg })
        }
    }, (req => {
        proxy.$CloseLoading();
        proxy.$Toast({ title: req.msg })
    }))
}

const selectActiveStateFu = (key: number) => {
    activeState.value = key
    if (key == 0) {
        orderShipRecordListFu()
    } else if (key == 1) {
        orderPaymentRecordListFu()
    } else if (key == 2) {
        orderOperationRecordListFu()
    }
}

/**
 * 滑动加载
 */
const scrolltolower = () => {
    // if (!slideLoading.value) return
    console.log('++++++++');
    // manageDevicesParams.value.page += 1
    // resetManageDevicesParams()
}
</script>


<template>
    <view class="container flex_column">
        <view class="bg"></view>
        <com-header header-title="操作记录" :backColor="false" :titleColor="true"></com-header>
        <view class="record_state_list flex_align flex_around">
            <view :class="['record_state_item', activeState == item.key ? 'record_state_item_active' : '']"
                v-for="item in stateList" :key="item.key" @click="selectActiveStateFu(item.key)">
                <view>{{ item.title }}</view>
            </view>
        </view>
        <view class="main_con flex_1">
            <scroll-view class="scroll_con " scroll-y="true"
                lower-threshold="50"
                @scrolltolower="scrolltolower">
                <view class="record_list flex_column">
                    <template v-if="activeState == 0 && shipmentRecord.length > 0" v-for="item in shipmentRecord"
                        :key="`shipment_${item.id}`">
                        <view class="record_item flex_column">
                            <view>{{ item.userName }}</view>
                            <view class="flex_between flex_align">
                                <view class="record_item_time">{{ dateStrToDateFormat(item.createTime, '') }}</view>
                                <view class="record_item_content">{{ item.handNum }}手/{{ item.num }}件</view>
                            </view>
                            <view class="record_item_code_con flex_align">
                                <image class="QR_code_icon" :src="QR_code_icon"></image>
                                <view class="flex_1">发货二维码</view>
                                <button class="record_item_code_btn">查看</button>
                            </view>
                        </view>
                    </template>
                    <template v-else-if="activeState == 1 && cashierRecord.length > 0" v-for="item in cashierRecord"
                        :key="`cashier_${item.id}`">
                        <view class="record_item cashier_record flex_align">
                            <image class="cashier_img"></image>
                            <view class="flex_column flex_1 cashier_record_content">
                                <view>{{ item.payUserName }}</view>
                                <view class="flex_between flex_align">
                                    <view class="record_item_time">{{ dateStrToDateFormat(item.payTime, '') }}</view>
                                    <view class="cashier_record_price">
                                        <text class="cashier_record_price_icon">¥</text>
                                        <text>{{ formatNumber(item.amount) }}</text>
                                    </view>
                                </view>
                            </view>
                        </view>
                    </template>
                    <template v-else-if="activeState == 2 && otherRecords.length > 0" v-for="item in otherRecords"
                        :key="`other_${item.id}`">
                        <view class="record_item flex_column">
                            <view class="flex_between flex_align">
                                <view>{{ item.userName }}</view>
                                <view class="record_item_status">{{ item.message }}</view>
                            </view>
                            <view class="record_item_time">{{ dateStrToDateFormat(item.createTime, '') }}</view>
                        </view>
                    </template>
                    <com-no_data v-else noDataText="暂无记录"></com-no_data>
                </view>
            </scroll-view>
        </view>
    </view>
</template>


<style lang="scss" scoped>
.container {
    width: 100%;
    height: 100%;
    background: #F2F1F5;

    .bg {
        width: 750rpx;
        height: 282rpx;
        background: linear-gradient(136deg, #0D5DFF 0%, #00AAFF 100%);
        transform: scaleY(-1);
        position: fixed;
        left: 0;
        top: 0;
    }

    .record_state_list {
        grid-gap: 20rpx;
        margin-top: 30rpx;
        position: relative;
        gap: 60rpx;

        .record_state_item {
            font-weight: 400;
            font-size: 28rpx;
            color: #D3EAFF;
            padding: 14rpx 0;
            text-align: center;
        }

        .record_state_item_active {
            font-weight: 500;
            font-size: 28rpx;
            color: #FFFFFF;
            position: relative;

            &::after {
                content: '';
                position: absolute;
                width: 32rpx;
                height: 4rpx;
                background: #FFFFFF;
                border-radius: 2rpx;
                bottom: 0;
                left: 50%;
                transform: translateX(-50%);
            }
        }
    }

    .main_con {
        overflow: hidden;
        margin-top: 24rpx;
        margin-top: 50rpx;

        .record_list {
            padding: 0 30rpx 30rpx;
            gap: 20rpx;
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            position: relative;

            .record_item {
                font-weight: bold;
                font-size: 30rpx;
                color: #202020;
                background: #FFFFFF;
                border-radius: 24rpx;
                padding: 28rpx;
                gap: 10rpx;

                .record_item_time {
                    font-weight: 400;
                    font-size: 26rpx;
                    color: #7C8191;
                }

                .record_item_content {
                    font-weight: 500;
                    font-size: 26rpx;
                    color: #FF840C;
                }

                .record_item_status {
                    background: rgba(255, 132, 12, 0.03);
                    border-radius: 12rpx;
                    padding: 12rpx;
                    font-weight: 400;
                    font-size: 26rpx;
                    color: #FF840C;
                }

                .record_item_code_con {
                    padding-top: 32rpx;
                    border-top: 1rpx solid #EFEFEF;
                    font-weight: 500;
                    font-size: 28rpx;
                    color: #202020;
                    gap: 12rpx;

                    .QR_code_icon {
                        width: 48rpx;
                        height: 48rpx;
                    }

                    .record_item_code_btn {
                        width: 136rpx;
                        height: 76rpx;
                        background: rgba(12, 104, 255, 0.03);
                        border-radius: 44rpx;
                        border: 1rpx solid #CDE1FF;
                        font-weight: 500;
                        font-size: 30rpx;
                        color: #0C62FF;
                        line-height: 76rpx;
                    }
                }
            }

            .cashier_record {
                padding: 38rpx 28rpx;
                gap: 24rpx;

                .cashier_img {
                    width: 64rpx;
                    height: 64rpx;
                    border-radius: 50%;
                    border: 1px solid #000;
                }

                .cashier_record_content {
                    gap: 6rpx;

                    .cashier_record_price {
                        font-weight: 500;
                        color: #202020;
                        font-size: 32rpx;

                        .cashier_record_price_icon {
                            font-size: 24rpx;
                        }
                    }
                }
            }
        }
    }
}
</style>