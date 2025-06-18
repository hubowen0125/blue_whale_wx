<script lang="ts" setup>
import { addEmployeeApi } from '@/http/api/all';
import { checkStr } from '@/utils/utils';

let timer: any
const { proxy } = getCurrentInstance() as any;

interface Params {
    [key: string]: string; // 或者任何适合的类型
    userName: string;
    phone: string;
}

const inputList = [
    {
        label: '员工姓名',
        value: 'userName',
        type: 'input',
        placeholder: '请输入员工姓名',
        maxlength: 20,
        inputType: 'text',
    },
    {
        label: '员工手机',
        value: 'phone',
        type: 'input',
        placeholder: '请输入员工手机',
        inputType: 'text',
        maxlength: 11,
    },
    {
        label: '员工状态',
        value: '',
        type: 'switch',
        placeholder: '请输入详情地址',
        maxlength: 100,
        inputType: 'text',
    }
]
const params = reactive<Params>({
    userName: '',
    phone: ''
})

const formSubmit = () => {
    const { phone, userName } = params
    console.log('formSubmit', phone, userName);
    if (!userName) {
        proxy.$Toast({ title: '请输入员工姓名' });
        return
    }
    if (!checkStr(phone)) {
        proxy.$Toast({ title: '请输入正确手机号' });
        return
    }
    proxy.$Loading();
    addEmployeeApi(params).then((res: any) => {
        const { code, data, msg } = res
        proxy.$CloseLoading();
        if (code == proxy.$successCode) {
            proxy.$Toast({
                title: '创建成功',
                successCB: () => {
                    timer = setTimeout(() => {
                        uni.navigateBack()
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
    <view class="container container_defalut_bg flex_column">
        <com-header header-title="添加员工"></com-header>
        <view class="main_con flex_1">
            <form @submit="formSubmit">
                <view class="form_con flex_column">
                    <view class="form_item " v-for="item in inputList" :key="item.label">
                        <view class="form_label flex_align flex_between">
                            <view class="form_label_text">{{ item.label }}</view>
                            <switch v-if="item.type === 'switch'" color="#0C61FD" checked />
                        </view>
                        <view class="form_input flex_align" v-if="item.type === 'input'">
                            <input class="flex_1" :placeholder="item.placeholder" :maxlength="item.maxlength"
                                v-model.trim="params[item.value]" :type="item.inputType">
                        </view>
                    </view>
                    <button class="button_defalut" hover-class="pointer" hover-stay-time="2000"
                        form-type="submit">确认添加</button>
                </view>
            </form>
        </view>
    </view>
</template>


<style lang="scss" scoped>
.container {
    .main_con {
        padding: 30rpx;

        .form_con {
            background: #FFFFFF;
            box-shadow: 0rpx 4rpx 12rpx 0rpx #DDE8FC;
            border-radius: 24rpx;
            padding: 48rpx 28rpx 80rpx;
            gap: 40rpx;

            .form_item {

                .form_label {
                    font-weight: 500;
                    font-size: 28rpx;
                    color: #202020;

                    .form_label_text {
                        position: relative;

                        &::after {
                            content: '*';
                            position: absolute;
                            color: #E82E2E;
                            top: 0;
                            right: -16rpx;
                        }
                    }
                }

                .form_input {
                    padding: 0 32rpx;
                    height: 96rpx;
                    background: #F7F8FA;
                    border-radius: 12rpx;
                    margin-top: 20rpx;
                }
            }

            .button_defalut {
                width: 646rpx;
                margin-top: 20rpx;
            }
        }
    }
}
</style>
