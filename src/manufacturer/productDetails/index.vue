<script lang="ts" setup>

const productDetails = [
    {
        title: '商品名称',
        value: '儿童短袖',
        required: true
    },
    {
        title: '商品款号',
        value: '20019',
        required: true
    },
    {
        title: '尺码',
        value: '8-12',
        required: true
    },
    {
        title: '颜色',
        value: '白色、红色',
        required: true
    },
    {
        title: '价格',
        value: '¥200',
        required: true
    },
    {
        title: '一手件数',
        value: '一手5件',
        required: true
    },
    {
        title: '库存',
        value: '20',
        required: true
    },
]

</script>


<template>
    <view class="container flex_column">
        <view class="bg"></view>
        <com-header header-title="订单确认" :backColor="false" :titleColor="true"></com-header>
        <view class="main_con flex_1 flex_column">
            <view class="product_img_con flex_column">
                <view class="product_title">商品图片</view>
                <view class="img_list">
                    <image class="img" v-for="item in 5" :key="item"></image>
                </view>
            </view>
            <view class="product_detail">
                <view class="product_detail_item flex_align flex_between" v-for="item, index in productDetails">
                    <view class="flex_align product_detail_item_title">{{ item.title }}</view>
                    <view class="flex_1  product_detail_item_value">
                        <view>{{ item.value }}</view>
                    </view>
                </view>
            </view>
        </view>
        <view class="footer_con"><button class="button_defalut">商品编辑</button></view>
    </view>
</template>

<style lang="scss" scoped>
.container {
    .bg {
        width: 750rpx;
        height: 304rpx;
        background: linear-gradient(136deg, #0D5DFF 0%, #00AAFF 100%);
        position: fixed;
        left: 0;
        top: 0;
    }

    .main_con {
        overflow-x: hidden;
        overflow-y: auto;
        margin-top: 30rpx;
        gap: 20rpx;
        padding: 24rpx;
        position: relative;

        .product_img_con {
            font-weight: bold;
            font-size: 32rpx;
            color: #202020;
            gap: 24rpx;
            background: #FFFFFF;
            border-radius: 24rpx;
            padding: 36rpx 28rpx;

            .img_list {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 20rpx;

                .img {
                    width: 184rpx;
                    height: 184rpx;
                    border: 1px solid #000;
                    border-radius: 20rpx;
                }
            }
        }

        .product_detail {
            background: #FFFFFF;
            border-radius: 24rpx;
            padding: 0 28rpx;

            .product_detail_item {
                padding: 34rpx 0;
                border-bottom: 1rpx solid #EFEFEF;
                pointer-events: none;

                .product_detail_item_title {
                    width: 200rpx;
                    font-weight: 500;
                    font-size: 28rpx;
                    color: #202020;
                }

                .product_detail_item_value {
                    font-weight: 400;
                    font-size: 28rpx;
                    color: #7C8191;
                    text-align: right;

                    .product_detail_item_value_price {
                        font-weight: 500;
                        color: #FF840C;
                    }
                }
            }
        }
    }
}
</style>