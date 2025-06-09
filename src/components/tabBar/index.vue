<script lang="ts" setup>
// import icon_1 from "../../images/tabBar/icon_1.png"
// import icon_1_active from "../../images/tabBar/icon_1_active.png"
// import icon_2 from "../../images/tabBar/icon_2.png"
// import icon_2_active from "../../images/tabBar/icon_2_active.png"
// import icon_3 from "../../images/tabBar/icon_3.png"
// import icon_3_active from "../../images/tabBar/icon_3_active.png"
// import icon_4 from "../../images/tabBar/icon_4.png"
// import icon_4_active from "../../images/tabBar/icon_4_active.png"
// import icon_5 from "../../images/tabBar/icon_5.png"
// import icon_5_active from "../../images/tabBar/icon_5_active.png"
// import { useUserStore } from "@/store/modules/user";


// const useUser = useUserStore()
const emit = defineEmits(['setTabBarIndex'])

// const tabbarList = [
//     {
//         iconPath: icon_1,
//         selectedIconPath: icon_1_active,
//         text: "数据概览",
//         index: 0,
//         show: true
//     },
//     {
//         iconPath: icon_2,
//         selectedIconPath: icon_2_active,
//         text: "经销商数据",
//         index: 1,
//         show: ![2, 8].includes(useUser.userInfo.userType)
//     },
//     {
//         iconPath: icon_3,
//         selectedIconPath: icon_3_active,
//         text: "货柜数据",
//         index: 2,
//         show: true
//     },
//     {
//         iconPath: icon_4,
//         selectedIconPath: icon_4_active,
//         text: "商品数据",
//         index: 3,
//         show: true
//     },
//     {
//         iconPath: icon_5,
//         selectedIconPath: icon_5_active,
//         text: "分成数据",
//         index: 4,
//         show: true
//     }
// ]

// const props = defineProps<{
//     tabBarIndex: number;
// }>()

const props = defineProps({
    tabBarIndex: {
        type: Number,
        default: 0
    },
    tabbarList: {
        type: Array as PropType<any[]>,
        default: () => []
    }
})


const switchTab = (index: number) => {
    console.log(index, 'switchTabswitchTabswitchTabswitchTab');
    emit('setTabBarIndex', index)
}

</script>

<template>
    <view class="tab_bar">
        <template v-for="item in tabbarList" :key="item.index">
            <view
                class="tab_bar_item"
                @click="switchTab(item.index)">
                <image class="image_con" :class="tabBarIndex === item.index ? '' : 'opacity_img'"
                    :src="item.selectedIconPath"></image>
                <image class="image_con" :class="tabBarIndex === item.index ? 'opacity_img' : ''"
                    :src="item.iconPath"></image>
                <view class="tabbar_text" :class="tabBarIndex === item.index ? 'activeColor' : 'defalutColor'">{{
                    item.text }}</view>
            </view>
        </template>
    </view>
</template>

<style lang="scss" scoped>
.tab_bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 100rpx;
    display: flex;
    padding-bottom: env(safe-area-inset-bottom);
    background-color: #fff;

    .tabbar_icon {
        position: absolute;
        width: 100%;
        height: 110rpx;
        left: 0;
        top: 0;
    }

    .tab_bar_item {
        flex: 1;
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        position: relative;

        .image_con {
            width: 56rpx;
            height: 56rpx;
        }

        .tabbar_text {
            font-weight: 400;
            font-size: 24rpx;
            color: #555555;
        }

        .opacity_img {
            opacity: 0;
            position: absolute;
            top: 0;
            left: 0;
            pointer-events: none;
        }

        .defalutColor {
            color: #555555;
        }

        .activeColor {
            color: #0C62FF;
        }

    }
}
</style>
