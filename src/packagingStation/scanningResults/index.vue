<script lang="ts" setup>
import { handleInput } from "@/utils/utils";
import { scanCodeApi, stockInApi } from "../http/packagingStation";
import scan_icon from "@/static/images/packagingStation/scan_icon.png"

let timer: any
const { proxy } = getCurrentInstance() as any;

interface STOCKINPARAMS {
    type: number
    manufacturerName: string
    packagingWholesaleId: string
    storageNum: number | string
    checkHandNum: number | string
    [key: string]: string | number // 添加索引签名以允许通过字符串索引
}

const orderDetail = [
    {
        title: '厂家',
        value: 'manufacturerName',
        type: 'text'
    },
    {
        title: '批发商',
        value: 'wholesaleName',
        type: 'text'
    },
    {
        title: '客户仓位',
        value: 'storageNum',
        type: 'text'
    },
    {
        title: '订单数量(手)',
        value: 'orderHandNum',
        type: 'text'
    },
    {
        title: '核点数量(手)',
        value: '请输入核点数量',
        type: 'input'
    },
]
const codeDetails = ref<any>({})
const stockInParams = ref<STOCKINPARAMS>({
    type: 2, // 类型1.输入 2.扫码 
    manufacturerName: '',
    packagingWholesaleId: '',
    storageNum: '',
    checkHandNum: ''
})

onLoad((e: any) => {
    if (e.orderNo) {
        const { orderNo, shipId } = e
        scanCodeFu(orderNo, shipId)
    }
})

/**
 * 扫码按钮点击事件
 */
const scanCodeFu = (orderNo: string, shipId: string) => {
    scanCodeApi({ orderNo, shipId }).then((res: any) => {
        const { code, data, msg, token } = res
        proxy.$CloseLoading();
        if (code == proxy.$successCode) {
            console.log(data, '0000');
            codeDetails.value = data
            stockInParams.value = { ...stockInParams.value, ...codeDetails.value }
        } else {
            proxy.$Toast({ title: msg })
        }
    }, (req => {
        proxy.$CloseLoading();
        proxy.$Toast({ title: req.msg })
    }))
}

const inputValueFu = async (e: any, key: string) => {
    const value = e.target.value
    const result = await handleInput(value) as string;
    if (result) {
        const num = parseInt(result, 10)
        stockInParams.value[key] = num.toString()
    } else {
        stockInParams.value[key] = 0
    }
}

const stockInFu = () => {
    if (!stockInParams.value.checkHandNum) {
        return proxy.$Toast({ title: '请输入核点数量' })
    }
    proxy.$Loading()
    stockInApi(stockInParams.value).then((res: any) => {
        const { code, data, msg, token } = res
        proxy.$CloseLoading();
        if (code == proxy.$successCode) {
            console.log(data, '0000');
            proxy.$Toast({
                title: '入库成功',
                successCB: () => {
                    timer = setTimeout(() => {
                        uni.navigateBack()
                    }, 1500)
                }
            })
        } else {
            proxy.$Toast({ title: msg })
        }
    }, (req => {
        proxy.$CloseLoading();
        proxy.$Toast({ title: req.msg })
    }))
}

/**
 * 重置按钮点击事件
 */
const resetFu = () => {
    uni.navigateBack()
}

/**
 * 页面
 */
onUnmounted(() => {
    // 清除定时器
    if (timer) {
        clearTimeout(timer);
        timer = null;
    }
})
</script>


<template>
    <view class="container flex_column">
        <view class="bg"></view>
        <com-header :backColor="false"></com-header>
        <view class="main flex_1">
            <view class="desc_con flex_align">
                <image class="scan_icon" :src="scan_icon"></image>
                <text>扫码结果</text>
            </view>
            <view class="result_con">
                <view class="result_title flex_align">
                    <text>订单号: </text>
                    <text class="order_num">{{ codeDetails.orderNo }}</text>
                </view>
                <view class="result_detail">
                    <view class="result_item flex_align" v-for="item in orderDetail" :key="item.title">
                        <view class="result_item_title">{{ item.title }}</view>
                        <view class="result_item_key flex_1" v-if="item.type === 'text'">
                            {{ codeDetails[item.value] }}
                        </view>
                        <input class="result_item_key flex_1" v-model.trim="stockInParams.checkHandNum" v-else
                            type="number"
                            :placeholder="item.value" @blur="(e: any) => inputValueFu(e, 'checkHandNum')">
                    </view>
                </view>
                <view class="btn_con flex_align">
                    <button class="reset_btn" @click="resetFu">重置</button>
                    <button class="button_defalut flex_1" @click="stockInFu">立即入库</button>
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
        height: 623rpx;
        background: linear-gradient(136deg, #0D5DFF 0%, #00AAFF 100%);
        clip-path: ellipse(100% 100% at 50% 100%);
        /* 底部椭圆裁剪 */
        transform: scaleY(-1);
        position: fixed;
        left: 0;
        top: 0;
    }

    .main {
        padding: 32rpx 24rpx;
        position: relative;

        .desc_con {
            font-weight: bold;
            font-size: 48rpx;
            color: #FFFFFF;

            .scan_icon {
                width: 40rpx;
                height: 40rpx;
                margin-right: 20rpx;
            }
        }

        .result_con {
            background: #FFFFFF;
            margin-top: 40rpx;
            border-radius: 20rpx;
            padding: 0 28rpx 60rpx;

            .result_title {
                width: 606rpx;
                height: 136rpx;
                border-bottom: 2rpx dashed #B2C6E5;
                margin: auto;
                justify-content: center;
                font-weight: bold;
                font-size: 32rpx;
                color: #202020;

                .order_num {
                    color: #0C62FF;
                }
            }

            .result_detail {
                padding: 40rpx 28rpx;

                .result_item {
                    padding: 34rpx 0;
                    border-bottom: 1rpx solid #EFEFEF;
                    font-weight: 500;
                    font-size: 28rpx;
                    color: #202020;

                    .result_item_key {
                        font-weight: 400;
                        font-size: 28rpx;
                        color: #7C8191;
                        text-align: right;
                    }
                }
            }

            .btn_con {
                gap: 16rpx;

                .reset_btn {
                    width: 184rpx;
                    height: 96rpx;
                    background: rgba(12, 104, 255, 0.05);
                    border-radius: 48rpx;
                    border: 1rpx solid #8CBAFF;
                    font-weight: 500;
                    font-size: 30rpx;
                    color: #0C62FF;
                    line-height: 96rpx;
                }
            }
        }
    }
}
</style>