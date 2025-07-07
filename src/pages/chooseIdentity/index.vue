<script lang="ts" setup>
import { getUserInfoApi, updateUserRoleApi } from "@/http/api/all"
import checkbox from "@/static/images/checkbox.png"
import checkbox_active from "@/static/images/checkbox_active.png"
import manufacturer_icon from "@/static/images/chooseIdentity/manufacturer_icon.png"
import wholesale_icon from "@/static/images/chooseIdentity/wholesale_icon.png"
import packaging_icon from "@/static/images/chooseIdentity/packaging_icon.png"
import { useUserStore } from "@/store/modules/user"

const useUser = useUserStore()
const { proxy } = getCurrentInstance() as any;

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
        callBack: true
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
        callBack: false
    }
]

const identityList = [
    {
        title: '我是厂家',
        desc:'厂家',
        iamge: manufacturer_icon,
        key: 'manufacturer',
        className: 'icon_1'
    },
    {
        title: '我是批发商',
        desc:'批发商',
        iamge: wholesale_icon,
        key: 'wholesale',
        className: 'icon_2',
    },
    {
        title: '我是打包站',
        desc:'打包站',
        iamge: packaging_icon,
        key: 'packaging',
        className: 'icon_3'
    },
]
const popupData = ref()
const popupCom = ref()
const params = reactive({
    userName: useUser.userInfo.userName,
    userRole: ''
})
const roleTitle = ref('')


const handleConfirmFu = () => {
    console.log('213213');
    if (params.userRole == '') {
        proxy.$Toast({ title: '请选择身份' })
        return
    }
    popupData.value = { ...popupList[0] }
    popupData.value.popupContent[0].desc = roleTitle.value
    popupCom.value.showPopup()
}

/**
 * 确认选择
 */
const confirmPopupFu = () => {
    proxy.$Loading();
    updateUserRoleApi(params).then((res: any) => {
        const { code, data, msg, miniRole } = res
        if (code == proxy.$successCode) {
            console.log('code');
            getUserInfoFu()
            if (params.userRole == 'packaging') {
                popupData.value = { ...popupList[1] }
                popupCom.value.showPopup()
            } else {
                uni.redirectTo({
                    url: '/manufacturer/home/index'
                })
            }
        } else {
            proxy.$Toast({ title: msg })
        }
    }, (req => {
        proxy.$Toast({ title: req.msg })
    }))
}

const getUserInfoFu = () => {
    getUserInfoApi().then((res: any) => {
        const { code, data, msg } = res
        proxy.$CloseLoading();
        if (code == proxy.$successCode) {
            useUser.setUserInfoFu(data.sysUser)
            useUser.setMiniRoleFu(data.miniRole)
        } else {
            proxy.$Toast({ title: msg })
        }
    }, (req => {
        proxy.$Toast({ title: req.msg })
    }))
}

</script>


<template>
    <view class="container flex_column container_defalut_bg">
        <view class="container_title">请选择您的身份</view>
        <view class="container_desc">帮助我们更好地为您提供服务</view>
        <view class="identity_list flex_column">
            <view class="identity_item flex_align" v-for="item in identityList" :key="item.key"
                @click="params.userRole = item.key, roleTitle = item.desc">
                <image class="identity_item_image" :class="item.className" :src="item.iamge"></image>
                <view class="identity_item_title flex_1">{{ item.title }}</view>
                <image class="identity_item_checkbox" :src="params.userRole == item.key ? checkbox_active : checkbox" />
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

            .identity_item_title {
                text-align: right;
            }

            .identity_item_image {
                width: 240rpx;
                height: 240rpx;
            }

            .icon_1 {
                margin-top: -50rpx;
            }

            .icon_3 {
                margin-top: 5rpx;
            }
        }
    }

    .button_defalut {
        width: 606rpx;
    }
}
</style>