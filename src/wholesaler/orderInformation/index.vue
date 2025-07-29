<script lang="ts" setup>
import { packagingWholesalePageApi } from "@/http/api/all";
import { wholesaleListApi } from '@/wholesaler/http/wholesaler';
import position_1 from "@/static/images/position_1.png"
import arrow_right from "@/static/images/arrow_right.png"
import hint_icon from "@/static/images/hint_icon.png"
import { useUserStore } from '@/store/modules/user';
import { createAddApi } from "@/http/api/all";
import { useWholesalerStore } from "@/wholesaler/store/wholesaler"

const useWholesaler = useWholesalerStore()
const useUser = useUserStore();
const { proxy } = getCurrentInstance() as any;


const shoppingCart = ref<Array<any>>([...useWholesaler.shoppingCart])
const paramsPage = reactive({
    pageNum: 1,
    pageSize: 10,
})
const packagingStationList = ref<Array<any>>([])
const selectPackagingStationRef = ref()
const packagingStationData = ref<any>({})
const useInfo = ref(useUser.userInfo.dept)
const createParams = reactive<any>({
    cardProductsParams: [],
    packagingId: '',
    manufacturerId: ''
})
const selectManufacturerRef = ref()
const manufacturerList = ref<Array<any>>([])
const manufacturerData = ref<any>({})
const type = ref('') // goodsShelves 商品架  shoppingCart 购物车

onLoad((e: any) => {
    if (e.type) {
        type.value = e.type
        if (type.value === 'goodsShelves') {
            createParams.manufacturerId = useWholesaler.manufacturerId
        }
    }
})

onShow(() => {
    shoppingCart.value = useWholesaler.shoppingCart
})

onMounted(() => {
    packagingWholesalePageFu()
    wholesaleListFu()
})

/**
 * 获取打包站列表
 */
const packagingWholesalePageFu = () => {
    // wholesaleId: wholesaleDetail.value.wholesaleId
    packagingWholesalePageApi({ wholesaleId: useUser.userInfo.deptId }).then((res: any) => {
        const { code, data, msg, token } = res
        proxy.$CloseLoading();
        if (code == proxy.$successCode) {
            if (data && data.length > 0) {
                packagingStationList.value = [...packagingStationList.value, ...data]
            }
        } else {
            proxy.$Toast({ title: msg })
        }
    }, (req => {
        proxy.$CloseLoading();
        proxy.$Toast({ title: req.msg })
    }))
}

/**
 * 获取货架列表
 */
const wholesaleListFu = () => {
    wholesaleListApi({}, paramsPage).then((res: any) => {
        const { code, data, msg, token } = res
        proxy.$CloseLoading();
        if (code == proxy.$successCode) {
            console.log(data, '0000');
            if (data && data.datas && data.datas.length > 0) {
                manufacturerList.value = manufacturerList.value.concat(data.datas)
            }
        } else {
            proxy.$Toast({ title: msg })
        }
    }, (req => {
        proxy.$CloseLoading();
        proxy.$Toast({ title: req.msg })
    }))
}

const orderDelFu = (e: any) => {
    console.log(e , '删除订单');
    const index = shoppingCart.value.findIndex((item) => item.id === e)
    if (index !== -1) {
        shoppingCart.value.splice(index, 1)
        useWholesaler.setShoppingCartFu(shoppingCart.value)
    }
}


const selectPackagingStationFu = () => {
    selectPackagingStationRef.value.showPopupFu()
}

/**
 * 选择打包站
 * @param e 
 */
const selectSubmitFu = (e: any) => {
    packagingStationData.value = e
    createParams.packagingId = e.packagingId
}

/**
 * 选择厂家
 */
const selectManufacturerFu = () => {
    selectManufacturerRef.value.showPopupFu()
}

const scrolltolower = () => {
    paramsPage.pageNum += 1
    wholesaleListFu()
}

const selectManufacturerSubmitFu = (e: any) => {
    console.log(e, '1223');
    if (createParams.manufacturerId == e.deptId) {
        return
    } else {
        manufacturerData.value = e
        createParams.manufacturerId = e.deptId
        shoppingCart.value = []
        useWholesaler.setShoppingCartFu([])
    }
}

const selectProductFu = () => {
    if (type.value === 'shoppingCart') {
        if (!createParams.manufacturerId) {
            return proxy.$Toast({ title: '请选择厂家' })
        }
        uni.navigateTo({
            url: `/wholesaler/selectProduct/index?manufacturerId=${createParams.manufacturerId}&type=${type.value}`
        })
    } else {
        uni.navigateBack()
    }
}

/**
 * 创建订单
 */
