<script lang="ts" setup>
import { scanCodeApi, stockInApi } from "@/packagingStation/http/packagingStation";
import { getInfoApi, packagingWholesalePageApi } from "@/http/api/all";
import position_1 from "@/static/images/position_1.png"
import scan_code_icon from "@/static/images/packagingStation/scan_code_icon.png"
import arrow_bottom from "@/static/images/arrow_bottom.png"
import { useUserStore } from '@/store/modules/user';
import { calculateTimeDifference, handleInput } from "@/utils/utils";

const useUser = useUserStore()
const { proxy } = getCurrentInstance() as any;

interface STOCKINPARAMS {
    type: number
    manufacturerName: string
    packagingWholesaleId: string
    storageNum: number | string
    checkHandNum: number | string
    [key: string]: string | number // 添加索引签名以允许通过字符串索引
}

const tabBarIndex = inject("tabBarIndex") as Ref<number>
const stockInParams = ref<STOCKINPARAMS>({
    type: 1, // 类型1.输入 2.扫码 
    manufacturerName: '',
    packagingWholesaleId: '',
    storageNum: '',
    checkHandNum: '',
    orderNo: '',
    shipId: ''
})
const wholesaleList = ref<any[]>([])
const wholesaleName = ref('')
const selectWholesalerRef = ref<any>()
const popupData = reactive({
    popupTitle: '续费提醒',
    pupupType: 'default',
    popupContent: [
        {
            text: '您的会员服务将在',
            desc: '7天内到期',
        },
        {
            text: '请及时续费',
        },
    ],
    cancelText: '稍后处理',
    confirmText: '立即续费',
    callBack: true
})
const codePopupData = reactive({
    popupTitle: '提示',
    pupupType: 'default',
    popupContent: [
        {
            text: '您无权限进行入库操作，请联系对方进行调整'
        }
    ],
    confirmText: '我知道了',
})
const renewPopupData = reactive({
    popupTitle: '立即续费',
    pupupType: 'default',
    popupContent: [
        {
            text: '请联系',
            desc: '',
            text1: '进行续费'
        }
    ],
    confirmText: '我知道了',
})
const renewPopup = ref()
const codePopupCom = ref()
const popupCom = ref()
const wholesalerParams = ref<any>({
    packagingId: useUser.userInfo.deptId,
    wholesaleName: ''
})
// 是否支持选择经销商
const isSupportSelectWholesaler = ref(false)

watch(() => tabBarIndex.value, (newVal) => {
    if (newVal == 0) {
        console.log('213213');
    }
})

onMounted(() => {
    packagingWholesalePageFu()
    getInfoFu()
})

/**
 * 获取批发商列表
 */
const packagingWholesalePageFu = () => {
    packagingWholesalePageApi(wholesalerParams.value).then((res: any) => {
        const { code, data, msg, token } = res
        proxy.$CloseLoading();
        if (code == proxy.$successCode) {
            console.log(data, '0000');
            if (data && data.length > 0) {
                wholesaleList.value = data;
            } else {
                wholesaleList.value = []
            }
        } else {
            proxy.$Toast({ title: msg })
        }
    }, (req => {
        proxy.$CloseLoading();
        proxy.$Toast({ title: req.msg })
    }))
}

/**
 * 获取用户信息
 */
const getInfoFu = () => {
    getInfoApi().then((res: any) => {
        const { code, data, msg } = res
        proxy.$CloseLoading();
        if (code == proxy.$successCode) {
            console.log(data, calculateTimeDifference(data.expireTime));
            const day = calculateTimeDifference(data.expireTime).day;
            if (0 < day && day < 7) {
                popupData.popupContent[0].desc = `${day}天后到期`
                popupCom.value.showPopup()
            } else if (day < 0) {
                popupData.popupContent[0].text = '您的会员服务已过期'
                popupData.popupContent[0].desc = `${day * -1}天`
                popupCom.value.showPopup()
            }
        } else {
            proxy.$Toast({ title: msg })
        }
    }, (req => {
        proxy.$CloseLoading();
        proxy.$Toast({ title: req.msg })
    }))
}


