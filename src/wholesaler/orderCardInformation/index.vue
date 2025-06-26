<script lang="ts" setup>
import { packagingWholesalePageApi } from "../http/wholesaler";
import position_1 from "@/static/images/position_1.png"
import arrow_right from "@/static/images/arrow_right.png"
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
    packagingId: ''
})

onMounted(() => {
    packagingWholesalePageFu()
})

/**
 * 获取打包站列表
 */
const packagingWholesalePageFu = () => {
    // wholesaleId: wholesaleDetail.value.wholesaleId
    packagingWholesalePageApi({ wholesaleId: useUser.userInfo.userId }, paramsPage).then((res: any) => {
        const { code, data, msg, token } = res
        proxy.$CloseLoading();
        if (code == proxy.$successCode) {
            if (data.datas && data.datas.length > 0) {
                packagingStationList.value = [...packagingStationList.value, ...data.datas]
            }
        } else {
            proxy.$Toast({ title: msg })
        }
    }, (req => {
        proxy.$CloseLoading();
        proxy.$Toast({ title: req.msg })
    }))
}

const selectPackagingStationFu = () => {
    selectPackagingStationRef.value.showPopupFu()
}

const scrolltolower = () => {
    paramsPage.pageNum += 1
    packagingWholesalePageFu()
}

/**
 * 选择打包站
 * @param e 
 */
const selectSubmitFu = (e: any) => {
    packagingStationData.value = e
    createParams.packagingId = e.packagingId
}

const selectProductFu = () => {
    if (useWholesaler.manufacturerId) {
        uni.navigateTo({
            url: `/wholesaler/selectProduct/index?manufacturerId=${useWholesaler.manufacturerId}`
        })
    } else {
        uni.navigateTo({
            url: '/wholesaler/selectManufacturer/index'
        })
    }
}

/**
 * 创建订单
 */
const createAddFu = async () => {
    if (!createParams.packagingId) {
        return proxy.$Toast({ title: '请选择打包站' })
    }
    createParams.cardProductsParams = shoppingCart.value.map((item) => {
        return {
            productsDetailParams: item.productColorsList,
            productId: item.id,
        }
    })
    await createAddApi(createParams).then((res: any) => {
        const { code, data, msg } = res
        proxy.$CloseLoading();
        if (code == proxy.$successCode) {
            // useUser.setShareParamFu({
            //     path: `/pages/loading/index?type=manufacturer&cardNo=${data}`,
            // })
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
                        <view class="my_info_name">{{ useInfo.deptName }}</view>
                    </view>
                    <view>{{ useInfo.address }}</view>
                    <view>{{ useInfo.deptPhone }}</view>
                </view>
                <template>
                    <view class="select_station_con flex_align" @click="selectPackagingStationFu">
                        <view>选择打包站</view>
                        <view class="select_station flex_1">{{ packagingStationData.packagingName || '请选择' }}</view>
                        <image class="arrow_right" :src="arrow_right"></image>
                    </view>
                    <button class="add_goods_btn" @click="selectProductFu">添加商品</button>
                </template>
            </view>
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
        <view class="footer_con">
            <!-- open-type="share" -->
            <button class="share_btn" @click="createAddFu">选择微信好友立即发送</button>
        </view>
    </view>
    <com-selectPackagingStation ref="selectPackagingStationRef" :packagingStationList="packagingStationList"
        @scrolltolower="scrolltolower" @selectSubmitFu="selectSubmitFu"></com-selectPackagingStation>
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
</style>