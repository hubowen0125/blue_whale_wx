<script lang="ts" setup>


const popupData = {
    popupTitle: '添加尺寸',
    pupupType: 'input',
    cancelText: '取消',
    confirmText: '确认',
    placeholder: '请输入新尺寸',
}


const popupCom = ref()
const headerTitle = ref('选择尺码')

/**
 * 添加参数
 */
const addParamsFu = () => {
    popupCom.value.showPopup()
}


/**
 * 确认选择
 */
const confirmPopupFu = () => {
    console.log('324324');
    // popupData.value = popupList[1]
    // setTimeout(() => {
    //     popupCom.value.showPopup()
    // }, 200);
}

</script>


<template>
    <view class="container flex_column">
        <com-header :header-title="headerTitle"></com-header>
        <view class="main_con flex_1">
            <view class="parameter_container">
                <view>{{ headerTitle }}</view>
                <view class="parameter_list">
                    <button class="parameter_item parameter_item_active">1-5</button>
                    <button class="parameter_item">1-5</button>
                    <button class="parameter_item">1-5</button>
                    <button class="parameter_item">1-5</button>
                    <button class="parameter_item">1-5</button>
                    <button class="parameter_item">1-5</button>
                    <button class="parameter_item">1-5</button>
                    <button class="parameter_item">1-5</button>
                </view>
            </view>
        </view>
        <view class="footer_con flex">
            <button class="add_btn" @click="addParamsFu">添加尺寸</button>
            <button class="flex_1 button_defalut">确认</button>
        </view>
    </view>
    <com-popup_com ref="popupCom" :popupData="popupData" @confirmPopupFu="confirmPopupFu"></com-popup_com>
</template>


<style lang="scss" scoped>
.main_con {
    padding: 32rpx 24rpx;

    .parameter_container {
        background: #FFFFFF;
        border-radius: 24rpx;
        padding: 36rpx 28rpx;
        font-weight: bold;
        font-size: 32rpx;
        color: #202020;
        min-height: 832rpx;

        .parameter_list {
            margin-top: 28rpx;
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 20rpx;

            .parameter_item {
                height: 64rpx;
                background: #F7F8FA;
                border-radius: 16rpx;
                font-weight: 500;
                font-size: 26rpx;
                color: #202020;
                line-height: 64rpx;
            }

            .parameter_item_active {
                background: rgba(12, 104, 255, 0.03);
                border: 1rpx solid #CDE1FF;
                color: #0C62FF;
            }
        }
    }
}

.footer_con {
    gap: 20rpx;

    .add_btn {
        width: 212rpx;
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
</style>