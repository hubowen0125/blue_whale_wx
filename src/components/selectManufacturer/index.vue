<script lang="ts" setup>
import off_icon from "@/static/images/off_icon.png"
import position_1 from "@/static/images/position_1.png"
import checkbox from "@/static/images/checkbox.png"
import checkbox_active from "@/static/images/checkbox_active.png"

const emit = defineEmits(['selectSubmitFu', 'scrolltolower'])

const { proxy } = getCurrentInstance() as any;

const props = defineProps({
    manufacturerList: {
        type: Array<any>,
        default: () => []
    }
})

const popupRef = ref();
const selectData = ref<any>({});

const slideLoading = computed(() => {
    return props.manufacturerList.length % 10 === 0
})

/**
 * 显示弹窗
 */
const showPopupFu = () => {
    popupRef.value.open('bottom')
}

// 关闭弹窗
const closePopupFu = () => {
    popupRef.value.close();
}

const checkboxFu = (item: any,) => {
    console.log('checkboxFu', item)
    selectData.value = item
}

const submitFu = () => {
    console.log('submitFu')
    if (!selectData.value.deptId) {
        proxy.$Toast({ title: '请选择厂家' })
        return
    }
    closePopupFu()
    emit('selectSubmitFu', selectData.value)
}


/**
 * 滑动加载
 */
const scrolltolower = () => {
    console.log('滑动加载');
    if (!slideLoading.value) return
    emit('scrolltolower')
}

defineExpose({
    showPopupFu
});
</script>


<template>
    <uni-popup ref="popupRef" :safe-area="false" :mask-click="false">
        <view class="popup_content flex_column ">
            <view class="popup_header flex_align flex_between">
                <text>选择厂家</text>
                <image class="off_icon" :src="off_icon" @click="closePopupFu"></image>
            </view>
            <view class="mian_con flex_1">
                <scroll-view class="scroll_con" scroll-y="true" lower-threshold="50" @scrolltolower="scrolltolower">
                    <view class="manufacturer_list flex_column" v-if="manufacturerList.length > 0">
                        <template v-for="(item , index) in manufacturerList" :key="index">
                            <view class="manufacturer_item flex_align flex_between"
                                :class="{ 'manufacturer_item_active': item.dept.deptId == selectData.deptId }"
                                @click="checkboxFu(item.dept)">
                                <view class="flex_column">
                                    <view class="flex_align manufacturer_info">
                                        <image class="position_icon" :src="position_1"></image>
                                        <view class="manufacturer_name">{{ item.dept.deptName }}</view>
                                    </view>
                                    <view>{{ item.dept.address }}</view>
                                    <view>{{ item.dept.phone }}</view>
                                </view>
                                <image class="checkbox_icon"
                                    :src="item.dept.deptId == selectData.deptId ? checkbox_active : checkbox"></image>
                            </view>
                        </template>
                    </view>
                    <com-no_data v-else noDataText="暂无数据"></com-no_data>
                </scroll-view>
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

    .mian_con {
        overflow-x: hidden;
        overflow-y: auto;

        .manufacturer_list {
            gap: 20rpx;

            .manufacturer_item {
                border: 2rpx solid #F7F8FA;
                background: #F7F8FA;
                border-radius: 24rpx;
                padding: 32rpx;
                font-weight: 400;
                font-size: 24rpx;
                color: #7C8191;
                gap: 12rpx;
                box-sizing: border-box;

                .manufacturer_info {
                    margin-bottom: 8rpx;

                    .manufacturer_name {
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

            .manufacturer_item_active {
                border: 2rpx solid rgba(1, 163, 255, 1);
                border-radius: 24rpx;
                background: #FFFFFF;
            }
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