<script lang="ts" setup>
import { getByIdApi, productsPageApi, productListApi } from "../http/manufacturer";
import { addProductApi } from "@/http/api/all";
import off_icon from "@/static/images/off_icon.png"
import order_fixed from "@/static/images/wholesaler/order_fixed.png"
import { useManufacturerStore } from "@/manufacturer/store/manufacturer";
import { useUserStore } from "@/store/modules/user";


let timer: any
const useUser = useUserStore()
const useManufacturer = useManufacturerStore()
const { proxy } = getCurrentInstance() as any;

const paramsPage = reactive({
    pageNum: 1,
    pageSize: 10,
})
const productList = ref<any[]>([])
const slideLoading = ref(true) // 是否需要滑动加载
const selectProductType = ref('')
const headerTitle = ref('')
const popupRef = ref();
const popupProductDetail = ref<any>({})
const shareCradList = ref<Array<any>>([])
const addProductParams = ref<any>({
    cardNo: '',
    cardProductsParams: [

    ]
})
const shareProductParams = ref({
    styleNumber: "",
    manufacturerName: useUser.userInfo.nickName,
    cardNo: ""
})
const getProductParams = ref({
    styleNumber: '',
})
const isLoad = ref(false) // 是否加载


const shoppingCartNum = computed(() => {
    return useManufacturer.orderCard.length
})

onLoad((e: any) => {
    if (e.type) {
        selectProductType.value = e.type
        if (e.type == 'orderCard') {
            headerTitle.value = '立即订货'
            productsPageFu()
        } else {
            headerTitle.value = '选择商品'
            addProductParams.value.cardNo = e.cardNo
            shareProductParams.value.cardNo = e.cardNo
            productListFu()
        }
    }
})

onShow(() => {
    if (selectProductType.value && isLoad.value) {
        if (selectProductType.value !== 'orderCard') {
            shareCradList.value = []
            productList.value = []
            paramsPage.pageNum = 1
            slideLoading.value = true
            productListFu()
        } else {
            let arr = [...useManufacturer.orderCard]
            productList.value.map((item: any) => {
                if (arr.some((cartItem: any) => cartItem.id === item.id)) {
                    item.isAdded = true
                } else {
                    item.isAdded = false
                }
            })
        }
    } else {
        isLoad.value = true
    }
})

