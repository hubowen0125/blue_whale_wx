<script lang="ts" setup>
import position_1 from "@/static/images/position_1.png"
import scan_code_icon from "@/static/images/packagingStation/scan_code_icon.png"
import { useUserStore } from '@/store/modules/user';

const useUser = useUserStore()
const { proxy } = getCurrentInstance() as any;

const tabBarIndex = inject("tabBarIndex") as Ref<number>


watch(() => tabBarIndex.value, (newVal) => {
    if (newVal == 0) {
        console.log('213213');
    }
})


const scanCodeFu = () => {
    proxy.$Loading()
    uni.scanCode({
        onlyFromCamera: true,
        success: function (res) {
            console.log('条码类型：' + res.scanType);
            console.log('条码内容：' + res.result);
            proxy.$CloseLoading()
            uni.navigateTo({
                url: '/pages/packagingStation/scanningResults/index'
            })
        },
        fail: function (res) {
            console.log('扫描失败：' + res.errMsg);
            proxy.$CloseLoading()
            proxy.$Toast('扫描失败，请扫描正确的二维码！')
        }
    });
}

</script>


<template>
    <view class="home_com flex_column">
        <view class="header_con flex_align">
            <image class="header_img" :src="position_1"></image>
            <view class="header_title">新村路打包站</view>
        </view>
        <view class="home_main flex_column">
            <view class="table_con">
                <text class="table_title">厂家名称</text>
                <input class="table_input" type="text" placeholder="请输入厂家名称">
            </view>
            <view class="table_con">
                <text class="table_title">批发商名称</text>
                <view class="flex table_input_list">
                    <input class="table_input table_input_item" type="text" placeholder="请输入批发商名称">
                    <input class="table_input flex_1" type="text" placeholder="请输入仓位">
                </view>
            </view>
            <view class="table_con">
                <text class="table_title">核点数量(手)</text>
                <input class="table_input" type="text" placeholder="请输入核点数量">
            </view>
            <view class="btn_con flex_align">
                <button class="reset_btn">重置</button>
                <button class="button_defalut flex_1">立即入库</button>
            </view>
        </view>
        <view class="scan_code_con flex_align flex_column" @click="scanCodeFu">
            <image class="scan_code_icon" :src="scan_code_icon"></image>
            <view class="scan_code_desc">扫码入库</view>
        </view>
    </view>
</template>

<style lang="scss" scoped>
.home_com {
    width: 100%;
    height: 100%;
    padding: v-bind('`${useUser.navHeight + (useUser.statusBarHeight / 2)}px`') 30rpx 30rpx 30rpx;
    box-sizing: border-box;

    .header_con {
        font-weight: bold;
        font-size: 40rpx;
        color: #202020;

        .header_img {
            width: 36rpx;
            height: 36rpx;
            margin-right: 12rpx;
        }
    }

    .home_main {
        width: 690rpx;
        height: 776rpx;
        background: #FFFFFF;
        box-shadow: 0rpx 4rpx 12rpx 0rpx #DDE8FC;
        border-radius: 24rpx;
        gap: 40rpx;
        padding: 48rpx 28rpx;
        box-sizing: border-box;
        margin-top: 40rpx;

        .table_con {
            .table_title {
                font-weight: 500;
                font-size: 28rpx;
                color: #202020;
                position: relative;

                &::after {
                    content: '*';
                    color: #E82E2E;
                    position: absolute;
                    right: -16rpx;
                    top: 0;
                }
            }

            .table_input {
                margin-top: 20rpx;
                width: 634rpx;
                height: 96rpx;
                background: #F7F8FA;
                border-radius: 12rpx;
                padding: 0 32rpx;
                box-sizing: border-box;
                line-height: 96rpx;
            }

            .table_input_list {
                gap: 16rpx;

                .table_input_item {
                    width: 402rpx;
                }
            }
        }

        .btn_con {
            gap: 16rpx;

            .reset_btn {
                width: 184rpx;
                height: 96rpx;
                background: rgba(12, 104, 255, 0.05);
                border-radius: 48rpx;
                border: 1rpx solid #8CBAFF;
                font-weight: 500;
                font-size: 30rpx;
                color: #0C62FF;
                line-height: 96rpx;
            }
        }
    }

    .scan_code_con {
        width: 690rpx;
        height: 336rpx;
        background: rgba(12, 104, 255, 0.04);
        border-radius: 24rpx;
        border: 2rpx solid #8CBAFF;
        gap: 36rpx;
        justify-content: center;

        .scan_code_icon {
            width: 136rpx;
            height: 136rpx;
        }
    }

}
</style>