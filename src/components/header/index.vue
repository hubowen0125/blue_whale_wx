<script lang="ts" setup>
import { useUserStore } from '@/store/modules/user';
import back_icon from "@/static/images/back_icon.png"
import back_icon_white from "@/static/images/back_icon_white.png"

const useUser = useUserStore()

// 声明 props
const props = defineProps({
    headerTitle: {
        type: String,
        default: ''
    },
    back: {
        type: Boolean,
        default: true
    },
    backColor: {
        type: Boolean,
        default: true
    },
    returnFu: {
        type: [Boolean, Function],
        default: false
    },
    titleColor: {
        type: Boolean,
        default: false
    }
})
const backStyle = {
    top: `${useUser.statusBarHeight + ((useUser.navHeight - 20) / 2)}px`
}

const titleStyle = {
    lineHeight: `${useUser.navHeight}px`
}

const backFu = () => {
    if (typeof props.returnFu === 'function') {
        props.returnFu()
    } else {
        let len = getCurrentPages().length;
        console.log(len)
        if (len > 1) {
            uni.navigateBack()
        } else {
            if (useUser.miniRole == 'manufacturer') {
                uni.redirectTo({
                    url: '/manufacturer/home/index'
                })
            }
            if (useUser.miniRole == 'wholesale') {
                uni.redirectTo({
                    url: '/wholesaler/home/index'
                })
            }
            if (useUser.miniRole == 'packaging') {
                uni.redirectTo({
                    url: '/packagingStation/home/index'
                })
            }
        }
    }
}


</script>


<template>
    <view class="header_con" hover-class="pointer"
        hover-stay-time="1000">
        <view class="back_icon_con" v-if="back" @click="backFu" :style="backStyle">
            <image class="back_icon" :src="backColor ? back_icon : back_icon_white"></image>
        </view>
        <view class="header_title" :class="{ 'title_white': titleColor }" :style="titleStyle">{{ headerTitle }}</view>
    </view>
</template>


<style lang="scss" scoped>
.header_con {
    width: 100%;
    position: relative;
    height: v-bind('`${useUser.navHeight}px`');
    padding-top: v-bind('`${useUser.statusBarHeight}px`');

    .back_icon_con {
        width: 100rpx;
        height: 50rpx;
        position: absolute;
        padding-left: 22rpx;

        .back_icon {
            width: 38rpx;
            height: 38rpx;
            display: block;
            margin-top: 6rpx;
        }

    }

    .header_title {
        text-align: center;
        height: 100%;
        font-weight: 600;
        font-size: 34rpx;
        color: #000000;
    }

    .title_white {
        color: #FFFFFF;
    }
}
</style>