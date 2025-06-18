<script lang="ts" setup>
import del_icon from "@/static/images/del_icon.png"
import off_icon from "@/static/images/off_icon.png"

const popupRef = ref();

onMounted(() => {
    popupRef.value.open('center')
})

/**
 * 分享
 */
const shareFu = () => {
    popupRef.value.open('center')
}

const formSubmit = (e: any) => {
}

</script>

<template>
    <view class="container flex_column">
        <view class="bg"></view>
        <com-header header-title="订货卡" :backColor="false" :titleColor="true"></com-header>
        <view class="main_con flex_1 flex_column">
            <view class="flex_align flex_between switch_con">
                <view>是否允许批发商查看库存</view>
                <switch color="#0C61FD" checked />
            </view>
            <view class="product_lsit flex_column">
                <view v-for="item in 10" :key="item">
                    <com-orderInfo>
                        <template #button>
                            <view class="del_btn flex_align">
                                <image class="del_icon" :src="del_icon"></image>
                                <view>删除</view>
                            </view>
                        </template>
                    </com-orderInfo>
                </view>
            </view>
        </view>
        <view class="footer_con">
            <button class="share_btn" @click="shareFu">选择微信好友立即发送</button>
        </view>
    </view>
    <uni-popup ref="popupRef">
        <view class="popup_content">
            <view class="popup_header flex_align flex_between">
                <view>
                    <text>提示</text>
                    <text class="popup_header_desc">(请先完善信息)</text>
                </view>
                <image class="off_icon" :src="off_icon"></image>
            </view>
            <form @submit="formSubmit">
                <view class="form_item">
                    <view class="form_label">名称</view>
                    <input class="input_item" type="text" placeholder="请输入名称">
                </view>
                <view class="form_item">
                    <view class="收货地址">名称</view>
                    <view class="select_list">

                    </view>
                </view>
                <view class="form_item">
                    <view class="form_label">详细地址</view>
                    <input class="input_item" type="text" placeholder="请输入详细地址">
                </view>
                <button class="form_btn">确定</button>
            </form>
        </view>
    </uni-popup>
</template>

<style lang="scss" scoped>
.container {
    background: #F2F1F5;

    .bg {
        width: 750rpx;
        height: 270rpx;
        background: linear-gradient(136deg, #0D5DFF 0%, #00AAFF 100%);
        position: fixed;
        left: 0;
        top: 0;
    }

    .main_con {
        margin-top: 12rpx;
        padding: 24rpx;
        position: relative;
        gap: 20rpx;
        overflow-x: hidden;
        overflow-y: auto;

        .switch_con {
            padding: 28rpx;
            background: #FFFFFF;
            border-radius: 24rpx;
            font-weight: 500;
            font-size: 28rpx;
            color: #202020;
        }

        .product_lsit {
            background: #FFFFFF;
            border-radius: 24rpx;
            padding: 28rpx;
            gap: 56rpx;

            .del_btn {
                font-weight: 400;
                font-size: 28rpx;
                color: #7C8191;

                .del_icon {
                    width: 28rpx;
                    height: 28rpx;
                    margin-right: 6rpx;
                }
            }
        }
    }
}

.popup_content {
    width: 632rpx;
    background: #FFFFFF;
    border-radius: 24rpx;
    padding: 36rpx 28rpx;
    box-sizing: border-box;

    .popup_header {
        font-weight: bold;
        font-size: 36rpx;
        color: #202020;

        .popup_header_desc {
            font-weight: 500;
            font-size: 24rpx;
            margin-left: 16rpx;
            color: #FF840C;
        }

        .off_icon {
            width: 28rpx;
            height: 28rpx;
        }
    }

    .form_item {
        margin-top: 40rpx;
        font-weight: 500;
        font-size: 28rpx;
        color: #202020;

        .form_label {
            margin-bottom: 20rpx;
        }

        .input_item {
            width: 576rpx;
            height: 96rpx;
            background: #F7F8FA;
            border-radius: 12rpx;
            padding: 0 32rpx;
            box-sizing: border-box;
        }
    }

    .form_btn {
        width: 576rpx;
        height: 96rpx;
        background: linear-gradient(90deg, #0D5DFF 0%, #00AAFF 100%);
        border-radius: 48rpx;
        font-weight: 500;
        font-size: 30rpx;
        color: #FFFFFF;
        line-height: 96rpx;
        margin: 40rpx 0;
    }
}
</style>