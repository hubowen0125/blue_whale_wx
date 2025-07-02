<script lang="ts" setup>
import { getSalesStatisticsApi } from "@/manufacturer/http/manufacturer"
import { getInfoApi } from "@/http/api/all"
import arrow_right_1 from "@/static/images/arrow_right_1.png"
import left_icon from "@/manufacturer/images/left_icon.png"
import right_icon from "@/manufacturer/images/right_icon.png"
import { useUserStore } from '@/store/modules/user';
import { useManufacturerStore } from "@/manufacturer/store/manufacturer"
import { createDateShifter } from "@/utils/utils"

const useManufacturer = useManufacturerStore()
const useUser = useUserStore()
const { proxy } = getCurrentInstance() as any;

// 功能列表
const funList = [
    {
        name: '我的批发商',
        path: '/manufacturer/wholesalerList/index'
    },
    {
        name: '我的员工',
        path: '/pages/myEmployees/index?userRole=manufacturer'
    },
    {
        name: '联系客服',
        path: ''
    },
    {
        name: '用户协议',
        path: '/packagingStation/myWholesaler/index'
    },
    {
        name: '隐私政策',
        path: ''
    },
]
const popupData = {
    popupTitle: '立即续费',
    pupupType: 'default',
    popupContent: [
        {
            text: '请联系',
            desc: '15618257147',
            text1: '进行续费'
        },
    ],
    confirmText: '确定',
    callBakc: true
}
const reportList = [
    {
        title: '订单数',
        value: () => statisticsDetail.value.orderNum || 0,
    },
    {
        title: '销售量',
        value: () => `${statisticsDetail.value.handNum || 0}手/${statisticsDetail.value.num || 0}件`,
    },
    {
        title: '销售额',
        value: () => `¥${statisticsDetail.value.amount || 0}`,
    },
]
const dateShift = createDateShifter() // 默认从今天开始


const tabBarIndex = inject("tabBarIndex") as Ref<number>
const popupCom = ref()
const infoDetails = ref<any>({})
const date = ref(dateShift.get())
const isLoad = ref(false) // 是否加载
const statisticsDetail = ref({
    orderNum: 0,
    handNum: 0,
    num: 0,
    amount: 0,
})


// onMounted(() => {
//     getInfoFu()
//     getSalesStatisticsFu()
// })

watch(() => tabBarIndex.value, (newVal) => {
    if (newVal == 4 && !isLoad.value) {
        isLoad.value = true
        getInfoFu()
        getSalesStatisticsFu()
    }
})

/**
 * 获取用户信息
 */
const getInfoFu = () => {
    proxy.$Loading();
    getInfoApi().then((res: any) => {
        const { code, data, msg } = res
        proxy.$CloseLoading();
        if (code == proxy.$successCode) {
            console.log(data);
            infoDetails.value = { ...infoDetails.value, ...data }
        } else {
            proxy.$Toast({ title: msg })
        }
    }, (req => {
        proxy.$CloseLoading();
        proxy.$Toast({ title: req.msg })
    }))
}

const getSalesStatisticsFu = () => {
    getSalesStatisticsApi({ date: date.value }).then((res: any) => {
        const { code, data, msg } = res
        if (code == proxy.$successCode) {
            console.log(data);
            statisticsDetail.value = data
        } else {
            proxy.$Toast({ title: msg })
        }
    }, (req => {
        proxy.$Toast({ title: req.msg })
    }))
}

const reduceTimeFu = () => {
    date.value = dateShift.prev()
    getSalesStatisticsFu()
}

const addTimeFu = () => {
    date.value = dateShift.next()
    getSalesStatisticsFu()
}

/**
 * 设置页面跳转
 * @param path 
 */
const toPageFu = (item: any) => {
    const { path } = item
    console.log(path, 'path');

    if (!path) return
    uni.navigateTo({
        url: path
    })
}

// 确认弹窗
const confirmPopupFu = () => {
    console.log('1111');
}

// 立即续费
const renewFu = () => {
    uni.navigateTo({
        url: '/wholesaler/renewalMembership/index'
    })
}

const logoutFu = () => {

    uni.showModal({
        content: '确定退出登录吗？',
        success: (res) => {
            if (res.confirm) {
                useUser.resetState()
                useManufacturer.resetState()
                uni.reLaunch({
                    url: `/pages/loading/index`
                })
            }
        }
    })
}


</script>


