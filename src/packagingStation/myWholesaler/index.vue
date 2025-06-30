<script lang="ts" setup>
import { myWholesaleApi, wholesaleStatisticApi } from "../http/packagingStation";
import search_icon from "@/static/images/search_icon.png"


const { proxy } = getCurrentInstance() as any;

const wholesalerInfoList = [
    {
        title: '批发商数',
        value: () => wholesaleStatistics.value.wholesaleNum || 0,
    },
    {
        title: '总数量(手)',
        value: () => wholesaleStatistics.value.handNum || 0,
    },
    {
        title: '大于7天',
        title1: '未打包批发商',
        value: () => wholesaleStatistics.value.noPackagingNum || 0,
    }
]
const wholesalerList = ref<Array<any>>([])
const wholesalerParams = reactive({
    pageNum: 1,
    pageSize: 10,
    wholesaleName: ''
})
const slideLoading = ref(true) // 是否需要滑动加载
const wholesaleStatistics = ref<any>({
    handNum: 0,
    noPackagingNum: 0,
    wholesaleNum: 0
})

onMounted(() => {
    wholesaleStatisticFu()
})

onShow(() => {
    // 获取批发商信息
    wholesalerList.value = []
    slideLoading.value = true
    getWholesalerInfo()
})

// 获取批发商信息
const getWholesalerInfo = () => {
    myWholesaleApi(wholesalerParams).then((res: any) => {
        const { code, data, msg, token } = res
        proxy.$CloseLoading();
        if (code == proxy.$successCode) {
            if (data.datas && data.datas.length > 0) {
                wholesalerList.value = [...wholesalerList.value, ...data.datas]
                if (data.datas.length < wholesalerParams.pageSize) {
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

/**
 * 批发商统计信息
 */
const wholesaleStatisticFu = () => {
    wholesaleStatisticApi().then((res: any) => {
        const { code, data, msg, token } = res
        if (code == proxy.$successCode) {
            console.log(data)
            wholesaleStatistics.value = data
        } else {
            proxy.$Toast({ title: msg })
        }
    }, (req => {
        proxy.$Toast({ title: req.msg })
    }))
}

const searchInputBlur = (e: string) => {
    console.log('搜索输入框失去焦点');
    wholesalerParams.wholesaleName = e
    wholesalerParams.pageNum = 1
    wholesalerList.value = []
    slideLoading.value = true
    getWholesalerInfo()
}

// 添加批发商
const addWholesalerFu = () => {
    console.log('添加批发商')
    uni.navigateTo({
        url: '/packagingStation/addWholesaler/index'
    })
}

// 批发商详情
const wholesalerDetailFu = (id: string) => {
    uni.navigateTo({
        url: `/packagingStation/wholesalerDetails/index?id=${id}`
    })
}


/**
 * 滑动加载
 */
const scrolltolower = () => {
    if (!slideLoading.value) return
    console.log('++++++++');
    // manageDevicesParams.value.page += 1
    // resetManageDevicesParams()
}

</script>

<template>
    <view class="container flex_column">
        <view class="bg"></view>
        <com-header header-title="我的批发商" :backColor="false" :titleColor="true"></com-header>
        <view class="mian_con flex_1 flex_column">
            <view class="wholesaler_info">
                <view class="wholesaler_info_item flex_column flex_align flex_center"
                    v-for="item in wholesalerInfoList"
                    :key="item.title">
                    <view class=" wholesaler_num">{{ item.value() }}</view>
                    <view class="wholesaler_name flex_column flex_align flex_center">
                        <view>{{ item.title }}</view>
                        <view v-if="item.title1">{{ item.title1 }}</view>
                    </view>
                </view>
            </view>
            <view class="search_input">
                <com-searchInput placeholder="请输入批发商名称进行查询" @onBlur="searchInputBlur"></com-searchInput>
            </view>
            <view class="wholesaler_con  flex_1">
                <scroll-view class="scroll_con " scroll-y="true"
                    lower-threshold="50"
                    @scrolltolower="scrolltolower">
                    <view class="wholesaler_list flex_column" v-if="wholesalerList.length > 0">
                        <view class="wholesaler_item flex_column" v-for="item in wholesalerList" :key="item.id"
                            @click="wholesalerDetailFu(item.id)">
                            <view class="wholesaler_item_name flex">
                                <view>{{ item.wholesaleName }}</view>
                                <view class="wholesaler_item_address">{{ item.wholesaleAddress }}</view>
                            </view>
                            <view>总数量: {{ item.handNum }}手</view>
                            <view>未打包天数: {{ item.unpackingDays }}</view>
                        </view>
                    </view>
                    <com-no_data v-else noDataText="暂无批发商数据"></com-no_data>
                </scroll-view>
            </view>
        </view>
        <view class="footer_con">
            <button class="button_defalut" @click="addWholesalerFu">添加批发商</button>
        </view>
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

    .mian_con {
        padding: 24rpx;
        gap: 20rpx;
        position: relative;
        overflow: hidden;

        .wholesaler_info {
            padding: 28rpx 20rpx;
            background: #FFFFFF;
            border-radius: 24rpx;
            display: grid;
            grid-template-columns: repeat(3, 208rpx);
            gap: 20rpx;

            .wholesaler_info_item {
                height: 184rpx;
                background: #F2F6FF;
                border-radius: 20rpx;
                font-weight: 400;
                font-size: 24rpx;
                color: #7C8191;

                .wholesaler_num {
                    font-weight: bold;
                    font-size: 40rpx;
                    color: #0C62FF;
                }

                .wholesaler_name {
                    height: 56rpx;
                    margin-top: 10rpx;
                }
            }
        }

        .search_con {
            height: 88rpx;
            border-radius: 12rpx;
            padding: 0 32rpx;
            box-sizing: border-box;
            background: #FFFFFF;

            .search_icon {
                width: 28rpx;
                height: 28rpx;
                margin-right: 20rpx;
            }
        }

        .wholesaler_con {
            overflow: hidden;

            .wholesaler_list {
                gap: 20rpx;

                .wholesaler_item {
                    padding: 28rpx;
                    background: #FFFFFF;
                    border-radius: 24rpx;
                    font-weight: 400;
                    font-size: 26rpx;
                    color: #7C8191;
                    gap: 16rpx;

                    .wholesaler_item_name {
                        font-weight: bold;
                        font-size: 32rpx;
                        color: #202020;
                        align-items: flex-end;
                        margin-bottom: 6rpx;

                        .wholesaler_item_address {
                            font-weight: 400;
                            font-size: 26rpx;
                            color: #346BCF;
                            margin-left: 12rpx;
                        }
                    }
                }
            }
        }
    }
}
</style>