<script lang="ts" setup>

const emit = defineEmits(['confirmPopupFu'])

interface POPUPDATA {
    popupTitle: string;
    pupupType: string;
    popupContent?: any[];
    cancelText?: string;
    confirmText?: string;
    placeholder?: string;
    callBack?: boolean
}

const props = withDefaults(defineProps<{
    popupData: POPUPDATA;
}>(), {
    popupData: () => ({
        popupTitle: '',
        pupupType: 'default',
        popupContent: undefined,
        cancelText: undefined,
        confirmText: undefined,
        placeholder: '',
        callBack: true
    }),
});

const popupRef = ref();
const inputData = ref('');

// 显示弹窗
const showPopup = () => {
    popupRef.value.open('center')
}

// 关闭弹窗
const closePopupFu = () => {
    popupRef.value.close();
    setTimeout(() => {
        inputData.value = '';
    }, 500);
}

// 确认弹窗
const confirmPopupFu = () => {
    console.log(props.popupData.callBack, '000000');
    if (props.popupData.callBack) {
        if (props.popupData.pupupType === 'input') {
            if (inputData.value === '') {
                uni.showToast({
                    title: '请输入内容',
                    icon: 'none'
                });
                return;
            }
        }
        closePopupFu()
        setTimeout(() => {
            emit('confirmPopupFu', inputData.value)
        }, 200);
    } else {
        closePopupFu()
    }
}

defineExpose({
    showPopup
});

</script>


<template>
    <view class="popup_con">
        <uni-popup ref="popupRef" :mask-click="false">
            <view class="popup_content flex_column text_align">
                <view class="popup_title">{{ popupData.popupTitle }}</view>
                <view class="popup_main flex_column" v-if="popupData.pupupType === 'default'">
                    <view v-for="item in popupData.popupContent" :key="item.id" class="popup_text_item">
                        <text>{{ item.text }}</text>
                        <text v-if="item.desc" class="popup_text_desc">{{ item.desc }}</text>
                        <text v-if="item.text1">{{ item.text1 }}</text>
                    </view>
                </view>
                <view class="popup_main popup_input_con flex_column" v-if="popupData.pupupType === 'input'">
                    <view v-for="item in popupData.popupContent" :key="item.id" class="popup_text_item">
                        <text>{{ item.text }}</text>
                        <text v-if="item.desc" class="popup_text_desc">{{ item.desc }}</text>
                    </view>
                    <input class="popup_input" v-model.trim="inputData" type="text"
                        :placeholder="popupData.placeholder">
                </view>
                <view class="popup_btn_con flex">
                    <button v-if="popupData.cancelText" class="popup_btn popup_btn_cancel flex_1"
                        @click="closePopupFu">{{
                            popupData.cancelText }}</button>
                    <button v-if="popupData.confirmText" class="popup_btn popup_btn_confirm flex_1"
                        @click="confirmPopupFu">{{
                            popupData.confirmText }}</button>
                </view>
            </view>
        </uni-popup>
    </view>
</template>


<style lang="scss" scoped>
.popup_content {
    width: 532rpx;
    background: #FFFFFF;
    border-radius: 24rpx;
    padding-top: 62rpx;

    .popup_title {
        font-weight: bold;
        font-size: 36rpx;
        color: #202020;
    }

    .popup_main {
        margin-top: 32rpx;
        gap: 16rpx;
        margin-bottom: 52rpx;
        padding:0 20rpx;

        .popup_text_item {
            font-weight: 400;
            font-size: 28rpx;
            color: #7C8191;

            .popup_text_desc {
                color: #FF840C;
            }
        }
    }

    .popup_input_con {
        margin-bottom: 30rpx;

        .popup_input {
            width: 452rpx;
            height: 96rpx;
            border-radius: 12rpx;
            border: 1px solid #C0C0C0;
            padding: 0 32rpx;
            box-sizing: border-box;
            margin: 24rpx auto 0;
            text-align: left;
            background-clip: padding-box;
        }
    }

    .popup_btn_con {
        height: 100rpx;
        border-top: 1px solid #E7E7E7;

        .popup_btn {
            line-height: 100rpx;
            background-color: transparent;
            font-weight: 500;
            font-size: 28rpx;
        }

        .popup_btn_cancel {
            position: relative;
            color: #9299BA;
            border-right: 1px solid #E7E7E7;
        }

        .popup_btn_confirm {
            color: #0C62FF;
        }
    }
}
</style>