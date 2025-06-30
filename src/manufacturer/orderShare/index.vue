<script lang="ts" setup>
import { getByCardNoApi } from "@/http/api/all"
import { useUserStore } from "@/store/modules/user";
import share from "@/static/share.jpg"


const useUser = useUserStore()
const { proxy } = getCurrentInstance() as any;

const orderDetails = ref<any>({
    totalHandNum: 0,
    totalNum: 0,
    totalAmount: 0,
    packaging: {},
    wholesale: {},
    manufacturer: {},
    cardProductsList:[],
    remark: ''
})

onLoad((e: any) => {
    if (e.orderNo) {
        getByCardNoFu(e.orderNo)
        useUser.setShareParamFu({
            title: '蓝鲸',
            path: `/pages/loading/index?type=wholesale&cardNo=${e.orderNo}`,
            imageUrl: share
        })
    }
})


/**
 * 获取订单详情
 */
const getByCardNoFu = (cardNo: string) => {
    getByCardNoApi({ cardNo }).then((res: any) => {
        const { code, data, msg, token } = res
        proxy.$CloseLoading();
        if (code == proxy.$successCode) {
            console.log(data, '0000');
            if (data.cardProductsList && data.cardProductsList.length > 0) {
                data.cardProductsList.map((item: { productColorsList: any; cardProductsDetailList: any; id: any; productId: any; }) => {
                    item.productColorsList = item.cardProductsDetailList
                    item.id = item.productId
                    return item
                })
            }
            orderDetails.value = data
        } else {
            proxy.$Toast({ title: msg })
        }
    }, (req => {
        proxy.$CloseLoading();
        proxy.$Toast({ title: req.msg })
    }))
}

</script>

<template>
    <view class="container flex_column">
        <view class="bg"></view>
        <com-header header-title="订货卡" :backColor="false" :titleColor="true"></com-header>
        <view class="main_con flex_1 flex_column">
            <view class="flex_align flex_between switch_con">
                <view>是否允许批发商查看库存</view>
                <switch color="#0C61FD" disabled :checked="!orderDetails.viewInventory"></switch>
            </view>
            <view class="product_lsit flex_column" v-if="orderDetails.cardProductsList.length > 0">
                <view v-for="item in orderDetails.cardProductsList" :key="item.id">
                    <com-orderInfo :productDetail="item">
                    </com-orderInfo>
                </view>
            </view>
            <com-no_data v-else :noDataText="'暂无商品'"></com-no_data>
        </view>
        <view class="footer_con">
            <button class="share_btn" open-type="share">选择微信好友立即发送</button>
        </view>
    </view>
</template>

<style lang="scss" scoped>
.container {
    background: #F2F1F5;

    .bg {
        width: 750rpx;
        height: 270rpx;
        background: linear-gradient(136deg, #0D5DFF 0%, #00AAFF 100%);
        position: fixed;
        left: 0;
        top: 0;
    }

    .main_con {
        margin-top: 12rpx;
        padding: 24rpx;
        position: relative;
        gap: 20rpx;
        overflow-x: hidden;
        overflow-y: auto;

        .switch_con {
            padding: 28rpx;
            background: #FFFFFF;
            border-radius: 24rpx;
            font-weight: 500;
            font-size: 28rpx;
            color: #202020;
        }

        .product_lsit {
            background: #FFFFFF;
            border-radius: 24rpx;
            padding: 28rpx;
            gap: 56rpx;

            .del_btn {
                font-weight: 400;
                font-size: 28rpx;
                color: #7C8191;

                .del_icon {
                    width: 28rpx;
                    height: 28rpx;
                    margin-right: 6rpx;
                }
            }
        }
    }
}

.hint_con {
    font-weight: 400;
    font-size: 26rpx;
    color: #7C8191;
    margin-bottom: 36rpx;
    margin-top: 18rpx;

    .hint_icon {
        width: 26rpx;
        height: 26rpx;
        margin-right: 8px;
    }
}
</style>