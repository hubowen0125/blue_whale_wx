<script lang="ts" setup>
import { handleInput } from "@/utils/utils";
import { getSizesListApi, sizeAddApi, getColorsListApi, colorsAddApi } from "../http/manufacturer"


const { proxy } = getCurrentInstance() as any;

const popupDataList = [
    {
        popupTitle: '添加尺寸',
        pupupType: 'input',
        cancelText: '取消',
        confirmText: '确认',
        placeholder: '请输入新尺寸',
        callBack: true,
    },
    {
        popupTitle: '添加颜色',
        pupupType: 'input',
        cancelText: '取消',
        confirmText: '确认',
        placeholder: '请输入新颜色',
        callBack: true,
    }
]

const popupData = ref()


const popupCom = ref()
const headerTitle = ref('选择尺码')
const addButtonText = ref('')
const sizeList = ref<any>([])
const sizeActive = ref<any>()
const type = ref('')
const colorsList = ref<any>([])
const colorsActive = ref<any>([])
const productColorsList = ref<any>([])


onLoad((e: any) => {
    if (e.type) {
        type.value = e.type
        if (e.type == 'size') {
            headerTitle.value = '选择尺码'
            addButtonText.value = '添加尺寸'
            popupData.value = popupDataList[0]
            getSizesListFu()
            const eventChannel = proxy.getOpenerEventChannel();
            if (eventChannel) {
                eventChannel.on('activeSizeList', (data: any) => {
                    sizeActive.value = data
                });
            }
        }
        if (e.type == 'color') {
            getColorsListFu()
            addButtonText.value = '添加颜色'
            headerTitle.value = '选择颜色'
            popupData.value = popupDataList[1]
            const eventChannel = proxy.getOpenerEventChannel();
            if (eventChannel) {
                eventChannel.on('activeColorList', (data: any) => {
                    colorsActive.value = data
                });
            }
        }
        if (e.type == 'inventory') {
            headerTitle.value = '库存'
            const eventChannel = proxy.getOpenerEventChannel();
            if (eventChannel) {
                eventChannel.on('productColorsList', (data: any) => {
                    console.log(data, 'productColorsList');
                    productColorsList.value = data
                });
            }
        }
    }
})

/**
 * 获取尺寸列表
 */
const getSizesListFu = () => {
    proxy.$Loading()
    getSizesListApi({}).then((res: any) => {
        const { code, data, msg, token } = res
        proxy.$CloseLoading();
        if (code == proxy.$successCode) {
            if (data.datas && data.datas.length > 0) {
                sizeList.value = data.datas
            }
            console.log(data, '0000');
        } else {
            proxy.$Toast({ title: msg })
        }
    }, (req => {
        proxy.$CloseLoading();
        proxy.$Toast({ title: req.msg })
    }))
}

/**
 * 获取颜色列表
 */
const getColorsListFu = () => {
    proxy.$Loading()
    getColorsListApi({}).then((res: any) => {
        const { code, data, msg, token } = res
        proxy.$CloseLoading();
        if (code == proxy.$successCode) {
            if (data.datas && data.datas.length > 0) {
                colorsList.value = data.datas
            }
            console.log(data, '0000');
        } else {
            proxy.$Toast({ title: msg })
        }
    }, (req => {
        proxy.$CloseLoading();
        proxy.$Toast({ title: req.msg })
    }))
}

/**
 * 选择数据
 * @param item 
 */
const selectSizeFu = (item: any) => {
    sizeActive.value = item
    console.log(sizeActive.value, 'asdsdasdsad');
}

/**
 * 选择颜色
 * @param item 
 */
const selectColorsFu = (item: any) => {
    const index = colorsActive.value.findIndex((color: any) => color.color == item.color)
    if (index > -1) {
        colorsActive.value.splice(index, 1)
    } else {
        colorsActive.value.push(item)
    }
    console.log(colorsActive.value, 'asdasdasd');

}

/**
 * 设置颜色样式
 * @param item 
 */
const setColorClassFu = (item: any) => {
    const index = colorsActive.value.findIndex((color: any) => color.color == item.color)
    if (index > -1) {
        return true
    } else {
        return false
    }
}

/**
 * 添加参数
 */
const addParamsFu = () => {
    popupCom.value.showPopup()
}

/**
 * 确认选择
 */
const confirmPopupFu = (inputValue: string) => {
    if (type.value == 'size') {
        addSizeFu(inputValue)
    }
    if (type.value == 'color') {
        addColorFu(inputValue)
    }
}

/**
 * 新增尺寸
 * @param size 
 */
const addSizeFu = (size: string) => {
    console.log('addSizeFu', size);
    proxy.$Loading()
    sizeAddApi({ size }).then((res: any) => {
        const { code, data, msg, token } = res
        proxy.$CloseLoading();
        if (code == proxy.$successCode) {
            proxy.$Toast({ title: '添加成功' })
            getSizesListFu()
        } else {
            proxy.$Toast({ title: msg })
        }
    }, (req => {
        proxy.$CloseLoading();
        proxy.$Toast({ title: req.msg })
    }))
}

/**
 * 新增颜色
 * @param color 
 */
const addColorFu = (color: string) => {
    proxy.$Loading()
    colorsAddApi({ color }).then((res: any) => {
        proxy.$CloseLoading();
        const { code, data, msg, token } = res
        if (code == proxy.$successCode) {
            proxy.$Toast({ title: '添加成功' })
            getColorsListFu()
        } else {
            proxy.$Toast({ title: msg })
        }
    }, (req => {
        proxy.$CloseLoading();
        proxy.$Toast({ title: req.msg })
    }))
}

