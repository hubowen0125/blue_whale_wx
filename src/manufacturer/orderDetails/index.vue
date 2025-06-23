<script lang="ts" setup>
import { getByOrderNoApi } from "@/http/api/order";
import wait_icon from "@/static/images/wait_icon.png";
import del_icon from "@/static/images/del_icon.png";
import deliverGoodsInfo from "../components/deliverGoodsInfo/index.vue"
import { dateStrToDateFormat, formatNumber } from "@/utils/utils";

const { proxy } = getCurrentInstance() as any;


const orderText = reactive([
    {
        title: '批发商',
        value: computed(() => orderDetails.value?.wholesale?.deptName),
        value1: computed(() => orderDetails.value?.wholesale?.phone),
    },
    {
        title: '总件数',
        value: computed(() => `${orderDetails.value?.totalHandNum}手/${orderDetails.value?.totalNum}件`),
    },
    {
        title: '核点',
        value: computed(() => `${orderDetails.value?.checkHandNum}手/${orderDetails.value?.checkNum}件`),
    },
    {
        title: '总金额',
        value: computed(() => formatNumber(orderDetails.value?.totalAmount)),
        type: 'price',
    },
    {
        title: '已收金额',
        value: computed(() => formatNumber(orderDetails.value?.paymentAmount)),
        type: 'price',
    },
    {
        title: '订单号',
        value: computed(() => orderDetails.value?.orderNo),
    },
    {
        title: '创建时间',
        value: computed(() => dateStrToDateFormat(orderDetails.value?.createTime, '')),
    },
    {
        title: '备注',
        value: computed(() => orderDetails.value?.remark),
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
    confirmText: '确定'
}

const popupCom = ref()
const orderNo = ref('')
const orderDetails = ref<any>({})

onLoad((e: any) => {
    if (e.orderNo) {
        orderNo.value = e.orderNo
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
                <view class="order_details_item flex_align flex_between" v-for="item, index in orderText"
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
            <deliverGoodsInfo :deliver-info="orderDetails.packaging"></deliverGoodsInfo>
            <view class="order_info">
                <view class="order_info_title">商品信息</view>
                <view class="table_con flex_column">
                    <template v-for="item in orderDetails.orderProductsList" :key="item.id">
                        <com-orderTable
                            orderType="show"
                            :productDetail="item">
                        </com-orderTable>
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
            <button class="deliver_goods_btn" @click="deliverGoodsFu">发货</button>
            <button class="button_defalut" @click="cashOnDeliveryFu">收银</button>
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
</style>