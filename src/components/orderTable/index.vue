<script lang="ts" setup>
import checkbox from "@/static/images/checkbox.png"
import checkbox_active from "@/static/images/checkbox_active.png"
import { handleInput, formatNumber, preciseMath } from "@/utils/utils"
import { useUserStore } from "@/store/modules/user"
import del_icon from "@/static/images/del_icon.png"


const emit = defineEmits(['deselectAllFu', 'orderDelFu'])

const preciseMathFu = preciseMath()
const useUser = useUserStore()

const props = defineProps({
    orderType: {
        type: String,  // show 展示   handleOrder 下单  handleRefund 退款 detail 详情  shareDetail 分享
        default: 'show'
    },
    productDetail: {
        type: Object,
        default: {}
    },
    selectAll: {
        type: Boolean,
        default: false
    },
    miniRole: {
        type: String,
        default: ''
    },
    deleteBtn: {
        type: Boolean,
        default: false
    },
    viewInventory: {
        type: Number,
        default: 0
    },
    goodsShelves: {
        type: String,
        default: ''
    }
})

const columns = reactive([
    {
        title: '颜色',
        key: 'colorName'
    },
    {
        title: '尺寸(库存)',
        key: 'sizeName'
    },
    {
        title: '数量(件)',
        key: 'unitQuantity'
    },
    {
        title: '待发货',
        key: 'handNum'
    }
])
const showTable = ref(true)
const selectTitle = computed(() => {
    return useUser.miniRole == 'manufacturer' ? '剩余全发' : '剩余全退'
})

const tableDetail = computed(() => {
    console.log(props.productDetail, 'props.productDetail');

    return props.productDetail
})

