<script lang="ts" setup>
import { useManufacturerStore } from "@/manufacturer/store/manufacturer";
import { formatNumber } from "@/utils/utils";


const useManufacturer = useManufacturerStore()
const { proxy } = getCurrentInstance() as any;

const shoppingCart = ref<Array<any>>(useManufacturer.shoppingCart)

const totalAmount = computed(() => {
    let total = 0
    for (let i = 0; i < shoppingCart.value.length; i++) {
        for (let j = 0; j < shoppingCart.value[i].productColorsList.length; j++) {
            total += shoppingCart.value[i].price * shoppingCart.value[i].productColorsList[j].handNum
        }
    }
    return total
})
const totalHandNum = computed(() => {
    let total = 0
    for (let i = 0; i < shoppingCart.value.length; i++) {
        for (let j = 0; j < shoppingCart.value[i].productColorsList.length; j++) {
            total += shoppingCart.value[i].productColorsList[j].handNum
        }
    }
    return total
})
const totalNum = computed(() => {
    let total = 0
    for (let i = 0; i < shoppingCart.value.length; i++) {
        for (let j = 0; j < shoppingCart.value[i].productColorsList.length; j++) {
            total += shoppingCart.value[i].unitQuantity * shoppingCart.value[i].productColorsList[j].handNum
        }
    }
    return total
})



/**
 * 立即下单
 */
const handleOrderFu = () => {
    console.log('立即下单', shoppingCart.value)
    uni.navigateTo({
        url: '/manufacturer/orderConfirmation/index'
    })
}

</script>


<template>
    <view class="container flex_column">
        <view class="bg"></view>
        <com-header header-title="订货卡详情" :backColor="false" :titleColor="true"></com-header>
        <view class="main_con flex_1">
            <view class="product_list flex_column">
                <template v-for="item in shoppingCart" :key="item.id">
                    <view class="product_item">
                        <com-orderTable
                            orderType="handleOrder"
                            :productDetail="item"></com-orderTable>
                    </view>
                </template>
            </view>
        </view>
        <view class="footer_con flex_between flex_align">
            <view>
                <view>
                    <text class="price_icon">¥</text>
                    <text>{{ formatNumber(totalAmount) }}</text>
                </view>
                <view class="unit_info">{{ totalHandNum }}手/{{ totalNum }}件</view>
            </view>
            <button class="button_defalut" @click="handleOrderFu">立即下单</button>
        </view>
    </view>
</template>

<style lang="scss" scoped>
.container {
    background: #F2F1F5;

    .bg {
        width: 750rpx;
        height: 318rpx;
        background: linear-gradient(136deg, #0D5DFF 0%, #00AAFF 100%);
        position: fixed;
        left: 0;
        top: 0;
    }

    .main_con {
        padding: 24rpx;
        position: relative;
        overflow-x: hidden;
        overflow-y: auto;

        .product_list {
            gap: 20rpx;

            .product_item {
                background: #FFFFFF;
                border-radius: 24rpx;
                padding: 36rpx 28rpx;
            }
        }
    }

    .footer_con {
        font-weight: 500;
        font-size: 44rpx;
        color: #0C62FF;

        .price_icon {
            font-size: 28rpx;
        }

        .unit_info {
            font-weight: 400;
            font-size: 24rpx;
            color: #202020;
        }

        .button_defalut {
            width: 320rpx;
        }
    }
}
</style>