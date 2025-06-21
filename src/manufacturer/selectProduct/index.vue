<script lang="ts" setup>
import { getByIdApi, productsPageApi } from "../http/manufacturer";
import order_fixed from "@/static/images/wholesaler/order_fixed.png"
import { useManufacturerStore } from "@/manufacturer/store/manufacturer";


const useManufacturer = useManufacturerStore()
const { proxy } = getCurrentInstance() as any;

const paramsPage = reactive({
    pageNum: 1,
    pageSize: 10,
})
const productList = ref<any[]>([])
const slideLoading = ref(true) // 是否需要滑动加载
const popupProductDetail = ref<any>({})

const shoppingCartNum = computed(() => {
    return useManufacturer.orderCard.length
})


onMounted(() => {
    productsPageFu()
})

/**
 * 获取商品列表
 */
const productsPageFu = () => {
    proxy.$Loading()
    productsPageApi({}, paramsPage).then((res: any) => {
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
            }
            if (data.datas.length < paramsPage.pageSize) {
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
    const arr = [...useManufacturer.orderCard]
    const index = arr.findIndex((item: any) => item.id === data.id)
    if (index === -1) {
        data.productColorsList.map((item: any) => {
            item.handNum = 1
            return item
        })
        arr.push(data)
        data.isAdded = true
    } else {
        arr.splice(index, 1)
        data.isAdded = false
    }
    useManufacturer.setOrderCardFu(arr)
    popupProductDetail.value.isAdded = true
}

/**
 * 跳转到订货卡详情页
 */
const viewOrderCardDetailFu = () => {
    uni.navigateTo({
        url: '/manufacturer/orderCard/index?id=123456'
    })
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
        <view class="bg"></view>
        <com-header header-title="立即订货" :backColor="false" :titleColor="true"></com-header>
        <view class="search_con ">
            <com-searchInput placeholder="搜索商品"></com-searchInput>
        </view>
        <view class="main_con flex_1">
            <scroll-view class="scroll_con" scroll-y="true" lower-threshold="50" @scrolltolower="scrolltolower">
                <view class="product_lsit flex_column">
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
            </scroll-view>
        </view>
        <view class="order_fixed" @click="viewOrderCardDetailFu">
            <uni-badge class="uni-badge-left-margin" :text="shoppingCartNum" absolute="rightTop" :offset="[3, 3]"
                size="small">
                <image class="order_fixed_img" :src="order_fixed"></image>
            </uni-badge>
        </view>
    </view>
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