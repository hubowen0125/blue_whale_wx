<script lang="ts" setup>
import home from "@/static/images/wholesaler/tabbar/home.png"
import home_active from "@/static/images/wholesaler/tabbar/home_active.png"
import order from "@/static/images/wholesaler/tabbar/order.png"
import order_active from "@/static/images/wholesaler/tabbar/order_active.png"
import order_ard from "@/static/images/wholesaler/tabbar/order_ard.png"
import order_ard_active from "@/static/images/wholesaler/tabbar/order_ard_active.png"
import goods_shelves from "@/static/images/wholesaler/tabbar/goods_shelves.png"
import goods_shelves_active from "@/static/images/wholesaler/tabbar/goods_shelves_active.png"
import my from "@/static/images/wholesaler/tabbar/my.png"
import my_active from "@/static/images/wholesaler/tabbar/my_active.png"
import home_com from "../components/tabbar/home/index.vue"
import order_com from "../components/tabbar/order/index.vue"
import my_com from "../components/tabbar/my/index.vue"


const { proxy } = getCurrentInstance() as any

const tabbarList = [
    {
        iconPath: home,
        selectedIconPath: home_active,
        text: "首页",
        index: 0,
    },
    {
        iconPath: order,
        selectedIconPath: order_active,
        text: "订单",
        index: 1,
    },
    {
        iconPath: order_ard,
        selectedIconPath: order_ard_active,
        text: "订货卡",
        index: 2,
    },
    {
        iconPath: goods_shelves,
        selectedIconPath: goods_shelves_active,
        text: "货架",
        index: 3,
    },
    {
        iconPath: my,
        selectedIconPath: my_active,
        text: "我的",
        index: 4,
    },
]
const tabBarIndex = ref(1)

onLoad(() => {
    // proxy.$Loading()
    // useDataBoard.setTabBarIndex(0)
    // if (![2, 8].includes(useUser.userInfo.userType)) {
    //     useDataBoard.getDealerInfoFu()
    // } else {
    //     useDataBoard.getDealerDeviceInfoFu()
    // }
})

const setTabBarIndex = (index: number) => {
    tabBarIndex.value = index
}

provide('tabBarIndex', tabBarIndex);

</script>


<template>
    <view class="container flex_column">
        <view class="tabbar_main container_defalut_bg flex_1">
            <view :class="[tabBarIndex == 0 ? 'opacity1' : 'opacity0']">
                <home_com></home_com>
            </view>
            <view :class="[tabBarIndex == 1 ? 'opacity1' : 'opacity0']">
                <order_com></order_com>
            </view>
            <view :class="[tabBarIndex == 2 ? 'opacity1' : 'opacity0', 'my_scroll']">
                <my_com></my_com>
            </view>
        </view>
        <view class="tabbar_con">
            <com-tabBar :tabBarIndex="tabBarIndex" :tabbarList="tabbarList" @setTabBarIndex="setTabBarIndex">
            </com-tabBar>
        </view>
    </view>
</template>


<style lang="scss" scoped>
.scroll-container {
    -webkit-overflow-scrolling: touch;
    overflow: auto;
}

.tabbar_main {
    flex: 1;
    height: calc(100% - (100rpx + env(safe-area-inset-bottom)));
    position: relative;

    .opacity1 {
        height: 100%;
    }

    .my_scroll {
        overflow-x: hidden;
        overflow-y: auto;
    }

    :deep(.van-calendar__day--start) {
        color: #111E36 !important;
    }

    :deep(.van-calendar__day--middle) {
        background: #F4F6FC !important;
        color: #111E36 !important;
    }

    :deep(.van-calendar__day--end) {
        color: #111E36 !important;
    }

    :deep(.van-button--block) {
        height: 92rpx !important;
        border-radius: 12rpx;
        color: #000000 !important;
    }
}

.tabbar_con {
    height: calc(100rpx + env(safe-area-inset-bottom));
}
</style>