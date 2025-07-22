<script lang="ts" setup>
import { getByOrderNoApi, delByOrderNoApi } from "@/http/api/order";
import wait_icon from "@/static/images/wait_icon.png";
import del_icon from "@/static/images/del_icon.png";
import close_icon_1 from "@/static/images/close_icon_1.png"
import deliverGoodsInfo from "../components/deliverGoodsInfo/index.vue"
import { dateStrToDateFormat, formatNumber, preciseMath } from "@/utils/utils";
import QRCode from 'weapp-qrcode';

const { proxy } = getCurrentInstance() as any;
const preciseMathFu = preciseMath()

const orderText = reactive([
    {
        title: '批发商',
        value: computed(() => orderDetails.value?.wholesale?.cityName),
        value1: computed(() => orderDetails.value?.wholesale?.deptName),
        show: true
    },
    {
        title: '批发商手机号',
        value: computed(() => orderDetails.value?.wholesale?.phone),
        show: true
    },
    {
        title: '总件数',
        value: computed(() => `${orderDetails.value?.totalHandNum}手/${orderDetails.value?.totalNum}件`),
        show: true
    },
    {
        title: '核点',
        value: computed(() => `${orderDetails.value?.checkHandNum}手`),
        show: true
    },
    {
        title: '总金额',
        value: computed(() => formatNumber(orderDetails.value?.totalAmount)),
        show: true
    },
    {
        title: '已收金额',
        value: computed(() => formatNumber(orderDetails.value?.paymentAmount)),
        type: 'price',
        show: true
    },
    {
        title: '订单号',
        value: computed(() => orderDetails.value?.orderNo),
        show: true
    },
    {
        title: '创建时间',
        value: computed(() => dateStrToDateFormat(orderDetails.value?.createTime, '')),
        show: true
    },
    {
        title: '打包站',
        value: computed(() => orderDetails.value?.packaging?.deptName || ''),
        show: true
    },
    {
        title: '打包站地址',
        value: computed(() => orderDetails.value?.packaging?.address || ''),
        show: true
    },
    {
        title: '打包站手机号',
        value: computed(() => orderDetails.value?.packaging?.phone || ''),
        show: true
    },
    {
        title: '发货二维码',
        buttonText: '立即查看',
        show: computed(() => orderDetails.value?.shipId ? true : false),
    },
    {
        title: '备注',
        value: computed(() => orderDetails.value?.remark),
        show: true
    },
])
const popupData = {
    popupTitle: '作废订单',
    pupupType: 'default',
    popupContent: [
        {
            text: '是否作废该订单',
        },
    ],
    cancelText: '取消',
    confirmText: '确定',
    callBack: true
}
const qrcodeIcon = ref('')
const popupCom = ref()
const orderNo = ref('')
const orderDetails = ref<any>({})
const codePopupRef = ref()

onLoad((e: any) => {
    if (e.orderNo) {
        orderNo.value = e.orderNo
    }
})