const createAddFu = async () => {
    // if (!createParams.packagingId) {
    //     return proxy.$Toast({ title: '请选择打包站' })
    // }
    createParams.cardProductsParams = shoppingCart.value.map((item) => {
        return {
            productsDetailParams: item.productColorsList,
            productId: item.id,
        }
    })
    proxy.$Loading()
    await createAddApi(createParams).then((res: any) => {
        const { code, data, msg } = res
        proxy.$CloseLoading();
        if (code == proxy.$successCode) {
            uni.reLaunch({
                url: `/wholesaler/orderShare/index?orderNo=${data}`
            })
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
        <com-header header-title="订货卡信息" :backColor="false" :titleColor="true"></com-header>
        <view class="main_con flex_column flex_1">
            <view class="information_con">
                <view class="information_title">我的信息</view>
                <view class="flex_column my_information">
                    <view class="flex_align my_info">
                        <image class="position_icon" :src="position_1"></image>
                        <view class="my_info_name">{{ useInfo?.deptName }}</view>
                    </view>
                    <view>{{ useInfo.address }}</view>
                    <view>{{ useInfo.phone }}</view>
                </view>
                <view class="select_station_con flex_align" @click="selectPackagingStationFu">
                    <view>选择打包站</view>
                    <view class="select_station flex_1">{{ packagingStationData.packagingName || '请选择' }}</view>
                    <image class="arrow_right" :src="arrow_right"></image>
                </view>
                <template v-if="type == 'shoppingCart'">
                    <view class="select_station_con flex_align" @click="selectManufacturerFu">
                        <view>选择厂家</view>
                        <view class="select_station flex_1">{{ manufacturerData.deptName || '请选择' }}</view>
                        <image class="arrow_right" :src="arrow_right"></image>
                    </view>
                </template>
                <button class="add_goods_btn" @click="selectProductFu">添加商品</button>
            </view>
            <view class="product_list flex_column">
                <template v-for="item in shoppingCart" :key="item.id">
                    <view class="product_item">
                        <com-orderTable
                            miniRole="wholesaler"
                            orderType="handleOrder"
                            @orderDelFu="orderDelFu"
                            :deleteBtn="true"
                            :productDetail="item"></com-orderTable>
                    </view>
                </template>
            </view>
        </view>
        <view class="footer_con">
            <!-- open-type="share"
            <button class="share_btn" @click="createAddFu">选择微信好友立即发送</button> -->
            <view class="hint_con flex_align">
                <image class="hint_icon" :src="hint_icon"></image>
                <view>创建完成可发送给微信好友</view>
            </view>
            <button class="button_defalut" @click="createAddFu">完成创建</button>
        </view>
    </view>
    <com-selectPackagingStation ref="selectPackagingStationRef" :packagingStationList="packagingStationList"
        @scrolltolower="scrolltolower" @selectSubmitFu="selectSubmitFu"></com-selectPackagingStation>
    <com-selectManufacturer ref="selectManufacturerRef" :manufacturerList="manufacturerList"
        @selectSubmitFu="selectManufacturerSubmitFu"></com-selectManufacturer>
</template>

<style lang="scss" scoped>
.container {
    background: #F2F1F5;

    .bg {
        width: 750rpx;
        height: 304rpx;
        background: linear-gradient(136deg, #0D5DFF 0%, #00AAFF 100%);
        position: fixed;
        left: 0;
        top: 0;
    }

    .main_con {
        padding: 24rpx;
        position: relative;
        gap: 20rpx;
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

        .information_con {
            padding: 36rpx 28rpx;
            background: #FFFFFF;
            border-radius: 24rpx;

            .information_title {
                font-weight: bold;
                font-size: 32rpx;
                color: #202020;
            }

            .no_data_con {
                position: relative;
                width: 100%;
                height: 300rpx;
            }

            .edit_btn {
                width: 156rpx;
                height: 72rpx;
                background: rgba(12, 104, 255, 0.03);
                border-radius: 16rpx;
                border: 1rpx solid #CDE1FF;
                font-weight: 500;
                font-size: 26rpx;
                color: #0C62FF;
                line-height: 72rpx;
                margin: auto;
            }

            .my_information {
                background: #F2F6FF;
                border-radius: 20rpx;
                padding: 34rpx 28rpx;
                font-weight: 400;
                font-size: 24rpx;
                color: #7C8191;
                gap: 12rpx;
                margin-top: 32rpx;

                .my_info {
                    margin-bottom: 8rpx;

                    .my_info_name {
                        font-weight: 500;
                        font-size: 32rpx;
                        color: #202020;
                    }

                    .position_icon {
                        width: 28rpx;
                        height: 28rpx;
                        margin-right: 8rpx;
                    }
                }
            }

            .select_station_con {
                font-weight: 500;
                font-size: 28rpx;
                color: #202020;
                padding: 34rpx 0;
                gap: 8rpx;
                border-bottom: 1rpx solid #EFEFEF;

                .select_station {
                    color: #0C62FF;
                    text-align: right;
                }

                .arrow_right {
                    transform: rotate(90deg);
                    width: 28rpx;
                    height: 28rpx;
                }
            }

            .add_goods_btn {
                width: 646rpx;
                height: 96rpx;
                background: rgba(12, 104, 255, 0.05);
                border-radius: 48rpx;
                border: 1rpx solid #8CBAFF;
                font-weight: 500;
                font-size: 30rpx;
                color: #0C62FF;
                line-height: 96rpx;
                margin-top: 40rpx;
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