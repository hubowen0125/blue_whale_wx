<script lang="ts" setup>
import { getByCardNoApi } from "@/http/api/all"
import position_1 from "@/static/images/position_1.png"
import { useUserStore } from "@/store/modules/user";
import share from "@/static/share.jpg"


const useUser = useUserStore()
const { proxy } = getCurrentInstance() as any;

const orderDetails = ref<any>({
    totalHandNum: 0,
    totalNum: 0,
    totalAmount: 0,
    packaging: {},
    wholesale: {},
    manufacturer: {},
    remark: ''
})

onLoad((e: any) => {
    if (e.orderNo) {
        getByCardNoFu(e.orderNo)
        useUser.setShareParamFu({
            title: '蓝鲸',
            path: `/pages/loading/index?type=manufacturer&cardNo=${e.orderNo}`,
            imageUrl: share
        })
    }
})

/**
 * 获取订单详情
 */
const getByCardNoFu = (cardNo: string) => {
    getByCardNoApi({ cardNo }).then((res: any) => {
        const { code, data, msg, token } = res
        proxy.$CloseLoading();
        if (code == proxy.$successCode) {
            console.log(data, '0000');
            if (data.cardProductsList && data.cardProductsList.length > 0) {
                data.cardProductsList.map((item: { productColorsList: any; cardProductsDetailList: any; id: any; productId: any; }) => {
                    item.productColorsList = item.cardProductsDetailList
                    item.id = item.productId
                    return item
                })
            }
            orderDetails.value = data
        } else {
            proxy.$Toast({ title: msg })
        }
    }, (req => {
        proxy.$CloseLoading();
        proxy.$Toast({ title: req.msg })
    }))
}
</script>


<template>
    <view class="container flex_column">
        <view class="bg"></view>
        <com-header header-title="订货卡信息" :backColor="false" :titleColor="true"></com-header>
        <view class="main_con flex_column flex_1">
            <view class="information_con">
                <view class="information_title">我的信息</view>
                <view class="flex_column my_information">
                    <view class="flex_align my_info">
                        <image class="position_icon" :src="position_1"></image>
                        <view class="my_info_name">{{ orderDetails.wholesale?.deptName }}</view>
                    </view>
                    <view>{{ orderDetails.wholesale?.address }}</view>
                    <view>{{ orderDetails.wholesale?.phone }}</view>
                </view>
                <view class="select_station_con flex_align">
                    <view>打包站</view>
                    <view class="select_station flex_1">{{ orderDetails.packaging?.deptName }}</view>
                </view>
                <view class="select_station_con flex_align">
                    <view>厂家</view>
                    <view class="select_station flex_1">{{ orderDetails.manufacturer?.deptName }}</view>
                </view>
            </view>
            <view class="product_list flex_column">
                <template v-for="item in orderDetails.cardProductsList" :key="item.id">
                    <view class="product_item">
                        <com-orderTable
                            orderType="shareDetail"
                            :productDetail="item"></com-orderTable>
                    </view>
                </template>
            </view>
        </view>
        <view class="footer_con">
            <button class="share_btn" open-type="share">选择微信好友立即发送</button>
        </view>
    </view>
</template>

<style lang="scss" scoped>
.container {
    background: #F2F1F5;

    .bg {
        width: 750rpx;
        height: 304rpx;
        background: linear-gradient(136deg, #0D5DFF 0%, #00AAFF 100%);
        position: fixed;
        left: 0;
        top: 0;
    }

    .main_con {
        padding: 24rpx;
        position: relative;
        gap: 20rpx;

        .product_list {
            gap: 20rpx;

            .product_item {
                background: #FFFFFF;
                border-radius: 24rpx;
                padding: 36rpx 28rpx;
            }
        }

        .information_con {
            padding: 36rpx 28rpx;
            background: #FFFFFF;
            border-radius: 24rpx;

            .information_title {
                font-weight: bold;
                font-size: 32rpx;
                color: #202020;
            }

            .no_data_con {
                position: relative;
                width: 100%;
                height: 300rpx;
            }

            .edit_btn {
                width: 156rpx;
                height: 72rpx;
                background: rgba(12, 104, 255, 0.03);
                border-radius: 16rpx;
                border: 1rpx solid #CDE1FF;
                font-weight: 500;
                font-size: 26rpx;
                color: #0C62FF;
                line-height: 72rpx;
                margin: auto;
            }

            .my_information {
                background: #F2F6FF;
                border-radius: 20rpx;
                padding: 34rpx 28rpx;
                font-weight: 400;
                font-size: 24rpx;
                color: #7C8191;
                gap: 12rpx;
                margin-top: 32rpx;

                .my_info {
                    margin-bottom: 8rpx;

                    .my_info_name {
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
            }

            .select_station_con {
                font-weight: 500;
                font-size: 28rpx;
                color: #202020;
                padding: 34rpx 0;
                gap: 8rpx;
                border-bottom: 1rpx solid #EFEFEF;

                .select_station {
                    color: #0C62FF;
                    text-align: right;
                }

                .arrow_right {
                    transform: rotate(90deg);
                    width: 28rpx;
                    height: 28rpx;
                }
            }

            .add_goods_btn {
                width: 646rpx;
                height: 96rpx;
                background: rgba(12, 104, 255, 0.05);
                border-radius: 48rpx;
                border: 1rpx solid #8CBAFF;
                font-weight: 500;
                font-size: 30rpx;
                color: #0C62FF;
                line-height: 96rpx;
                margin-top: 40rpx;
            }
        }
    }
}

.hint_con {
    font-weight: 400;
    font-size: 26rpx;
    color: #7C8191;
    margin-bottom: 36rpx;
    margin-top: 18rpx;

    .hint_icon {
        width: 26rpx;
        height: 26rpx;
        margin-right: 8px;
    }
}
</style>