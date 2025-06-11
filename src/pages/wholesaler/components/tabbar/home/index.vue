<script lang="ts" setup>
import position_1 from "@/static/images/position_1.png"
import arrow_right_1 from "@/static/images/arrow_right_1.png"
import long_arrow from "@/static/images/long_arrow.png"
import orderItem from "../../orderItem/idnex.vue"
import { useUserStore } from '@/store/modules/user';

const useUser = useUserStore()
const { proxy } = getCurrentInstance() as any;

const orderType = [
    {
        title: '今日订单',
        value: '100',
    },
    {
        title: '未发货订单',
        value: '80',
    },
    {
        title: '异常订单',
        value: '20',
    },
]
const popupData = {
    popupTitle: '续费提醒',
    pupupType: 'default',
    popupContent: [
        {
            text: '您的会员服务将在',
            desc: '7天内到期',
        },
        {
            text: '请及时续费',
        },
    ],
    cancelText: '稍后处理',
    confirmText: '立即续费'
}

const popupCom = ref()
const tabBarIndex = inject("tabBarIndex") as Ref<number>

onMounted(() => {
    popupCom.value.showPopup()
})


watch(() => tabBarIndex.value, (newVal) => {
    if (newVal == 0) {
        console.log('213213');
    }
})

/**
 * 滑动加载
 */
const scrolltolower = () => {
    // if (!slideLoading.value) return
    console.log('++++++++');
    // manageDevicesParams.value.page += 1
    // resetManageDevicesParams()
}



// 确认弹窗
const confirmPopupFu = () => {
    console.log('1111');

}
</script>


<template>
    <view class="home_com flex_column">
        <view class="header_con flex_align">
            <image class="header_img" :src="position_1"></image>
            <view class="header_title">上海春之都店</view>
        </view>
        <view class="order_type_con flex">
            <view class="order_type_item flex_column flex_align flex_center" v-for="item in orderType"
                :key="item.title">
                <view>{{ item.value }}</view>
                <view class="order_type_item_title">{{ item.title }}</view>
            </view>
        </view>
        <view class="flex_align flex_between order_all_con">
            <view>全部订单</view>
            <view class="order_all_btn flex_align">
                <view>查看全部</view>
                <image class="arrow_right" :src="arrow_right_1"></image>
            </view>
        </view>
        <view class="main_con flex_1">
            <scroll-view class="scroll_con " scroll-y="true"
                lower-threshold="50"
                @scrolltolower="scrolltolower">
                <view class="order_list flex_column">
                    <template v-for="item in 10" :key="item">
                        <orderItem></orderItem>
                    </template>
                </view>
            </scroll-view>
        </view>
        <com-popup_com ref="popupCom" :popupData="popupData" @confirmPopupFu="confirmPopupFu"></com-popup_com>
    </view>
</template>

<style lang="scss" scoped>
.home_com {
    width: 100%;
    height: 100%;
    padding: v-bind('`${useUser.navHeight + (useUser.statusBarHeight / 2)}px`') 30rpx 30rpx 30rpx;
    box-sizing: border-box;

    .header_con {
        font-weight: bold;
        font-size: 40rpx;
        color: #202020;

        .header_img {
            width: 36rpx;
            height: 36rpx;
            margin-right: 12rpx;
        }
    }

    .order_type_con {
        gap: 16rpx;
        margin: 32rpx 0 56rpx;

        .order_type_item {
            width: 220rpx;
            height: 200rpx;
            background: #FFFFFF;
            box-shadow: 0rpx 4rpx 12rpx 0rpx #DDE8FC;
            border-radius: 24rpx;
            font-weight: bold;
            font-size: 40rpx;
            color: #0C62FF;
            gap: 10rpx;

            .order_type_item_title {
                font-weight: 400;
                font-size: 24rpx;
                color: #7C8191;
            }
        }
    }

    .order_all_con {
        font-weight: bold;
        font-size: 32rpx;
        color: #202020;

        .order_all_btn {
            font-weight: 400;
            font-size: 24rpx;
            color: #7C8191;

            .arrow_right {
                width: 24rpx;
                height: 24rpx;
            }
        }
    }

    .main_con {
        overflow: hidden;
        margin-top: 24rpx;

        .order_list {
            gap: 20rpx;

        }
    }
}
</style>