<script lang="ts" setup>
import { manufacturerWholesalePageApi } from "../http/manufacturer"
import { packagingWholesalePageApi } from "@/http/api/all"
import arrow_right from "@/static/images/arrow_right.png"
import deliverGoodsInfo from "../components/deliverGoodsInfo/index.vue"
import { useManufacturerStore } from "@/manufacturer/store/manufacturer";
import { formatNumber } from "@/utils/utils"
import { useUserStore } from "@/store/modules/user"
import { createOrderApi } from "@/http/api/order"

const useUser = useUserStore()
const useManufacturer = useManufacturerStore()
const { proxy } = getCurrentInstance() as any;

const orderTextList = reactive([
    {
        title: '批发商',
        value: computed(() => wholesaleDetail.value?.wholesaleName || '选择批发商'),
        value1: computed(() => wholesaleDetail.value?.wholesalePhone || ''),
        type: 'select'
    },
    {
        title: '总件数',
        value: computed(() => `${orderDetails.value?.totalHandNum}手/${orderDetails.value?.totalNum}件`),
    },
    {
        title: '总金额',
        value: computed(() => formatNumber(orderDetails.value?.totalAmount)), // 动态绑定计算属性,
        type: 'price',
    },
])

const wholesalerRef = ref();
const orderDetails = ref<any>({
    totalHandNum: computed(() => {
        let total = 0
        const list = useManufacturer.shoppingCart
        if (list.length > 0) {
            for (let i = 0; i < list.length; i++) {
                for (let j = 0; j < list[i].productColorsList.length; j++) {
                    total += list[i].productColorsList[j].handNum
                }
            }
        }
        return total
    }),
    totalNum: computed(() => {
        let total = 0
        const list = useManufacturer.shoppingCart
        if (list.length > 0) {
            for (let i = 0; i < list.length; i++) {
                for (let j = 0; j < list[i].productColorsList.length; j++) {
                    total += list[i].unitQuantity * list[i].productColorsList[j].handNum
                }
            }
        }
        return total
    }),
    totalAmount: computed(() => {
        let total = 0
        const list = useManufacturer.shoppingCart
        if (list.length > 0) {
            for (let i = 0; i < list.length; i++) {
                for (let j = 0; j < list[i].productColorsList.length; j++) {
                    total += list[i].price * list[i].productColorsList[j].handNum  * list[i].unitQuantity
                }
            }
        }
        return total
    }),
    packagingId: '',
    wholesaleId: '',
    paymentType: '',
    viewInventory: 0,
    remark: '',
    orderProductsParams: useManufacturer.shoppingCart
})
const type = ref('')
const wholesaleList = ref<any[]>([])
const wholesaleDetail = ref<any>({})
const packagingStationList = ref<any[]>([])
const packagingDetail = ref<any>({})
const paramsPage = reactive({
    pageNum: 1,
    pageSize: 10,
})
const selectPackagingStationRef = ref()
const selectWholesalerRef = ref<any>()

onLoad(() => {
    manufacturerWholesalePageFu()
})


/**
 * 获取批发商列表
 */
const manufacturerWholesalePageFu = () => {
    manufacturerWholesalePageApi({}, paramsPage).then((res: any) => {
        const { code, data, msg, token } = res
        proxy.$CloseLoading();
        if (code == proxy.$successCode) {
            console.log(data, '0000');
            if (data && data.length > 0) {
                data.forEach((item: any) => {
                    item.active = false
                })
                wholesaleList.value = data;
            }
        } else {
            proxy.$Toast({ title: msg })
        }
    }, (req => {
        proxy.$CloseLoading();
        proxy.$Toast({ title: req.msg })
    }))
}

// 显示批发商弹窗
const showWholesalerFu = () => {
    console.log('显示批发商弹窗');
    selectWholesalerRef.value.showPopupFu()
}

const submitWholesalerFu = (e: any) => {
    wholesaleDetail.value = e;
    orderDetails.value.wholesaleId = wholesaleDetail.value.wholesaleId;

    packagingDetail.value = {};
    orderDetails.value.packagingId = '';
    packagingWholesalePageFu()
}

/**
 * 获取打包站列表
 */
const packagingWholesalePageFu = () => {
    packagingWholesalePageApi({ wholesaleId: wholesaleDetail.value.wholesaleId }).then((res: any) => {
        const { code, data, msg, token } = res
        proxy.$CloseLoading();
        if (code == proxy.$successCode) {
            console.log(data, '0000');
            if (data && data.length > 0) {
                data.forEach((item: any) => {
                    item.active = false
                })
                packagingStationList.value = data;
            }
        } else {
            proxy.$Toast({ title: msg })
        }
    }, (req => {
        proxy.$CloseLoading();
        proxy.$Toast({ title: req.msg })
    }))
}


// 显示弹窗
const showPopup = () => {
    if (!wholesaleDetail.value?.wholesaleId) {
        return proxy.$Toast({ title: '请选择批发商' })
    }
    console.log('显示弹窗');
    selectPackagingStationRef.value.showPopupFu()
}

const submitPackagingFu = (e: any) => {
    packagingDetail.value = e;
    orderDetails.value.packagingId = packagingDetail.value.packagingId;
}

