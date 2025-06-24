<script lang="ts" setup>
import { wholesaleListApi, productListApi } from '@/wholesaler/http/wholesaler';
import off_icon from "@/static/images/off_icon.png"
import order_fixed from "@/static/images/wholesaler/order_fixed.png"
import { useWholesalerStore } from "@/wholesaler/store/wholesaler"

const useWholesaler = useWholesalerStore()
const { proxy } = getCurrentInstance() as any;

const manufacturerId = ref('')
const paramsPage = reactive({
    pageNum: 1,
    pageSize: 10,
})
const getProductParams = ref({
    productName: '',
    manufacturerId: ''
})
const productsList = ref<any[]>([])
const slideLoading = ref(true) // 是否需要滑动加载
const popupRef = ref();
const popupProductDetail = ref<any>({})
const shareCradList = ref<Array<any>>([])


const shoppingCartNum = computed(() => {
    return useWholesaler.shoppingCart.length
})

onLoad((e: any) => {
    if (e.manufacturerId) {
        manufacturerId.value = e.manufacturerId
        productListFu()
    } else {
        wholesaleListFu()
    }
})

/**
 * 获取货架列表
 */
const wholesaleListFu = () => {
    proxy.$Loading()
    wholesaleListApi(getProductParams.value, paramsPage).then((res: any) => {
        const { code, data, msg, token } = res
        proxy.$CloseLoading();
        if (code == proxy.$successCode) {
            console.log(data, '0000');
            // if (data && data.length > 0) {
            //     data.map((item: { productsList: { isAdded: boolean; }[]; }) => {
            //         item.productsList.map((items: any) => {
            //             if (useWholesaler.shoppingCart.some((cartItem: any) => cartItem.id === items.id)) {
            //                 items.isAdded = true
            //             } else {
            //                 items.isAdded = false
            //             }
            //         })
            //         productsList.value = productsList.value.concat(item.productsList)
            //     })
            // }
            // if (data[0].productsList.length < paramsPage.pageSize) {
            //     slideLoading.value = false
            // }
        } else {
            proxy.$Toast({ title: msg })
        }
    }, (req => {
        proxy.$CloseLoading();
        proxy.$Toast({ title: req.msg })
    }))
}

const productListFu = () => {
    proxy.$Loading()
    productListApi(getProductParams.value).then((res: any) => {
        const { code, data, msg, token } = res
        proxy.$CloseLoading();
        if (code == proxy.$successCode) {
            console.log(data, '0000');
            // if (data && data.length > 0) {
            //     data.map((item: { productsList: { isAdded: boolean; }[]; }) => {
            //         item.productsList.map((items: any) => {
            //             if (useWholesaler.shoppingCart.some((cartItem: any) => cartItem.id === items.id)) {
            //                 items.isAdded = true
            //             } else {
            //                 items.isAdded = false
            //             }
            //         })
            //         productsList.value = productsList.value.concat(item.productsList)
            //     })
            // }
            // if (data[0].productsList.length < paramsPage.pageSize) {
            //     slideLoading.value = false
            // }
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
    arr = [...useWholesaler.shoppingCart]
    const index = arr.findIndex((item: any) => item.id === data.id)
    if (index === -1) {
        data.productColorsList.map((item: any) => {
            item.handNum = 1
            return item
        })
        arr.push(data)
    } else {
        arr.splice(index, 1)
    }
    popupProductDetail.value = data
    popupRef.value.open('bottom');
}

// 关闭弹窗
const closePopupFu = () => {
    popupRef.value.close();
}


/**
 * 加入订货单
 */
const addToCartFu = () => {
    const arr = [...useWholesaler.shoppingCart]
    const index = arr.findIndex((item: any) => item.id === popupProductDetail.value.id)
    popupProductDetail.value.isAdded = true
    if (index === -1) {
        arr.push(popupProductDetail.value)
    } else {
        arr[index] = popupProductDetail.value
    }
    useWholesaler.setShoppingCartFu(arr)
    popupRef.value.close()
}


/**
 * 跳转到订货卡详情页
 */
const viewOrderCardDetailFu = () => {
    uni.navigateTo({
        url: '/wholesaler/productConfirmation/index'
    })
}

</script>

<template>
    <view class="container flex_column">
        <view class="bg"></view>
        <com-header header-title="选择商品" :backColor="false" :titleColor="true"></com-header>
        <view class="search_con ">
            <com-searchInput placeholder="搜索商品"></com-searchInput>
        </view>
        <view class="main_con flex_column flex_1">
            <view class="order_info_list flex_column">
                <view v-for="item in productsList" :key="item.id">
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
        </view>

        <view class="order_fixed" @click="viewOrderCardDetailFu">
            <uni-badge class="uni-badge-left-margin" :text="shoppingCartNum" absolute="rightTop" :offset="[3, 3]"
                size="small">
                <image class="order_fixed_img" :src="order_fixed"></image>
            </uni-badge>
        </view>
    </view>
    <uni-popup ref="popupRef" :safe-area="false">
        <view class="popup_content flex_cloumn">
            <view class="popup_header flex_align flex_between">
                <text>加入订货单</text>
                <image class="off_icon" :src="off_icon" @click="closePopupFu"></image>
            </view>
            <com-orderTable ref="orderTableRef" orderType="handleOrder"
                :productDetail="popupProductDetail"></com-orderTable>
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
        width: 750rpx;
        height: 318rpx;
        background: linear-gradient(136deg, #0D5DFF 0%, #00AAFF 100%);
        position: fixed;
        left: 0;
        top: 0;
    }

    .search_con {
        margin: 32rpx 24rpx 52rpx;
    }

    .main_con {
        padding: 24rpx;
        position: relative;
        overflow-x: hidden;
        overflow-y: auto;

        .order_info_list {
            background: #FFFFFF;
            border-radius: 24rpx;
            padding: 28rpx;
            gap: 56rpx;

            .order_quantity {
                padding: 8rpx 14rpx;
                font-weight: 500;
                font-size: 26rpx;
                color: #0C62FF;
                background: rgba(12, 104, 255, 0.03);
                border-radius: 12rpx;
                border: 1rpx solid #CDE1FF;
            }

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
    padding: 40rpx 24rpx env(safe-area-inset-bottom);
    border-radius: 32rpx 32rpx 0 0;

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