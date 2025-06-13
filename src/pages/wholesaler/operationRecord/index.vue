<script lang="ts" setup>


const { proxy } = getCurrentInstance() as any;

const stateList = [
    {
        title: '发货记录',
        key: 0,
    },
    {
        title: '收银记录',
        key: 1,
    },
    {
        title: '其他记录',
        key: 2,
    },
]
const activeState = ref(0)


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
        <com-header header-title="操作记录" :backColor="false" :titleColor="true"></com-header>
        <view class="record_state_list flex_align flex_around">
            <view :class="['record_state_item', activeState == item.key ? 'record_state_item_active' : '']"
                v-for="item in stateList" :key="item.key" @click="activeState = item.key">
                <view>{{ item.title }}</view>
            </view>
        </view>
        <view class="main_con flex_1">
            <scroll-view class="scroll_con " scroll-y="true"
                lower-threshold="50"
                @scrolltolower="scrolltolower">
                <view class="record_list flex_column">
                    <template v-if="activeState == 0" v-for="item in 10" :key="item">
                        <view class="record_item flex_column">
                            <view>陈冠希</view>
                            <view class="flex_between flex_align">
                                <view class="record_item_time">2025-05-05 11:26</view>
                                <view class="record_item_content">2手/10件</view>
                            </view>
                        </view>
                    </template>
                    <template v-if="activeState == 1" v-for="item in 10" :key="item">
                        <view class="record_item cashier_record flex_align">
                            <image class="cashier_img"></image>
                            <view class="flex_column flex_1 cashier_record_content">
                                <view>陈冠希</view>
                                <view class="flex_between flex_align">
                                    <view class="record_item_time">2025-05-05 11:26</view>
                                    <view class="cashier_record_price">
                                        <text class="cashier_record_price_icon">¥</text>
                                        <text>20.00</text>
                                    </view>
                                </view>
                            </view>
                        </view>
                    </template>
                    <template v-if="activeState == 2" v-for="item in 10" :key="item">
                        <view class="record_item flex_column">
                            <view class="flex_between flex_align">
                                <view>陈冠希</view>
                                <view class="record_item_status">修改订单</view>
                            </view>
                            <view class="record_item_time">2025-05-05 11:26</view>
                        </view>
                    </template>
                </view>
            </scroll-view>
        </view>
    </view>
</template>


<style lang="scss" scoped>
.container {
    width: 100%;
    height: 100%;
    background: #F2F1F5;

    .bg {
        width: 750rpx;
        height: 282rpx;
        background: linear-gradient(136deg, #0D5DFF 0%, #00AAFF 100%);
        transform: scaleY(-1);
        position: fixed;
        left: 0;
        top: 0;
    }

    .record_state_list {
        grid-gap: 20rpx;
        margin-top: 30rpx;
        position: relative;
        gap: 60rpx;

        .record_state_item {
            font-weight: 400;
            font-size: 28rpx;
            color: #D3EAFF;
            padding: 14rpx 0;
            text-align: center;
        }

        .record_state_item_active {
            font-weight: 500;
            font-size: 28rpx;
            color: #FFFFFF;
            position: relative;

            &::after {
                content: '';
                position: absolute;
                width: 32rpx;
                height: 4rpx;
                background: #FFFFFF;
                border-radius: 2rpx;
                bottom: 0;
                left: 50%;
                transform: translateX(-50%);
            }
        }
    }

    .main_con {
        overflow: hidden;
        margin-top: 24rpx;
        margin-top: 50rpx;

        .record_list {
            padding: 0 30rpx 30rpx;
            gap: 20rpx;

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

                .record_item_content {
                    font-weight: 500;
                    font-size: 26rpx;
                    color: #FF840C;
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

            .cashier_record {
                padding: 38rpx 28rpx;
                gap: 24rpx;

                .cashier_img {
                    width: 64rpx;
                    height: 64rpx;
                    border-radius: 50%;
                    border: 1px solid #000;
                }

                .cashier_record_content {
                    gap: 6rpx;

                    .cashier_record_price {
                        font-weight: 500;
                        color: #202020;
                        font-size: 32rpx;

                        .cashier_record_price_icon {
                            font-size: 24rpx;
                        }
                    }
                }
            }
        }
    }
}
</style>