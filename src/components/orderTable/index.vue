<script lang="ts" setup>
import checkbox from "@/static/images/checkbox.png"
import checkbox_active from "@/static/images/checkbox_active.png"
import { handleInput, formatNumber } from "@/utils/utils"


const props = defineProps({
    orderType: {
        type: String,  // show 展示   handleOrder 下单  handleRefund 退款
        default: 'show'
    },
    productDetail: {
        type: Object,
        default: {}
    }
})

const columns = [
    {
        title: '颜色',
        key: 'colorName'
    },
    {
        title: '尺码',
        key: 'sizeName'
    },
    {
        title: '数量',
        key: 'unitQuantity'
    },
    {
        title: '待发货',
        key: 'handNum'
    }
]

const tableDetail = computed(() => {
    return props.productDetail
})

const totalAmount = computed(() => {
    let total = 0
    if (tableDetail.value && tableDetail.value.productColorsList?.length > 0) {
        for (let j = 0; j < tableDetail.value.productColorsList.length; j++) {
            total += tableDetail.value.price * tableDetail.value.productColorsList[j].handNum
        }
    }
    return total
})

const totalNum = computed(() => {
    let total = 0
    const list = tableDetail.value.productColorsList
    if (list.length > 0) {
        for (let j = 0; j < list.length; j++) {
            total += list[j].handNum
        }
    }
    return total
})

// 单个选择
const selectItem = ref(false)


const selectItemFu = () => {
    selectItem.value = !selectItem.value
}

/**
 * 输入框输入值
 * @param e 
 * @param item 
 * @param key 
 */
const inputValueFu = async (e: any, item: any,) => {
    const value = e.target.value
    const result = await handleInput(value) as string;
    console.log(result, 'resultresultresult');
    if (result) {
        item.handNum = parseInt(result, 10)
    } else {
        item.handNum = 1
    }
}

/**
 * 减少数量
 */
const reduceFu = (item: any) => {
    if (item.handNum == 1) {
        return
    } else {
        item.handNum = item.handNum - 1
    }
}

/**
 * 增加数量
 */
const addFu = (item: any) => {
    if (item.handNum == item.stockNum) {
        return
    } else {
        item.handNum = item.handNum + 1
    }
}



defineExpose({
    tableDetail
});
</script>


<template>
    <view class="order_table">
        <com-orderInfo :productDetail="tableDetail">
            <template #button>
                <template v-if="orderType == 'handleOrder'">
                    <view class="order_unit">1手/{{ tableDetail.unitQuantity }}件</view>
                    <view class="order_unit_price">¥{{ formatNumber(totalAmount) }}</view>
                </template>
                <template v-if="orderType == 'show'">
                    <view class="order_quantity">
                        <text>x</text>
                        <text>{{ totalNum }}</text>
                    </view>
                </template>
                <template v-if="orderType == 'handleRefund'">
                    <view class="flex_align order_refund_btn" @click="selectItemFu">
                        <image class="checkbox"
                            :src="selectItem ? checkbox_active : checkbox"></image>
                        <text :class="[selectItem ? 'checkbox_active' : '']">剩余全退</text>
                    </view>
                </template>
            </template>
        </com-orderInfo>
        <view class="table_container">
            <!-- 表头 -->
            <view class="table_row table_header">
                <view
                    :class="['table_cell', orderType == 'handleOrder' && col.key == 'handNum' ? 'table_cell_input' : '']"
                    v-for="(col, index) in columns" :key="index">
                    {{ col.title }}
                </view>
            </view>
            <!-- 表格数据 -->
            <view class="table_row" v-for="(row, rowIndex) in tableDetail.productColorsList" :key="rowIndex">
                <template v-for="(col, colIndex) in columns" :key="colIndex">
                    <view class="table_cell table_cell_input" v-if="orderType == 'handleOrder' && col.key == 'handNum'">
                        <view class="flex_align flex_center table_cell_input_con">
                            <view class="table_cell_btn table_cell_btn_minus" @click="reduceFu(row)">-</view>
                            <input class="tabler_cell_input"
                                type="number"
                                @input="(e: any) => inputValueFu(e, row)"
                                :value="row.handNum">
                            <view class="table_cell_btn table_cell_btn_plus" @click="addFu(row)">+</view>
                        </view>
                    </view>
                    <view :class="['table_cell', orderType == 'show' && col.key == 'handNum' ? 'table_cell_color' : '']"
                        v-else>{{
                            ['sizeName', 'unitQuantity'].includes(col.key) ? tableDetail[col.key] :
                                row[col.key] }}</view>
                </template>
            </view>
        </view>
    </view>
</template>


<style lang="scss" scoped>
.order_unit {
    padding: 12rpx 16rpx;
    background: rgba(12, 104, 255, 0.03);
    border-radius: 12rpx;
    border: 1rpx solid #CDE1FF;
    font-weight: 400;
    font-size: 26rpx;
    color: #0C62FF;
    margin-bottom: 8px;
}

.order_unit_price {
    font-weight: 500;
    font-size: 28rpx;
    color: #F73030;
}

.order_quantity {
    padding: 8rpx 14rpx;
    font-weight: 500;
    font-size: 26rpx;
    color: #0C62FF;
    background: rgba(12, 104, 255, 0.03);
    border-radius: 12rpx;
    border: 1rpx solid #CDE1FF;
}

.order_refund_btn {
    gap: 12rpx;
    font-weight: 500;
    font-size: 26rpx;
    color: #202020;

    .checkbox_active {
        color: #0C62FF;
    }

    .checkbox {
        width: 30rpx;
        height: 30rpx;
    }
}

.table_container {
    width: 100%;
    margin-top: 36rpx;

    .table_row {
        display: flex;
        border-bottom: 1rpx solid #eee;
        align-items: center;
        font-weight: 400;
        font-size: 24rpx;
        color: #202020;

        .table_cell {
            padding: 16rpx;
            text-align: center;
            box-sizing: border-box;
            flex: 1;

            .table_cell_input_con {
                position: relative;
                overflow: hidden;

                &::after {
                    content: '';
                    width: 100%;
                    height: 100%;
                    border: 1rpx solid #E0E0E7;
                    position: absolute;
                    top: 0;
                    left: 0;
                    border-radius: 12rpx;
                    z-index: 10;
                    pointer-events: none;
                    box-sizing: border-box;
                }

                .table_cell_btn {
                    width: 60rpx;
                    height: 60rpx;
                    background: #FFFFFF;
                    line-height: 60rpx;
                }

                .table_cell_btn_minus {
                    border-right: 1rpx solid #E0E0E7;
                }

                .table_cell_btn_plus {
                    border-left: 1rpx solid #E0E0E7;
                }

                .tabler_cell_input {
                    padding: 0rpx 10rpx;
                    box-sizing: border-box;
                    width: 76rpx;
                    height: 100%;
                }
            }
        }

        .table_cell_color {
            color: #FF840C;
        }

        .table_cell_input {
            width: 228rpx !important;
            flex: none;
        }
    }

    .table_header {
        background: #F7F7FB;
        border: 1rpx solid #EFEFF4;
        font-weight: 500;
        font-size: 24rpx;
        color: #202020;
    }

}
</style>