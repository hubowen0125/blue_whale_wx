<script lang="ts" setup>
import { getByIdApi, productsPageApi } from "../http/manufacturer";
import order_fixed from "@/static/images/wholesaler/order_fixed.png"
import off_icon from "@/static/images/off_icon.png"
import { useManufacturerStore } from "@/manufacturer/store/manufacturer";


const useManufacturer = useManufacturerStore()
const { proxy } = getCurrentInstance() as any;

const popupRef = ref();
const paramsPage = reactive({
    pageNum: 1,
    pageSize: 10,
})
const getProductParams = ref({
    productName: '',
})
const productList = ref<any[]>([])
const slideLoading = ref(true) // 是否需要滑动加载
const popupProductDetail = ref<any>({})
const orderTableRef = ref()
// const shoppingCartNum = ref(0)


const shoppingCartNum = computed(() => {
    return useManufacturer.shoppingCart.length
})

onMounted(() => {
    productsPageFu()
})

/**
 * 获取商品列表
 */
const productsPageFu = () => {
    proxy.$Loading()
    productsPageApi(getProductParams.value, paramsPage).then((res: any) => {
        const { code, data, msg, token } = res
        proxy.$CloseLoading();
        if (code == proxy.$successCode) {
            console.log(data, '0000');
            if (data.datas && data.datas.length > 0) {
                data.datas.map((item: any) => {
                    if (useManufacturer.shoppingCart.some((cartItem: any) => cartItem.id === item.id)) {
                        item.isAdded = true
                    } else {
                        item.isAdded = false
                    }
                })
                productList.value = [...productList.value, ...data.datas]
                console.log(productList.value, '00000');
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

/**
 * 获取商品详情
 * @param id 
 */
const showPopupFu = (data: any) => {
    const arr = [...useManufacturer.shoppingCart]
    const index = arr.findIndex((item: any) => item.id === data.id)
    if (index === -1) {
        data.productColorsList.map((item: any) => {
            item.handNum = 0
            return item
        })
        popupProductDetail.value = data
    } else {
        popupProductDetail.value = arr[index]
    }
    popupRef.value.open('bottom')
}

// 关闭弹窗
const closePopupFu = () => {
    popupRef.value.close();
}

/**
 * 加入订货单
 */
const addToCartFu = () => {
    const arr = [...useManufacturer.shoppingCart]
    const index = arr.findIndex((item: any) => item.id === popupProductDetail.value.id)
    if (index === -1) {
        arr.push(popupProductDetail.value)
    } else {
        arr[index] = popupProductDetail.value
    }
    useManufacturer.setShoppingCartFu(arr)
    popupProductDetail.value.isAdded = true
    popupRef.value.close()
}

/**
 * 跳转到订货卡详情页
 */
const viewOrderCardDetailFu = () => {
    if (shoppingCartNum.value == 0) {
        proxy.$Toast({ title: '请先加入订货单' })
        return
    }
    uni.navigateTo({
        url: '/manufacturer/productConfirmation/index'
    })
}

const searchInputBlur = (e: string) => {
    getProductParams.value.productName = e
    paramsPage.pageNum = 1
    productList.value = []
    slideLoading.value = true
    productsPageFu()
}

/**
 * 滑动加载
 */
const scrolltolower = () => {
    console.log('滑动加载');
    if (!slideLoading.value) return
    paramsPage.pageNum += 1
    productsPageFu()
}


</script>


<template>
    <view class="container flex_column">
        <view class="bg">
            <com-header header-title="创建订单" :backColor="false" :titleColor="true"></com-header>
            <view class="search_con ">
                <com-searchInput placeholder="搜索商品" @onBlur="searchInputBlur"></com-searchInput>
            </view>
        </view>
        <view class="main_con flex_1">
            <scroll-view class="scroll_con" scroll-y="true" lower-threshold="50" @scrolltolower="scrolltolower">
                <view class="product_lsit flex_column" v-if="productList.length > 0">
                    <view v-for="item in productList" :key="item.id">
                        <com-orderInfo :productDetail="item" @viewDetailsFu="showPopupFu(item)">
                            <template #button>
                                <template v-if="!item.isAdded">
                                    <button class="add_btn">加入订货单</button>
                                </template>
                                <template v-else>
                                    <button class="btn_after">已加入</button>
                                </template>
                            </template>
                        </com-orderInfo>
                    </view>
                </view>
                <com-no_data v-else noDataText="暂无数据"></com-no_data>
            </scroll-view>
        </view>
        <view class="order_fixed" @click="viewOrderCardDetailFu">
            <uni-badge class="uni-badge-left-margin" :text="shoppingCartNum" absolute="rightTop" :offset="[3, 3]"
                size="small">
                <image class="order_fixed_img" :src="order_fixed"></image>
            </uni-badge>
        </view>
    </view>

    <uni-popup ref="popupRef" :safe-area="false">
        <view class="popup_content flex_column">
            <view class="popup_header flex_align flex_between">
                <text>加入订货单</text>
                <image class="off_icon" :src="off_icon" @click="closePopupFu"></image>
            </view>
            <view class="flex_1 poupo_main">
                <com-orderTable ref="orderTableRef" orderType="handleOrder" miniRole="manufacturer"
                    :productDetail="popupProductDetail"></com-orderTable>
            </view>
            <view class="popup_footer flex_align">
                <button class="button_cancel" @click="closePopupFu">取消</button>
                <button class="button_defalut flex_1" @click="addToCartFu">加入订货单</button>
            </view>
        </view>
    </uni-popup>
</template>

<style lang="scss" scoped>
.container {
    background: #F2F1F5;

    .bg {
        background: linear-gradient(136deg, #0D5DFF 0%, #00AAFF 100%);
    }

    .search_con {
        margin: 32rpx 24rpx 52rpx;
    }

    .main_con {
        overflow-x: hidden;
        overflow-y: auto;
        padding: 24rpx;

        .product_lsit {
            background: #FFFFFF;
            border-radius: 24rpx;
            padding: 28rpx;
            gap: 56rpx;

            .add_btn {
                width: 154rpx;
                height: 48rpx;
                background: rgba(12, 104, 255, 0.03);
                border-radius: 12rpx;
                border: 1rpx solid #CDE1FF;
                font-weight: 400;
                font-size: 26rpx;
                color: #0C62FF;
                line-height: 48rpx;
            }

            .btn_after {
                width: 102rpx;
                height: 48rpx;
                background: rgba(183, 183, 183, 0.05);
                border-radius: 12rpx;
                border: 1rpx solid #C9C9C9;
                font-weight: 400;
                font-size: 26rpx;
                color: #7C8191;
                line-height: 48rpx;
            }
        }
    }

    .order_fixed {
        width: 92rpx;
        height: 92rpx;
        position: fixed;
        right: 30rpx;
        bottom: 192rpx;

        .order_fixed_img {
            width: 92rpx;
            height: 92rpx;
        }
    }
}

.popup_content {
    background-color: #fff;
    padding: 40rpx 24rpx calc(26rpx + env(safe-area-inset-bottom));
    border-radius: 32rpx 32rpx 0 0;
    max-height: 60vh;
    overflow: hidden;
    box-sizing: border-box;

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

    .poupo_main {
        overflow-x: hidden;
        overflow-y: auto;
    }

    .popup_footer {
        gap: 16rpx;
        margin-top: 40rpx;

        .button_cancel {
            width: 190rpx;
            height: 96rpx;
            background: #fff;
            border-radius: 48rpx;
            border: 1rpx solid #ACACAC;
            font-weight: 500;
            font-size: 30rpx;
            color: #202020;
            line-height: 96rpx;
        }

        .button_defalut {
            height: 96rpx;
            background: linear-gradient(90deg, #0D5DFF 0%, #00AAFF 100%);
            font-weight: 500;
            font-size: 30rpx;
            color: #FFFFFF;
            line-height: 96rpx;
            border-radius: 48rpx;
        }
    }
}
</style>