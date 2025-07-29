<script lang="ts" setup>
import { storageInputPageApi } from "@/packagingStation/http/packagingStation";
import arrow_bottom from "@/static/images/arrow_bottom.png"
import long_arrow from "@/static/images/long_arrow.png"
import search_icon from "@/static/images/search_icon.png"
import { useUserStore } from '@/store/modules/user';
import { getCurrentDate, compareTime, calculateDaysDifference } from "@/utils/utils";

const useUser = useUserStore()
const { proxy } = getCurrentInstance() as any;

const quertList = [
    {
        placeholder: '请输入批发商名称进行查询',
        value: 'wholesaleName'
    },
    {
        placeholder: '请输入仓位名称进行查询',
        value: 'storageNum'
    },
    {
        placeholder: '请输入厂家名称进行查询',
        value: 'manufacturerName'
    },
]

const tabBarIndex = inject("tabBarIndex") as Ref<number>
const paramsPage = reactive({
    pageNum: 1,
    pageSize: 10,
})
const recordParams = reactive<any>({
    wholesaleName: '',
    manufacturerName: '',
    storageNum: '',
    startTime: '',
    endTime: '',
})
const slideLoading = ref(true) // 是否需要滑动加载
const recordList = ref<any[]>([]) // 入库记录列表
const isLoad = ref(false) // 是否加载

const startDate = computed(() => {
    return getDate('start')
})

const endDate = computed(() => {
    return getDate('end')
})

const timeDesc = computed(() => {
    return calculateDaysDifference(recordParams.endTime, recordParams.startTime) + '天'
})




watch(() => tabBarIndex.value, (newVal) => {
    if (newVal == 1) {
        isLoad.value = true
        const time = getCurrentDate(7)
        const { startTime, endTime, startYear, startMonth, startDay, endYear, endMonth, endDay } = time
        recordParams.startTime = `${startYear}-${startMonth}-${startDay}`
        recordParams.endTime = `${endYear}-${endMonth}-${endDay}`
        console.log(time, 'assaddsd');
        resetParams()
    }
})

onShow(() => {
    if (isLoad.value) {
        resetParams()
    }
})

const storageInputPageFu = () => {
    proxy.$Loading();
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
 * 输入框失去焦点
 */
const resetParams = () => {
    slideLoading.value = true
    paramsPage.pageNum = 1
    recordList.value = []
    storageInputPageFu()
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

const getDate = (type: string) => {
    const date = new Date();
    let year = date.getFullYear();
    let month: string | number = date.getMonth() + 1;
    let day: string | number = date.getDate();

    if (type === 'start') {
        year = year - 10;
    } else if (type === 'end') {
        year = year
    }
    month = month > 9 ? month : '0' + month;
    day = day > 9 ? day : '0' + day;
    return `${year}-${month}-${day}`;
}

/**
 * 开始时间改变
 * @param e 
 */
const startChangeFu = (e: any) => {
    const { value } = e.detail
    if (compareTime(value, recordParams.endTime) > 0) {
        return proxy.$Toast({ title: '开始时间不能大于结束时间' })
    }
    recordParams.startTime = value
}

/**
 * 结束时间改变
 * @param e 
 */
const endChangeFu = (e: any) => {
    const { value } = e.detail
    if (compareTime(recordParams.startTime, value) > 0) {
        return proxy.$Toast({ title: '结束时间不能小于开始时间' })
    }
    recordParams.endTime = value
}

const printerFu = (item: any) => {
    uni.navigateTo({
        url: `/packagingStation/printerSettings/index?type=storageInput&id=${item.id}`
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
    <view class="record_com flex_column">
        <view class="bg"></view>
        <view class="record_header">入库记录</view>
        <view class="record_main flex_1">
            <scroll-view class="scroll_con " scroll-y="true"
                lower-threshold="50"
                @scrolltolower="scrolltolower">
                <view class="query_criteria">
                    <view class="quert_input_list flex_column">
                        <view class="flex_align quert_input" v-for="item, index in quertList" :key="index">
                            <image class="search_icon" :src="search_icon"></image>
                            <input class="flex_1" type="text" :placeholder="item.placeholder"
                                v-model.trim="recordParams[item.value]" />
                        </view>
                    </view>
                    <button class="button_defalut" @click="resetParams">查询</button>
                </view>
                <view class="record_con">
                    <view class="record_list flex_column" v-if="recordList.length > 0">
                        <view class="record_item" v-for="item in recordList" :key="item.id"
                            @click="viewRecordDetailFu(item)">
                            <view class="record_item_time flex_align flex_between">
                                <view>{{ item.createTime }}</view>
                                <view>仓位: {{ item.storageNum }}</view>
                            </view>
                            <view class="record_item_info flex_align">
                                <view>{{ item.wholesaleName }}</view>
                                <view class="record_item_position">{{ item.wholesaleCityName }}</view>
                            </view>
                            <view class="record_item_manufacturer">厂家: {{ item.manufacturerName }}</view>
                            <view class="record_item_num">入库数量: {{ item.checkHandNum }}手</view>
                            <button class="record_item_button" @click.stop="printerFu(item)">打印</button>
                        </view>
                    </view>
                    <com-no_data v-else noDataText="暂无批发商数据"></com-no_data>
                </view>
            </scroll-view>
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
        margin-bottom: 10rpx;
    }

    .record_main {
        position: relative;
        overflow: hidden;

        .query_criteria {
            width: 702rpx;
            height: auto;
            background: #FFFFFF;
            border-radius: 24rpx;
            padding: 20rpx 28rpx;
            box-sizing: border-box;

            .quert_input_list {
                gap: 16rpx;
                margin-bottom: 12rpx;

                .quert_input {
                    height: 78rpx;
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