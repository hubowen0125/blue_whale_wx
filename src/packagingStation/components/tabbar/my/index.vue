<script lang="ts" setup>
import arrow_right_1 from "@/static/images/arrow_right_1.png"
import { useUserStore } from '@/store/modules/user';
import { getInfoApi, logoutApi } from "@/http/api/all"

const useUser = useUserStore()
const { proxy } = getCurrentInstance() as any;

// 功能列表
const funList = [
    {
        name: '我的批发商',
        path: '/packagingStation/myWholesaler/index'
    },
    {
        name: '报表管理',
        path: '/packagingStation/myReport/index'
    },
    {
        name: '员工管理',
        path: '/pages/myEmployees/index?userRole=packaging'
    },
    {
        name: '打印机设置',
        path: '/packagingStation/printerSettings/index'
    },
    {
        name: '联系客服',
        path: ''
    },
    {
        name: '用户协议',
        path: '/pages/agreement/index?type=userAgreement'
    },
    {
        name: '隐私政策',
        path: '/pages/agreement/index?type=privacyAgreement'
    },
]

const tabBarIndex = inject("tabBarIndex") as Ref<number>
const infoDetails = ref<any>({})

watch(() => tabBarIndex.value, (newVal) => {
    if (newVal == 2) {
        getInfoFu()
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
            infoDetails.value = data
            useUser.userInfo.dept = { ...useUser.userInfo.dept, ...data }
        } else {
            proxy.$Toast({ title: msg })
        }
    }, (req => {
        proxy.$CloseLoading();
        proxy.$Toast({ title: req.msg })
    }))
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

const logoutFu = () => {
    uni.showModal({
        content: '确定退出登录吗？',
        success: (res) => {
            if (res.confirm) {
                logoutApi({}).then((res: any) => {
                    const { code, data, msg } = res
                    if (code == proxy.$successCode) {
                        useUser.resetState()
                        uni.reLaunch({
                            url: `/pages/loading/index`
                        })
                    } else {
                        proxy.$Toast({ title: msg })
                    }
                }, (req => {
                    proxy.$Toast({ title: req.msg })
                }))
            }
        }
    })
}


</script>


<template>
    <view class="my_con flex_column">
        <view class="bg"></view>
        <com-myHeader :userRole="'packaging'" :infoDetails="infoDetails" @editInformationFu="getInfoFu"></com-myHeader>
        <view class="fun_list">
            <view class="fun_item flex_between flex_align" @click="toPageFu(item)" v-for="item, index in funList"
                :key="index">
                <view>{{ item.name }}</view>
                <image class="arrow_right_1" :src="arrow_right_1"></image>
            </view>
        </view>
        <button class="logout_btn" @click="logoutFu">退出登录</button>
    </view>
</template>


<style lang="scss" scoped>
.my_con {
    width: 100%;
    padding: v-bind('`${useUser.statusBarHeight + useUser.navHeight}px`') 24rpx 30rpx 24rpx;
    box-sizing: border-box;
    background: #F2F1F5;
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