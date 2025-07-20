<script lang="ts" setup>
import { getOrderPageApi } from "@/http/api/order";
import { getInfoApi } from "@/http/api/all"
import { getWholesaleOrderStatisticsApi } from "@/wholesaler/http/wholesaler"
import position_1 from "@/static/images/position_1.png"
import arrow_right_1 from "@/static/images/arrow_right_1.png"
import orderItem from "../../orderItem/idnex.vue"
import { useUserStore } from '@/store/modules/user';
import { calculateTimeDifference } from "@/utils/utils";

const emit = defineEmits(['setTabBarIndex'])

const useUser = useUserStore()
const { proxy } = getCurrentInstance() as any;

const orderType = reactive([
    {
        title: '今日订单',
        value: computed(() => statistic.value.orderToday || 0),
    },
    {
        title: '待发货订单',
        value: computed(() => statistic.value.orderNotShipped || 0),
    },
    {
        title: '异常订单',
        value: computed(() => statistic.value.abnormalOrderNum || 0),
    },
])
const popupData = reactive({
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
    confirmText: '立即续费',
    callBack: true
})
const renewPopupData = reactive({
    popupTitle: '立即续费',
    pupupType: 'default',
    popupContent: [
        {
            text: '请联系',
            desc: '',
            text1: '进行续费'
        }
    ],
    confirmText: '我知道了',
})
const renewPopup = ref()

const popupCom = ref()
const paramsPage = reactive({
    pageNum: 1,
    pageSize: 10,
})
const orderList = ref<any[]>([])
const statistic = ref<any>({
    orderToday: 0,
    orderNotShipped: 0,
    abnormalOrderNum: 0
})
const triggered = ref(false) // 下拉刷新
const isLoad = ref(false) // 是否加载

onMounted(() => {
    getOrderPageFu()
    getWholesaleOrderStatisticsFu()
})


/**
 * 获取用户信息
 */
const getInfoFu = () => {
    getInfoApi().then((res: any) => {
        const { code, data, msg } = res
        proxy.$CloseLoading();
        if (code == proxy.$successCode) {
            console.log(data, calculateTimeDifference(data.expireTime));
            const day = calculateTimeDifference(data.expireTime).day;
            if (0 < day && day < 7) {
                popupData.popupContent[0].desc = `${day}天后到期`
                popupCom.value.showPopup()
            } else if (day < 0) {
                popupData.popupContent[0].text = '您的会员服务已过期'
                popupData.popupContent[0].desc = `${day * -1}天`
                popupCom.value.showPopup()
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
 * 获取订单列表
 */
const getOrderPageFu = async () => {
    proxy.$Loading()
    await getOrderPageApi({ status: '' }, paramsPage).then((res: any) => {
        const { code, data, msg } = res
        if (code == proxy.$successCode) {
            console.log(data, '0000');
            if (data.datas && data.datas.length > 0) {
                orderList.value = data.datas
            } else {
                orderList.value = []
            }
        } else {
            proxy.$CloseLoading();
            proxy.$Toast({ title: msg })
        }
    }, (req => {
        proxy.$CloseLoading();
        proxy.$Toast({ title: req.msg })
    }))
    if (!isLoad.value) {
        getInfoFu()
        isLoad.value = true
    } else {
        proxy.$CloseLoading();
    }
}

const getWholesaleOrderStatisticsFu = () => {
    getWholesaleOrderStatisticsApi().then((res: any) => {
        const { code, data, msg } = res
        if (code == proxy.$successCode) {
            console.log(data, '1111');
            statistic.value = data
        } else {
            proxy.$CloseLoading();
            proxy.$Toast({ title: msg })
        }
    }, (req => {
        proxy.$CloseLoading();
        proxy.$Toast({ title: req.msg })
    }))
}

/**
 * 查看全部订单
 */
const viewAllOrderFu = () => {
    emit('setTabBarIndex', 1)
}

// 确认弹窗
const confirmPopupFu = () => {
    console.log('1111');
    renewPopupData.popupContent[0].desc = useUser.servicePhone
    renewPopup.value.showPopup()
}

const refresherrefreshFu = () => {
    triggered.value = true
    getOrderPageFu()
}
</script>


<template>
    <view class="home_com flex_column">
        <view class="header_con flex_align">
            <image class="header_img" :src="position_1"></image>
            <view class="header_title">{{ useUser.userInfo?.dept?.deptName }}</view>
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
            <view class="order_all_btn flex_align" @click="viewAllOrderFu">
                <view>查看全部</view>
                <image class="arrow_right" :src="arrow_right_1"></image>
            </view>
        </view>
        <view class="main_con flex_1">
            <scroll-view class="scroll_con " scroll-y="true"
                lower-threshold="50"
                :refresher-enabled="true"
                :refresher-triggered="triggered"
                @refresherrefresh="refresherrefreshFu">
                <view class="order_list flex_column">
                    <template v-for="item in orderList" :key="item.id">
                        <orderItem :orderData="item"></orderItem>
                    </template>
                </view>
            </scroll-view>
        </view>
        <com-popup_com ref="popupCom" :popupData="popupData" @confirmPopupFu="confirmPopupFu"></com-popup_com>
        <com-popup_com ref="renewPopup" :popupData="renewPopupData"></com-popup_com>
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