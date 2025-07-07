<script lang="ts" setup>
import checkbox from "@/static/images/checkbox.png"
import checkbox_active from "@/static/images/checkbox_active.png"
import position_1 from "@/static/images/position_1.png"
import off_icon from "@/static/images/off_icon.png"


const emit = defineEmits(['selectSubmitFu'])

const { proxy } = getCurrentInstance() as any;

const props = defineProps({
    wholesaleList: {
        type: Array<any>,
        default: () => []
    }
})

const popupRef = ref<any>(null)
const selectData = ref<any>({});


/**
 * 显示弹窗
 */
const showPopupFu = () => {
    popupRef.value.open('bottom')
}

const checkboxFu = (item: any,) => {
    console.log('checkboxFu', item)
    selectData.value = item
}

const submitFu = () => {
    console.log('submitFu')
    if (!selectData.value.id) {
        proxy.$Toast({ title: '请选择批发商' })
        return
    }
    closePopupFu()
    emit('selectSubmitFu', selectData.value)
}

// 关闭弹窗
const closePopupFu = () => {
    popupRef.value.close();
}

defineExpose({
    showPopupFu
});
</script>


<template>

    <uni-popup ref="popupRef" :safe-area="false">
        <view class="popup_content flex_column ">
            <view class="popup_header flex_align flex_between">
                <text>选择批发商</text>
                <image class="off_icon" :src="off_icon" @click="closePopupFu"></image>
            </view>
            <view class="packaging_station_list flex_column flex_1">
                <template v-for="item in wholesaleList" :key="item.id" v-if="wholesaleList.length > 0">
                    <view class="packaging_station_item flex_align flex_between"
                        :class="{ 'packaging_station_item_active': item.id == selectData.id }"
                        @click="checkboxFu(item)">
                        <view class="flex_column">
                            <view class="flex_align packaging_station_info">
                                <image class="position_icon" :src="position_1"></image>
                                <view class="packaging_station_name">{{ item.wholesaleName }}</view>
                            </view>
                            <view>{{ item.address }}</view>
                            <view>{{ item.wholesalePhone }}</view>
                        </view>
                        <image class="checkbox_icon"
                            :src="item.id == selectData.id ? checkbox_active : checkbox"></image>
                    </view>
                </template>
                <com-no_data v-else noDataText="暂无数据"></com-no_data>
            </view>
            <button class="button_defalut" @click="submitFu">确认</button>
        </view>
    </uni-popup>
</template>

<style lang="scss" scoped>
.popup_content {
    background-color: #fff;
    padding: 40rpx 24rpx calc(26rpx + env(safe-area-inset-bottom));
    border-radius: 32rpx 32rpx 0 0;
    height: 60vh;
    overflow: hidden;

    .popup_header {
        font-weight: bold;
        font-size: 40rpx;
        color: #202020;
        margin-bottom: 40rpx;

        .off_icon {
            width: 28rpx;
            height: 28rpx;
        }

    }

    .packaging_station_list {
        gap: 20rpx;
        overflow-x: hidden;
        overflow-y: auto;

        .packaging_station_item {
            background: #F7F8FA;
            border-radius: 24rpx;
            border: 2rpx solid #F7F8FA;
            padding: 32rpx;
            font-weight: 400;
            font-size: 24rpx;
            color: #7C8191;
            gap: 12rpx;

            .packaging_station_info {
                margin-bottom: 8rpx;

                .packaging_station_name {
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

            .checkbox_icon {
                width: 36rpx;
                height: 36rpx;
            }
        }

        .packaging_station_item_active {
            border: 2rpx solid rgba(1, 163, 255, 1);
            border-radius: 24rpx;
            background: #FFFFFF;
        }
    }


    .button_defalut {
        height: 96rpx;
        background: linear-gradient(90deg, #0D5DFF 0%, #00AAFF 100%);
        font-weight: 500;
        font-size: 30rpx;
        color: #FFFFFF;
        line-height: 96rpx;
        border-radius: 48rpx;
        margin-top: 48rpx;
    }
}
</style>