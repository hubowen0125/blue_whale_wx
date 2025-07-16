<script lang="ts" setup>
import { createAddApi } from "@/http/api/all";
import del_icon from "@/static/images/del_icon.png"
import hint_icon from "@/static/images/hint_icon.png"
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
const orderNo = ref('')
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
    if (!useUser.userInfo.dept.address) {
        editInformationRef.value.showPopupFu()
        return
    }
    proxy.$Loading()
    await createAddApi(createParams).then((res: any) => {
        const { code, data, msg } = res
        proxy.$CloseLoading();
        if (code == proxy.$successCode) {
            uni.reLaunch({
                url: `/manufacturer/orderShare/index?orderNo=${data}`
            })
        } else {
            proxy.$Toast({ title: msg })
        }
    }, (req => {
        proxy.$CloseLoading();
        proxy.$Toast({ title: req.msg })
    }))
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
            <view class="hint_con flex_align">
                <image class="hint_icon" :src="hint_icon"></image>
                <view>创建完成可发送给微信好友</view>
            </view>
            <button class="button_defalut" @click="createAddFu">完成创建</button>
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