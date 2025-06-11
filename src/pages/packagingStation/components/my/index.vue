<script lang="ts" setup>
import icon_3 from "@/static/images/chooseIdentity/icon_3.png"
import position_2 from "@/static/images/position_2.png"
import edit_icon from "@/static/images/edit_icon.png"
import member_icon from "@/static/images/member_icon.png"
import arrow_right from "@/static/images/arrow_right.png"
import arrow_right_1 from "@/static/images/arrow_right_1.png"
import { useUserStore } from '@/store/modules/user';

const useUser = useUserStore()

// 功能列表
const funList = [
    {
        name: '我的批发商',
        path: ''
    },
    {
        name: '报表管理',
        path: ''
    },
    {
        name: '员工管理',
        path: ''
    },
    {
        name: '打印机设置',
        path: ''
    },
    {
        name: '联系客服',
        path: ''
    },
    {
        name: '用户协议',
        path: ''
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
    confirmText: '确定'
}

const tabBarIndex = inject("tabBarIndex") as Ref<number>
const popupCom = ref()


onMounted(() => {
    popupCom.value.showPopup()
})

watch(() => tabBarIndex.value, (newVal) => {
    if (newVal == 2) {
        // useDataBoard.setConditionIndex(0)
        console.log('111111');

    }
})


// 确认弹窗
const confirmPopupFu = () => {
    console.log('1111');

}


</script>


<template>
    <view class="my_con flex_column">
        <view class="bg"></view>
        <view class="my_header  flex_between">
            <view class="my_header_info flex_column ">
                <view class="flex_align position_info">
                    <image class="position_icon" :src="position_2"></image>
                    <view>新村路打包站</view>
                </view>
                <view>上海市普陀区甘泉路280号</view>
                <view>15618257147</view>
                <button class="flex_align edit_btn">
                    <image class="edit_icon" :src="edit_icon"></image>
                    <text>编辑</text>
                </button>
            </view>
            <image class="my_header_icon" :src="icon_3"></image>
        </view>
        <view class="member_info flex_between flex_1">
            <view>
                <view class="flex_align">
                    <image class="member_icon" :src="member_icon"></image>
                    <text class="member_name">打包站</text>
                </view>
                <view class="member_desc">有效期至 2026-05-16</view>
            </view>
            <button class="flex_align member_btn flex_center">
                <text>立即续费</text>
                <image class="arrow_right" :src="arrow_right"></image>
            </button>
        </view>
        <view class="fun_list">
            <view class="fun_item flex_between flex_align" v-for="item, index in funList" :key="index">
                <view>{{ item.name }}</view>
                <image class="arrow_right_1" :src="arrow_right_1"></image>
            </view>
        </view>
        <button class="logout_btn">退出登录</button>
    </view>
    <com-popup_com ref="popupCom" :popupData="popupData" @confirmPopupFu="confirmPopupFu"></com-popup_com>
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

    .my_header {
        font-weight: 400;
        font-size: 24rpx;
        color: #DDEFFF;
        position: relative;

        .my_header_info {
            gap: 12rpx;

            .position_info {
                font-weight: bold;
                font-size: 40rpx;
                color: #FFFFFF;
                margin-bottom: 4rpx;

                .position_icon {
                    width: 36rpx;
                    height: 36rpx;
                    margin-right: 18rpx;
                }
            }

            .edit_btn {
                width: 120rpx;
                box-sizing: border-box;
                padding: 18rpx 20rpx;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 40rpx;
                border: 1rpx solid #8CBAFF;
                font-weight: 500;
                font-size: 26rpx;
                color: #FFFFFF;

                .edit_icon {
                    width: 20rpx;
                    height: 20rpx;
                    margin-right: 8rpx;
                }
            }
        }

        .my_header_icon {
            width: 360rpx;
            height: 360rpx;
        }
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

    .fun_list {
        background: #FFFFFF;
        border-radius: 24rpx;
        padding: 0 28rpx;
        margin: 20rpx 0;

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