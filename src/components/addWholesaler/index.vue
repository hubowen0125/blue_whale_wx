<script lang="ts" setup>
import { manufacturerWholesaleAddApi } from "@/manufacturer/http/manufacturer";
import { sysRegionListApi } from "@/http/api/all"
import arrow_bottom from "@/static/images/arrow_bottom.png"
import { areasMap } from "@/utils/utils";

const { proxy } = getCurrentInstance() as any;

const inputList = [
    {
        label: '批发商名称',
        value: 'wholesaleName',
        type: 'input',
        placeholder: '请输入批发商名称',
        maxlength: 20,
        inputType: 'text',
        disabled: false,
    },
    {
        label: '批发商地区',
        value: 'areaDetail',
        type: 'select',
        placeholder: '请选择批发商地区',
        inputType: 'text',
        maxlength: 100,
        disabled: true,
    },
    {
        label: '详细地址',
        value: 'address',
        type: 'input',
        placeholder: '请输入详情地址',
        maxlength: 100,
        inputType: 'text',
        disabled: false,
    },
    {
        label: '批发商手机号',
        value: 'wholesalePhone',
        type: 'input',
        placeholder: '请输入批发商手机号',
        maxlength: 11,
        inputType: 'number',
        disabled: false,
    },
    {
        label: '批发商仓位',
        value: '',
        type: 'input',
        placeholder: '请输入批发商仓位',
        maxlength: 20,
        inputType: 'text',
        disabled: false,
    },
]

const addParams = reactive({
    wholesaleName: '',
    wholesalePhone: '',
    districtIds: '',
    address: '',
})
const cascaderOptions = ref<any>([])
const selectedProvinceIndex = ref(0)
const selectedCityIndex = ref(0)
const selectedDistrictIndex = ref(0)
const areaDetail = ref('请选择')
const showArea = ref(false)
const selectAreaRef = ref();

onMounted(() => {
    sysRegionListFu()
})

const sysRegionListFu = () => {
    if (proxy.cascaderOptions.length > 0) {
        cascaderOptions.value = proxy.cascaderOptions
        selectAreaRef.value.showPopupFu()
        return
    }
    sysRegionListApi().then((res: any) => {
        const { code, data, msg } = res
        proxy.$CloseLoading();
        if (code == proxy.$successCode) {
            console.log(data);
            cascaderOptions.value = areasMap(data);
            // infoDetails.value = data
        } else {
            proxy.$Toast({ title: msg })
        }
    }, (req => {
        proxy.$CloseLoading();
        proxy.$Toast({ title: req.msg })
    }))
}

/**
 * 关闭省市区选择
 */
const onClose = () => {
    showArea.value = false
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

/**
 * 选择收货地址
 * @param e 
 */
const selectAreaFu = (e: any) => {
    const { province, city, district, provinceCode, cityCode, districtCode } = e
    // addParams.areaDetail = `${province}${city}${district}`
    // addParams.province = provinceCode
    // addParams.city = cityCode
    // addParams.district = districtCode
}

const formSubmit = (e: any) => {
    console.log(e, 'formSubmit');
}

</script>

<template>
    <view class="container container_defalut_bg flex_cloumn">
        <com-header header-title="添加批发商"></com-header>
        <view class="main_con flex_1">
            <form @submit="formSubmit">
                <view class="form_con flex_column">
                    <view class="form_item " v-for="item in inputList" :key="item.label"
                        @click="item.type === 'select' && (showArea = true)">
                        <text class="form_label">{{ item.label }}</text>
                        <view class="form_input flex_align">
                            <input class="flex_1" :placeholder="item.placeholder" :maxlength="item.maxlength"
                                v-model.trim="item.value" :type="item.inputType" :disabled="item.disabled">
                            <image v-if="item.type === 'select'" class="arrow_bottom" :src="arrow_bottom"></image>
                        </view>
                    </view>
                    <button class="button_defalut">确认添加</button>
                </view>
            </form>
        </view>
        <com-selectArea ref="selectAreaRef" :cascader="cascaderOptions" @selectAreaFu="selectAreaFu"></com-selectArea>
    </view>
</template>

<style lang="scss" scoped>
.container {
    .main_con {
        padding: 30rpx;

        .form_con {
            background: #FFFFFF;
            box-shadow: 0rpx 4rpx 12rpx 0rpx #DDE8FC;
            border-radius: 24rpx;
            padding: 48rpx 28rpx 80rpx;
            gap: 40rpx;

            .form_item {

                .form_label {
                    font-weight: 500;
                    font-size: 28rpx;
                    color: #202020;
                    position: relative;

                    &::after {
                        content: '*';
                        position: absolute;
                        color: #E82E2E;
                        top: 0;
                        right: -16rpx;
                    }
                }

                .form_input {
                    padding: 0 32rpx;
                    height: 96rpx;
                    background: #F7F8FA;
                    border-radius: 12rpx;
                    margin-top: 20rpx;

                    .arrow_bottom {
                        width: 28rpx;
                        height: 28rpx;
                    }
                }
            }

            .button_defalut {
                width: 646rpx;
                margin-top: 20rpx;
            }
        }
    }
}
</style>