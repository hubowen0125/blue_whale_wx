<script lang="ts" setup>
import { getByOrderNoApi } from "@/http/api/order";
import { businessOrderApi } from "../http/wholesaler";
import checkbox from "@/static/images/checkbox.png"
import checkbox_active from "@/static/images/checkbox_active.png"
import hint_icon from "@/static/images/hint_icon.png"

const { proxy } = getCurrentInstance() as any;

const popupData = {
    popupTitle: '修改订单',
    pupupType: 'default',
    popupContent: [
        {
            text: '是否确认修改该订单',
        },
    ],
    cancelText: '取消',
    confirmText: '确定',
    callBack: true
}

const popupCom = ref()

// 全选
const selectAll = ref(false)
const isRefund = ref(false)
const orderDetails = ref<any>({})
const orderNo = ref('')
const returnParams = reactive<any>({
    orderNo: '',
    productsParams: []
})



onLoad((e: any) => {
    if (e.orderNo) {
        orderNo.value = e.orderNo
        returnParams.orderNo = e.orderNo
        getByOrderNoFu()
    }
})

/**
 * 获取订单详情
 */
const getByOrderNoFu = () => {
    proxy.$Loading()
    getByOrderNoApi({ orderNo: orderNo.value }).then((res: any) => {
        const { code, data, msg } = res
        proxy.$CloseLoading();
        if (code == proxy.$successCode) {
            console.log(data);
            data.orderProductsList.map((item: any) => {
                item.orderProductsDetailList.map((items: any) => {
                    return items.returnNum = 0
                })
                item.productColorsList = item.orderProductsDetailList
                return item
            })
            orderDetails.value = data
        } else {
            proxy.$Toast({ title: msg })
        }
    }, (req => {
        proxy.$CloseLoading();
        proxy.$Toast({ title: req.msg })
    }))
}


/**
 * 全选
 */
const selectAllFu = (data: boolean) => {
    selectAll.value = data
}

/**
 * 选择是否退款
 */
const selectIsRefundFu = (item: boolean) => {
    isRefund.value = item
}

// 确认修改
const confirmModifyFu = () => {
    console.log('confirmModify');
    popupCom.value.showPopup()
}

// 确认弹窗
const confirmPopupFu = () => {
    console.log('1111');
    orderDetails.value.orderProductsList.map((item: any) => {
        const obj: any = {
            orderProductId: item.productId,
            productsDetailParams: []
        }
        item.orderProductsDetailList.map((items: any) => {
            obj.productsDetailParams.push({
                orderProductDetailId: items.id,
                handNum: items.returnNum,
            })
        })
        returnParams.productsParams.push(obj)
    })
    proxy.$Loading()
    businessOrderApi(returnParams).then((res: any) => {
        const { code, data, msg } = res
        proxy.$CloseLoading();
        if (code == proxy.$successCode) {
            console.log(data);
            uni.navigateBack()
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
        <com-header header-title="待发货退单" :backColor="false" :titleColor="true"></com-header>
        <view class="order_info flex_align flex_between">
            <view class="flex_align order_info_con">
                <view class="flex_column order_info_item">
                    <view>2手/10件</view>
                    <view class="order_info_title">总件数</view>
                </view>
                <view class="flex_column order_info_item">
                    <view>2手/10件</view>
                    <view class="order_info_title">待发货</view>
                </view>
            </view>
            <view class="flex_align" @click="selectAllFu(!selectAll)">
                <image class="checkbox" :src="selectAll ? checkbox_active : ''"></image>
                <text class="checkbox_text">全选</text>
            </view>
        </view>
        <view class="mian_con flex_1">
            <scroll-view class="scroll_con " scroll-y="true"
                lower-threshold="50">
                <view class="order_list flex_column">
                    <template v-for="item in orderDetails.orderProductsList" :key="item.id">
                        <view class="order_item">
                            <com-orderTable
                                miniRole="wholesaler"
                                orderType="handleRefund"
                                :productDetail="item"
                                :selectAll="selectAll"
                                @deselectAllFu="selectAllFu">
                            </com-orderTable>
                        </view>
                    </template>
                    <deliverGoodsInfo :deliverInfo="orderDetails.packaging"></deliverGoodsInfo>
                </view>
            </scroll-view>
        </view>
        <view class="footer_con flex_column">
            <view class="flex_align flex_between">
                <view class="flex_align">
                    <image class="footer_hint_icon" :src="hint_icon"></image>
                    <text>货款是否已退</text>
                </view>
                <view class="flex_align">
                    <view class="flex_align" @click="selectIsRefundFu(true)">
                        <image class="checkbox" :src="isRefund ? checkbox_active : checkbox"></image>
                        <text class="checkbox_text">是</text>
                    </view>
                    <view class="flex_align" @click="selectIsRefundFu(false)">
                        <image class="checkbox" :src="!isRefund ? checkbox_active : checkbox"></image>
                        <text class="checkbox_text">否</text>
                    </view>
                </view>
            </view>
            <button class="button_defalut" @click="confirmModifyFu">确认修改</button>
        </view>
    </view>
    <com-popup_com ref="popupCom" :popupData="popupData" @confirmPopupFu="confirmPopupFu"></com-popup_com>
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

    .order_info {
        font-weight: bold;
        font-size: 28rpx;
        color: #9FFFFD;
        position: relative;
        padding: 20rpx 28rpx 0 24rpx;

        .order_info_con {
            gap: 110rpx;

            .order_info_item {
                gap: 10rpx;

                .order_info_title {
                    font-weight: 400;
                    font-size: 24rpx;
                    color: #DFEFFF;
                }
            }

            .order_info_item:nth-child(1) {
                position: relative;

                &::after {
                    content: "";
                    position: absolute;
                    width: 2rpx;
                    height: 38rpx;
                    background: #FFFFFF;
                    opacity: 0.3;
                    right: -55rpx;
                    top: 50%;
                    transform: translateY(-50%);
                }
            }
        }

        .checkbox {
            width: 36rpx;
            height: 36rpx;
            background: #FFFFFF;
            border-radius: 50%;
            margin-right: 12rpx;
        }

        .checkbox_text {
            font-weight: 500;
            font-size: 28rpx;
            color: #FFFFFF;

        }
    }

    .mian_con {
        overflow: hidden;
        margin-top: 50rpx;

        .order_list {
            padding: 0 24rpx;
            gap: 20rpx;

            .order_item {
                background: #FFFFFF;
                border-radius: 24rpx;
                padding: 36rpx 28rpx;
            }
        }
    }

    .footer_con {
        gap: 24rpx;
        font-weight: 400;
        font-size: 28rpx;
        color: #202020;
        padding-top: 30rpx;

        .footer_hint_icon {
            width: 26rpx;
            height: 26rpx;
            margin-right: 8rpx;
        }

        .checkbox {
            width: 32rpx;
            height: 32rpx;
            margin-right: 8rpx;
            margin-left: 52rpx;
        }

        .checkbox_text {
            font-weight: 400;
            font-size: 28rpx;
            color: #7C8191;
        }
    }
}
</style>