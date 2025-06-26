<script lang="ts" setup>

const emit = defineEmits(['selectAreaFu'])

const props = defineProps({
    cascader: {
        type: Array<any>,
        default: () => []
    }
})


const popupRef = ref()
const selectedProvinceIndex = ref(0)
const selectedCityIndex = ref(0)
const selectedDistrictIndex = ref(0)
const cascaderOptions = computed(() => {
    return props.cascader
})



const showPopupFu = () => {
    popupRef.value.open('bottom')
}


/**
 * 关闭省市区选择
 */
const onClose = () => {
    popupRef.value.close()
}

/**
 * 省市区选择
 * @param e 
 */
const bindPickerChange = (e: any) => {
    const [provinceIndex, cityIndex, districtIndex] = e.detail.value;
    if (selectedProvinceIndex.value != provinceIndex) {
        selectedProvinceIndex.value = provinceIndex;
        selectedCityIndex.value = 0;
        selectedDistrictIndex.value = 0;
    } else {
        selectedProvinceIndex.value = provinceIndex;
        if (selectedCityIndex.value != cityIndex) {
            selectedCityIndex.value = cityIndex;
            selectedDistrictIndex.value = 0;
        } else {
            selectedDistrictIndex.value = districtIndex
        }
    }
}

const confirmSelection = () => {
    const province = cascaderOptions.value[selectedProvinceIndex.value].text || '';
    const provinceCode = cascaderOptions.value[selectedProvinceIndex.value].value || '';
    let city
    let cityCode
    let district
    let districtCode
    if (cascaderOptions.value[selectedProvinceIndex.value].children) {
        city = cascaderOptions.value[selectedProvinceIndex.value].children[selectedCityIndex.value]?.text || ''
        cityCode = cascaderOptions.value[selectedProvinceIndex.value]?.children[selectedCityIndex.value]?.value || ''
        if (cascaderOptions.value[selectedProvinceIndex.value].children[selectedCityIndex.value].children) {
            district = cascaderOptions.value[selectedProvinceIndex.value]?.children[selectedCityIndex.value]?.children[selectedDistrictIndex.value]?.text || ''
            districtCode = cascaderOptions.value[selectedProvinceIndex.value]?.children[selectedCityIndex.value]?.children[selectedDistrictIndex.value]?.value || ''
        } else {
            district = ''
            districtCode = ''
        }
    } else {
        city = ''
        cityCode = ''
        district = ''
        districtCode = ''
    }
    emit('selectAreaFu', {
        province,
        city,
        district,
        provinceCode,
        cityCode,
        districtCode
    })
    onClose()
}

defineExpose({
    showPopupFu
});
</script>


<template>

    <uni-popup ref="popupRef" :safe-area="false">
        <view class="popup_main flex_column">
            <view class="flex_between popup_btn_con">
                <view class="btn_1" @click="onClose">取消</view>
                <view class="btn_2" @click="confirmSelection">确定</view>
            </view>
            <picker-view @change="bindPickerChange" class="picker_view flex_1"
                :value="[selectedProvinceIndex, selectedCityIndex, selectedDistrictIndex]">
                <picker-view-column class="picker_view_column">
                    <view v-for="(province, index) in cascaderOptions" :key="index" class="flex_align flex_center">
                        {{
                            province.text }}</view>
                </picker-view-column>
                <picker-view-column class="picker_view_column"
                    v-if="cascaderOptions[selectedProvinceIndex]?.children">
                    <view v-for="(province, index) in cascaderOptions[selectedProvinceIndex].children" :key="index"
                        class="flex_align flex_center">{{
                            province.text }}</view>
                </picker-view-column>
                <picker-view-column class="picker_view_column"
                    v-if="cascaderOptions[selectedProvinceIndex] && cascaderOptions[selectedProvinceIndex].children && cascaderOptions[selectedProvinceIndex].children[selectedCityIndex]?.children">
                    <view
                        v-for="(province, index) in cascaderOptions[selectedProvinceIndex].children[selectedCityIndex].children"
                        class="flex_align flex_center"
                        :key="index">{{ province.text }}</view>
                </picker-view-column>
            </picker-view>
        </view>
    </uni-popup>
</template>

<style lang="scss" scoped>
.popup_main {
    background-color: #fff;
    padding: 40rpx 24rpx calc(26rpx + env(safe-area-inset-bottom));
    border-radius: 32rpx 32rpx 0 0;
    height: 60vh;
    overflow: hidden;
    box-sizing: border-box;

    .popup_btn_con {
        padding: 20rpx;
        font-size: 32rpx;

        .btn_1 {
            color: #949494;
        }

        .btn_2 {
            color: #71c29c;
        }
    }

    .picker_view {
        width: 100%;

        .picker_view_column {
            text-align: center;
        }
    }
}
</style>