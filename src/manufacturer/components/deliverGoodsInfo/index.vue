<script lang="ts" setup>
import arrow_right from "@/static/images/arrow_right.png"

const emit = defineEmits(['selectPackagingFu'])

const props = defineProps({
    deliverInfo: {
        type: Object,
        default: () => ({})
    },
    edit: {
        type: Boolean,
        default: false
    }
})

const selectPackagingFu = () => {
    emit('selectPackagingFu')
}

</script>


<template>
    <view class="deliver_goods_info flex_column">
        <!-- <view>送货信息</view> -->
        <view class="flex_between select_con">
            <view>送货信息</view>
            <view v-if="edit" class="flex_align select_desc" @click="selectPackagingFu">
                <text>{{ deliverInfo.packagingId ? '修改' : '请选择' }}</text>
                <image class="arrow_right" :src="arrow_right"></image>
            </view>
        </view>
        <view class="flex_align deliver_goods_info_item">
            <view>配送站信息</view>
            <view class="flex_1" v-if="deliverInfo.packagingId">
                <view class="deliver_goods_title">{{ deliverInfo.deptName || deliverInfo.packagingName }}</view>
                <view class="deliver_goods_address">{{ deliverInfo.address || deliverInfo.packagingAddress }}</view>
                <view class="deliver_goods_tel">{{ deliverInfo.phone || deliverInfo.packagingPhone}}</view>
            </view>
            <view class="flex_1" v-else>请选择打包站</view>
        </view>
        <slot name="input"></slot>
    </view>
</template>


<style lang="scss" scoped>
.deliver_goods_info {
    padding: 36rpx 28rpx;
    font-weight: bold;
    font-size: 32rpx;
    color: #202020;
    gap: 24rpx;
    background: #FFFFFF;
    border-radius: 24rpx;

    .select_con {
        .select_desc {
            font-weight: 500;
            font-size: 28rpx;
            color: #0C62FF;
        }

        .arrow_right {
            width: 28rpx;
            height: 28rpx;
            margin-right: 8rpx;
        }
    }

    .deliver_goods_info_item {
        background: #F2F6FF;
        padding: 34rpx 28rpx;
        font-weight: 500;
        font-size: 28rpx;
        color: #202020;
        border-radius: 24rpx;
        text-align: right;

        .deliver_goods_address {
            font-weight: 400;
            color: #7C8191;
            margin: 12rpx 0;
        }

        .deliver_goods_tel {
            color: #0C62FF;
        }
    }
}
</style>