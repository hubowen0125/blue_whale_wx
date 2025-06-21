<script lang="ts" setup>
import { manufacturerWholesalePageApi } from "../http/manufacturer"
import arrow_right from "@/static/images/arrow_right.png"
import off_icon from "@/static/images/off_icon.png"
import position_1 from "@/static/images/position_1.png"
import checkbox from "@/static/images/checkbox.png"
import checkbox_active from "@/static/images/checkbox_active.png"
import deliverGoodsInfo from "../components/deliverGoodsInfo/index.vue"
import { useManufacturerStore } from "@/manufacturer/store/manufacturer";


const useManufacturer = useManufacturerStore()
const { proxy } = getCurrentInstance() as any;

const orderDetails = [
    {
        title: '批发商',
        value: '选择批发商',
        type: 'select'
    },
    {
        title: '总件数',
        value: '60手/100件',
    },
    {
        title: '总金额',
        value: '100.00',
        type: 'price',
    },
]

const wholesalerRef = ref();
const popupRef = ref();

onMounted(() => {
    console.log('mounted');
    manufacturerWholesalePageFu()
})

const manufacturerWholesalePageFu = () => {
    manufacturerWholesalePageApi({}).then((res: any) => {
        const { code, data, msg, token } = res
        proxy.$CloseLoading();
        if (code == proxy.$successCode) {
            console.log(data, '0000');
        } else {
            proxy.$Toast({ title: msg })
        }
    }, (req => {
        proxy.$CloseLoading();
        proxy.$Toast({ title: req.msg })
    }))
}

// 显示弹窗
const showPopup = () => {
    console.log('显示弹窗');
    popupRef.value.open('bottom')
}

// 关闭弹窗
const closePopupFu = () => {
    popupRef.value.close();
}

// 显示批发商弹窗
const showWholesalerFu = () => {
    console.log('显示批发商弹窗');
    wholesalerRef.value.open('bottom')
}

// 关闭弹窗
const closeWholesalerFu = () => {
    wholesalerRef.value.close();
}
</script>


<template>
    <view class="container flex_column">
        <view class="bg"></view>
        <com-header header-title="订单确认" :backColor="false" :titleColor="true"></com-header>
        <view class="main_con flex_1 flex_column">
            <view class="order_details">
                <view class="order_details_item flex_align flex_between"
                    :class="{ 'order_details_item_select ': item.type == 'select' }" v-for="item, index in orderDetails"
                    :key="index" @click="showWholesalerFu">
                    <view class="flex_align order_details_item_title">{{ item.title }}</view>
                    <view class="flex_1  order_details_item_value">
                        <view v-if="item.type === 'price'" class="order_details_item_value_price">¥{{ item.value }}
                        </view>
                        <view v-else>{{ item.value }}</view>
                    </view>
                    <image v-if="item.type == 'select'" class="arrow_right" :src="arrow_right"></image>
                </view>
            </view>
            <deliverGoodsInfo :edit="true">
                <template #input>
                    <view class="flex_align flex_between deliver_info_item">
                        <view>备注</view>
                        <input class="deliver_info_item_input" type="text" placeholder="请输入备注内容">
                    </view>
                </template>
            </deliverGoodsInfo>
            <view class="product_list flex_column">
                <template v-for="item in 10" :key="item">
                    <view class="product_item">
                        <com-orderTable orderType="handleOrder"></com-orderTable>
                    </view>
                </template>
            </view>
        </view>
        <view class="footer_con flex_between flex_align">
            <view>
                <view>
                    <text class="price_icon">¥</text>
                    <text>80</text>
                </view>
                <view class="unit_info">2手/10件</view>
            </view>
            <button class="button_defalut">生成订单</button>
        </view>
    </view>

    <uni-popup ref="popupRef" :safe-area="false">
        <view class="popup_content flex_column ">
            <view class="popup_header flex_align flex_between">
                <text>选择打包站</text>
                <image class="off_icon" :src="off_icon" @click="closePopupFu"></image>
            </view>
            <view class="packaging_station_list flex_column flex_1">
                <template v-for="item in 10" :key="item">
                    <view class="packaging_station_item flex_align flex_between"
                        :class="{ 'packaging_station_item_active': item % 2 === 0 }">
                        <view class="flex_column">
                            <view class="flex_align packaging_station_info">
                                <image class="position_icon" :src="position_1"></image>
                                <view class="packaging_station_name">新村路打包站</view>
                            </view>
                            <view>上海市普陀区甘泉路280号</view>
                            <view>15618257147</view>
                        </view>
                        <image class="checkbox_icon" :src="checkbox"></image>
                    </view>
                </template>
            </view>
            <button class="button_defalut">确认</button>
        </view>
    </uni-popup>


    <uni-popup ref="wholesalerRef" :safe-area="false">
        <view class="popup_content flex_column ">
            <view class="popup_header flex_align flex_between">
                <text>选择批发商</text>
                <image class="off_icon" :src="off_icon" @click="closeWholesalerFu"></image>
            </view>
            <view class="packaging_station_list flex_column flex_1">
                <template v-for="item in 10" :key="item">
                    <view class="packaging_station_item flex_align flex_between"
                        :class="{ 'packaging_station_item_active': item % 2 === 0 }">
                        <view class="flex_column">
                            <view class="flex_align packaging_station_info">
                                <image class="position_icon" :src="position_1"></image>
                                <view class="packaging_station_name">上海春之都店</view>
                            </view>
                            <view>上海市普陀区甘泉路280号</view>
                            <view>15618257147</view>
                        </view>
                        <image class="checkbox_icon" :src="checkbox"></image>
                    </view>
                </template>
            </view>
            <button class="button_defalut">确认</button>
        </view>
    </uni-popup>
