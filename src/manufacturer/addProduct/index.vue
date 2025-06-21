<script lang="ts" setup>
import { getByIdApi, productsAddApi, productsEditApi } from "../http/manufacturer"
import upload_icon from "@/static/images/upload_icon.png"
import arrow_bottom from "@/static/images/arrow_bottom.png"
import { getSignedUriFu } from "@/utils/upload"

let timer: any
const { proxy } = getCurrentInstance() as any

const productDetail = [
    {
        title: '商品名称',
        value: 'productName',
        type: 'input',
        inputType: 'text',
        required: true,
        placeholder: '请输入商品名称'
    },
    {
        title: '商品款号',
        value: 'styleNumber',
        type: 'input',
        inputType: 'text',
        required: false,
        placeholder: '请输入商品款号'
    },
    {
        title: '尺码',
        value: 'sizeName',
        type: 'select',
        inputType: 'text',
        required: true,
        placeholder: '请选择尺码',
        selectType: 'size'
    },
    {
        title: '颜色',
        value: '',
        type: 'select',
        inputType: 'text',
        required: true,
        placeholder: '请选择颜色',
        selectType: 'color'
    },
    {
        title: '价格',
        value: 'price',
        type: 'input',
        inputType: 'number',
        required: true,
        placeholder: '请输入价格'
    },
    {
        title: '一手件数',
        value: 'unitQuantity',
        type: 'input',
        inputType: 'number',
        required: true,
        placeholder: '请选择一手件数'
    },
    {
        title: '季节',
        value: 'season',
        type: 'input',
        inputType: 'text',
        required: false,
        placeholder: '请输入季节'
    },
    {
        title: '库存',
        value: '',
        type: 'select',
        inputType: 'number',
        required: false,
        placeholder: '请输入库存'
    },
]
const fileList = ref<any>([])
let orderParams = ref<any>({
    productImagesBoList: [
        {
            imageUrl: 'https://minio-dev.local-test.sxkemao.com/tv-bucket/tv/materiel/img/体验馆/dfadf4b40f91448cac16ab7b454164b5_1739409271391.png?x-oss-process=image/resize,m_pad,w_236,h_160',
        }
    ],
    productName: '',
    styleNumber: '',
    sizeName: '',
    productColorsList: [],
    price: "",
    unitQuantity: '',
    season: ''
})
const productId = ref('')
const headerTitle = ref('添加商品')
const submitBtnText = ref('立即添加')

onLoad((e: any) => {
    if (e.id) {
        productId.value = e.id
        headerTitle.value = '修改商品'
        submitBtnText.value = '立即修改'
        getByIdFu()
    }
})

onShow(() => {
    const pages = getCurrentPages()
    const currentPage = pages[pages.length - 1]
    // @ts-ignore
    if (currentPage.$vm.sizeActive) {
        console.log(currentPage.$vm.sizeActive, '00000selectActiveList');
        orderParams.value.sizeName = currentPage.$vm.sizeActive.size
    }
    if (currentPage.$vm.colorsActive) {
        console.log(currentPage.$vm.colorsActive, 'colorActive');
        currentPage.$vm.colorsActive.map((item: any) => {
            orderParams.value.productColorsList.push({
                colorName: item.color,
                stockNum: 0,
                id: item.id
            })
        })
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
            orderParams.value = data
        } else {
            proxy.$Toast({ title: msg })
        }
    }, (req => {
        proxy.$CloseLoading();
        proxy.$Toast({ title: req.msg })
    }))
}


/** 
 * 上传图片
 * @param detail 
 */
const uploadFu = async () => {
    uni.chooseImage({
        count: 1, //默认9
        sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
        success: function (res) {
            fileList.value = [...fileList.value, ...res.tempFilePaths]
            proxy.$Loading();
            const { tempFilePaths } = res as any
            tempFilePaths.map(async (item: any) => {
                const imgUrl = await getSignedUriFu('DEVICE_STOCK', { tempFilePath: item })
                // orderParams.value.finishPicPath = imgUrl
                proxy.$CloseLoading();
            })
        }
    });
}


/**
 * 添加参数
 * @param item 
 */
const addParamFu = (item: any) => {
    console.log(item, 'addParamFu');
    uni.navigateTo({
        url: `/manufacturer/addParameters/index?type=${item.selectType}`
    })
}

/**
 * form提交
 * @param e 
 */
