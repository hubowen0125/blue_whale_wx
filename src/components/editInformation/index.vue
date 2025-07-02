<script lang="ts" setup>
import { wholesaleEditApi } from "@/http/api/wholesaler";
import { manufacturerEditApi } from "@/http/api/manufacturer";
import { sysRegionListApi, getInfoApi } from "@/http/api/all";
import off_icon from "@/static/images/off_icon.png"
import arrow_bottom from "@/static/images/arrow_bottom.png"
import { areasMap } from "@/utils/utils";
import { useUserStore } from "@/store/modules/user";

const emit = defineEmits(['editInformationFu'])

const useUser = useUserStore();
const { proxy } = getCurrentInstance() as any;

const props = defineProps({
    type: {
        type: String,
        default: ''
    }
});

const popupRef = ref();
const selectAreaRef = ref();
const cascaderOptions = ref<any>([])
const formParams = reactive<any>({
    deptName: '',
    province: '',
    provinceName: '',
    city: '',
    cityName: '',
    district: '',
    districtName: '',
    address: '',
})
const areaDetail = ref('')

const sysRegionListFu = () => {
    if (proxy.cascaderOptions.length > 0) {
        cascaderOptions.value = proxy.cascaderOptions
        selectAreaRef.value.showPopupFu()
        return
    }
    proxy.$Loading();
    sysRegionListApi().then((res: any) => {
        const { code, data, msg } = res
        proxy.$CloseLoading();
        if (code == proxy.$successCode) {
            console.log(data);
            cascaderOptions.value = areasMap(data);
            proxy.cascaderOptions = cascaderOptions.value
            selectAreaRef.value.showPopupFu()
        } else {
            proxy.$Toast({ title: msg })
        }
    }, (req => {
        proxy.$CloseLoading();
        proxy.$Toast({ title: req.msg })
    }))
}

/**
 * 显示弹窗
 */
const showPopupFu = () => {
    popupRef.value.open('center')
}

/**
 * 关闭弹窗
 */
const closePopupFu = () => {
    popupRef.value.close()
}

/**
 * 显示选择收货地址弹窗
 */
const showSelectAreaFu = () => {
    sysRegionListFu()
}

/**
 * 选择收货地址
 * @param e 
 */
const selectAreaFu = (e: any) => {
    const { province, city, district, provinceCode, cityCode, districtCode } = e
    areaDetail.value = `${province}${city}${district}`
    formParams.province = provinceCode
    formParams.provinceName = province
    formParams.city = cityCode
    formParams.cityName = city
    formParams.district = districtCode
    formParams.districtName = district
}

const formSubmit = async (e: any) => {
    const { deptName, province, city, district, address } = formParams
    if (!deptName) {
        proxy.$Toast({ title: '请输入名称' })
        return
    }
    if (!province) {
        proxy.$Toast({ title: '请选择区域城市' })
        return
    }
    if (!address) {
        proxy.$Toast({ title: '请输入详细地址' })
        return
    }
    if (props.type == 'wholesaler') {
        await wholesaleEditApi(formParams).then((res: any) => {
            const { code, data, msg } = res
            if (code == proxy.$successCode) {
                proxy.$Toast({ title: '修改成功' })
                closePopupFu()
            } else {
                proxy.$Toast({ title: msg })
            }
        }, (req => {
            proxy.$Toast({ title: req.msg })
        }))
    } else if (props.type == 'manufacturer') {
        await manufacturerEditApi(formParams).then((res: any) => {
            const { code, data, msg } = res
            if (code == proxy.$successCode) {
                proxy.$Toast({ title: '修改成功' })
                closePopupFu()
            } else {
                proxy.$Toast({ title: msg })
            }
        }, (req => {
            proxy.$Toast({ title: req.msg })
        }))
    } else if (props.type == 'packaging') {

    }
    getInfoFu()
    emit('editInformationFu')
}

/**
 * 获取用户信息
 */
const getInfoFu = () => {
    proxy.$Loading();
    getInfoApi().then((res: any) => {
        const { code, data, msg } = res
        proxy.$CloseLoading();
        if (code == proxy.$successCode) {
            useUser.userInfo.dept = { ...useUser.userInfo.dept, ...data }
        } else {
            proxy.$Toast({ title: msg })
        }
    }, (req => {
        proxy.$CloseLoading();
        proxy.$Toast({ title: req.msg })
    }))
}

defineExpose({
    showPopupFu
});
</script>


<template>
    <uni-popup ref="popupRef" :mask-click="false">
        <view class="popup_content">
            <view class="popup_header">
                <view class="popup_title">编辑信息</view>
                <image class="off_icon" :src="off_icon" @click="closePopupFu"></image>
            </view>
            <form @submit="formSubmit">
                <view class="form_item">
                    <view class="form_label">名称</view>
                    <input class="input_item" type="text" placeholder="请输入名称" v-model="formParams.deptName">
                </view>
                <view class="form_item">
                    <view class="form_label">区域城市</view>
                    <view class="input_item flex_align" @click="showSelectAreaFu">
                        <input class="flex_1" type="text" v-model="areaDetail" disabled
                            placeholder="请选择区域城市">
                        <image class="arrow_bottom" :src="arrow_bottom"></image>
                    </view>
                </view>
                <view class="form_item">
                    <view class="form_label">详细地址</view>
                    <input class="input_item" type="text" placeholder="请输入详细地址" v-model="formParams.address">
                </view>
                <button class="form_btn" form-type="submit">确定</button>
            </form>
        </view>
    </uni-popup>
    <com-selectArea ref="selectAreaRef" :cascader="cascaderOptions" @selectAreaFu="selectAreaFu"></com-selectArea>
</template>


<style lang="scss" scoped>
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
        text-align: center;
        position: relative;

        .off_icon {
            width: 28rpx;
            height: 28rpx;
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            right: 0;
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

            .arrow_bottom {
                width: 28rpx;
                height: 28rpx;
            }
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