<script lang="ts" setup>
import { wholesalePageApi } from "../http/wholesaler";
import { dateStrToDateFormat, formatNumber } from "@/utils/utils";

const { proxy } = getCurrentInstance() as any;

const storageRecordList = ref<Array<any>>([])
const slideLoading = ref(true) // 是否需要滑动加载
const paramsPage = reactive({
    pageNum: 1,
    pageSize: 10,
})

onLoad(() => {
    wholesalePageFunc()
})

const wholesalePageFunc = async () => {
    proxy.$Loading()
    slideLoading.value = false
    wholesalePageApi({}, paramsPage).then((res: any) => {
        proxy.$CloseLoading();
        const { code, data, msg } = res
        if (code == proxy.$successCode) {
            if (data.datas && data.datas.length > 0) {
                storageRecordList.value = [...storageRecordList.value, ...data.datas]
                if (data.datas.length == paramsPage.pageSize) {
                    slideLoading.value = true
                }
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
 * 滑动加载
 */
const scrolltolower = () => {
    if (!slideLoading.value) return
    console.log('++++++++');
    paramsPage.pageNum += 1
    wholesalePageFunc()
}
</script>


<template>
    <view class="container flex_column">
        <com-header header-title="操作记录"></com-header>
        <view class="main_con flex_1">
            <scroll-view class="scroll_con " scroll-y="true"
                lower-threshold="50"
                @scrolltolower="scrolltolower">
                <view class="record_list flex_column">
                    <template v-if="storageRecordList.length > 0" v-for="item in storageRecordList"
                        :key="`other_${item.id}`">
                        <view class="record_item flex_column">
                            <view class="flex_between flex_align">
                                <view>{{ item.manufacturerName }}</view>
                                <view class="record_item_status">{{ item.checkHandNum }}手</view>
                            </view>
                            <view class="flex_between flex_align">
                                <view class="record_item_time">{{ item.packagingName }}</view>
                                <view class="record_item_time">{{ dateStrToDateFormat(item.createTime, '') }}</view>
                            </view>
                        </view>
                    </template>
                    <com-no_data v-else noDataText="暂无记录"></com-no_data>
                </view>
            </scroll-view>
        </view>
    </view>
</template>


<style lang="scss" scoped>
.main_con {
    overflow: hidden;
    margin-top: 24rpx;

    .record_list {
        padding: 0 24rpx;
        gap: 20rpx;
    }

    .record_item {
        font-weight: bold;
        font-size: 30rpx;
        color: #202020;
        background: #FFFFFF;
        border-radius: 24rpx;
        padding: 28rpx;
        gap: 10rpx;

        .record_item_time {
            font-weight: 400;
            font-size: 26rpx;
            color: #7C8191;
        }

        .record_item_status {
            background: rgba(255, 132, 12, 0.03);
            border-radius: 12rpx;
            padding: 12rpx;
            font-weight: 400;
            font-size: 26rpx;
            color: #FF840C;
        }
    }

}
</style>