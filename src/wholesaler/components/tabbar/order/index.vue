<script lang="ts" setup>
import { getOrderPageApi } from "@/http/api/order";
import orderItem from "../../orderItem/idnex.vue"
import { useUserStore } from '@/store/modules/user';

const useUser = useUserStore()
const { proxy } = getCurrentInstance() as any;

const stateList = [
    {
        title: '全部',
        key: '',
    },
    {
        title: '未发货',
        key: 1,
    },
    {
        title: '部分发货',
        key: 2,
    },
    {
        title: '待付款',
        key: 3,
    },
    {
        title: '异常订单',
        key: 4,
    },
]

const tabBarIndex = inject("tabBarIndex") as Ref<number>
const activeState = ref<string | number>('')
const isLoad = ref(false) // 是否加载
const slideLoading = ref(true) // 是否需要滑动加载
const paramsPage = reactive({
    pageNum: 1,
    pageSize: 10,
})
const orderList = ref<any[]>([])


watch(() => tabBarIndex.value, (newVal) => {
    if (newVal == 1 && !isLoad.value) {
        isLoad.value = true
        getOrderPageFu()
    }
})

/**
 * 获取订单列表
 */
const getOrderPageFu = () => {
    proxy.$Loading()
    getOrderPageApi({ status: activeState.value }, paramsPage).then((res: any) => {
        const { code, data, msg, token } = res
        proxy.$CloseLoading();
        if (code == proxy.$successCode) {
            console.log(data, '0000');
            if (data.datas && data.datas.length > 0) {
                orderList.value = [...orderList.value, ...data.datas]
                if (data.datas.length < paramsPage.pageSize) {
                    slideLoading.value = false
                }
            } else {
                slideLoading.value = false
            }
        } else {
            proxy.$Toast({ title: msg })
        }
    }, (req => {
        proxy.$CloseLoading();
        proxy.$Toast({ title: req.msg })
    }))
}

/**
 * 选择状态
 * @param key 
 */
const selectStateFu = (key: string | number) => {
    activeState.value = key
    paramsPage.pageNum = 1
    orderList.value = []
    slideLoading.value = true
    getOrderPageFu()
}


/**
 * 滑动加载
 */
const scrolltolower = () => {
    if (!slideLoading.value) return
    console.log('++++++++');
    paramsPage.pageNum += 1
    getOrderPageFu()
    // resetManageDevicesParams()
}
</script>


<template>
    <view class="record_com flex_column">
        <view class="bg"></view>
        <com-header header-title="全部订单" :back="false" :titleColor="true"></com-header>
        <view class="order_state_list flex_align flex_center">
            <view :class="['order_state_item', activeState == item.key ? 'order_state_item_active' : '']"
                v-for="item in stateList" :key="item.key" @click="selectStateFu(item.key)">
                <view>{{ item.title }}</view>
            </view>
        </view>
        <view class="main_con flex_1">
            <scroll-view class="scroll_con " scroll-y="true"
                lower-threshold="50"
                @scrolltolower="scrolltolower">
                <view class="order_list flex_column" v-if="orderList.length > 0">
                    <template v-for="item in orderList" :key="item.id">
                        <orderItem :orderData="item"></orderItem>
                    </template>
                </view>
                <com-no_data v-else :noDataText="'暂无订单'"></com-no_data>
            </scroll-view>
        </view>
    </view>
</template>


<style lang="scss" scoped>
.record_com {
    width: 100%;
    height: 100%;
    background: #F2F1F5;

    .bg {
        width: 750rpx;
        height: 282rpx;
        background: linear-gradient(136deg, #0D5DFF 0%, #00AAFF 100%);
        transform: scaleY(-1);
        position: fixed;
        left: 0;
        top: 0;
    }

    .order_state_list {
        grid-gap: 20rpx;
        margin-top: 30rpx;
        position: relative;
        gap: 60rpx;

        .order_state_item {
            font-weight: 400;
            font-size: 28rpx;
            color: #D3EAFF;
            padding: 14rpx 0;
            text-align: center;
        }

        .order_state_item_active {
            font-weight: 500;
            font-size: 28rpx;
            color: #FFFFFF;
            position: relative;

            &::after {
                content: '';
                position: absolute;
                width: 32rpx;
                height: 4rpx;
                background: #FFFFFF;
                border-radius: 2rpx;
                bottom: 0;
                left: 50%;
                transform: translateX(-50%);
            }
        }
    }

    .main_con {
        overflow: hidden;
        margin-top: 24rpx;
        margin-top: 50rpx;

        .order_list {
            padding: 0 30rpx 30rpx;
            gap: 20rpx;
        }
    }
}
</style>