// 显示批发商弹窗
const showWholesalerFu = () => {
    console.log('显示批发商弹窗');
    selectWholesalerRef.value.showPopupFu()
}

/**
 * 选择批发商
 * @param e 
 */
const selectSubmitFu = (e: any) => {
    wholesaleName.value = e.wholesaleName
    stockInParams.value.packagingWholesaleId = e.id
    stockInParams.value.storageNum = e.storageNum
}

const inputValueFu = async (e: any, key: string) => {
    const value = e.target.value
    const result = await handleInput(value) as string;
    if (result) {
        const num = parseInt(result, 10)
        stockInParams.value[key] = num.toString()
    } else {
        stockInParams.value[key] = 0
    }
}


/**
 * 入库
 */
const stockInFu = () => {
    const { type, manufacturerName, packagingWholesaleId, storageNum, checkHandNum } = stockInParams.value
    console.log(stockInParams.value, 'stockInParamsstockInParamsstockInParams');
    if (!manufacturerName) {
        return proxy.$Toast({ title: '请输入厂家名称' })
    }
    if (!packagingWholesaleId) {
        return proxy.$Toast({ title: '请选择批发商' })
    }
    if (!checkHandNum) {
        return proxy.$Toast({ title: '请输入核点数量' })
    }
    proxy.$Loading()
    stockInApi(stockInParams.value).then((res: any) => {
        const { code, data, msg } = res
        proxy.$CloseLoading();
        if (code == proxy.$successCode) {
            console.log(data, '0000');
            proxy.$Toast({ title: '入库成功' })
            resetStockInParamsFu()
        } else {
            proxy.$Toast({ title: msg })
        }
    }, (req => {
        proxy.$CloseLoading();
        proxy.$Toast({ title: req.msg })
    }))
}

const resetStockInParamsFu = () => {
    stockInParams.value = {
        type: 1,
        manufacturerName: '',
        packagingWholesaleId: '',
        storageNum: '',
        checkHandNum: '',
        orderNo: '',
        shipId: ''
    }
    wholesaleName.value = ''
}

const scanCodeFu = () => {
    proxy.$Loading()
    uni.scanCode({
        success: function (res) {
            console.log('条码类型：' + res.scanType);
            console.log('条码内容：' + res.result);
            proxy.$CloseLoading()
            if (res.result) {
                const params: any = {};
                const queryStr = res.result
                const queryArr = queryStr.split('&');
                queryArr.forEach(item => {
                    const keyValueArr = item.split('=');
                    if (keyValueArr.length > 1) {
                        params[keyValueArr[0]] = keyValueArr[1];
                    }
                });
                const { packagingId, shipId, orderNo } = params
                // if (packagingId == useUser.userInfo.dept.deptId) {
                queryScanCodeFu(orderNo, shipId)
                // } else {
                //     codePopupCom.value.showPopup()
                // }
            }
        },
        fail: function (res) {
            console.log('扫描失败：' + res.errMsg);
            proxy.$CloseLoading()
            proxy.$Toast('扫描失败，请扫描正确的二维码！')
        }
    });
}

/**
 * 扫码按钮点击事件
 */
const queryScanCodeFu = (orderNo: string, shipId: string) => {
    scanCodeApi({ orderNo, shipId }).then((res: any) => {
        const { code, data, msg, token } = res
        proxy.$CloseLoading();
        if (code == proxy.$successCode) {
            console.log(data, '0000');
            const { wholesaleName: name } = data
            stockInParams.value = { ...stockInParams.value, ...data }
            stockInParams.value.name = name
            wholesaleName.value = name
        } else {
            proxy.$Toast({ title: msg })
        }
    }, (req => {
        proxy.$CloseLoading();
        proxy.$Toast({ title: req.msg })
    }))
}

