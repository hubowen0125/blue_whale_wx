<script lang="ts" setup>
import { productsPageApi } from '@/manufacturer/http/manufacturer';
import { useUserStore } from '@/store/modules/user';

const useUser = useUserStore()
const { proxy } = getCurrentInstance() as any;


const inventoryType = [
    {
        title: '总款数',
        value: '100',
    },
    {
        title: '总销量(件)',
        value: '80',
    },
    {
        title: '总库存',
        value: '20',
    },
]

const tabBarIndex = inject("tabBarIndex") as Ref<number>
const paramsPage = reactive({
    pageNum: 1,
    pageSize: 10,
})
const productList = ref<any[]>([])
const isLoad = ref(false) // 是否加载
const slideLoading = ref(true) // 是否需要滑动加载

watch(() => tabBarIndex.value, (newVal) => {
    if (newVal == 3 && !isLoad.value) {
        console.log('213213');
        isLoad.value = true
        productsPageFu()
    }
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
                productList.value = [...productList.value, ...data.datas]
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
 * 创建订单
 */
const createOrderFu = () => {
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
            <com-searchInput placeholder="搜索厂家"></com-searchInput>
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
                <view class="product_lsit flex_column">
                    <view v-for="item in productList" :key="item.id">
                        <com-orderInfo :productDetail="item" @viewDetailsFu="viewDetailsFu"></com-orderInfo>
                    </view>
                </view>
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
        padding: 0 24rpx;

        .product_lsit {
            background: #FFFFFF;
            border-radius: 24rpx;
            padding: 28rpx;
            gap: 56rpx;
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