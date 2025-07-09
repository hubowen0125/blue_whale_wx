<script lang="ts" setup>
import { getByOrderNoApi, orderShipRecordShipApi } from "@/http/api/order";
import checkbox_active from "@/static/images/checkbox_active.png"
import deliverGoodsInfo from "../components/deliverGoodsInfo/index.vue"
import QRCode from 'weapp-qrcode';
import close_icon_1 from "@/static/images/close_icon_1.png"

const { proxy } = getCurrentInstance() as any;



// 全选
const selectAll = ref(false)
const isRefund = ref(false)
const orderNo = ref('')
const orderDetails = ref<any>({})
const shipParams = reactive<any>({
    orderNo: '',
    productsParams: []
})
const qrcodeIcon = ref('')
const codePopupRef = ref()

onLoad((e: any) => {
    if (e.orderNo) {
        orderNo.value = e.orderNo
        shipParams.orderNo = e.orderNo
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

// 立即发货
const deliverGoodsFu = () => {
    console.log('立即发货')
    shipParams.productsParams = []
    orderDetails.value.orderProductsList.map((item: any) => {
        const obj: any = {
            orderProductId: item.id,
            productsDetailParams: []
        }
        item.orderProductsDetailList.map((items: any) => {
            obj.productsDetailParams.push({
                orderProductDetailId: items.id,
                handNum: items.returnNum,
            })
        })
        shipParams.productsParams.push(obj)
    })
    proxy.$Loading()
    orderShipRecordShipApi(shipParams).then((res: any) => {
        const { code, data, msg } = res
        proxy.$CloseLoading();
        if (code == proxy.$successCode) {
            console.log(data);
            proxy.$Toast({ title: '发货成功' })
            const { orderNo, packagingId } = orderDetails.value
            // 生成二维码
            new QRCode({
                width: 140,
                height: 140,
                canvasId: 'qrcode',
                text: `shipId=${data}&orderNo=${orderNo}&packagingId=${packagingId}`, // 二维码内容动态化
                callback: (res: any) => {
                    console.log(res)
                    uni.canvasToTempFilePath({
                        canvasId: 'qrcode',
                        success: async (res: any) => {
                            qrcodeIcon.value = res.tempFilePath;
                            codePopupRef.value.open('center')
                        }
                    })
                }
            });
        } else {
            proxy.$Toast({ title: msg })
        }
    }, (req => {
        proxy.$CloseLoading();
        proxy.$Toast({ title: req.msg })
    }))
}

const closePopupFu = () => {
    uni.navigateBack()
    codePopupRef.value.close()
}
</script>



<template>
    <view class="container flex_column">
        <view class="bg"></view>
        <com-header header-title="发货详情" :backColor="false" :titleColor="true"></com-header>
        <view class="order_info flex_align flex_between">
            <view class="flex_align order_info_con">
                <view class="flex_column order_info_item">
                    <view>{{ orderDetails.totalHandNum }}手/{{ orderDetails.totalNum }}件</view>
                    <view class="order_info_title">总件数</view>
                </view>
                <view class="flex_column order_info_item">
                    <view>{{ orderDetails.unSendHandNum }}手/{{ orderDetails.unSendNum }}件</view>
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
                                orderType="handleRefund"
                                miniRole="manufacturer"
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
        <view class="footer_con ">
            <button class="button_defalut" @click="deliverGoodsFu">立即发货</button>
        </view>
        <canvas class="code_icon" canvas-id="qrcode"
            style="width: 140px; height: 140px;position: absolute;left: -9999px;"></canvas>
    </view>

    <uni-popup ref="codePopupRef">
        <view class="popup_main flex_column flex_align">
            <view>发货成功</view>
            <image class="popup_img" :src="qrcodeIcon" :show-menu-by-longpress="true"></image>
            <view class="popup_tips popup_text">请下载或打印该二维码</view>
            <view class="popup_text">已便于打包站扫码入库</view>
            <view class="popup_text">在发货记录中也可查看该二维码</view>
        </view>
        <image class="close_icon" :src="close_icon_1" @click="closePopupFu"></image>
    </uni-popup>
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
}

.popup_main {
    width: 532rpx;
    height: 590rpx;
    background: #FFFFFF;
    border-radius: 24rpx;
    font-weight: bold;
    font-size: 36rpx;
    color: #202020;
    padding-top: 60rpx;
    box-sizing: border-box;

    .popup_img {
        width: 280rpx;
        height: 280rpx;
        margin: 36rpx auto 0;
    }

    .popup_text {
        font-weight: 500;
        font-size: 24rpx;
        color: #7C8191;
        margin-top: 6rpx;
    }

    .popup_tips {
        color: #FF840C;
        margin-top: 14px;
    }
}

.close_icon {
    width: 56rpx;
    height: 56rpx;
    display: block;
    margin: 40rpx auto 0;
}
</style>