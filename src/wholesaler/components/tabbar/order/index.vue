<script lang="ts" setup>
import orderItem from "../../orderItem/idnex.vue"
import { useUserStore } from '@/store/modules/user';

const useUser = useUserStore()
const { proxy } = getCurrentInstance() as any;

const stateList = [
    {
        title: '全部',
        key: 0,
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
const activeState = ref(0)


watch(() => tabBarIndex.value, (newVal) => {
    if (newVal == 1) {
        // useDataBoard.setConditionIndex(0)
        console.log('111111');

    }
})


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
    <view class="record_com flex_column">
        <view class="bg"></view>
        <com-header header-title="全部订单" :back="false" :titleColor="true"></com-header>
        <view class="order_state_list flex_align flex_center">
            <view :class="['order_state_item', activeState == item.key ? 'order_state_item_active' : '']"
                v-for="item in stateList" :key="item.key" @click="activeState = item.key">
                <view>{{ item.title }}</view>
            </view>
        </view>
        <view class="main_con flex_1">
            <scroll-view class="scroll_con " scroll-y="true"
                lower-threshold="50"
                @scrolltolower="scrolltolower">
                <view class="order_list flex_column">
                    <template v-for="item in 10" :key="item">
                        <orderItem></orderItem>
                    </template>
                </view>
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