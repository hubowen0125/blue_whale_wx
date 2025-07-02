<script lang="ts" setup>
import { useUserStore } from '@/store/modules/user';

const useUser = useUserStore();

const emit = defineEmits(['viewDetailsFu']);

const props = defineProps({
    needDownload: {
        type: Boolean,
        default: true
    },
    productDetail: {
        type: Object,
        default: () => ({
            productName: '',
            styleNumber: '',
            price: 0
        })
    },
    orderType: {
        type: String,  // show 展示   handleOrder 下单  handleRefund 退款
        default: 'show'
    },
});

const orderImage = computed(() => {
    return props.productDetail.productImagesList && props.productDetail.productImagesList[0] && props.productDetail.productImagesList[0].imageUrlFull || '';
});

/**
 * 查看详情
 */
const viewDetailsFu = () => {
    emit('viewDetailsFu', props.productDetail);
}

const downLoadingFu = () => {
    console.log('下载图片');
    useUser.setProductDetailFu(props.productDetail || {})
    uni.navigateTo({
        url: `/pages/downLoadImages/index?id=${props.productDetail.id}`
    })
}

</script>

<template>
    <view class="flex order_info" @click="viewDetailsFu">
        <view :class="['order_image_con', needDownload ? '' : 'pointer']" @click.stop="downLoadingFu">
            <image class="order_image" :src="orderImage"></image>
            <view v-if="needDownload" class="order_image_tips">下载图片</view>
        </view>
        <view class="flex_column flex_1">
            <view>{{ productDetail.productName }}</view>
            <view class="flex_1 order_number">款号: {{ productDetail.styleNumber }}</view>
            <view class="order_price" v-if="orderType !== 'handleRefund'">
                <text class="order_price_icon">¥</text>
                <text>{{ productDetail.price }}</text>
            </view>
        </view>
        <view class="order_unit_con">
            <slot name="button"></slot>
        </view>
    </view>
</template>

<style lang="scss" scoped>
.order_info {
    gap: 20rpx;
    font-weight: 500;
    font-size: 28rpx;
    color: #202020;

    .order_image_con {
        position: relative;
        width: 140rpx;
        height: 140rpx;
        border-radius: 16rpx;
        overflow: hidden;

        .order_image {
            width: 140rpx;
            height: 140rpx;
        }

        .order_image_tips {
            width: 140rpx;
            height: 40rpx;
            background: rgba(1, 7, 18, 0.4);
            font-weight: 400;
            font-size: 20rpx;
            color: #FFFFFF;
            line-height: 40rpx;
            text-align: center;
            position: absolute;
            bottom: 0;
            left: 0;
        }

    }

    .order_number {
        font-weight: 400;
        font-size: 24rpx;
        color: #7C8191;
    }

    .order_price {
        font-weight: 500;
        font-size: 32rpx;
        color: #202020;

        .order_price_icon {
            font-size: 24rpx;
        }
    }

    .order_quantity {
        padding: 8rpx 14rpx;
        font-weight: 500;
        font-size: 26rpx;
        color: #0C62FF;
        background: rgba(12, 104, 255, 0.03);
        border-radius: 12rpx;
        border: 1rpx solid #CDE1FF;
    }
}
</style>