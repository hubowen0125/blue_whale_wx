<script lang="ts" setup>
import { createOrderApi } from "@/http/api/order";
import { packagingWholesalePageApi } from "../http/wholesaler";
import arrow_right from "@/static/images/arrow_right.png"
import off_icon from "@/static/images/off_icon.png"
import position_1 from "@/static/images/position_1.png"
import checkbox from "@/static/images/checkbox.png"
import checkbox_active from "@/static/images/checkbox_active.png"
import { formatNumber } from "@/utils/utils";
import { useUserStore } from "@/store/modules/user"
import { useWholesalerStore } from "@/wholesaler/store/wholesaler"


let timer: any
const useWholesaler = useWholesalerStore()
const useUser = useUserStore()
const { proxy } = getCurrentInstance() as any;

const orderDetails = reactive([
    {
        title: '厂家',
        value: computed(() => productDetail.value.manufacturer?.deptName),
        value1: computed(() => productDetail.value.manufacturer?.phone),
    },
    {
        title: '总件数',
        // value: '60手/100件',
        value: computed(() => `${createParams.totalHandNum}手/${createParams.totalNum}件`), // 动态绑定计算属性
    },
    {
        title: '总金额',
        value: computed(() => `${formatNumber(createParams.totalAmount)}`), // 动态绑定计算属性,
        type: 'price',
    },
    {
        title: '已收金额',
        value: computed(() => `${formatNumber(productDetail.value.paymentAmount)}`), // 动态绑定计算属性,
        type: 'price',
    },
    {
        title: '备注',
        value: '轻拿轻放, 感谢',
        type: 'input'
    },
])

const popupRef = ref();
const cardNo = ref('');
const productDetail = ref<any>({
    orderProductsParams: [],
    paymentAmount: 0,
    manufacturerId: '',
    viewInventory: 0,
    manufacturer: {}
})
const paramsPage = reactive({
    pageNum: 1,
    pageSize: 10,
})
const packagingStationList = ref<Array<any>>([])
const packaginhStationActive = ref<any>({})
const slideLoading = ref(true) // 是否需要滑动加载
const createParams = reactive<any>({
    manufacturerId: computed(() => productDetail.value.manufacturer.deptId),
    packagingId: '',
    totalHandNum: computed(() => {
        let total = 0
        const list = productDetail.value.orderProductsParams
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
        const list = productDetail.value.orderProductsParams
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
        const list = productDetail.value.orderProductsParams
        if (list.length > 0) {
            for (let i = 0; i < list.length; i++) {
                for (let j = 0; j < list[i].productColorsList.length; j++) {
                    total += list[i].price * list[i].productColorsList[j].handNum
                }
            }
        }
        return total
    }),
    remark: '',
    orderProductsParams: [],
    viewInventory: computed(() => productDetail.value.viewInventory),
    status: 1
})

onLoad((e: any) => {
    packagingWholesalePageFu()
    productDetail.value.manufacturer = useWholesaler.shoppingManufacturer
    productDetail.value.orderProductsParams = useWholesaler.shoppingCart
    createParams.orderProductsParams = useWholesaler.shoppingCart
})

/**
 * 获取打包站列表
 */
