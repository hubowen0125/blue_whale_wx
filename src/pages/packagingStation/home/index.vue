<script lang="ts" setup>
// import tabBar_com from "../components/tabBar/index.vue"
// import data_overview from "../components/layout/data_overview/index.vue"
// import dealer_data from "../components/layout/dealer_data/index.vue"
// import device_data from "../components/layout/device_data/index.vue"
// import product_data from "../components/layout/product_data/index.vue"
// import splitting_data from "../components/layout/splitting_data/index.vue"
// import { useDataBoardStore } from "../store/dataBoard"
// import { useUserStore } from "@/store/modules/user"
import home from "@/static/images/packagingStation/tabbar/home.png"
import home_active from "@/static/images/packagingStation/tabbar/home_active.png"
import record from "@/static/images/packagingStation/tabbar/record.png"
import record_active from "@/static/images/packagingStation/tabbar/record_active.png"
import my from "@/static/images/packagingStation/tabbar/my.png"
import my_active from "@/static/images/packagingStation/tabbar/my_active.png"
import home_com from "../components/home/index.vue"
import record_com from "../components/record/index.vue"

// const useUser = useUserStore()
// const useDataBoard = useDataBoardStore()
const { proxy } = getCurrentInstance() as any

const tabbarList = [
    {
        iconPath: home,
        selectedIconPath: home_active,
        text: "首页",
        index: 0,
    },
    {
        iconPath: record,
        selectedIconPath: record_active,
        text: "入库记录",
        index: 1,
    },
    {
        iconPath: my,
        selectedIconPath: my_active,
        text: "我的",
        index: 2,
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

// watch(() => useDataBoard.tabBarIndex, (newVal) => {
//     tabBarIndex.value = newVal
// }, { deep: true })

const setTabBarIndex = (index: number) => {
    tabBarIndex.value = index
    // useDataBoard.setTabBarIndex(index)
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
                <record_com></record_com>
            </view>
            <!-- <view :class="[tabBarIndex == 2 ? 'opacity1' : 'opacity0']">
                <device_data></device_data>
            </view>
            <view :class="[tabBarIndex == 3 ? 'opacity1' : 'opacity0']">
                <product_data></product_data>
            </view>
            <view :class="[tabBarIndex == 4 ? 'opacity1' : 'opacity0']">
                <splitting_data></splitting_data>
            </view> -->
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