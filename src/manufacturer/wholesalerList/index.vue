<script lang="ts" setup>
import { manufacturerWholesalePageApi, getWholesaleStatisticsApi } from '../http/manufacturer';


const { proxy } = getCurrentInstance() as any;


const wholesalerDetails = [
    {
        title: '总批发商',
        value: computed(() => wholesaleStatistics.value.wholesaleNum || 0)
    },
    {
        title: '总订单',
        value: computed(() => wholesaleStatistics.value.orderNum || 0)
    },
    {
        title: '总金额',
        value: computed(() => wholesaleStatistics.value.amount || 0)
    },
]
const wholesalerList = ref<Array<any>>([])
const slideLoading = ref(true) // 是否需要滑动加载
const paramsPage = reactive({
    pageNum: 1,
    pageSize: 10,
})
const wholesaleStatistics = ref({
    wholesaleNum: 0,
    orderNum: 0,
    amount: 0
})

onMounted(() => {
    wholesalePageFu()
    getWholesaleStatisticsFu()
})

/**
 * 获取批发商信息
 */
const wholesalePageFu = () => {
    manufacturerWholesalePageApi({}, paramsPage).then((res: any) => {
        const { code, data, msg } = res
        proxy.$CloseLoading();
        if (code == proxy.$successCode) {
            console.log(data);
            if (data && data.length > 0) {
                wholesalerList.value = [...wholesalerList.value, ...data]
                if (data.length < paramsPage.pageSize) {
                    slideLoading.value = false
                }
            } else {
                slideLoading.value = false
            }
        } else {
            proxy.$Toast({ title: msg })
        }
    }, (req => {
        proxy.$CloseLoading();
        proxy.$Toast({ title: req.msg })
    }))
}

const getWholesaleStatisticsFu = () => {
    getWholesaleStatisticsApi().then((res: any) => {
        const { code, data, msg } = res
        if (code == proxy.$successCode) {
            wholesaleStatistics.value = data
        } else {
            proxy.$Toast({ title: msg })
        }
    }, (req => {
        proxy.$Toast({ title: req.msg })
    }))
}

/**
 * 添加批发商
 */
const addWholesalerFu = () => {
    uni.navigateTo({
        url: '/manufacturer/addWholesaler/index'
    })
}

/**
 * 滑动加载
 */
const scrolltolower = () => {
    // if (!slideLoading.value) return
    console.log('++++++++');
    // manageDevicesParams.value.page += 1
    // resetManageDevicesParams()
}

</script>

<template>
    <view class="container flex_column">
        <view class="bg"></view>
        <com-header header-title="我的批发商" :backColor="false" :titleColor="true"></com-header>
        <view class="report_con flex">
            <view class="report_item flex_column flex_align flex_center flex_1"
                v-for="item in wholesalerDetails"
                :key="item.title">
                <view>{{ item.value }}</view>
                <view class="report_item_title">{{ item.title }}</view>
            </view>
        </view>
        <view class="main_con flex_1">
            <scroll-view class="scroll_con " scroll-y="true"
                lower-threshold="50"
                @scrolltolower="scrolltolower">
                <view class="wholesaler_list flex_column" v-if="wholesalerList.length > 0">
                    <view class="wholesaler_item flex_column" v-for="item in wholesalerList" :key="item.id">
                        <view>
                            <text>{{ item.wholesaleName }}</text>
                            <text class="wholesaler_item_address">{{ item.province }}</text>
                        </view>
                        <view class="flex_align flex_between wholesaler_item_order">
                            <text>总订单: {{ item.storageNum }}手</text>
                            <view class="wholesaler_item_order_price">
                                <text>¥</text>
                                <text class="price_num">200</text>
                            </view>
                        </view>
                    </view>
                </view>
                <com-no_data v-else noDataText="暂无批发商"></com-no_data>
            </scroll-view>
        </view>
        <view class="footer_con"><button class="button_defalut" @click="addWholesalerFu">添加批发商</button></view>
    </view>
</template>


<style lang="scss" scoped>
.container {
    background: #F2F1F5;

    .bg {
        width: 750rpx;
        height: 394rpx;
        background: linear-gradient(136deg, #0D5DFF 0%, #00AAFF 100%);
        clip-path: ellipse(100% 100% at 50% 100%);
        /* 底部椭圆裁剪 */
        transform: scaleY(-1);
        position: fixed;
        left: 0;
        top: 0;
    }

    .report_con {
        gap: 20rpx;
        position: relative;
        margin: 24rpx;
        background: #FFFFFF;
        border-radius: 24rpx;
        padding: 28rpx 20rpx;

        .report_item {
            font-weight: 500;
            font-size: 40rpx;
            color: #0C62FF;
            gap: 10rpx;
            height: 184rpx;
            background: #F2F6FF;
            border-radius: 20rpx;

            .report_item_title {
                font-weight: 400;
                font-size: 24rpx;
                color: #7C8191;
            }
        }
    }

    .main_con {
        overflow-x: hidden;
        overflow-y: auto;

        .wholesaler_list {
            padding: 24rpx;
            gap: 20rpx;

            .wholesaler_item {
                padding: 28rpx;
                gap: 14rpx;
                font-weight: bold;
                font-size: 32rpx;
                color: #202020;
                background: #FFFFFF;
                border-radius: 24rpx;

                .wholesaler_item_address {
                    font-weight: 400;
                    font-size: 26rpx;
                    color: #346BCF;
                    margin-left: 12rpx;
                }

                .wholesaler_item_order {
                    font-weight: 400;
                    font-size: 26rpx;
                    color: #7C8191;
                }

                .wholesaler_item_order_price {
                    font-weight: 500;
                    font-size: 24rpx;
                    color: #202020;

                    .price_num {
                        font-size: 36rpx;
                    }
                }
            }
        }
    }
}
</style>