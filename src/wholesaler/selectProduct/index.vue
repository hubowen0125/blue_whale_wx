<script lang="ts" setup>

</script>

<template>
    <view class="container flex_column">
        <view class="bg"></view>
        <com-header header-title="选择商品" :backColor="false" :titleColor="true"></com-header>
        <view class="search_con ">
            <com-searchInput placeholder="搜索商品"></com-searchInput>
        </view>
        <view class="main_con flex_column flex_1">
            <view class="order_info_list flex_column">
                <template v-for="item in 10" :key="item">
                    <com-orderInfo :needDownload="false">
                        <template #button>
                            <view class="order_quantity">
                                加入订货卡
                            </view>
                        </template>
                    </com-orderInfo>
                </template>
            </view>
        </view>
    </view> 
</template>

<style lang="scss" scoped>
.container {
    background: #F2F1F5;

    .bg {
        width: 750rpx;
        height: 318rpx;
        background: linear-gradient(136deg, #0D5DFF 0%, #00AAFF 100%);
        position: fixed;
        left: 0;
        top: 0;
    }

    .search_con {
        margin: 32rpx 24rpx 52rpx;
    }

    .main_con {
        padding: 24rpx;
        position: relative;
        overflow-x: hidden;
        overflow-y: auto;

        .order_info_list {
            background: #FFFFFF;
            border-radius: 24rpx;
            padding: 28rpx;
            gap: 56rpx;

            .order_quantity {
                padding: 8rpx 14rpx;
                font-weight: 500;
                font-size: 26rpx;
                color: #0C62FF;
                background: rgba(12, 104, 255, 0.03);
                border-radius: 12rpx;
                border: 1rpx solid #CDE1FF;
            }
        }
    }
}
</style>