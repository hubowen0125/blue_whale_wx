<script lang="ts" setup>
import { productsPageApi, getShelfStatisticsApi } from '@/manufacturer/http/manufacturer';
import { useUserStore } from '@/store/modules/user';
import { useManufacturerStore } from "@/manufacturer/store/manufacturer";


const useManufacturer = useManufacturerStore()
const useUser = useUserStore()
const { proxy } = getCurrentInstance() as any;


const inventoryType = [
    {
        title: '总款数',
        value: computed(() => statisticsDetail.value.totalCount || 0),
    },
    {
        title: '总销量(件)',
        value: computed(() => statisticsDetail.value.totalSales || 0),
    },
    {
        title: '总库存',
        value: computed(() => statisticsDetail.value.totalStock || 0),
    },
]

const tabBarIndex = inject("tabBarIndex") as Ref<number>
const paramsPage = reactive({
    pageNum: 1,
    pageSize: 10,
})
const getProductParams = ref({
    productName: '',
})
const productList = ref<any[]>([])
const isLoad = ref(false) // 是否加载
const slideLoading = ref(true) // 是否需要滑动加载
const statisticsDetail = ref({
    totalCount: 0,
    totalSales: 0,
    totalStock: 0,
})

onShow(() => {
    const pages = getCurrentPages()
    const currentPage = pages[pages.length - 1]
    if (currentPage.$vm.refresh) {
        currentPage.$vm.refresh = false
        resetParams()
    }
})

watch(() => tabBarIndex.value, (newVal) => {
    if (newVal == 3 && !isLoad.value) {
        isLoad.value = true
        productsPageFu()
        getShelfStatisticsFu()
    }
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
 * 获取货架统计
 */
const getShelfStatisticsFu = () => {
    getShelfStatisticsApi().then((res: any) => {
        const { code, data, msg } = res
        if (code == proxy.$successCode) {
            console.log(data, 'data');
            statisticsDetail.value = data
        } else {
            proxy.$Toast({ title: msg })
        }
    }, (req => {
        proxy.$Toast({ title: req.msg })
    }))
}

/**
 * 创建订单
 */
const createOrderFu = () => {
    useManufacturer.setShoppingCartFu([])
    uni.navigateTo({
        url: "/manufacturer/createOrder/index"
    })
}

/**
 * 添加商品
 */
const addProductFu = () => {
    uni.navigateTo({
        url: "/manufacturer/addProduct/index"
    })
}

/**
 * 查看商品详情
 * @param productDetail 
 */
const viewDetailsFu = (productDetail: any) => {
    uni.navigateTo({
        url: `/manufacturer/productDetails/index?id=${productDetail.id}`
    })
}

const searchInputBlur = (e: string) => {
    console.log('搜索输入框失去焦点');
    getProductParams.value.productName = e
    paramsPage.pageNum = 1
    productList.value = []
    slideLoading.value = true
    productsPageFu()
}

const resetParams = () => {
    getProductParams.value.productName = ''
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
    <view class="goods_shelves_con flex_column">
        <view class="goods_shelves_title">货架</view>
        <view class="search_input">
            <com-searchInput placeholder="搜索商品" @onBlur="searchInputBlur"></com-searchInput>
        </view>
        <view class="inventory_type_con flex">
            <view class="inventory_type_item flex_column flex_align flex_center flex_1" v-for="item in inventoryType"
                :key="item.title">
                <view>{{ item.value }}</view>
                <view class="inventory_type_item_title">{{ item.title }}</view>
            </view>
        </view>
        <view class="main_con flex_1 flex_column">
            <scroll-view class="scroll_con" scroll-y="true" lower-threshold="50" @scrolltolower="scrolltolower">
                <view class="product_lsit flex_column" v-if="productList.length > 0">
                    <view class="product_item" v-for="item in productList" :key="item.id">
                        <com-orderTable
                            orderType="detail"
                            miniRole="manufacturer"
                            :goodsShelves="'manufacturer'"
                            :productDetail="item">
                        </com-orderTable>
                    </view>
                </view>
                <com-no_data v-else :noDataText="'暂无订单'"></com-no_data>
            </scroll-view>
        </view>
        <view class="footer_con flex">
            <button class="create_btn" @click="createOrderFu">创建订单</button>
            <button class="button_defalut flex_1" @click="addProductFu">添加商品</button>
        </view>
    </view>
</template>


<style lang="scss" scoped>
.goods_shelves_con {
    width: 100%;
    height: 100%;
    padding: v-bind('`${useUser.navHeight + (useUser.statusBarHeight / 2)}px`') 0 30rpx;
    box-sizing: border-box;
    gap: 20rpx;

    .goods_shelves_title {
        font-weight: bold;
        font-size: 48rpx;
        color: #202020;
        padding: 0 30rpx;
    }

    .search_input {
        padding: 0 24rpx;
    }

    .inventory_type_con {
        gap: 16rpx;
        padding: 0 24rpx;

        .inventory_type_item {
            height: 200rpx;
            background: #FFFFFF;
            box-shadow: 0rpx 4rpx 12rpx 0rpx #DDE8FC;
            border-radius: 24rpx;
            font-weight: bold;
            font-size: 40rpx;
            color: #0C62FF;
            gap: 10rpx;

            .inventory_type_item_title {
                font-weight: 400;
                font-size: 24rpx;
                color: #7C8191;
            }
        }
    }

    .main_con {
        gap: 20rpx;
        overflow-x: hidden;
        overflow-y: auto;

        .product_lsit {
            gap: 20rpx;

            .product_item {
                background: #FFFFFF;
                border-radius: 24rpx;
                padding: 28rpx;
                margin: 0 24rpx;
            }
        }
    }

    .footer_con {
        padding: 20rpx 24rpx;
        gap: 20rpx;
        margin: 0;

        .create_btn {
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
    }
}
</style>