onShow(() => {
    if (orderNo.value) {
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


const showPopupFu = () => {
    popupCom.value.showPopup()
}

/**
 * 作废订单
 */
const delByOrderNoFu = () => {
    delByOrderNoApi({ orderNo: orderNo.value }).then((res: any) => {
        const { code, data, msg } = res
        proxy.$CloseLoading();
        if (code == proxy.$successCode) {
            console.log(data);
            getByOrderNoFu()
            proxy.$Toast({ title: '作废成功' })
        } else {
            proxy.$Toast({ title: msg })
        }
    }, (req => {
        proxy.$CloseLoading();
        proxy.$Toast({ title: req.msg })
    }))
}

/**
 * 查看操作记录
 */
const viewRecordsFu = () => {
    uni.navigateTo({
        url: `/manufacturer/operationRecord/index?orderNo=${orderNo.value}`
    })
}

// 发货
const deliverGoodsFu = () => {
    uni.navigateTo({
        url: `/manufacturer/deliverGoodsDetail/index?orderNo=${orderNo.value}`
    })
}

// 收银
const cashOnDeliveryFu = () => {
    uni.navigateTo({
        url: `/manufacturer/cashierPage/index?orderNo=${orderNo.value}`
    })
}


/**
 * 查看二维码
 * @param item 
 */
const viewCodeFu = () => {
    console.log('1111');

    const { orderNo, packagingId, shipId } = orderDetails.value
    // 生成二维码
    new QRCode({
        width: 140,
        height: 140,
        canvasId: 'qrcode',
        text: `shipId=${shipId}&orderNo=${orderNo}&packagingId=${packagingId}`, // 二维码内容动态化
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
};


const closePopupFu = () => {
    codePopupRef.value.close()
}


</script>


<template>
    <view class="container flex_column">
        <view class="bg"></view>
        <com-header :backColor="false"></com-header>
        <view class="main_con flex_1 flex_column">
            <view class="order_details">
                <view class="wait_con flex_between">
                    <view class="flex_align flex_center">
                        <image class="wait_icon" :src="wait_icon"></image>
                        <text>{{ orderDetails.statusMsg }}</text>
                    </view>
                    <view class="wait_num">已发货{{ preciseMathFu.subtract(orderDetails.totalHandNum || 0,
                        orderDetails.unSendHandNum || 0)
                    }}手/{{ preciseMathFu.subtract(orderDetails.totalNum || 0, orderDetails.unSendNum || 0) }}件
                    </view>
                </view>
                <template v-for="item, index in orderText"
                    :key="index">
                    <view class="order_details_item flex_align flex_between" v-if="item.show">
                        <view class="flex_align order_details_item_title">{{ item.title }}</view>
                        <view class="flex_1  order_details_item_value">
                            <view v-if="item.type === 'price'" class="order_details_item_value_price">¥{{ item.value }}
                            </view>
                            <view v-else-if="item.buttonText" style="color: #52B73C;" @click="viewCodeFu">{{
                                item.buttonText }}</view>
                            <view v-else>{{ item.value }}</view>
                            <view v-if="item.value1">{{ item.value1 }}</view>
                        </view>
                    </view>
                </template>
            </view>
            <!-- <deliverGoodsInfo :deliver-info="orderDetails.packaging"></deliverGoodsInfo> -->
            <view class="order_info">
                <view class="order_info_title">商品信息</view>
                <view class="table_con flex_column">
                    <template v-for="item in orderDetails.orderProductsList" :key="item.id">
                        <com-orderTable
                            orderType="detail"
                            miniRole="manufacturer"
                            :productDetail="item">
                        </com-orderTable>
                    </template>
                </view>
            </view>
        </view>
        <view class="footer_con flex_align flex_between">
            <view class="del_btn flex_column flex_align" v-if="orderDetails.status == 1" @click="showPopupFu">
                <image class="del_icon" :src="del_icon"></image>
                <text>作废</text>
            </view>
            <button class="records_btn flex_1" @click="viewRecordsFu">操作记录</button>
            <button v-if="[1, 2].includes(orderDetails.status)" class="deliver_goods_btn flex_1"
                @click="deliverGoodsFu">发货</button>
            <button v-if="orderDetails.paymentStatus == 1" class="button_defalut flex_1"
                @click="cashOnDeliveryFu">收银</button>
        </view>
        <canvas class="code_icon" canvas-id="qrcode"
            style="width: 140px; height: 140px;position: absolute;left: -9999px;"></canvas>
    </view>
    <com-popup_com ref="popupCom" :popupData="popupData" @confirmPopupFu="delByOrderNoFu"></com-popup_com>
    <uni-popup ref="codePopupRef" :mask-click="false">
        <view class="popup_main flex_column flex_align">
            <view>发货二维码</view>
            <image class="popup_img" :show-menu-by-longpress="true" :src="qrcodeIcon"></image>
        </view>
        <image class="close_icon" :src="close_icon_1" @click="closePopupFu"></image>
    </uni-popup>
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

        .order_details {
            background: #FFFFFF;
            border-radius: 24rpx;
            padding: 40rpx 28rpx;

            .wait_con {
                font-weight: bold;
                font-size: 48rpx;
                color: #202020;
                align-items: baseline;

                .wait_icon {
                    width: 48rpx;
                    height: 48rpx;
                    margin-right: 6rpx;
                }

                .wait_num {
                    font-weight: 500;
                    font-size: 28rpx;
                    color: #0C62FF;
                }
            }

            .order_details_item {
                margin-top: 20rpx;

                .order_details_item_title {
                    width: 200rpx;
                    font-weight: 400;
                    font-size: 26rpx;
                    color: #7C8191;
                }

                .order_details_item_value {
                    font-weight: 400;
                    font-size: 26rpx;
                    color: #202020;
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
        gap: 20rpx;

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

        .deliver_goods_btn {
            width: 200rpx;
            height: 96rpx;
            background: linear-gradient(90deg, #FF840C 0%, #FFA955 100%);
            border-radius: 48rpx;
            font-weight: 500;
            font-size: 30rpx;
            color: #FFFFFF;
            line-height: 96rpx;
        }

        .button_defalut {
            width: 200rpx;
        }
    }
}

.popup_main {
    width: 532rpx;
    height: 480rpx;
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
}

.close_icon {
    width: 56rpx;
    height: 56rpx;
    display: block;
    margin: 40rpx auto 0;
}
</style>