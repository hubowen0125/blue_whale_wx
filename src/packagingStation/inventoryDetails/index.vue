<script lang="ts" setup>
import { getByIdApi, storageInputApi, delByIdApi } from "../http/packagingStation";
import arrow_right from "@/static/images/arrow_right.png"
import { dateStrToDateFormat } from "@/utils/utils";

let timer: any
const { proxy } = getCurrentInstance() as any;

const inventoryDetail = reactive([
    {
        title: '订单号 ',
        value: computed(() => inventoryDetails.value.orderNo),
    },
    {
        title: '创建时间',
        value: computed(() => dateStrToDateFormat(inventoryDetails.value.createTime, '')),
    },
    {
        title: '厂家',
        value: computed(() => inventoryDetails.value.manufacturerName),
    },
    {
        title: '厂家电话号',
        value: computed(() => inventoryDetails.value.manufacturerPhone),
    },
    {
        title: '批发商',
        value: computed(() => inventoryDetails.value.wholesaleName),
    },
    {
        title: '批发商电话号',
        value: computed(() => inventoryDetails.value.wholesalePhone),
    },
    {
        title: '客户仓位',
        value: computed(() => inventoryDetails.value.storageNum),
    },
    {
        title: '订单数量(手)',
        value: computed(() => inventoryDetails.value.orderHandNum),
    },
    {
        title: '核点数量(手)',
        value: computed(() => inventoryDetails.value.checkHandNum),
        button: true
    },
])
const popupData = reactive({
    popupTitle: '修改核点数量',
    pupupType: 'input',
    popupContent: [
        {
            text: '原核点数量: ',
            desc: '20手'
        },
    ],
    cancelText: '取消',
    confirmText: '确认',
    placeholder: '请输入数量',
    callBack: true
})
const popupCom = ref()
const inventoryDetails = ref<any>({})
const inventoryId = ref('')

onLoad((e: any) => {
    if (e.id) {
        inventoryId.value = e.id
    }
})

onShow(() => {
    if (inventoryId.value) {
        getByIdFu()
    }
})

const getByIdFu = () => {
    proxy.$Loading()
    getByIdApi({ id: inventoryId.value }).then((res: any) => {
        const { code, data, msg, token } = res
        proxy.$CloseLoading();
        if (code == proxy.$successCode) {
            inventoryDetails.value = data
            popupData.popupContent[0].desc = `${inventoryDetails.value.checkHandNum}手`
        } else {
            proxy.$Toast({ title: msg })
        }
    }, (req => {
        proxy.$CloseLoading();
        proxy.$Toast({ title: req.msg })
    }))
}

const modifyFu = () => {
    popupCom.value.showPopup()
}

/**
 * 确认选择
 */
const confirmPopupFu = (num: string | number) => {
    storageInputApi({ id: inventoryId.value, checkHandNum: num }).then((res: any) => {
        const { code, data, msg, token } = res
        proxy.$CloseLoading();
        if (code == proxy.$successCode) {
            proxy.$Toast({
                title: '修改成功',
                successCB: () => {
                    timer = setTimeout(() => {
                        getByIdFu()
                    }, 1500)
                }
            })
        } else {
            proxy.$Toast({ title: msg })
        }
    }, (req => {
        proxy.$CloseLoading();
        proxy.$Toast({ title: req.msg })
    }))
}

const delByIdFu = () => {
    proxy.$Loading()
    delByIdApi({ id: inventoryId.value }).then((res: any) => {
        const { code, data, msg, token } = res
        proxy.$CloseLoading();
        if (code == proxy.$successCode) {
            proxy.$Toast({ title: '删除成功' })
            uni.navigateBack()
        } else {
            proxy.$Toast({ title: msg })
        }
    }, (req => {
        proxy.$CloseLoading();
        proxy.$Toast({ title: req.msg })
    }))
}

/**
 * 页面
 */
onUnmounted(() => {
    // 清除定时器
    if (timer) {
        clearTimeout(timer);
        timer = null;
    }
})
</script>