const formSubmit = (e: any) => {
    const { productName, sizeName, productColorsList, price, unitQuantity } = orderParams.value
    if (!productName) {
        proxy.$Toast({ title: '请填写商品名称' })
        return
    }
    if (!sizeName) {
        proxy.$Toast({ title: '请选择尺码' })
        return
    }
    if (!productColorsList.length) {
        proxy.$Toast({ title: '请选择颜色' })
        return
    }
    if (!price) {
        proxy.$Toast({ title: '请填写价格' })
        return
    }
    if (!unitQuantity) {
        proxy.$Toast({ title: '请填写一手件数' })
        return
    }
    proxy.$Loading();
    if (productId.value) {
        editProductFu()
    } else {
        addProductFu()
    }
}

/**
 * 新增
 */
const addProductFu = () => {
    productsAddApi(orderParams.value).then((res: any) => {
        const { code, data, msg, token } = res
        proxy.$CloseLoading();
        if (code == proxy.$successCode) {
            console.log(data, '0000');
            setPrevParams()
        } else {
            proxy.$Toast({ title: msg })
        }
    }, (req => {
        proxy.$CloseLoading();
        proxy.$Toast({ title: req.msg })
    }))
}

/**
 * 修改
 */
const editProductFu = () => {
    productsEditApi(orderParams.value).then((res: any) => {
        const { code, data, msg, token } = res
        proxy.$CloseLoading();
        if (code == proxy.$successCode) {
            console.log(data, '0000');
            setPrevParams()
        } else {
            proxy.$Toast({ title: msg })
        }
    }, (req => {
        proxy.$CloseLoading();
        proxy.$Toast({ title: req.msg })
    }))
}

/**
 * 设置上一页参数
 */
const setPrevParams = () => {
    const pages = getCurrentPages()
    const prevPage = pages[pages.length - 2] // 上一个页面
    prevPage.$vm.loading = true
    proxy.$Toast({
        title: productId.value ? '商品修改成功' : '商品添加成功',
        successCB: () => {
            timer = setTimeout(() => {
                uni.navigateBack()
            }, 1500);
        }
    })
}

</script>


<template>
    <view class="container flex_column">
        <com-header :header-title="headerTitle"></com-header>
        <view class="main_con flex_1">
            <view class="form_con">
                <form @submit="formSubmit">
                    <view class="form_item">
                        <view class="form_label">上传图片</view>
                        <view class="form_desc">最多可上传9张图片</view>
                        <view class="upload_img_con">
                            <image class="upload_icon" :src="upload_icon"></image>
                            <image v-if="fileList.length < 1" class="upload_icon" :src="upload_icon" @click="uploadFu"
                                mode="aspectFill"></image>
                        </view>
                    </view>
                    <view class="form_item" v-for="item in productDetail" :key="item.title">
                        <view class="form_label">{{ item.title }} <text class="form_required"
                                v-if="item.required">*</text> </view>
                        <view class="form_input_con flex_align" @click="item.type === 'select' && addParamFu(item)">
                            <input class="flex_1" :type="item.inputType" :placeholder="item.placeholder"
                                v-model.trim="orderParams[item.value]"
                                :disabled="item.type === 'select'">
                            <image v-if="item.type === 'select'" class="arrow_bottom" :src="arrow_bottom"></image>
                        </view>
                    </view>
                    <button class="button_defalut" form-type="submit">{{ submitBtnText }}</button>
                </form>
            </view>
        </view>
    </view>
</template>


<style lang="scss" scoped>
.container {
    background: linear-gradient(180deg, #E2ECFF 0%, #FFFFFF 100%);

    .main_con {
        padding: 30rpx 20rpx;
        overflow-x: hidden;
        overflow-y: auto;

        .form_con {
            padding: 40rpx 20rpx 60rpx;
            background: #FFFFFF;
            box-shadow: 0rpx 4rpx 12rpx 0rpx #DDE8FC;
            border-radius: 24rpx;

            .form_item {
                font-weight: 500;
                font-size: 28rpx;
                color: #202020;
                margin-bottom: 40rpx;

                .form_label {
                    margin-bottom: 20rpx;

                    .form_required {
                        color: #E82E2E;
                    }
                }

                .form_desc {
                    font-weight: 400;
                    font-size: 24rpx;
                    color: #7C8191;
                    margin-bottom: 24rpx;
                }

                .upload_img_con {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 20rpx;

                    .upload_icon {
                        width: 184rpx;
                        height: 184rpx;
                    }
                }

                .form_input_con {
                    height: 96rpx;
                    background: #F7F8FA;
                    border-radius: 12rpx;
                    padding: 0 32rpx;

                    .arrow_bottom {
                        width: 28rpx;
                        height: 28rpx;
                    }
                }
            }

            .button_defalut {
                width: 646rpx;
                margin: auto;
            }
        }
    }
}
</style>