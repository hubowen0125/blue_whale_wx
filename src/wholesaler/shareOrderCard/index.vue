<script lang="ts" setup>
import { selectByShareApi, addProductApi, getInfoApi } from "@/http/api/all"
import position_1 from "@/static/images/position_2.png"
import { formatNumber } from "@/utils/utils";
import { useUserStore } from '@/store/modules/user';

const useUser = useUserStore()
const { proxy } = getCurrentInstance() as any;

const shoppingCart = ref<Array<any>>([])
const type = ref('')
const cardNo = ref('')
const cardOrderDetail = ref<any>({
    cardProductsList: []
})
const infoDetails = ref<any>({})

/**
 * 计算总价
 */
const totalAmount = computed(() => {
    let total = 0
    const list = cardOrderDetail.value.cardProductsList
    if (list.length > 0) {
        for (let i = 0; i < list.length; i++) {
            for (let j = 0; j < list[i].productColorsList.length; j++) {
                total += list[i].price * list[i].productColorsList[j].handNum
            }
        }
    }
    return total
})
/**
 * 计算总件数
 */
const totalHandNum = computed(() => {
    let total = 0
    const list = cardOrderDetail.value.cardProductsList
    if (list.length > 0) {
        for (let i = 0; i < list.length; i++) {
            for (let j = 0; j < list[i].productColorsList.length; j++) {
                total += list[i].productColorsList[j].handNum
            }
        }
    }
    return total
})

/**
 * 计算总手数
 */
const totalNum = computed(() => {
    let total = 0
    const list = cardOrderDetail.value.cardProductsList
    if (list.length > 0) {
        for (let i = 0; i < list.length; i++) {
            for (let j = 0; j < list[i].productColorsList.length; j++) {
                total += list[i].unitQuantity * list[i].productColorsList[j].handNum
            }
        }
    }
    return total
})

onLoad((e: any) => {
    if (e.type) {
        type.value = e.type
        cardNo.value = e.cardNo
        selectByShareFu()
        getInfoFu()
    }
})

const selectByShareFu = () => {
    selectByShareApi({ type: type.value, cardNo: cardNo.value }).then((res: any) => {
        const { code, data, msg } = res
        proxy.$CloseLoading();
        if (code == proxy.$successCode) {
            console.log(data);
            data.cardProductsList.map((item: { productColorsList: any; cardProductsDetailList: any; }) => {
                item.productColorsList = item.cardProductsDetailList
                return item
            })
            cardOrderDetail.value = data
        } else {
            proxy.$Toast({ title: msg })
        }
    }, (req => {
        proxy.$CloseLoading();
        proxy.$Toast({ title: req.msg })
    }))
}


/**
 * 获取用户信息
 */
const getInfoFu = () => {
    proxy.$Loading();
    getInfoApi().then((res: any) => {
        const { code, data, msg } = res
        if (code == proxy.$successCode) {
            console.log(data);
            infoDetails.value = data
        } else {
            proxy.$Toast({ title: msg })
        }
    }, (req => {
        proxy.$Toast({ title: req.msg })
    }))
}


/**
 * 立即下单
 */
const handleOrderFu = () => {
    console.log('立即下单', shoppingCart.value)
    addProductApi(cardOrderDetail.value.cardProductsList[0]).then((res: any) => {
        const { code, data, msg } = res
        proxy.$CloseLoading();
        if (code == proxy.$successCode) {
            console.log(data);
        } else {
            proxy.$Toast({ title: msg })
        }
    }, (req => {
        proxy.$CloseLoading();
        proxy.$Toast({ title: req.msg })
    }))
    uni.navigateTo({
        url: `/wholesaler/orderConfirmation/index?type=share&cardNo=${cardNo.value}`
    })
}

</script>


<template>
    <view class="container flex_column">
        <view class="bg"></view>
        <view class="my_header  flex_between">
            <view class="my_header_info flex_column ">
                <view class="flex_align position_info">
                    <image class="position_icon" :src="position_1"></image>
                    <view>{{ infoDetails.username }}</view>
                </view>
                <view>{{ infoDetails.address }}</view>
                <view>{{ infoDetails.userPhone }}</view>
            </view>
        </view>
        <view class="main_con flex_1 flex_column">
            <view class="product_list flex_column flex_1">
                <view class="product_title">已选商品</view>
                <template v-for="item in cardOrderDetail.cardProductsList" :key="item.id">
                    <view class="product_item">
                        <com-orderTable
                            orderType="handleOrder"
                            :productDetail="item">
                        </com-orderTable>
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
    padding-top: v-bind('`${useUser.statusBarHeight + useUser.navHeight}px`');
    box-sizing: border-box;

    .bg {
        width: 750rpx;
        height: 524rpx;
        background: linear-gradient(136deg, #0D5DFF 0%, #00AAFF 100%);
        clip-path: ellipse(100% 100% at 50% 100%);
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
        padding: 0 24rpx;
        box-sizing: border-box;

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
        }
    }

    .main_con {
        position: relative;
        margin-top: 40rpx;
        overflow: hidden;
        padding: 0 24rpx;
        box-sizing: border-box;


        .product_list {
            background: #FFFFFF;
            border-radius: 24rpx;
            padding: 36rpx 28rpx;
            box-sizing: border-box;
            gap: 56rpx;
            overflow-x: hidden;
            overflow-y: auto;

            .product_title {
                font-weight: bold;
                font-size: 32rpx;
                color: #202020;
                margin-bottom: -30rpx;
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