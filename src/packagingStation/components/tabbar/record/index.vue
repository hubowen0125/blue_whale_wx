<script lang="ts" setup>
import { storageInputPageApi } from "@/packagingStation/http/packagingStation";
import arrow_bottom from "@/static/images/arrow_bottom.png"
import long_arrow from "@/static/images/long_arrow.png"
import search_icon from "@/static/images/search_icon.png"
import { useUserStore } from '@/store/modules/user';

const useUser = useUserStore()
const { proxy } = getCurrentInstance() as any;

const quertList = [
    {
        placeholder: '请输入批发商名称进行查询',
        value: ''
    },
    {
        placeholder: '请输入仓位名称进行查询',
        value: ''
    },
    {
        placeholder: '请输入厂家名称进行查询',
        value: ''
    },
]

const tabBarIndex = inject("tabBarIndex") as Ref<number>
const paramsPage = reactive({
    pageNum: 1,
    pageSize: 10,
})
const recordParams = reactive({
    wholesaleName: '',
    manufacturerName: '',
    storageNum: '',
})
const slideLoading = ref(true) // 是否需要滑动加载
const recordList = ref<any[]>([]) // 入库记录列表
const isLoad = ref(false) // 是否加载


watch(() => tabBarIndex.value, (newVal) => {
    if (newVal == 1 && !isLoad.value) {
        isLoad.value = true
        storageInputPageFu()
        console.log('111111');

    }
})

