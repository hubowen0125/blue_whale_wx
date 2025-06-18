<script lang="ts" setup>
import del_icon from "@/static/images/del_icon.png"

// 添加员工
const addEmployeeFu = () => {
    console.log('addEmployeeFu');
    uni.navigateTo({
        url: '/packagingStation/addEmployee/index'
    });
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
        <com-header header-title="我的员工"></com-header>
        <view class="flex_1 main_con">
            <scroll-view class="scroll_con " scroll-y="true"
                lower-threshold="50"
                @scrolltolower="scrolltolower">
                <view class="employee_con">
                    <view class="employee_list">
                        <view class="employee_item flex_align" v-for="item in 20" :key="item">
                            <view class="flex_1">
                                <view class="employee_item_name">陈冠希</view>
                                <view>15618257147</view>
                            </view>
                            <switch color="#0C61FD" checked />
                            <view class="flex_align">
                                <image class="del_icon" :src="del_icon"></image>
                                <text>删除</text>
                            </view>
                        </view>
                    </view>
                </view>
            </scroll-view>
        </view>
        <view class="footer_con">
            <button class="button_defalut" @click="addEmployeeFu">添加员工</button>
        </view>
    </view>
</template>


<style lang="scss" scoped>
.container {
    background: #F2F1F5;

    .main_con {
        overflow: hidden;
        margin: 24rpx 0;

        .employee_con {
            padding: 24rpx;

            .employee_list {
                border-radius: 24rpx;
                background: #FFFFFF;
                padding: 0 28rpx;

                .employee_item {
                    padding: 32rpx 0;
                    border-bottom: 1rpx solid #EFEFEF;
                    font-weight: 400;
                    font-size: 28rpx;
                    color: #7C8191;
                    gap: 20rpx;

                    .employee_item_name {
                        font-weight: 500;
                        font-size: 28rpx;
                        color: #202020;
                    }

                    .del_icon {
                        width: 28rpx;
                        height: 28rpx;
                        margin-right: 4rpx;
                    }
                }
            }
        }

    }
}
</style>