const createOrderFu = () => {
    if(!orderDetails.value.packagingId) {
        return proxy.$Toast({ title: '请选择打包站' })
    }
    proxy.$Loading();
    orderDetails.value.orderProductsParams.map((item: any) => {
        item.productsDetailParams = item.productColorsList.map((item: any) => {
            return {
                colorName: item.colorName,
                handNum: item.handNum,
            }
        })
        item.productId = item.id
        return
    })
    createOrderApi(orderDetails.value).then((res: any) => {
        const { code, data, msg, token } = res
        proxy.$CloseLoading();
        if (code == proxy.$successCode) {
            console.log(data, '0000');
            uni.reLaunch({
                url: `/manufacturer/orderDetails/index?orderNo=${data}`
            })
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
        <com-header header-title="订单确认" :backColor="false" :titleColor="true"></com-header>
        <view class="main_con flex_1 flex_column">
            <view class="order_details">
                <view class="order_details_item flex_align flex_between"
                    :class="{ 'order_details_item_select ': item.type == 'select' && type != 'share' }"
                    v-for="item, index in orderTextList"
                    :key="index" @click="showWholesalerFu">
                    <view class="flex_align order_details_item_title">{{ item.title }}</view>
                    <view class="flex_1  order_details_item_value">
                        <view v-if="item.type === 'price'" class="order_details_item_value_price">¥{{ item.value }}
                        </view>
                        <view v-else>{{ item.value }}</view>
                        <view v-if="item.value1">{{ item.value1 }}</view>
                    </view>
                    <image v-if="item.type == 'select' && type != 'share'" class="arrow_right" :src="arrow_right">
                    </image>
                </view>
            </view>
            <deliverGoodsInfo :deliverInfo="packagingDetail" :edit="true"
                @selectPackagingFu="showPopup">
                <template #input>
                    <view class="flex_align flex_between deliver_info_item">
                        <view>备注</view>
                        <input class="deliver_info_item_input" type="text" placeholder="请输入备注内容"
                            v-model="orderDetails.remark">
                    </view>
                </template>
            </deliverGoodsInfo>
            <view class="product_list flex_column">
                <template v-for="item in orderDetails.orderProductsParams" :key="item.id">
                    <view class="product_item">
                        <com-orderTable orderType="show" miniRole="manufacturer"
                            :productDetail="item"></com-orderTable>
                    </view>
                </template>
            </view>
        </view>
        <view class="footer_con flex_between flex_align">
            <view>
                <view>
                    <text class="price_icon">¥</text>
                    <text>{{ formatNumber(orderDetails.totalAmount) }}</text>
                </view>
                <view class="unit_info">{{ orderDetails.totalHandNum }}手/{{ orderDetails.totalNum }}件</view>
            </view>
            <button class="button_defalut" @click="createOrderFu">生成订单</button>
        </view>
    </view>
    <com-selectPackagingStation ref="selectPackagingStationRef" :packagingStationList="packagingStationList"
        @selectSubmitFu="submitPackagingFu"></com-selectPackagingStation>

    <com-selectWholesaler ref="selectWholesalerRef" :wholesaleList="wholesaleList"
        @selectSubmitFu="submitWholesalerFu"></com-selectWholesaler>
</template>

<style lang="scss" scoped>
.container {
    background: #F2F1F5;

    .bg {
        width: 750rpx;
        height: 424rpx;
        background: linear-gradient(136deg, #0D5DFF 0%, #00AAFF 100%);
        clip-path: ellipse(100% 100% at 50% 100%);
        /* 底部椭圆裁剪 */
        transform: scaleY(-1);
        position: fixed;
        left: 0;
        top: 0;
    }

    .arrow_right {
        width: 28rpx;
        height: 28rpx;
        margin-left: 8rpx;
        transform: rotate(90deg);
    }

    .main_con {
        padding: 24rpx;
        position: relative;
        overflow-x: hidden;
        gap: 20rpx;
        overflow-y: auto;

        .order_details {
            background: #FFFFFF;
            border-radius: 24rpx;
            padding: 0 28rpx;

            .order_details_item {
                padding: 34rpx 0;
                border-bottom: 1rpx solid #EFEFEF;
                pointer-events: none;

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

            .order_details_item_select {
                pointer-events: all;

                .order_details_item_value {
                    color: #0C62FF;
                }

            }
        }

        .pay_way_item {
            padding: 34rpx 0;
            border-bottom: 1rpx solid #EFEFEF;
            margin-bottom: 34rpx;

            .pay_way_value {
                text-align: right;
                font-weight: 500;
                font-size: 28rpx;
                color: #0C62FF;
            }
        }

        .deliver_info_item {

            .deliver_info_item_input {
                font-weight: 400;
                font-size: 28rpx;
                text-align: right;
            }
        }

        .product_list {
            gap: 20rpx;

            .product_item {
                background: #FFFFFF;
                border-radius: 24rpx;
                padding: 36rpx 28rpx;
            }
        }
    }

    .footer_con {
        font-weight: 500;
        font-size: 44rpx;
        color: #0C62FF;

        .price_icon {
            font-size: 28rpx;
        }

        .unit_info {
            font-weight: 400;
            font-size: 24rpx;
            color: #202020;
        }

        .button_defalut {
            width: 320rpx;
        }
    }
}

</style>