</template>

<style lang="scss" scoped>
.container {
    background: #F2F1F5;

    .bg {
        width: 750rpx;
        height: 424rpx;
        background: linear-gradient(136deg, #0D5DFF 0%, #00AAFF 100%);
        clip-path: ellipse(100% 100% at 50% 100%);
        /* 底部椭圆裁剪 */
        transform: scaleY(-1);
        position: fixed;
        left: 0;
        top: 0;
    }

    .main_con {
        padding: 24rpx;
        position: relative;
        overflow-x: hidden;
        gap: 20rpx;
        overflow-y: auto;

        .order_details {
            background: #FFFFFF;
            border-radius: 24rpx;
            padding: 0 28rpx;

            .order_details_item {
                padding: 34rpx 0;
                border-bottom: 1rpx solid #EFEFEF;
                pointer-events: none;

                .order_details_item_title {
                    width: 200rpx;
                    font-weight: 500;
                    font-size: 28rpx;
                    color: #202020;
                }

                .order_details_item_value {
                    font-weight: 400;
                    font-size: 28rpx;
                    color: #7C8191;
                    text-align: right;

                    .order_details_item_value_price {
                        font-weight: 500;
                        color: #FF840C;
                    }
                }
            }

            .order_details_item_select {
                pointer-events: all;

                .order_details_item_value {
                    color: #0C62FF;
                }

                .arrow_right {
                    width: 28rpx;
                    height: 28rpx;
                    margin-left: 8rpx;
                    transform: rotate(90deg);
                }
            }
        }

        .deliver_info_item {

            .deliver_info_item_input {
                font-weight: 400;
                font-size: 28rpx;
                text-align: right;
            }
        }

        .product_list {
            gap: 20rpx;

            .product_item {
                background: #FFFFFF;
                border-radius: 24rpx;
                padding: 36rpx 28rpx;
            }
        }
    }

    .footer_con {
        font-weight: 500;
        font-size: 44rpx;
        color: #0C62FF;

        .price_icon {
            font-size: 28rpx;
        }

        .unit_info {
            font-weight: 400;
            font-size: 24rpx;
            color: #202020;
        }

        .button_defalut {
            width: 320rpx;
        }
    }
}

.popup_content {
    background-color: #fff;
    padding: 40rpx 24rpx env(safe-area-inset-bottom);
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