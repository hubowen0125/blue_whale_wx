<script lang="ts" setup>
import upload_icon from "@/static/images/upload_icon.png"
import arrow_bottom from "@/static/images/arrow_bottom.png"


const productDetail = [
    {
        title: '商品名称',
        value: '',
        type: 'input',
        required: false,
        placeholder: '请输入商品名称'
    },
    {
        title: '商品款号',
        value: '',
        type: 'input',
        required: true,
        placeholder: '请输入商品款号'
    },
    {
        title: '尺码',
        value: '',
        type: 'select',
        required: false,
        placeholder: '请选择尺码'
    },
    {
        title: '颜色',
        value: '',
        type: 'select',
        required: true,
        placeholder: '请选择颜色'
    },
    {
        title: '价格',
        value: '',
        type: 'input',
        required: true,
        placeholder: '请输入价格'
    },
    {
        title: '一手件数',
        value: '',
        type: 'select',
        required: false,
        placeholder: '请选择一手件数'
    },
    {
        title: '季节',
        value: '',
        type: 'input',
        required: false,
        placeholder: '请输入季节'
    },
    {
        title: '库存',
        value: '',
        type: 'input',
        required: false,
        placeholder: '请输入库存'
    },
]



/**
 * 添加参数
 * @param item 
 */
const addParamFu = (item: any) => {
    console.log(item, 'addParamFu');
    uni.navigateTo({
        url: '/manufacturer/addParameters/index?title=' + item.title + '&type=' + item.type + '&required=' + item.required + '&placeholder=' + item.placeholder
    })
}

/**
 * form提交
 * @param e 
 */
const formSubmit = (e: any) => {
}

</script>


<template>
    <view class="container flex_column">
        <com-header header-title="添加商品"></com-header>
        <view class="main_con flex_1">
            <view class="form_con">
                <form @submit="formSubmit">
                    <view class="form_item">
                        <view class="form_label">上传图片</view>
                        <view class="form_desc">最多可上传9张图片</view>
                        <view class="upload_img_con">
                            <image class="upload_icon" :src="upload_icon"></image>
                            <image class="upload_icon" :src="upload_icon"></image>
                            <image class="upload_icon" :src="upload_icon"></image>
                            <image class="upload_icon" :src="upload_icon"></image>
                        </view>
                    </view>
                    <view class="form_item" v-for="item in productDetail" :key="item.title">
                        <view class="form_label">{{ item.title }} <text class="form_required"
                                v-if="item.required">*</text> </view>
                        <view class="form_input_con flex_align" @click="item.type === 'select' && addParamFu(item)">
                            <input class="flex_1" type="text" :placeholder="item.placeholder"
                                :disabled="item.type === 'select'">
                            <image v-if="item.type === 'select'" class="arrow_bottom" :src="arrow_bottom"></image>
                        </view>
                    </view>
                    <button class="button_defalut" form-type="submit">立即添加</button>
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