const totalAmount = computed(() => {
    let total = 0
    if (tableDetail.value && tableDetail.value.productColorsList?.length > 0) {
        for (let j = 0; j < tableDetail.value.productColorsList.length; j++) {
            total += tableDetail.value.price * tableDetail.value.productColorsList[j].handNum * tableDetail.value.unitQuantity
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

watch(() => props.selectAll, (newVal) => {
    try {
        selectItemFu(newVal)
    } catch (error) {

    }
}, { immediate: true })

watch(() => props.orderType, (newVal) => {
    if (['handleRefund', 'detail'].includes(props.orderType)) {
        columns[columns.length - 1].key = 'unsentHandNum'
        if (props.orderType == 'handleRefund') {
            columns.push({
                title: '操作',
                key: 'returnNum'
            })
        }
    }
}, { immediate: true })

watch(() => props.goodsShelves, (newVal) => {
    if (props.goodsShelves) {
        showTable.value = false
        columns[columns.length - 1].title = '库存'
        columns[columns.length - 1].key = 'stockNum'
    } else {
        showTable.value = true
    }
}, { immediate: true })


// 单个选择
const selectItem = ref(false)


const selectItemFu = (data: boolean) => {
    if (!data) {
        emit('deselectAllFu', data)
    }
    selectItem.value = data
    if (data) {
        tableDetail.value.productColorsList.forEach((item: { returnNum: any; unsentHandNum: any }) => {
            item.returnNum = item.unsentHandNum
        })
    }
}

/**
 * 输入框输入值
 * @param e 
 * @param item 
 * @param key 
 */
const inputValueFu = async (e: any, item: any, key: string) => {
    const value = e.target.value
    const result = await handleInput(value) as string;
    console.log(result, 'resultresultresult');
    if (result) {
        const num = parseInt(result, 10)
        // if (props.orderType == 'handleOrder' && num > item.stockNum) {
        //     item[key] = item.stockNum
        // } else if (props.orderType == 'handleRefund' && num > item.unsentHandNum) {
        //     item[key] = item.unsentHandNum
        // } else {
        item[key] = num
        // }
    } else {
        item[key] = 0
    }
}

/**
 * 减少数量
 */
const reduceFu = (item: any, key: string) => {
    if (item[key] == 0) {
        return
    } else {
        item[key] = item[key] - 1
    }
}

/**
 * 增加数量
 */
const addFu = (item: any, key: string) => {
    console.log(item, key, 'itemitemitem');
    // if (props.orderType == 'handleOrder' && item[key] == item.stockNum) {
    //     return
    // } else if (props.orderType == 'handleRefund' && item[key] == item.unsentHandNum) {
    //     return
    // } else {
    item[key] = item[key] + 1
    // }
}

const orderDelFu = () => {
    emit('orderDelFu', tableDetail.value.id)
}

const showTableFu = () => {
    showTable.value = !showTable.value
}


defineExpose({
    tableDetail
});
</script>


<template>
    <view class="order_table">
        <com-orderInfo :productDetail="tableDetail" :orderType="orderType" :goodsShelves="goodsShelves"
            :showTable="showTable"
            @showTableFu="showTableFu">
            <template #button>
                <template v-if="orderType == 'handleOrder' || orderType == 'shareDetail' ||  orderType == 'show'">
                    <button class="order_unit">1手/{{ tableDetail.unitQuantity }}件</button>
                    <view class="order_unit_price">¥{{ formatNumber(totalAmount) }}</view>
                </template>
                <!-- <template v-if="orderType == 'show'">
                    <view class="order_quantity">
                        <text>x</text>
                        <text>{{ totalNum }}</text>
                    </view>
                    <view class="order_unit_price">¥{{ formatNumber(totalAmount) }}</view>
                </template> -->
                <template v-if="orderType == 'handleRefund'">
                    <view class="flex_column flex_between">
                        <view class="flex_align order_refund_btn" @click="selectItemFu(!selectItem)">
                            <image class="checkbox"
                                :src="selectItem ? checkbox_active : checkbox"></image>
                            <text :class="[selectItem ? 'checkbox_active' : '']">{{ selectTitle }}</text>
                        </view>
                        <button class="order_unit">1手/{{ tableDetail.unitQuantity }}件</button>
                    </view>
                </template>
            </template>
            <template #del>
                <image v-if="deleteBtn" class="order_del_icon" :src="del_icon" @click="orderDelFu"></image>
            </template>
        </com-orderInfo>
        <view class="table_container" v-if="showTable">
            <!-- 表头 -->
            <view class="table_row table_header">
                <view
                    :class="['table_cell', (orderType == 'handleOrder' && col.key == 'handNum') || (orderType == 'handleRefund' && col.key == 'returnNum') ? 'table_cell_input' : '']"
                    v-for="(col, index) in columns" :key="index">
                    {{ col.title }}
                </view>
            </view>
            <!-- 表格数据 -->
            <view class="table_row" v-for="(row, rowIndex) in tableDetail.productColorsList" :key="rowIndex">
                <template v-for="(col, colIndex) in columns" :key="colIndex">
                    <view class="table_cell table_cell_input"
                        v-if="(orderType == 'handleOrder' && col.key == 'handNum') || (orderType == 'handleRefund' && col.key == 'returnNum')">
                        <view class="flex_align flex_center table_cell_input_con" :class="{ 'pointer': selectItem }">
                            <view class="table_cell_btn table_cell_btn_minus"
                                :class="{ table_cell_disabled: row[col.key] == 0 }" @click="reduceFu(row, col.key)">-
                            </view>
                            <input class="tabler_cell_input"
                                type="number"
                                @blur="(e: any) => inputValueFu(e, row, col.key)"
                                v-model="row[col.key]">
                            <view class="table_cell_btn table_cell_btn_plus"
                                :class="{ table_cell_disabled: props.orderType == 'handleRefund' && (row[col.key] == row.unsentHandNum) }"
                                @click="addFu(row, col.key)">+
                            </view>
                        </view>
                    </view>
                    <view class="table_cell"
                        v-else-if="col.key == 'sizeName' && (miniRole == 'manufacturer' || (miniRole == 'wholesaler' && viewInventory > 0))">
                        {{ tableDetail.sizeName }}({{ row.stockNum || 0 }})
                    </view>
                    <view class="table_cell" v-else-if="col.key == 'unitQuantity'">
                        {{ preciseMathFu.multiply(tableDetail.unitQuantity || 0, row.handNum || 0) }}
                    </view>
                    <view class="table_cell table_cell_color" v-else-if="goodsShelves && col.key == 'stockNum'">
                        {{ row[col.key] || 0 }}
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
    min-width: 124rpx;
    height: 48rpx;
    background: rgba(12, 104, 255, 0.03);
    border-radius: 12rpx;
    border: 1rpx solid #CDE1FF;
    font-weight: 400;
    font-size: 26rpx;
    color: #0C62FF;
    margin-bottom: 8px;
    line-height: 48rpx;
    box-sizing: border-box;
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
    margin-bottom: 30rpx;

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
            padding: 16rpx 0;
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
                    color: #0C62FF;
                }

                .table_cell_btn_minus {
                    border-right: 1rpx solid #E0E0E7;
                    background-clip: padding-box;
                }

                .table_cell_btn_plus {
                    border-left: 1rpx solid #E0E0E7;
                    background-clip: padding-box;
                }

                .table_cell_disabled {
                    pointer-events: none;
                    color: #C2C5CE;
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
            width: 200rpx !important;
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

.order_del_icon {
    width: 40rpx;
    height: 40rpx;
    margin-top: 20rpx;
}
</style>