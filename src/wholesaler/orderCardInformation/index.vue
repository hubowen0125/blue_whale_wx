<script lang="ts" setup>
import position_1 from "@/static/images/position_1.png"
import arrow_right from "@/static/images/arrow_right.png"
import { useUserStore } from '@/store/modules/user';


const userStore = useUserStore();
const { proxy } = getCurrentInstance() as any;



</script>

<template>
    <view class="container flex_column">
        <view class="bg"></view>
        <com-header header-title="订货卡信息" :backColor="false" :titleColor="true"></com-header>
        <view class="main_con flex_column flex_1">
            <view class="information_con">
                <view class="information_title">我的信息</view>
                <template>
                    <view class="no_data_con">
                        <com-no_data noDataText="暂无信息" noDataDescText="请立即前往我的-我的信息中进行完善"></com-no_data>
                    </view>
                    <button class="edit_btn">编辑</button>
                </template>
                <template>
                    <view class="flex_column my_information">
                        <view class="flex_align my_info">
                            <image class="position_icon" :src="position_1"></image>
                            <view class="my_info_name">上海春之都店</view>
                        </view>
                        <view>上海市普陀区甘泉路280号</view>
                        <view>15618257147</view>
                    </view>
                </template>
                <template>
                    <view class="select_station_con flex_align">
                        <view>选择打包站</view>
                        <view class="select_station flex_1">请选择</view>
                        <image class="arrow_right" :src="arrow_right"></image>
                    </view>
                    <button class="add_goods_btn">添加商品</button>
                </template>
            </view>
            <view class="my_information information_con">
                <view class="information_title">选择打包站</view>
                <view class="no_data_con">
                    <com-no_data noDataText="暂无信息" noDataDescText="请立即联系打包站进行信息完善"></com-no_data>
                </view>
            </view>
        </view>
    </view>
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