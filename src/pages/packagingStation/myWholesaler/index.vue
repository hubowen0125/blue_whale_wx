?id=<script lang="ts" setup>
import search_icon from "@/static/images/search_icon.png"


const { proxy } = getCurrentInstance() as any;

const wholesalerInfoList = [
    {
        name: '批发商数',
        value: '100'
    },
    {
        name: '总数量(手)',
        value: '200'
    },
    {
        name: '大于7天',
        name1: '未打包批发商',
        value: '80'
    }
]

// 添加批发商
const addWholesalerFu = () => {
    console.log('添加批发商')
    uni.navigateTo({
        url: '/pages/packagingStation/addWholesaler/index'
    })
}

// 批发商详情
const wholesalerDetailFu = () => {
    uni.navigateTo({
        url: '/pages/packagingStation/wholesalerDetails/index'
    })
}


/**
 * 滑动加载
 */
const scrolltolower = () => {
    // if (!slideLoading.value) return
    console.log('++++++++');
    // manageDevicesParams.value.page += 1
    // resetManageDevicesParams()
}

</script>

<template>
    <view class="container flex_column">
        <view class="bg"></view>
        <com-header header-title="我的批发商" :backColor="false" :titleColor="true"></com-header>
        <view class="mian_con flex_1 flex_column">
            <view class="wholesaler_info">
                <view class="wholesaler_info_item flex_column flex_align flex_center" v-for="item in wholesalerInfoList"
                    :key="item.value">
                    <view class=" wholesaler_num">{{ item.value }}</view>
                    <view class="wholesaler_name flex_column flex_align flex_center">
                        <view>{{ item.name }}</view>
                        <view v-if="item.name1">{{ item.name1 }}</view>
                    </view>
                </view>
            </view>
            <view class="search_con flex_align">
                <image class="search_icon" :src="search_icon"></image>
                <input class="flex_1" type="text" placeholder="请输入批发商名称进行查询" />
            </view>
            <view class="wholesaler_con  flex_1">
                <scroll-view class="scroll_con " scroll-y="true"
                    lower-threshold="50"
                    @scrolltolower="scrolltolower">
                    <view class="wholesaler_list flex_column">
                        <view class="wholesaler_item flex_column" v-for="item in 10" :key="item"
                            @click="wholesalerDetailFu">
                            <view class="wholesaler_item_name flex">
                                <view>陈冠希</view>
                                <view class="wholesaler_item_address">上海</view>
                            </view>
                            <view>总数量: 1000手</view>
                            <view>未打包天数: 10</view>
                        </view>
                    </view>
                </scroll-view>
            </view>
        </view>
        <view class="footer_con">
            <button class="button_defalut" @click="addWholesalerFu">添加批发商</button>
        </view>
    </view>
</template>


<style lang="scss" scoped>
.container {
    background: #F2F1F5;

    .bg {
        width: 750rpx;
        height: 394rpx;
        background: linear-gradient(136deg, #0D5DFF 0%, #00AAFF 100%);
        clip-path: ellipse(100% 100% at 50% 100%);
        /* 底部椭圆裁剪 */
        transform: scaleY(-1);
        position: fixed;
        left: 0;
        top: 0;
    }

    .mian_con {
        padding: 24rpx;
        gap: 20rpx;
        position: relative;
        overflow: hidden;

        .wholesaler_info {
            padding: 28rpx 20rpx;
            background: #FFFFFF;
            border-radius: 24rpx;
            display: grid;
            grid-template-columns: repeat(3, 208rpx);
            gap: 20rpx;

            .wholesaler_info_item {
                height: 184rpx;
                background: #F2F6FF;
                border-radius: 20rpx;
                font-weight: 400;
                font-size: 24rpx;
                color: #7C8191;

                .wholesaler_num {
                    font-weight: bold;
                    font-size: 40rpx;
                    color: #0C62FF;
                }

                .wholesaler_name {
                    height: 56rpx;
                    margin-top: 10rpx;
                }
            }
        }

        .search_con {
            height: 88rpx;
            border-radius: 12rpx;
            padding: 0 32rpx;
            box-sizing: border-box;
            background: #FFFFFF;

            .search_icon {
                width: 28rpx;
                height: 28rpx;
                margin-right: 20rpx;
            }
        }

        .wholesaler_con {
            overflow: hidden;

            .wholesaler_list {
                gap: 20rpx;

                .wholesaler_item {
                    padding: 28rpx;
                    background: #FFFFFF;
                    border-radius: 24rpx;
                    font-weight: 400;
                    font-size: 26rpx;
                    color: #7C8191;
                    gap: 16rpx;

                    .wholesaler_item_name {
                        font-weight: bold;
                        font-size: 32rpx;
                        color: #202020;
                        align-items: flex-end;
                        margin-bottom: 6rpx;

                        .wholesaler_item_address {
                            font-weight: 400;
                            font-size: 26rpx;
                            color: #346BCF;
                            margin-left: 12rpx;
                        }
                    }
                }
            }
        }
    }
}
</style>