const storageInputPageFu = () => {
    storageInputPageApi(recordParams, paramsPage).then((res: any) => {
        const { code, data, msg, token } = res
        proxy.$CloseLoading();
        if (code == proxy.$successCode) {
            if (data.datas && data.datas.length > 0) {
                recordList.value = [...recordList.value, ...data.datas]
                if (data.datas.length < paramsPage.pageSize) {
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
 * 查看入库记录详情
 * @param item 
 */
const viewRecordDetailFu = (item: any) => {
    const { id } = item
    if (id) {
        uni.navigateTo({
            url: `/packagingStation/inventoryDetails/index?id=${id}`
        })
    }
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
    <view class="record_com flex_column">
        <view class="bg"></view>
        <view class="record_header">入库记录</view>
        <view class="record_main flex_1 flex_column">
            <view class="query_criteria">
                <view class="flex_align time_desc">
                    <view class="flex_align">
                        <text>开始时间</text>
                        <image class="desc_icon" :src="arrow_bottom"></image>
                    </view>
                    <view class="flex_align ">
                        <text>结束时间</text>
                        <image class="desc_icon" :src="arrow_bottom"></image>
                    </view>
                </view>
                <view class="select_time flex_align">
                    <view class="flex_align">
                        <view>5月27日</view>
                        <image class="long_arrow" :src="long_arrow"></image>
                        <view>6月3日</view>
                    </view>
                    <view class="time_long flex_1">共7天</view>
                </view>
                <view class="quert_input_list flex_column">
                    <view class="flex_align quert_input" v-for="item, index in quertList" :key="index">
                        <image class="search_icon" :src="search_icon"></image>
                        <input class="flex_1" type="text" :placeholder="item.placeholder" />
                    </view>
                </view>
                <button class="button_defalut">查询</button>
            </view>
            <view class="flex_1 record_con">
                <scroll-view class="scroll_con " scroll-y="true"
                    lower-threshold="50"
                    @scrolltolower="scrolltolower">
                    <view class="record_list flex_column" v-if="recordList.length > 0">
                        <view class="record_item" v-for="item in recordList" :key="item.id"
                            @click="viewRecordDetailFu(item)">
                            <view class="record_item_time flex_align flex_between">
                                <view>{{ item.createTime }}</view>
                                <view>仓位: {{ item.storageNum }}</view>
                            </view>
                            <view class="record_item_info flex_align">
                                <view>{{ item.wholesaleName }}</view>
                                <view class="record_item_position">{{ item.wholesaleAddress }}</view>
                            </view>
                            <view class="record_item_manufacturer">厂家: {{ item.manufacturerName }}</view>
                            <view class="record_item_num">入库数量: {{ item.checkHandNum }}手</view>
                            <button class="record_item_button">打印</button>
                        </view>
                    </view>
                    <com-no_data v-else noDataText="暂无批发商数据"></com-no_data>
                </scroll-view>
            </view>
        </view>
    </view>
</template>


<style lang="scss" scoped>
.record_com {
    width: 100%;
    height: 100%;
    padding: v-bind('`${useUser.statusBarHeight}px`') 24rpx 30rpx 24rpx;
    box-sizing: border-box;
    background: #F2F1F5;


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

    .record_header {
        height: v-bind('`${useUser.navHeight}px`');
        line-height: v-bind('`${useUser.navHeight}px`');
        font-weight: bold;
        font-size: 48rpx;
        color: #FFFFFF;
        position: relative;
    }

    .record_main {
        position: relative;
        overflow: hidden;

        .query_criteria {
            width: 702rpx;
            height: 644rpx;
            background: #FFFFFF;
            border-radius: 24rpx;
            padding: 40rpx 28rpx;
            box-sizing: border-box;
            margin-top: 40rpx;

            .time_desc {
                font-weight: 400;
                font-size: 24rpx;
                color: #7C8191;
                gap: 174rpx;

                .desc_icon {
                    width: 24rpx;
                    height: 24rpx;
                    margin-left: 8rpx;
                }
            }

            .select_time {
                font-weight: 500;
                font-size: 40rpx;
                color: #202020;
                font-style: normal;
                margin-top: 10rpx;

                .long_arrow {
                    width: 90rpx;
                    height: 28rpx;
                    margin: 0 32rpx;
                }

                .time_long {
                    font-weight: 400;
                    font-size: 26rpx;
                    color: #0C62FF;
                    text-align: right;
                }
            }

            .quert_input_list {
                gap: 16rpx;
                margin: 40rpx 0 32rpx;

                .quert_input {
                    height: 88rpx;
                    background: #F7F8FA;
                    border-radius: 12rpx;
                    padding: 0 32rpx;
                    box-sizing: border-box;

                    .search_icon {
                        width: 28rpx;
                        height: 28rpx;
                        margin-right: 20rpx;
                    }
                }
            }

            .button_defalut {
                width: 100%;
            }
        }

        .record_con {
            overflow: hidden;
            margin-top: 20rpx;

            .record_list {
                gap: 20rpx;

                .record_item {
                    background: #FFFFFF;
                    border-radius: 24rpx;
                    padding: 28rpx 28rpx 40rpx;
                    box-sizing: border-box;
                    font-weight: 400;
                    font-size: 26rpx;
                    color: #7C8191;
                    position: relative;

                    .record_item_time {
                        font-weight: 400;
                        font-size: 26rpx;
                        color: #7C8191;
                        padding-bottom: 24rpx;
                        border-bottom: 1rpx solid #EFEFEF;
                    }

                    .record_item_info {
                        font-weight: bold;
                        font-size: 32rpx;
                        color: #202020;
                        margin-top: 20rpx;
                        margin-bottom: 24rpx;

                        .record_item_position {
                            font-weight: 400;
                            font-size: 26rpx;
                            color: #346BCF;
                            margin-left: 12rpx;
                        }
                    }

                    .record_item_manufacturer {
                        margin-bottom: 16rpx;
                    }

                    .record_item_button {
                        position: absolute;
                        width: 184rpx;
                        height: 88rpx;
                        background: rgba(12, 104, 255, 0.05);
                        border-radius: 44rpx;
                        border: 1rpx solid #8CBAFF;
                        font-weight: 500;
                        font-size: 30rpx;
                        color: #0C62FF;
                        line-height: 88rpx;
                        bottom: 28rpx;
                        right: 40rpx;
                    }
                }
            }
        }
    }
}
</style>