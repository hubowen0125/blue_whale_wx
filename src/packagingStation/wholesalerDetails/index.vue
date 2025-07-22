<script lang="ts" setup>
import { wholesaleDetailApi } from '../http/packagingStation';
import { dateStrToDateFormat } from '@/utils/utils';
import del_icon from "@/static/images/del_icon.png"

const { proxy } = getCurrentInstance() as any;

const wholesalerDetailsList = reactive([
    {
        title: '客户名称',
        value: computed(() => wholesaleDetails.value.wholesaleName)
    },
    {
        title: '仓位信息',
        value: computed(() => wholesaleDetails.value.storageNum)
    },
    {
        title: '客户地区',
        value: computed(() => `${wholesaleDetails.value.wholesaleProvinceName}${wholesaleDetails.value.wholesaleCityName}${wholesaleDetails.value.wholesaleDistrictName}`)
    },
    {
        title: '客户地址',
        value: computed(() => wholesaleDetails.value.wholesaleAddress)
    },
    {
        title: '手机号',
        value: computed(() => wholesaleDetails.value.wholesalePhone)
    },
    {
        title: '总数量',
        value: computed(() => `${wholesaleDetails.value.handNum}手`)
    },
    {
        title: '未打包天数',
        value: computed(() => `${wholesaleDetails.value.unpackingDays == -1 ? '未打包过' : wholesaleDetails.value.unpackingDays + '天'}`)
    },
])
const popupData = {
    popupTitle: '编辑仓位',
    pupupType: 'input',
    popupContent: [
        {
            text: '原仓位: ',
            desc: 'A1'
        },
    ],
    cancelText: '取消',
    confirmText: '确认',
    placeholder: '请输入新仓位',
    callBack: true
}
const popupCom = ref()
const activeTabs = ref(0)
const wholesaleDetails = ref<any>({})
const recordList = ref<any[]>([])

onLoad((e: any) => {
    if (e.id) {
        wholesaleDetailFu(e.id)
    }
})

/**
 * 获取批发商详情
 * @param id 
 */
const wholesaleDetailFu = (id: any) => {
    wholesaleDetailApi({ id }).then((res: any) => {
        const { code, data, msg, token } = res
        proxy.$CloseLoading();
        if (code == proxy.$successCode) {
            console.log(data, '0000');
            wholesaleDetails.value = data;
            recordList.value = data.storageInputList || [];
        } else {
            proxy.$Toast({ title: msg })
        }
    }, (req => {
        proxy.$CloseLoading();
        proxy.$Toast({ title: req.msg })
    }))
}

const setActiveTabs = (index: number) => {
    activeTabs.value = index
    recordList.value = index == 1 ? wholesaleDetails.value.storageOrderList || [] : wholesaleDetails.value.storageInputList || []
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


const modifyFu = () => {
    popupCom.value.showPopup()
}

</script>


<template>
    <view class="container flex_column">
        <view class="bg"></view>
        <com-header header-title="批发商详情" :backColor="false" :titleColor="true"></com-header>
        <view class="main_con flex_1">
            <view class="wholesaler_details">
                <view class="wholesaler_details_item flex_align flex_between" v-for="item in wholesalerDetailsList"
                    :key="item.title">
                    <view>{{ item.title }}</view>
                    <view class="wholesaler_details_item_value">{{ item.value }}</view>
                </view>
            </view>
            <view class="tabs_list flex_align">
                <view :class="['tabs_item', 'flex_1', activeTabs == 0 ? 'tab_active' : '']" @click="setActiveTabs(0)">
                    入库记录
                </view>
                <view :class="['tabs_item', 'flex_1', activeTabs == 1 ? 'tab_active' : '']" @click="setActiveTabs(1)">
                    订单记录</view>
            </view>
            <view class="record_list flex_column">
                <template v-if="recordList.length > 0">
                    <view class="record_item" v-for="item in recordList" :key="item.id">
                        <view>{{ item.wholesaleName }}</view>
                        <view class="flex_align record_item_info flex_between">
                            <view>入库数量: {{ item.checkHandNum }}手</view>
                            <view>{{ activeTabs == 1 ? `订单编号：${item.orderNo}` : dateStrToDateFormat(item.createTime, '')
                            }}
                            </view>
                        </view>
                        <view v-if="activeTabs == 1" class="record_item_info">{{ dateStrToDateFormat(item.createTime,
                            '') }}
                        </view>
                    </view>
                </template>
                <com-no_data v-else noDataText="暂无数据"></com-no_data>
            </view>
        </view>
        <view class="footer_con flex">
            <view class="del_btn flex_align">
                <image class="del_icon" :src="del_icon"></image>
                <view>删除</view>
            </view>
            <button class="button_defalut" @click="modifyFu">编辑仓位</button>
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
        padding: 24rpx 0;
        position: relative;
        overflow-x: hidden;
        overflow-y: auto;

        .wholesaler_details {
            margin: 0 24rpx;
            padding: 0 28rpx;
            background: #FFFFFF;
            border-radius: 24rpx;
            font-weight: 500;
            font-size: 28rpx;
            color: #202020;
            margin-bottom: 28rpx;

            .wholesaler_details_item {
                padding: 34rpx 0;
                border-bottom: 1rpx solid #EFEFEF;

                .wholesaler_details_item_value {
                    font-weight: 400;
                    font-size: 28rpx;
                    color: #7C8191
                }
            }
        }

        .tabs_list {
            background: #FFFFFF;
            font-weight: 500;
            font-size: 32rpx;
            color: #7C8191;
            margin-bottom: 20rpx;
            position: sticky;
            top: -24rpx;
            z-index: 2;

            .tabs_item {
                padding: 32rpx 0;
                text-align: center;
            }

            .tab_active {
                font-weight: bold;
                font-size: 32rpx;
                color: #202020;
                position: relative;

                &::before {
                    content: '';
                    width: 72rpx;
                    height: 4rpx;
                    position: absolute;
                    background: #0C62FF;
                    border-radius: 2rpx;
                    bottom: 0;
                    left: 50%;
                    transform: translateX(-50%);
                }
            }
        }

        .record_list {
            gap: 20rpx;
            padding: 0 24rpx;
            position: relative;
            min-height: 200rpx;

            .record_item {
                background: #FFFFFF;
                border-radius: 24rpx;
                padding: 28rpx;
                font-weight: bold;
                font-size: 32rpx;
                color: #202020;

                .record_item_info {
                    font-weight: 400;
                    font-size: 26rpx;
                    color: #7C8191;
                    margin-top: 20rpx;
                    padding-right: 84rpx;
                }
            }
        }
    }
}

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
</style>