<script lang="ts" setup>
import calendar_icon from "@/static/images/calendar_icon.png"


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
        <view class="bg">
            <com-header header-title="我的报表" :backColor="false" :titleColor="true"></com-header>
            <view class="select_calendar flex_align">
                <input class="flex_1" type="text" placeholder="请选择报表周期" :disabled="true">
                <image class="calendar_icon" :src="calendar_icon"></image>
            </view>
            <view class="select_time">已选时间: 2025-04-03至202</view>
            <view class="report_info flex_between">
                <view class="report_info_item flex_1">
                    <view>100</view>
                    <view class="report_info_title">批发商数</view>
                </view>
                <view class="report_info_item flex_1">
                    <view>100</view>
                    <view class="report_info_title">来货数量</view>
                </view>
            </view>
        </view>
        <view class="report_con flex_1">
            <scroll-view class="scroll_con " scroll-y="true"
                lower-threshold="50"
                @scrolltolower="scrolltolower">
                <view class="report_list  flex_column">
                    <view class="report_item flex_align" v-for="item in 100" :key="item">
                        <view class="report_item_time">2025-05-05 11:26</view>
                        <view class="flex_column flex_align ">
                            <view>1</view>
                            <view class="report_item_title">批发商数</view>
                        </view>
                        <view class="flex_column flex_align report_item_right">
                            <view>2</view>
                            <view class="report_item_title">来货数量</view>
                        </view>
                    </view>
                </view>
            </scroll-view>
        </view>
    </view>
</template>

<style lang="scss" scoped>
.container {
    background: #F2F1F5;

    .bg {
        width: 750rpx;
        height: 544rpx;
        background: linear-gradient(136deg, #0D5DFF 0%, #00AAFF 100%);

        .select_calendar {
            height: 88rpx;
            background: #FFFFFF;
            border-radius: 12rpx;
            padding: 0 32rpx;
            margin: 20rpx 24rpx 28rpx;

            .calendar_icon {
                width: 36rpx;
                height: 36rpx;
            }
        }

        .select_time {
            font-weight: 400;
            font-size: 26rpx;
            color: #DDEFFF;
            padding: 0 24rpx;

        }

        .report_info {
            padding: 38rpx 24rpx 24rpx;
            gap: 22rpx;

            .report_info_item {
                height: 136rpx;
                background: rgba(1, 16, 42, 0.1);
                border-radius: 16rpx;
                font-weight: bold;
                font-size: 40rpx;
                color: #FFFFFF;
                padding: 28rpx 32rpx;
                box-sizing: border-box;
                font-weight: bold;
                font-size: 40rpx;
                color: #FFFFFF;

                .report_info_title {
                    font-weight: 400;
                    font-size: 24rpx;
                    color: #DBF0FF;
                }
            }
        }
    }

    .report_con {
        overflow: hidden;
        margin-top: 20rpx;

        .report_list {
            padding: 0 24rpx 24rpx;
            gap: 20rpx;
            overflow-x: hidden;
            overflow-y: auto;

            .report_item {
                background: #FFFFFF;
                border-radius: 24rpx;
                padding: 48rpx 40rpx 48rpx 28rpx;
                font-weight: bold;
                font-size: 36rpx;
                color: #202020;
                gap: 80rpx;

                .report_item_time {
                    font-weight: 500;
                    font-size: 28rpx;
                    margin-right: 30rpx;
                }

                .report_item_title {
                    font-weight: 400;
                    font-size: 24rpx;
                    color: #7C8191;
                }

                .report_item_right {
                    position: relative;

                    &::after {
                        content: '';
                        position: absolute;
                        width: 2rpx;
                        height: 34rpx;
                        background: #DBDBDB;
                        left: -41rpx;
                        top: 50%;
                        transform: translateY(-50%);
                    }
                }
            }
        }
    }
}
</style>