/**
 * 选择数据
 */
const selectDataFu = () => {
    if (!sizeActive.value?.id && type.value == 'size') {
        proxy.$Toast({ title: '请先选择尺码' })
        return
    }
    if (colorsActive.value.length == 0 && type.value == 'color') {
        proxy.$Toast({ title: '请先选择尺码' })
        return
    }
    const pages = getCurrentPages() // 获取当前页面栈
    const prevPage = pages[pages.length - 2] // 上一个页面
    // 向 A 页面设置数据（data 中的某个属性）
    // @ts-ignore
    if (type.value == 'size') {
        prevPage.$vm.sizeActive = sizeActive.value
    }
    if (type.value == 'color') {
        prevPage.$vm.colorsActive = colorsActive.value
    }
    if (type.value == 'inventory') {
        prevPage.$vm.productColorsList = productColorsList.value
    }
    uni.navigateBack() // 返回上一页
}



/**
 * 输入框输入值
 * @param e 
 * @param item 
 * @param key 
 */
const inputValueFu = async (e: any, index: any) => {
    const value = e.target.value
    const result = await handleInput(value) as string;
    if (result) {
        const num = parseInt(result, 10)
        productColorsList.value[index].stockNum = num * 1
    } else {
        productColorsList.value[index].stockNum = 0
    }
}
</script>


<template>
    <view class="container flex_column">
        <com-header :header-title="headerTitle"></com-header>
        <view class="main_con flex_1">
            <view class="parameter_container">
                <view class="parameter_container_title">{{ type == 'inventory' ? '请输入库存' : headerTitle }}</view>
                <view :class="[type == 'inventory' ? 'flex_column inventory_list' : 'parameter_list']"
                    v-if="sizeList.length > 0 || colorsList.length > 0 || productColorsList.length > 0">
                    <template v-if="type == 'size'">
                        <button v-for="item in sizeList" :key="item.id" class="parameter_item"
                            :class="{ 'parameter_item_active': sizeActive?.id == item.id }"
                            @click="selectSizeFu(item)">{{ item.size }}</button>
                    </template>
                    <template v-if="type == 'color'">
                        <button v-for="item in colorsList" :key="item.id" class="parameter_item"
                            :class="{ 'parameter_item_active': setColorClassFu(item) }"
                            @click="selectColorsFu(item)">{{ item.color }}</button>
                    </template>
                    <template v-if="type == 'inventory'">
                        <template v-for="(item, index) in productColorsList" :key="index">
                            <view class="inventory_item">
                                <view class="inventory_item_title">{{ item.colorName }}</view>
                                <input class="inventory_item_input" type="number"
                                    :placeholder="`请输入${item.colorName}库存`"
                                    v-model.trim="item.stockNum" @blur="(e: any) => inputValueFu(e, index)">
                            </view>
                        </template>
                    </template>
                </view>
                <com-no_data v-else noDataText="暂无数据"></com-no_data>
            </view>
        </view>
        <view class="footer_con flex">
            <button v-if="addButtonText" class="add_btn" @click="addParamsFu">{{ addButtonText }}</button>
            <button class="flex_1 button_defalut" @click="selectDataFu">确认</button>
        </view>
    </view>
    <com-popup_com ref="popupCom" :popupData="{ ...popupData }" @confirmPopupFu="confirmPopupFu"></com-popup_com>
</template>


<style lang="scss" scoped>
.container{
    overflow: hidden;
}
.main_con {
    overflow-x: hidden;
    overflow-y: auto;
    padding: 32rpx 24rpx;

    .parameter_container {
        background: #FFFFFF;
        border-radius: 24rpx;
        padding: 36rpx 28rpx;
        min-height: 832rpx;
        position: relative;

        .parameter_container_title {
            font-weight: bold;
            font-size: 32rpx;
            color: #202020;
        }

        .parameter_list {
            margin-top: 28rpx;
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 20rpx;

            .parameter_item {
                height: 64rpx;
                background: #F7F8FA;
                border: 1rpx solid #F7F8FA;
                border-radius: 16rpx;
                font-weight: 500;
                font-size: 26rpx;
                color: #202020;
                line-height: 64rpx;
                box-sizing: border-box;
            }

            .parameter_item_active {
                background: rgba(12, 104, 255, 0.03);
                border: 1rpx solid #CDE1FF;
                color: #0C62FF;
            }
        }

        .inventory_list {
            gap: 40rpx;
            margin-top: 60rpx;

            .inventory_item_title {
                font-weight: 500;
                font-size: 28rpx;
                color: #202020;
                margin-bottom: 20rpx;
            }

            .inventory_item_input {
                width: 646rpx;
                height: 96rpx;
                background: #F7F8FA;
                border-radius: 12rpx;
                padding: 0 32rpx;
                box-sizing: border-box;
            }
        }
    }
}

.footer_con {
    gap: 20rpx;

    .add_btn {
        width: 212rpx;
        height: 96rpx;
        background: rgba(12, 104, 255, 0.05);
        border-radius: 48rpx;
        border: 1rpx solid #8CBAFF;
        font-weight: 500;
        font-size: 30rpx;
        color: #0C62FF;
        line-height: 96rpx;
    }
}
</style>