const packagingWholesalePageFu = () => {
    //  wholesaleId: useUser.userInfo.userId, 
    packagingWholesalePageApi({}, paramsPage).then((res: any) => {
        const { code, data, msg, token } = res
        proxy.$CloseLoading();
        if (code == proxy.$successCode) {
            if (data.datas && data.datas.length > 0) {
                packagingStationList.value = [...packagingStationList.value, ...data.datas]
                if (data.datas.length < paramsPage.pageSize) {
                    slideLoading.value = false
                }
            } else {
                slideLoading.value = false
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
    console.log('显示弹窗');
    popupRef.value.open('bottom')
}

// 关闭弹窗
const closePopupFu = () => {
    popupRef.value.close();
    if (!createParams.packagingId) {
        packaginhStationActive.value = {}
    }
}

/**
 * 选择打包站
 * @param item 
 */
const selectPackagingStationFu = (item: any) => {
    console.log('选择打包站', item);
    packaginhStationActive.value = item
}

/**
 * 提交打包站
 */
const submitPackagingStationFu = () => {
    console.log('提交打包站', createParams.packagingId);
    if (!packaginhStationActive.value.packagingId) {
        return proxy.$Toast({ title: '请选择打包站' })
    }
    createParams.packagingId = packaginhStationActive.value.packagingId
    popupRef.value.close();
}

/**
 * 创建订单
 */
const createOrderFu = () => {
    if (!createParams.packagingId) {
        return proxy.$Toast({ title: '请选择打包站' })
    }
    proxy.$Loading()
    createOrderApi(createParams).then((res: any) => {
        const { code, data, msg } = res
        proxy.$CloseLoading();
        if (code == proxy.$successCode) {
            console.log(data);
            proxy.$Toast({
                title: '下单成功',
                successCB: () => {
                    timer = setTimeout(() => {
                        // myEmployeeFu()
                        uni.reLaunch({
                            url: `/wholesaler/orderDetails/index?orderNo=${data}`
                        })
                    }, 1500);
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
 * 滑动加载
 */
const scrolltolower = () => {
    // if (!slideLoading.value) return
    console.log('++++++++');
    // manageDevicesParams.value.page += 1
    // resetManageDevicesParams()
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
        <com-header header-title="订单确认" :backColor="false" :titleColor="true"></com-header>
        <view class="main_con flex_1 flex_column">
            <view class="order_details">
                <view class="order_details_item flex_align flex_between" v-for="item, index in orderDetails"
                    :key="index">
                    <view class="flex_align order_details_item_title">{{ item.title }}</view>
                    <view class="flex_1  order_details_item_value">
                        <view v-if="item.type === 'price'" class="order_details_item_value_price">¥{{ item.value }}
                        </view>
                        <input v-else-if="item.type === 'input'" type="text" placeholder="请输入备注内容"
                            v-model.trim="createParams.remark" />
                        <view v-else>{{ item.value }}</view>
                        <view v-if="item.value1">{{ item.value1 }}</view>
                    </view>
                </view>
            </view>
            <view class="flex_between select_con" @click="showPopup">
                <view>送货信息</view>
                <view class="flex_align select_desc">
                    <text>{{ packaginhStationActive.packagingName || '请选择' }}</text>
                    <image class="arrow_right" :src="arrow_right"></image>
                </view>
            </view>
            <view class="product_list flex_column">
                <template v-for="item in productDetail.orderProductsParams" :key="item.id">
                    <view class="product_item">
                        <com-orderTable orderType="show" :productDetail="item"></com-orderTable>
                    </view>
                </template>
            </view>
        </view>
        <view class="footer_con flex_between flex_align">
            <view>
                <view>
                    <text class="price_icon">¥</text>
                    <text>{{ formatNumber(createParams.totalAmount) }}</text>
                </view>
                <view class="unit_info">{{ createParams.totalHandNum }}手/{{ createParams.totalNum }}件</view>
            </view>
            <button class="button_defalut" @click="createOrderFu">立即下单</button>
        </view>
    </view>

    <uni-popup ref="popupRef" :safe-area="false">
        <view class="popup_content flex_column ">
            <view class="popup_header flex_align flex_between">
                <text>选择打包站</text>
                <image class="off_icon" :src="off_icon" @click="closePopupFu"></image>
            </view>
            <view class="flex_1 popup_mian">
                <scroll-view class="scroll_con " scroll-y="true" lower-threshold="50" @scrolltolower="scrolltolower">
                    <view class="packaging_station_list flex_column ">
                        <template v-for="item in packagingStationList" :key="item.packagingId">
                            <view class="packaging_station_item flex_align flex_between"
                                :class="{ 'packaging_station_item_active': item.packagingId === packaginhStationActive.packagingId }"
                                @click="selectPackagingStationFu(item)">
                                <view class="flex_column">
                                    <view class="flex_align packaging_station_info">
                                        <image class="position_icon" :src="position_1"></image>
                                        <view class="packaging_station_name">{{ item.packagingName }}</view>
                                    </view>
                                    <view>{{ item.packagingAddress }}</view>
                                    <view>{{ item.packagingPhone }}</view>
                                </view>
                                <image class="checkbox_icon"
                                    :src="item.packagingId === packaginhStationActive.packagingId ? checkbox_active : checkbox">
                                </image>
                            </view>
                        </template>
                    </view>
                </scroll-view>
            </view>
            <button class="button_defalut" @click="submitPackagingStationFu">确认</button>
        </view>
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
        gap: 20rpx;
        overflow-y: auto;

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

        .select_con {
            font-weight: 500;
            font-size: 28rpx;
            color: #202020;
            padding: 34rpx 28rpx;
            background: #FFFFFF;
            border-radius: 24rpx;

            .select_desc {
                font-weight: 500;
                font-size: 28rpx;
                color: #0C62FF;
            }

            .arrow_right {
                width: 28rpx;
                height: 28rpx;
                margin-right: 8rpx;
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

.popup_content {
    background-color: #fff;
    padding: 40rpx 24rpx env(safe-area-inset-bottom);
    border-radius: 32rpx 32rpx 0 0;
    height: 60vh;
    overflow: hidden;

    .popup_header {
        font-weight: bold;
        font-size: 40rpx;
        color: #202020;
        margin-bottom: 40rpx;

        .off_icon {
            width: 28rpx;
            height: 28rpx;
        }

    }

    .popup_mian {
        overflow-x: hidden;
        overflow-y: auto;

        .scroll_con {
            width: 100%;
            height: 100%;
        }

        .packaging_station_list {
            gap: 20rpx;

            .packaging_station_item {
                border: 2rpx solid #F7F8FA;
                background: #F7F8FA;
                border-radius: 24rpx;
                padding: 32rpx;
                font-weight: 400;
                font-size: 24rpx;
                color: #7C8191;
                gap: 12rpx;

                .packaging_station_info {
                    margin-bottom: 8rpx;

                    .packaging_station_name {
                        font-weight: 500;
                        font-size: 32rpx;
                        color: #202020;
                    }

                    .position_icon {
                        width: 28rpx;
                        height: 28rpx;
                        margin-right: 8rpx;
                    }
                }

                .checkbox_icon {
                    width: 36rpx;
                    height: 36rpx;
                }
            }

            .packaging_station_item_active {
                border: 2rpx solid rgba(1, 163, 255, 1);
                border-radius: 24rpx;
                background: #FFFFFF;
            }
        }
    }


    .button_defalut {
        height: 96rpx;
        background: linear-gradient(90deg, #0D5DFF 0%, #00AAFF 100%);
        font-weight: 500;
        font-size: 30rpx;
        color: #FFFFFF;
        line-height: 96rpx;
        border-radius: 48rpx;
        margin-top: 48rpx;
    }
}
</style>