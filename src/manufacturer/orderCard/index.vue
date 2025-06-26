<script lang="ts" setup>
import { createAddApi } from "@/http/api/all";
import del_icon from "@/static/images/del_icon.png"
import off_icon from "@/static/images/off_icon.png"
import { useManufacturerStore } from "@/manufacturer/store/manufacturer";
import { useUserStore } from "@/store/modules/user";

const useUser = useUserStore()
const useManufacturer = useManufacturerStore()
const { proxy } = getCurrentInstance() as any;

const popupRef = ref();
const cartList = ref<Array<any>>(useManufacturer.orderCard);
const createParams = reactive<any>({
    viewInventory: 1,
    cardProductsParams: []
})
const orderNo = ref('CD202506211459020318')
const editInformationRef = ref()

/**
 * 删除商品
 * @param id 
 */
const deleteProduct = (id: number) => {
    const index = cartList.value.findIndex((item) => item.id === id)
    cartList.value.splice(index, 1)
    useManufacturer.setOrderCardFu(cartList.value)
}

/**
 * 切换是否允许批发商查看库存
 * @param e 
 */
const switchChangeFu = (e: any) => {
    console.log(e, '4234');
    const { value } = e.detail
    createParams.viewInventory = value ? 0 : 1
}

/**
 * 创建订单
 */
const createAddFu = async () => {
    createParams.cardProductsParams = cartList.value.map((item) => {
        return {
            productsDetailParams: item.productColorsList,
            productId: item.id,
        }
    })
    await createAddApi(createParams).then((res: any) => {
        const { code, data, msg } = res
        proxy.$CloseLoading();
        if (code == proxy.$successCode) {
            orderNo.value = data
        } else {
            proxy.$Toast({ title: msg })
        }
    }, (req => {
        proxy.$CloseLoading();
        proxy.$Toast({ title: req.msg })
    }))
}

/**
 * 分享
 */
const shareFu = async () => {
    if (!useUser.userInfo.dept.address) {
        editInformationRef.value.showPopupFu()
        return
    }
    await createAddFu()
}

const editInformationFu = async () => {
    await createAddFu()
}

</script>

<template>
    <view class="container flex_column">
        <view class="bg"></view>
        <com-header header-title="订货卡" :backColor="false" :titleColor="true"></com-header>
        <view class="main_con flex_1 flex_column">
            <view class="flex_align flex_between switch_con">
                <view>是否允许批发商查看库存</view>
                <switch color="#0C61FD" :checked="!createParams.viewInventory" @change="switchChangeFu"></switch>
            </view>
            <view class="product_lsit flex_column" v-if="cartList.length > 0">
                <view v-for="item in cartList" :key="item.id">
                    <com-orderInfo :productDetail="item">
                        <template #button>
                            <view class="del_btn flex_align"
                                @click="deleteProduct(item.id)">
                                <image class="del_icon" :src="del_icon"></image>
                                <view>删除</view>
                            </view>
                        </template>
                    </com-orderInfo>
                </view>
            </view>
            <com-no_data v-else :noDataText="'暂无商品'"></com-no_data>
        </view>
        <view class="footer_con">
            <button class="share_btn" @click="shareFu">选择微信好友立即发送</button>
        </view>
    </view>
    <com-editInformation ref="editInformationRef" type="manufacturer"
        @editInformationFu="editInformationFu"></com-editInformation>
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
</style>