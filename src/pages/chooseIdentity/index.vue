<script lang="ts" setup>
import checkbox from "@/static/images/checkbox.png"
import checkbox_active from "@/static/images/checkbox_active.png"
import icon_1 from "@/static/images/chooseIdentity/icon_1.png"
import icon_2 from "@/static/images/chooseIdentity/icon_2.png"
import icon_3 from "@/static/images/chooseIdentity/icon_3.png"


const popupList = [
    {
        popupTitle: '提示',
        pupupType: 'default',
        popupContent: [
            {
                text: '您选择的身份是: ',
                desc: '厂家'
            },
            {
                text: '身份选择后将无法修改, 请确认 ',
            },
        ],
        cancelText: '返回修改',
        confirmText: '确认选择',
    },
    {
        popupTitle: '提示',
        pupupType: 'default',
        popupContent: [
            {
                text: '请等待系统审核',
            }
        ],
        confirmText: '我知道了',
    }
]
const identityList = [
    {
        title: '我是厂家',
        iamge: icon_1,
        key: '1',
        className:'icon_1'
    },
    {
        key: '2',
        iamge: icon_2,
        title: '我是批发商',
        className:'icon_2',
    },
    {
        title: '我是打包站',
        iamge: icon_3,
        key: '3',
        className:'icon_3'
    },
]
const popupData = ref()
const activeIndex = ref('')
const popupCom = ref()


const handleConfirmFu = () => {
    console.log('213213');
    popupData.value = popupList[0]
    popupCom.value.showPopup()
}

/**
 * 确认选择
 */
const confirmPopupFu = () => {
    console.log('324324');
    // popupData.value = popupList[1]
    // setTimeout(() => {
    //     popupCom.value.showPopup()
    // }, 200);
}

</script>


<template>
    <view class="container flex_cloumn container_defalut_bg">
        <view class="container_title">请选择您的身份</view>
        <view class="container_desc">帮助我们更好地为您提供服务</view>
        <view class="identity_list flex_column">
            <view class="identity_item flex_align" v-for="item in identityList" :key="item.key"
                @click="activeIndex = item.key">
                <image class="identity_item_image" :class="item.className" :src="item.iamge"></image>
                <view class="identity_item_title flex_1">{{ item.title }}</view>
                <image class="identity_item_checkbox" :src="activeIndex == item.key ? checkbox_active : checkbox" />
            </view>
        </view>
        <button class="button_defalut" @click="handleConfirmFu">确认选择</button>
    </view>
    <com-popup_com ref="popupCom" :popupData="popupData" @confirmPopupFu="confirmPopupFu"></com-popup_com>
</template>


<style lang="scss" scoped>
.container {
    padding: 72rpx;
    box-sizing: border-box;

    .container_title {
        font-weight: bold;
        font-size: 52rpx;
        color: #202020;
        margin-top: 100rpx;
    }

    .container_desc {
        font-weight: 400;
        font-size: 28rpx;
        color: #3F4561;
        margin-top: 24rpx;
        margin-bottom: 60rpx;
    }

    .identity_list {
        gap: 44rpx;
        margin-bottom: 84rpx;

        .identity_item {
            width: 606rpx;
            height: 220rpx;
            background: #FFFFFF;
            box-shadow: 0rpx 2rpx 12rpx 0rpx #DDE8FC;
            border-radius: 24rpx;
            padding: 0 60rpx 0 50rpx;
            box-sizing: border-box;

            .identity_item_checkbox {
                width: 36rpx;
                height: 36rpx;
                margin-left: 20rpx;
            }
            .identity_item_title{
                text-align: right;
            }

            .identity_item_image {
                width: 240rpx;
                height: 240rpx;
            }
            .icon_1{
                margin-top: -50rpx;
            }
            .icon_3{
                margin-top: 5rpx;
            }
        }
    }
}
</style>