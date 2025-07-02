<script lang="ts" setup>
import { myEmployeeApi, deleteEmployeeApi, updateEmployeeStatusApi } from "@/http/api/all";
import del_icon from "@/static/images/del_icon.png"


let timer: any
const { proxy } = getCurrentInstance() as any

const myEmployeeList = ref<any>([])


onShow(() => {
    myEmployeeFu()
})

const myEmployeeFu = () => {
    proxy.$Loading();
    myEmployeeApi().then((res: any) => {
        const { code, data, msg } = res
        proxy.$CloseLoading();
        if (code == proxy.$successCode) {
            console.log(data, '00000');
            myEmployeeList.value = data
        } else {
            proxy.$Toast({ title: msg })
        }
    }, (req => {
        proxy.$CloseLoading();
        proxy.$Toast({ title: req.msg })
    }))
}


// 添加员工
const addEmployeeFu = () => {
    console.log('addEmployeeFu');
    uni.navigateTo({
        url: '/pages/addEmployee/index'
    });
}

/**
 * 删除员工
 * @param userId 
 */
const deleteEmployeeFu = (userId: string) => {
    proxy.$Loading();
    deleteEmployeeApi({ userId }).then((res: any) => {
        proxy.$CloseLoading();
        const { code, data, msg } = res
        if (code == proxy.$successCode) {
            proxy.$Toast({
                title: '删除成功',
                successCB: () => {
                    timer = setTimeout(() => {
                        myEmployeeFu()
                    }, 1500);
                }
            })
        } else {
            proxy.$Toast({ title: msg })
        }
    }, (req => {
        proxy.$CloseLoading();
        proxy.$Toast({ title: req.msg })
    }))
}

/**
 * 修改员工状态
 * @param userId 
 * @param status 
 */
const updateEmployeeStatusFu = (userId: string, item: any) => {
    console.log(userId, item, 'updateEmployeeStatusFu');
    const { status } = item
    proxy.$Loading();
    updateEmployeeStatusApi({ userId }).then((res: any) => {
        proxy.$CloseLoading();
        const { code, data, msg } = res
        if (code == proxy.$successCode) {
            proxy.$Toast({
                title: '修改成功',
                successCB: () => {
                    timer = setTimeout(() => {
                        myEmployeeFu()
                    }, 1500);
                }
            })
        } else {
            proxy.$Toast({ title: msg })
        }
    }, (req => {
        proxy.$CloseLoading();
        proxy.$Toast({ title: req.msg })
    }))
}

/**
 * 滑动加载
 */
const scrolltolower = () => {
    // if (!slideLoading.value) return
    console.log('++++++++');
    // manageDevicesParams.value.page += 1
    // resetManageDevicesParams()
}


/**
 * 页面
 */
onUnmounted(() => {
    // 清除定时器
    if (timer) {
        clearTimeout(timer);
        timer = null;
    }
})
</script>


<template>
    <view class="container flex_column">
        <com-header header-title="我的员工"></com-header>
        <view class="flex_1 main_con">
            <scroll-view class="scroll_con " scroll-y="true"
                lower-threshold="50"
                @scrolltolower="scrolltolower">
                <view class="employee_con">
                    <view class="employee_list" v-if="myEmployeeList.length > 0">
                        <view class="employee_item flex_align" v-for="item in myEmployeeList" :key="item.userId">
                            <view class="flex_1">
                                <view class="employee_item_name">{{ item.nickName }}</view>
                                <view>{{ item.phonenumber }}</view>
                            </view>
                            <switch color="#0C61FD" :checked="item.status != 1" @change="(e) => updateEmployeeStatusFu(item.userId, e)" />
                            <view class="flex_align" @click="deleteEmployeeFu(item.userId)">
                                <image class="del_icon" :src="del_icon"></image>
                                <text>删除</text>
                            </view>
                        </view>
                    </view>
                    <com-no_data v-else noDataText="暂无员工"></com-no_data>
                </view>
            </scroll-view>
        </view>
        <view class="footer_con">
            <button class="button_defalut" @click="addEmployeeFu">添加员工</button>
        </view>
    </view>
</template>


<style lang="scss" scoped>
.container {
    background: #F2F1F5;

    .main_con {
        overflow: hidden;
        margin: 24rpx 0;

        .employee_con {
            padding: 24rpx;

            .employee_list {
                border-radius: 24rpx;
                background: #FFFFFF;
                padding: 0 28rpx;

                .employee_item {
                    padding: 32rpx 0;
                    border-bottom: 1rpx solid #EFEFEF;
                    font-weight: 400;
                    font-size: 28rpx;
                    color: #7C8191;
                    gap: 20rpx;

                    .employee_item_name {
                        font-weight: 500;
                        font-size: 28rpx;
                        color: #202020;
                        margin-bottom: 12rpx;
                    }

                    .del_icon {
                        width: 28rpx;
                        height: 28rpx;
                        margin-right: 4rpx;
                    }
                }
            }
        }

    }
}
</style>