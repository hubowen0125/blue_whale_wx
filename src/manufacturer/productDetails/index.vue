<script lang="ts" setup>
import { getByIdApi } from '../http/manufacturer';


const { proxy } = getCurrentInstance() as any;

const productDetails = [
    {
        title: '商品名称',
        value: 'productName',
        required: true
    },
    {
        title: '商品款号',
        value: 'styleNumber',
        required: true
    },
    {
        title: '尺码',
        value: 'sizeName',
        required: true
    },
    {
        title: '颜色',
        value: 'colors',
        required: true
    },
    {
        title: '价格',
        value: 'price',
        required: true
    },
    {
        title: '一手件数',
        value: 'unitQuantity',
        required: true
    }
]

const productId = ref('')
let productDetailsData = ref<any>({
    productName: '',
    styleNumber: '',
    sizeName: '',
    colors: '',
    price: '',
    unitQuantity: '',
    productImagesList: []
})

onLoad((e: any) => {
    if (e.id) {
        productId.value = e.id
        getByIdFu()
    }
})

onShow(() => {
    const pages = getCurrentPages()
    const currentPage = pages[pages.length - 1]
    // @ts-ignore
    if (currentPage.$vm.refresh) {
        currentPage.$vm.refresh = false
        getByIdFu()
    }
})

const getByIdFu = () => {
    proxy.$Loading()
    getByIdApi({ id: productId.value }).then((res: any) => {
        const { code, data, msg, token } = res
        proxy.$CloseLoading();
        if (code == proxy.$successCode) {
            console.log(data, '0000');
            let colors = ''
            data.productColorsList.map((item: any) => {
                colors += item.colorName + '、'
            })
            data.colors = colors.substring(0, colors.length - 1)
            productDetailsData.value = data
        } else {
            proxy.$Toast({ title: msg })
        }
    }, (req => {
        proxy.$CloseLoading();
        proxy.$Toast({ title: req.msg })
    }))
}

/**
 * 预览图片
 */
const previewImageFu = (index: number) => {
    const fileList: Array<any> = []
    productDetailsData.value.productImagesList.map((item: any) => {
        fileList.push(item.imageUrlFull)
    })
    uni.previewImage({
        current: index,
        urls: fileList,
    })
}

const editProductFu = () => {
    uni.navigateTo({
        url: '/manufacturer/addProduct/index?id=' + productId.value
    })
}

</script>


<template>
    <view class="container flex_column">
        <view class="bg"></view>
        <com-header header-title="商品详情" :backColor="false" :titleColor="true"></com-header>
        <view class="main_con flex_1 flex_column">
            <view class="product_img_con flex_column">
                <view class="product_title">商品图片</view>
                <view class="img_list">
                    <template v-for="(item, index) in productDetailsData.productImagesList" :key="index">
                        <image class="img" :src="item.imageUrlFull" @click="previewImageFu(index)"></image>
                    </template>
                </view>
            </view>
            <view class="product_detail">
                <view class="product_detail_item flex_align flex_between" v-for="item, index in productDetails"
                    :key="index">
                    <view class="flex_align product_detail_item_title">{{ item.title }}</view>
                    <view class="flex_1  product_detail_item_value">
                        <view>{{ productDetailsData[item.value] }}</view>
                    </view>
                </view>
            </view>
        </view>
        <view class="footer_con"><button class="button_defalut" @click="editProductFu">商品编辑</button></view>
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