const productListFu = async () => {
    proxy.$Loading()
    await productListApi(shareProductParams.value, paramsPage).then((res: any) => {
        const { code, data, msg, token } = res
        proxy.$CloseLoading();
        if (code == proxy.$successCode) {
            if (data.datas && data.datas.length > 0) {
                productList.value = [...productList.value, ...data.datas]
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
                    if (useManufacturer.orderCard.some((cartItem: any) => cartItem.id === item.id)) {
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
    let arr
    if (selectProductType.value == 'orderCard') {
        arr = [...useManufacturer.orderCard]
    } else {
        if (data.isAdded) {
            return
        }
        arr = [...shareCradList.value]
    }
    const index = arr.findIndex((item: any) => item.id === data.id)
    if (index === -1) {
        data.productColorsList.map((item: any) => {
            item.handNum = 0
            return item
        })
        arr.push(data)
        if (selectProductType.value == 'orderCard') {
            data.isAdded = true
        }
    } else {
        arr.splice(index, 1)
        if (selectProductType.value == 'orderCard') {
            data.isAdded = false
        }
    }
    if (selectProductType.value == 'orderCard') {
        useManufacturer.setOrderCardFu(arr)
    } else {
        popupProductDetail.value = data
        popupRef.value.open('bottom');
    }
}

/**
 * 跳转到订货卡详情页
 */
const viewOrderCardDetailFu = () => {
    uni.navigateTo({
        url: '/manufacturer/orderCard/index?id=123456'
    })
}

// 关闭弹窗
const closePopupFu = () => {
    popupRef.value.close();
}

/**
 * 加入订货单
 */
const addToCartFu = () => {
    let arr: any[] = []
    if (selectProductType.value == 'orderCard') {
        arr = [...useManufacturer.shoppingCart]
    }
    const index = arr.findIndex((item: any) => item.id === popupProductDetail.value.id)
    if (index === -1) {
        arr.push(popupProductDetail.value)
    } else {
        arr[index] = popupProductDetail.value
    }
    useManufacturer.setShoppingCartFu(arr)
    popupProductDetail.value.isAdded = true
    shareCradList.value = shareCradList.value.concat(arr)
    popupRef.value.close()
}

/**
 * 添加商品
 */
const addProductFu = () => {
    if (!shareCradList.value.length) {
        return proxy.$Toast({ title: '请选择商品' })
    }
    addProductParams.value.cardProductsParams = []
    shareCradList.value.map((item) => {
        addProductParams.value.cardProductsParams.push({
            productId: item.id,
            productsDetailParams: item.productColorsList.map((color: any) => {
                return {
                    colorName: color.colorName,
                    handNum: color.handNum
                }
            })
        })
    })
    proxy.$Loading()
    addProductApi(addProductParams.value).then((res: any) => {
        const { code, data, msg } = res
        proxy.$CloseLoading();
        if (code == proxy.$successCode) {
            console.log(data);
            proxy.$Toast({
                title: '添加成功',
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
 * 添加商品
 * @param e 
 */
const newProductFu = () => {
    uni.navigateTo({
        url: '/manufacturer/addProduct/index'
    })
}

const searchInputBlur = (e: string) => {
    productList.value = []
    shareCradList.value = []
    paramsPage.pageNum = 1
    if (selectProductType.value == 'orderCard') {
        getProductParams.value.styleNumber = e
        paramsPage.pageNum = 1
        productsPageFu()
    } else {
        shareProductParams.value.styleNumber = e
        productListFu()
    }
}

/**
 * 滑动加载
 */
const scrolltolower = () => {
    console.log('滑动加载');
    if (!slideLoading.value) return
    paramsPage.pageNum += 1
    if (selectProductType.value == 'orderCard') {
        productsPageFu()
    } else {
        productListFu()
    }
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
        <view class="bg">
            <com-header :header-title="headerTitle" :backColor="false" :titleColor="true"></com-header>
            <view class="search_con ">
                <com-searchInput placeholder="搜索款号" @onBlur="searchInputBlur"></com-searchInput>
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
        <view v-if="selectProductType == 'orderCard'" class="order_fixed" @click="viewOrderCardDetailFu">
            <uni-badge class="uni-badge-left-margin" :text="shoppingCartNum" absolute="rightTop" :offset="[3, 3]"
                size="small">
                <image class="order_fixed_img" :src="order_fixed"></image>
            </uni-badge>
        </view>
        <view v-if="selectProductType == 'shareCrad'" class="footer_con flex_align">
            <button class="button_submit" @click="addProductFu">确定</button>
            <button class="button_defalut" @click="newProductFu">添加商品</button>
        </view>
    </view>

    <uni-popup ref="popupRef" :safe-area="false" :mask-click="false">
        <view class="popup_content flex_column">
            <view class="popup_header flex_align flex_between">
                <text>加入订货单</text>
                <view class="off_con" @click="closePopupFu">
                    <image class="off_icon" :src="off_icon"></image>
                </view>
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

.footer_con {
    gap: 16rpx;

    .button_submit {
        width: 290rpx;
        height: 96rpx;
        background: #fff;
        border-radius: 48rpx;
        border: 1rpx solid #ACACAC;
        font-weight: 500;
        font-size: 30rpx;
        color: #202020;
        line-height: 96rpx;
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

        .off_con {
            width: 50rpx;
            height: 50rpx;
            text-align: center;

            .off_icon {
                width: 28rpx;
                height: 28rpx;
            }
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