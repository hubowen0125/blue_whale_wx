<script lang="ts" setup>
import { getOrderPageApi } from "@/http/api/order";
import { getOrderStatisticsApi } from "@/manufacturer/http/manufacturer"
import position_1 from "@/static/images/position_1.png"
import arrow_right_1 from "@/static/images/arrow_right_1.png"
import orderItem from "../../orderItem/idnex.vue"
import { useUserStore } from '@/store/modules/user';

const useUser = useUserStore()
const { proxy } = getCurrentInstance() as any;

const emit = defineEmits(['setTabBarIndex'])

const orderType = reactive(
    [
        {
            title: '今日订单',
            value: computed(() => statisticsDetail.value.orderToday || 0),
        },
        {
            title: '在库订单',
            value: computed(() => statisticsDetail.value.orderNotShipped || 0),
        },
        {
            title: '总订单',
            value: computed(() => statisticsDetail.value.orderNum || 0),
        },
    ]
)
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
    confirmText: '立即续费',
    callBack: true
}

const popupCom = ref()
const orderList = ref<Array<any>>([])
const statisticsDetail = ref({
    orderNotShipped: 0,
    orderToday: 0,
    orderNum: 0,
})
const paramsPage = reactive({
    pageNum: 1,
    pageSize: 10,
})

onMounted(() => {
    getOrderStatisticsFu()
    getOrderPageFu()
})

/**
 * 获取订单列表
 */
const getOrderPageFu = () => {
    proxy.$Loading()
    getOrderPageApi({ status: '' }, paramsPage).then((res: any) => {
        const { code, data, msg, token } = res
        proxy.$CloseLoading();
        if (code == proxy.$successCode) {
            console.log(data, '0000');
            if (data.datas && data.datas.length > 0) {
                orderList.value = [...orderList.value, ...data.datas]
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
 * 获取订单统计数据
 */
const getOrderStatisticsFu = () => {
    getOrderStatisticsApi().then((res: any) => {
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

// 确认弹窗
const confirmPopupFu = () => {
    console.log('1111');
}

// 查看全部
const lookAll = () => {
    console.log('2222');
    emit('setTabBarIndex', 1)
}
</script>


<template>
    <view class="home_com flex_column">
        <view class="header_con flex_align">
            <image class="header_img" :src="position_1"></image>
            <view class="header_title">上海蓝鲸童装有限公司</view>
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
            <view class="order_all_btn flex_align" @click="lookAll">
                <view>查看全部</view>
                <image class="arrow_right" :src="arrow_right_1"></image>
            </view>
        </view>
        <view class="main_con flex_1">
            <scroll-view class="scroll_con " scroll-y="true"
                lower-threshold="50">
                <view class="order_list flex_column" v-if="orderList.length > 0">
                    <template v-for="item in orderList" :key="item.orderNo">
                        <orderItem :orderData="item"></orderItem>
                    </template>
                </view>
                <com-no_data v-else noDataText="暂无订单"></com-no_data>
            </scroll-view>
        </view>
        <com-popup_com ref="popupCom" :popupData="popupData" @confirmPopupFu="confirmPopupFu"></com-popup_com>
    </view>
</template>

<style lang="scss" scoped>
.home_com {
    width: 100%;
    height: 100%;
    padding: v-bind('`${useUser.navHeight + (useUser.statusBarHeight / 2)}px`') 0 30rpx;
    box-sizing: border-box;

    .header_con {
        font-weight: bold;
        font-size: 40rpx;
        color: #202020;
        margin: 0 30rpx;

        .header_img {
            width: 36rpx;
            height: 36rpx;
            margin-right: 12rpx;
        }
    }

    .order_type_con {
        gap: 16rpx;
        margin: 32rpx 30rpx 56rpx;

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
        margin: 0 30rpx;

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
            position: relative;
            margin: 0 30rpx;
        }
    }
}
</style>