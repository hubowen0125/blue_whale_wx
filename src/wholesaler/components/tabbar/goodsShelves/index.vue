<script lang="ts" setup>
import { wholesaleListApi } from '@/wholesaler/http/wholesaler';
import { useUserStore } from '@/store/modules/user';

const useUser = useUserStore()
const { proxy } = getCurrentInstance() as any;


const tabBarIndex = inject("tabBarIndex") as Ref<number>
const isLoad = ref(false) // 是否加载
const slideLoading = ref(true) // 是否需要滑动加载
const paramsPage = reactive({
    pageNum: 1,
    pageSize: 10,
})
// 货架列表
const shelfList = ref<Array<any>>([])


watch(() => tabBarIndex.value, (newVal) => {
    if (newVal == 3 && !isLoad.value) {
        console.log('213213');
        isLoad.value = true
        wholesaleListFu()
    }
})

/**
 * 获取货架列表
 */
const wholesaleListFu = () => {
    proxy.$Loading()
    wholesaleListApi({}, paramsPage).then((res: any) => {
        const { code, data, msg, token } = res
        proxy.$CloseLoading();
        if (code == proxy.$successCode) {
            console.log(data, '0000');
            if (data && data.length > 0) {
                shelfList.value = shelfList.value.concat(data)
            }
            if (data.length < paramsPage.pageSize) {
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
 * 立即订货
 */
const handleBuyFu = () => {
    uni.navigateTo({
        url: '/wholesaler/orderNow/index'
    })
}

</script>


<template>
    <view class="goods_shelves_con flex_column">
        <view class="goods_shelves_title">货架</view>
        <com-searchInput placeholder="搜索厂家"></com-searchInput>
        <view class="main_con flex_1 flex_column">
            <view class="companys_list flex_column">
                <view class="companys_item flex_column" v-for="(items, index) in shelfList" :key="index">
                    <view class="companys_item_title flex_align flex_between">
                        <view>{{ items.dept.deptName }}</view>
                        <button class="btn_buy" @click="handleBuyFu">立即订货</button>
                    </view>
                    <view class="product_list flex_column">
                        <template v-for="item in items.productsList" :key="item.id">
                            <com-orderInfo :productDetail="item"></com-orderInfo>
                        </template>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>


<style lang="scss" scoped>
.goods_shelves_con {
    width: 100%;
    height: 100%;
    padding: v-bind('`${useUser.navHeight + (useUser.statusBarHeight / 2)}px`') 30rpx 30rpx 30rpx;
    box-sizing: border-box;
    gap: 32rpx;

    .goods_shelves_title {
        font-weight: bold;
        font-size: 48rpx;
        color: #202020;
    }

    .main_con {
        gap: 20rpx;
        padding-bottom: 24rpx;
        overflow-x: hidden;
        overflow-y: auto;

        .companys_list {
            gap: 20rpx;

            .companys_item {
                background: #FFFFFF;
                border-radius: 24rpx;
                gap: 32rpx;
                padding: 28rpx;

                .companys_item_title {
                    font-weight: bold;
                    font-size: 32rpx;
                    color: #202020;

                    .btn_buy {
                        background: rgba(12, 104, 255, 0.03);
                        border-radius: 16rpx;
                        border: 1rpx solid #CDE1FF;
                        padding: 18rpx 24rpx;
                        font-weight: 500;
                        font-size: 26rpx;
                        color: #0C62FF;
                    }
                }

                .product_list {
                    gap: 56rpx;
                }
            }
        }
    }
}
</style>