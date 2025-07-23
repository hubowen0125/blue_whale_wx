<script lang="ts" setup>
import arrow_bottom from "@/static/images/arrow_bottom.png"
import { useUserStore } from '@/store/modules/user';

const useUser = useUserStore();

const emit = defineEmits(['viewDetailsFu', 'showTableFu']);

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
    goodsShelves: {
        type: String,
        default: ''
    },
    showTable: {
        type: Boolean,
        default: false
    }
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

const showTableFu = () => {
    emit('showTableFu');
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
            <view class="flex_align flex_between">
                <view>款号: {{ productDetail.styleNumber }}</view>
                <view class="order_price order_price_red" v-if="goodsShelves">
                    <text class="order_price_icon">¥</text>
                    <text>{{ productDetail.price }}</text>
                </view>
            </view>
            <view class="order_name flex_1">{{ productDetail.productName }}</view>
            <view class="order_price" v-if="orderType !== 'handleRefund' && !goodsShelves">
                <text class="order_price_icon">¥</text>
                <text>{{ productDetail.price }}</text>
            </view>
            <view class="order_quantity flex_between" v-if="goodsShelves" @click="showTableFu">
                <view class="flex_align">
                    <view>销量(手): <text class="order_quantity_num">{{ productDetail.salesNum }}</text></view>
                    <view>总库存(手): <text class="order_quantity_num">{{productDetail.stockNum}}</text></view>
                </view>
                <image class="arrow_bottom" :class="{ 'rotate180': showTable }" :src="arrow_bottom"></image>
            </view>
        </view>
        <slot name="button"></slot>
        <slot name="del"></slot>
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
        margin-right: 20rpx;
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


    .order_name {
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

    .order_price_red {
        color: #F73030;
    }

    .order_quantity {
        font-weight: 400;
        font-size: 24rpx;
        color: #7C8191;

        .order_quantity_num {
            color: #0C62FF;
            margin-right: 32rpx;
        }

        .arrow_bottom {
            width: 32rpx;
            height: 32rpx;
            transform: rotate(0);
            transition: all 0.3s ease;
        }

        .rotate180 {
            transform: rotate(180deg);
            transition: all 0.3s ease;
        }
    }
}
</style>