<template>
    <view class="my_con flex_column">
        <view class="bg"></view>
        <com-myHeader :userRole="'manufacturer'" :infoDetails="infoDetails"
            @editInformationFu="getInfoFu"></com-myHeader>
        <view class="daily_report">
            <view>日报表</view>
            <view class="select_time flex_align">
                <image class="select_time_icon" :src="left_icon" @click="reduceTimeFu"></image>
                <view class="flex_1">{{ date }}</view>
                <image class="select_time_icon" :src="right_icon" @click="addTimeFu"></image>
            </view>
            <view class="report_con flex">
                <view class="report_item flex_column flex_align flex_center flex_1"
                    v-for="item in reportList"
                    :key="item.title">
                    <view>{{ item.value() }}</view>
                    <view class="report_item_title">{{ item.title }}</view>
                </view>
            </view>
        </view>
        <view class="fun_list">
            <view class="fun_item flex_between flex_align" @click="toPageFu(item)" v-for="item, index in funList"
                :key="index">
                <view>{{ item.name }}</view>
                <image class="arrow_right_1" :src="arrow_right_1"></image>
            </view>
        </view>
        <button class="logout_btn" @click="logoutFu">退出登录</button>
    </view>
    <com-popup_com ref="popupCom" :popupData="popupData" @confirmPopupFu="confirmPopupFu"></com-popup_com>
</template>


<style lang="scss" scoped>
.my_con {
    width: 100%;
    padding: v-bind('`${useUser.statusBarHeight + useUser.navHeight}px`') 24rpx 30rpx 24rpx;
    box-sizing: border-box;
    overflow-y: auto;
    overflow-x: hidden;

    .bg {
        width: 750rpx;
        height: 508rpx;
        background: linear-gradient(136deg, #0D5DFF 0%, #00AAFF 100%);
        /* 底部椭圆裁剪 */
        transform: scaleY(-1);
        position: fixed;
        left: 0;
        top: 0;
    }

    .member_info {
        padding: 38rpx 28rpx;
        background: #FFFFFF;
        border-radius: 24rpx;
        font-weight: 400;
        font-size: 26rpx;
        color: #7C8191;
        margin-top: -76rpx;
        position: relative;

        .member_icon {
            width: 34rpx;
            height: 34rpx;
            margin-right: 14rpx;
        }

        .member_name {
            font-weight: normal;
            font-size: 32rpx;
            line-height: 36rpx;
            font-style: normal;
            background: linear-gradient(324.7605345773806deg, #0D5DFF 0%, #00AAFF 100%);
            background-clip: text;
            -webkit-text-fill-color: transparent;
            color: transparent;
        }

        .member_desc {
            margin-top: 10rpx;
        }

        .member_btn {
            padding: 24rpx;
            background: rgba(12, 104, 255, 0.05);
            border-radius: 48rpx;
            border: 1rpx solid #8CBAFF;
            font-weight: 500;
            font-size: 26rpx;
            color: #0C62FF;

            .arrow_right {
                width: 26rpx;
                height: 26rpx;
            }
        }
    }

    .daily_report {
        background: #FFFFFF;
        border-radius: 24rpx;
        font-weight: bold;
        font-size: 32rpx;
        color: #202020;
        padding: 36rpx 28rpx;
        margin-top: 20rpx;
        position: relative;

        .select_time {
            background: #F7F8FA;
            border-radius: 16rpx;
            margin: 24rpx 0 16rpx;
            padding: 22rpx 40rpx;
            text-align: center;
            font-weight: 500;
            font-size: 26rpx;

            .select_time_icon {
                width: 32rpx;
                height: 32rpx;
            }
        }

        .report_con {
            gap: 12rpx;

            .report_item {
                background: rgba(12, 104, 255, 0.03);
                border-radius: 20rpx;
                border: 1rpx solid #CDE1FF;
                height: 142rpx;
                font-weight: 500;
                font-size: 30rpx;
                color: #0C62FF;
                gap: 10rpx;

                .report_item_title {
                    font-weight: 400;
                    font-size: 24rpx;
                    color: #7C8191;
                }
            }
        }

    }

    .fun_list {
        background: #FFFFFF;
        border-radius: 24rpx;
        padding: 0 28rpx;
        margin: 20rpx 0;
        position: relative;

        .fun_item {
            font-weight: 500;
            font-size: 28rpx;
            color: #202020;
            padding: 36rpx 0;
            border-bottom: 1rpx solid #EFEFEF;

            .arrow_right_1 {
                width: 28rpx;
                height: 28rpx;
            }
        }
    }

    .logout_btn {
        width: 702rpx;
        height: 100rpx;
        background: #FFFFFF;
        border-radius: 24rpx;
        font-weight: 500;
        font-size: 28rpx;
        color: #202020;
        line-height: 100rpx;
    }
}
</style>