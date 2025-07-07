<script lang="ts" setup>
import { paymentTypeApi, getPaymentInfoApi, paymentApi } from "@/http/api/order"
import checkbox from "@/static/images/checkbox.png"
import checkbox_active from "@/static/images/checkbox_active.png"
import { formatNumber, handleInput } from "@/utils/utils"

const { proxy } = getCurrentInstance() as any;

const payMathodList = ref<Array<any>>([])
const payParams = reactive<any>({
    orderNo: '',
    amount: '',
    type: '',
})
const paymentInfo = ref({
    wholesaleName: '',
    totalDebt: '',
    orderAmount: '',
    orderRemainAmount: '',
    orderPaymentAmount: '',
})

onLoad((e: any) => {
    if (e.orderNo) {
        paymentTypeFu()
        getPaymentInfoFu(e.orderNo)
        payParams.orderNo = e.orderNo
    }
})

/**
 * 获取支付方式
 */
const paymentTypeFu = () => {
    paymentTypeApi().then((res: any) => {
        const { code, data, msg } = res
        proxy.$CloseLoading();
        if (code == proxy.$successCode) {
            payMathodList.value = data
        } else {
            proxy.$Toast({ title: msg })
        }
    }, (req => {
        proxy.$CloseLoading();
        proxy.$Toast({ title: req.msg })
    }))
}

/**
 * 获取支付信息
 */
const getPaymentInfoFu = (orderNo: string) => {
    getPaymentInfoApi({ orderNo }).then((res: any) => {
        const { code, data, msg } = res
        proxy.$CloseLoading();
        if (code == proxy.$successCode) {
            console.log(data);
            paymentInfo.value = data
        } else {
            proxy.$Toast({ title: msg })
        }
    }, (req => {
        proxy.$CloseLoading();
        proxy.$Toast({ title: req.msg })
    }))
}

const inputValueFu = async (e: any) => {
    const value = e.target.value
    const result = await handleInput(value) as string;
    if (result) {
        const num = parseInt(result, 10)
        console.log(num, 'numnumnumnum');
        payParams.amount = num.toString()
    } else {
        payParams.amount = 0
    }
}

const selectPayMethod = (item: any) => {
    payParams.type = item.type
}

const paymentFu = () => {
    const { amount, type } = payParams
    if (!amount) {
        proxy.$Toast({ title: '请输入收款金额' })
        return
    }
    if (!type) {
        proxy.$Toast({ title: '请选择支付方式' })
        return
    }
    proxy.$Loading()
    paymentApi(payParams).then((res: any) => {
        const { code, data, msg } = res
        proxy.$CloseLoading();
        if (code == proxy.$successCode) {
            proxy.$Toast({ title: '收款成功' })
            setTimeout(() => {
                uni.navigateBack()
            }, 1000)
        } else {
            proxy.$Toast({ title: msg })
        }
    }, (req => {
        proxy.$CloseLoading();
        proxy.$Toast({ title: req.msg })
    }))
}
</script>


<template>
    <view class="container flex_column">
        <view class="bg"></view>
        <com-header header-title="收银" :backColor="false" :titleColor="true"></com-header>
        <view class="main_con flex_column flex_1">
            <view class="customer_info">
                <view class="customer_info_item flex_align flex_between">
                    <view>客户名称</view>
                    <view class="customer_info_item_content flex_1">{{ paymentInfo.wholesaleName }}</view>
                </view>
                <view class="customer_info_item flex_align flex_between">
                    <view>累计欠款</view>
                    <view class="flex_1">
                        <text class="price">{{ formatNumber(paymentInfo.totalDebt) }}</text>
                        <text class="debt_price">(含本单:{{ formatNumber(paymentInfo.orderRemainAmount) }})</text>
                    </view>
                </view>
                <view class="customer_info_item flex_align flex_between">
                    <view>本单金额</view>
                    <view class="flex_1">
                        <text class="price">{{ formatNumber(paymentInfo.orderAmount) }}</text>
                        <text class="received_price">(已收:{{ formatNumber(paymentInfo.orderPaymentAmount) }}) </text>
                    </view>
                </view>
            </view>
            <view class="customer_info">
                <view class="customer_info_item flex_align flex_between">
                    <view>收款金额</view>
                    <input class="flex_1" type="number" placeholder="请输入收款金额" v-model="payParams.amount"
                        @blur="inputValueFu">
                </view>
            </view>
            <view class="pay_method_con">
                <view>选择支付方式</view>
                <view class="flex_align pay_item" v-for="item in payMathodList" :key="item.name"
                    @click="selectPayMethod(item)">
                    <image class="pay_item_icon" :src="item.icon"></image>
                    <view class="flex_align pay_item_content flex_between flex_1">
                        <view>
                            <view class="pay_item_name">{{ item.name }}</view>
                            <view>{{ item.description }}</view>
                        </view>
                        <image class="pay_item_select" :src="item.type == payParams.type ? checkbox_active : checkbox">
                        </image>
                    </view>
                </view>
            </view>
        </view>
        <view class="footer_con"><button class="button_defalut" @click="paymentFu">确认收款 ¥{{
            formatNumber(payParams.amount) }}</button></view>
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
        overflow-x: hidden;
        overflow-y: auto;

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