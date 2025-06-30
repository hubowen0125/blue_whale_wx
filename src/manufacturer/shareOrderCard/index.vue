<script lang="ts" setup>
import { selectByShareApi, editCardApi, getInfoApi } from "@/http/api/all"
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
        // selectByShareFu()
        // getInfoFu()
    }
})


onShow(() => {
    if (cardNo.value) {
        selectByShareFu()
    }
})

/**
 * 获取分享订单详情
 */
const selectByShareFu = () => {
    selectByShareApi({ type: type.value, cardNo: cardNo.value }).then((res: any) => {
        const { code, data, msg } = res
        proxy.$CloseLoading();
        if (code == proxy.$successCode) {
            console.log(data);
            if (data.cardProductsList && data.cardProductsList.length > 0) {
                data.cardProductsList.map((item: { productColorsList: any; cardProductsDetailList: any; id: any; productId: any; }) => {
                    item.productColorsList = item.cardProductsDetailList
                    item.id = item.productId
                    return item
                })
            }
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
    if (!cardOrderDetail.value.cardProductsList.length) {
        proxy.$Toast({ title: '请选择商品' })
        return
    }
    editCardApi(cardOrderDetail.value).then((res: any) => {
        const { code, data, msg } = res
        proxy.$CloseLoading();
        if (code == proxy.$successCode) {
            uni.navigateTo({
                url: `/manufacturer/orderCardInformation/index?type=share&cardNo=${cardNo.value}`
            })
        } else {
            proxy.$Toast({ title: msg })
        }
    }, (req => {
        proxy.$CloseLoading();
        proxy.$Toast({ title: req.msg })
    }))
}

const selectProductFu = () => {
    uni.navigateTo({
        url: `/manufacturer/selectProduct/index?type=shareCrad&cardNo=${cardNo.value}`
    })
}

</script>


<template>
    <view class="container flex_column">
        <view class="bg"></view>
        <com-header header-title="订货卡" :backColor="false" :titleColor="true"></com-header>
        <view class="main_con flex_1 flex_column">
            <view class="card_info section_con flex_column">
                <view class="section_title">订货卡信息</view>
                <view class="flex_align card_info_item">
                    <view>批发商信息</view>
                    <view class="flex_1">
                        <view class="card_info_item_title">{{ cardOrderDetail?.wholesale?.deptName }}</view>
                        <view class="card_info_item_address">{{ cardOrderDetail?.wholesale?.address }}</view>
                        <view class="card_info_item_tel">{{ cardOrderDetail?.wholesale?.phone }}</view>
                    </view>
                </view>
                <view class="flex_align card_info_item">
                    <view>配送站信息</view>
                    <view class="flex_1">
                        <view class="card_info_item_title">{{ cardOrderDetail?.packaging?.deptName }}</view>
                        <view class="card_info_item_address">{{ cardOrderDetail?.packaging?.address }}</view>
                        <view class="card_info_item_tel">{{ cardOrderDetail?.packaging?.phone }}</view>
                    </view>
                </view>
                <button class="card_info_btn" @click="selectProductFu">选择商品</button>
            </view>
            <view class="product_list section_con flex_column flex_1">
                <view class="section_title">已选商品</view>
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

    .main_con {
        position: relative;
        margin-top: 40rpx;
        overflow: hidden;
        padding: 0 24rpx;
        box-sizing: border-box;
        gap: 20rpx;
        overflow-x: hidden;
        overflow-y: auto;

        .section_con {
            background: #FFFFFF;
            border-radius: 24rpx;
            padding: 36rpx 28rpx;
            box-sizing: border-box;

            .section_title {
                font-weight: bold;
                font-size: 32rpx;
                color: #202020;
            }
        }

        .card_info {
            gap: 24rpx;

            .card_info_item {
                background: #F2F6FF;
                padding: 34rpx 28rpx;
                font-weight: 500;
                font-size: 28rpx;
                color: #202020;
                border-radius: 24rpx;
                text-align: right;

                .card_info_item_address {
                    font-weight: 400;
                    color: #7C8191;
                    margin: 12rpx 0;
                }

                .card_info_item_tel {
                    color: #0C62FF;
                }
            }

            .card_info_btn {
                width: 646rpx;
                height: 96rpx;
                background: rgba(12, 104, 255, 0.05);
                border-radius: 48rpx;
                border: 1rpx solid #8CBAFF;
                font-weight: 500;
                font-size: 30rpx;
                color: #0C62FF;
                line-height: 96rpx;
            }
        }

        .product_list {
            gap: 56rpx;

            .section_title {
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