const searchInputBlur = (e: string) => {
    console.log('搜索输入框失去焦点');
    wholesalerParams.value.wholesaleName = e
    wholesaleName.value = ''
    stockInParams.value.packagingWholesaleId = ''
    stockInParams.value.storageNum = ''
    isSupportSelectWholesaler.value = false
    packagingWholesalePageFu()
}

const searchInputFu = (e: string) => {
    console.log('搜索输入框输入');
    isSupportSelectWholesaler.value = true
}

// 确认弹窗
const confirmPopupFu = () => {
    console.log('1111');
    renewPopupData.popupContent[0].desc = useUser.servicePhone
    renewPopup.value.showPopup()
}

</script>


<template>
    <view class="home_com flex_column">
        <view class="header_con flex_align">
            <image class="header_img" :src="position_1"></image>
            <view class="header_title">{{ useUser.userInfo?.dept?.deptName }}</view>
        </view>
        <view class="home_main flex_column">
            <view class="table_con">
                <text class="table_title">厂家名称</text>
                <input class="table_input" type="text" placeholder="请输入厂家名称"
                    v-model="stockInParams.manufacturerName">
            </view>
            <view class="table_con">
                <text class="table_title">批发商名称</text>
                <view class="flex table_input_list">
                    <view class="flex_align table_input table_input_item" @click="showWholesalerFu">
                        <input class=" flex_1" type="text"
                            placeholder="选择批发商" disabled
                            v-model="wholesaleName">
                        <image class="arrow_bottom" :src="arrow_bottom"></image>
                    </view>
                    <input class="table_input flex_1" type="number" placeholder="请输入仓位"
                        v-model="stockInParams.storageNum" @blur="(e: any) => inputValueFu(e, 'storageNum')">
                </view>
            </view>
            <view class="table_con">
                <text class="table_title">核点数量(手)</text>
                <input class="table_input" type="number" placeholder="请输入核点数量"
                    v-model="stockInParams.checkHandNum" @blur="(e: any) => inputValueFu(e, 'checkHandNum')">
            </view>
            <view class="btn_con flex_align">
                <button class="reset_btn" @click="resetStockInParamsFu">重置</button>
                <button class="button_defalut flex_1" @click="stockInFu">立即入库</button>
            </view>
        </view>
        <view>
            <view class="scan_code_con flex_align flex_column" @click="scanCodeFu">
                <image class="scan_code_icon" :src="scan_code_icon"></image>
                <view class="scan_code_desc">扫码入库</view>
            </view>
        </view>
    </view>
    <com-selectWholesaler ref="selectWholesalerRef"
        :wholesaleList="wholesaleList" @selectSubmitFu="selectSubmitFu"
        :isSupportSelectWholesaler="isSupportSelectWholesaler">
        <template #search>
            <view class="search_input">
                <com-searchInput placeholder="请输入批发商名称进行查询" @onBlur="searchInputBlur"
                @onFocus="searchInputFu"></com-searchInput>
            </view>
        </template>
    </com-selectWholesaler>
    <com-popup_com ref="popupCom" :popupData="popupData" @confirmPopupFu="confirmPopupFu"></com-popup_com>
    <com-popup_com ref="codePopupCom" :popupData="codePopupData"></com-popup_com>
    <com-popup_com ref="renewPopup" :popupData="renewPopupData"></com-popup_com>
</template>

<style lang="scss" scoped>
.home_com {
    width: 100%;
    height: 100%;
    padding: v-bind('`${useUser.navHeight + (useUser.statusBarHeight / 2)}px`') 30rpx 30rpx 30rpx;
    box-sizing: border-box;
    overflow-x: hidden;
    overflow-y: auto;

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

                .arrow_bottom {
                    width: 24rpx;
                    height: 24rpx;
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
        margin-top: 30rpx;

        .scan_code_icon {
            width: 136rpx;
            height: 136rpx;
        }
    }

}

.search_input {
    border: 2rpx solid #DDE8FC;
    margin-top: -20rpx;
    margin-bottom: 20rpx;
    border-radius: 20rpx;
    overflow: hidden;
}
</style>