<template>
    <view class="container flex_column">
        <view class="bg"></view>
        <com-header header-title="入库详情" :backColor="false" :titleColor="true"></com-header>
        <view class="main_con flex_1">
            <view class="inventory_details">
                <view class="inventory_details_item flex_align flex_between" v-for="item, index in inventoryDetail"
                    :key="index">
                    <view class="inventory_details_item_title">{{ item.title }}</view>
                    <view class="flex_1  inventory_details_item_value" :class="{ 'flex_align flex_end': item.button }">
                        <view>{{ item.value }}</view>
                        <button class="inventory_details_item_button" v-if="item.button" @click="modifyFu">修改</button>
                    </view>
                </view>
            </view>
            <view class="operation_record">操作记录</view>
            <view class="operation_record_list flex_column">
                <template v-if="inventoryDetails.records && inventoryDetails.records.length > 0">
                    <view class="operation_record_item flex_align" v-for="item in inventoryDetails.records"
                        :key="item.id">
                        <view class="flex_column flex_1">
                            <view>{{ item.createBy }}</view>
                            <view class="operation_record_item_color">{{ dateStrToDateFormat(item.createTime) }}</view>
                        </view>
                        <view class="flex_column flex_align">
                            <view>{{ item.originalNum }}</view>
                            <view class="operation_record_item_color">原数据</view>
                        </view>
                        <view class="flex_column flex_align operation_record_item_modify">
                            <view>{{ item.checkHandNum }}</view>
                            <view class="operation_record_item_color">修改后</view>
                        </view>
                    </view>
                </template>
                <com-no_data v-else noDataText="暂无操作记录"></com-no_data>
            </view>
        </view>
        <view class="footer_con">
            <button class="delete_record_button" @click="delByIdFu">删除记录</button>
        </view>
    </view>
    <com-popup_com ref="popupCom" :popupData="popupData" @confirmPopupFu="confirmPopupFu"></com-popup_com>
</template>


<style lang="scss" scoped>
.container {
    background: #F2F1F5;

    .bg {
        width: 750rpx;
        height: 524rpx;
        background: linear-gradient(136deg, #0D5DFF 0%, #00AAFF 100%);
        clip-path: ellipse(100% 100% at 50% 100%);
        /* 底部椭圆裁剪 */
        transform: scaleY(-1);
        position: fixed;
        left: 0;
        top: 0;
    }

    .main_con {
        padding: 50rpx 24rpx 30rpx;
        position: relative;
        overflow-x: hidden;
        overflow: auto;

        .inventory_details {
            background: #FFFFFF;
            border-radius: 24rpx;
            padding: 40rpx 28rpx;

            .inventory_details_item {
                margin-top: 20rpx;

                .inventory_details_item_title {
                    font-weight: 400;
                    font-size: 26rpx;
                    color: #7C8191;
                }

                .inventory_details_item_value {
                    font-weight: 400;
                    font-size: 26rpx;
                    color: #202020;
                    text-align: right;

                    .inventory_details_item_button {
                        padding: 16rpx 18rpx;
                        background: rgba(12, 104, 255, 0.05);
                        border-radius: 12rpx;
                        border: 1rpx solid #8CBAFF;
                        font-weight: 500;
                        font-size: 26rpx;
                        color: #0C62FF;
                        line-height: 1;
                        margin-left: 20rpx;
                    }
                }
            }
        }

        .operation_record {
            font-weight: bold;
            font-size: 32rpx;
            color: #202020;
            margin-top: 48rpx;
            margin-bottom: 24rpx;
        }

        .operation_record_list {
            gap: 20rpx;
            min-height: 200rpx;
            position: relative;

            .operation_record_item {
                padding: 46rpx 28rpx;
                background: #FFFFFF;
                border-radius: 24rpx;
                font-weight: bold;
                font-size: 30rpx;
                color: #202020;
                gap: 102rpx;

                .operation_record_item_modify {
                    position: relative;
                    font-weight: bold;
                    font-size: 36rpx;
                    color: #0C62FF;

                    &::after {
                        content: '';
                        position: absolute;
                        width: 2rpx;
                        height: 34rpx;
                        background: #DBDBDB;
                        left: -51rpx;
                        top: 50%;
                        transform: translateY(-50%);
                    }

                }

                .operation_record_item_color {
                    font-weight: 400;
                    font-size: 26rpx;
                    color: #7C8191;
                }

            }
        }
    }

    .delete_record_button {
        height: 96rpx;
        background: rgba(255, 12, 12, 0.04);
        border-radius: 48rpx;
        border: 1rpx solid #F9ABAB;
        font-weight: 500;
        font-size: 30rpx;
        color: #FF0C0C;
        line-height: 96rpx;
    }
}
</style>