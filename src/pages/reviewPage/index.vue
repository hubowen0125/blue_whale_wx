<script lang="ts" setup>
import review_icon from "@/static/images/review_icon.png"
import { useUserStore } from '@/store/modules/user';

const useUser = useUserStore()

const logoutFu = () => {
    useUser.resetState()
    uni.reLaunch({
        url: `/pages/loading/index`
    })
}

</script>


<template>
    <view class="container flex_column">
        <view class="color_fff">
            <com-header :back="false" header-title="聚衣仓"></com-header>
        </view>
        <view class="main_con flex_1">
            <view class="color_fff flex_column flex_align review_con">
                <image class="review_icon" :src="review_icon"></image>
                <view class="review_status">审核中</view>
                <view class="review_tips">您申请的打包站身份</view>
                <view class="review_tips">平台正在审核，请耐心等待</view>
            </view>
        </view>
        <view class="footer_con">
            <button class="button_defalut" @click="logoutFu">返回登录</button>
        </view>
    </view>
</template>

<style lang="scss" scoped>
.color_fff {
    background: #fff;
}

.review_con {
    padding: 128rpx 0;

    .review_icon {
        width: 216rpx;
        height: 154rpx;
    }

    .review_status {
        font-weight: bold;
        font-size: 32rpx;
        color: #202020;
        margin-top: 40rpx;
        margin-bottom: 20rpx;
    }

    .review_tips {
        font-weight: 400;
        font-size: 28rpx;
        color: #666666;
        margin-top: 6rpx;
    }
}
</style>