<script lang="ts" setup>
import { getSmsCodeApi, verifySmsApi, getUserInfoApi, servicePhoneApi, renewalFeeApi } from '@/http/api/all';
import { checkStr } from '@/utils/utils';
import checkbox from "@/static/images/checkbox.png"
import checkbox_active from "@/static/images/checkbox_active.png"
import { useUserStore } from '@/store/modules/user';

const useUser = useUserStore()
const { proxy } = getCurrentInstance() as any;

let timer: any
const loginParams = reactive({
    phone: '',
    code: ''
})
const pointerBtn = ref(false)
const codeBtn = ref('获取验证码')
const checked = ref(false)
const type = ref('') // 订货卡类型
const cardNo = ref('')
const typeId = ref('')


onLoad((e: any) => {
    if (e && e.code) {
        proxy.$CloseLoading();
        useUser.resetState()
        useUser.setJump401Fu(false)
    }
    if (e.type) {
        type.value = e.type
        cardNo.value = e.cardNo
        typeId.value = e.typeId
    }
})

onShow(() => {
    if (useUser.jump401) {
        useUser.setJump401Fu(false)
    }
})

/**
 * 获取验证吗
 * @param judge 判断当前是否需要图形验证 
 */
const setTimeFu = () => {
    pointerBtn.value = true
    const { phone } = loginParams
    if (!checkStr(phone)) {
        proxy.$Toast({ title: '请输入正确手机号' });
        pointerBtn.value = false;
        return;
    }
    proxy.$Loading();
    getSmsCodeApi({ phone }).then((res: any) => {
        proxy.$CloseLoading();
        const { code, msg } = res
        if (code == proxy.$successCode) {
            let countDown = 60
            codeBtn.value = countDown + 's后重新获取'
            timer = setInterval(() => {
                countDown--
                codeBtn.value = countDown + 's后重新获取'
                if (countDown == 0) {
                    codeBtn.value = '获取验证码'
                    pointerBtn.value = false
                    clearInterval(timer)
                }
            }, 1000)
        } else {
            pointerBtn.value = false;
            proxy.$Toast({ title: msg })
        }
    }, (req => {
        pointerBtn.value = false;
        proxy.$CloseLoading();
        proxy.$Toast({ title: req.msg })
    }))

}


const formSubmit = (e: any) => {
    const { phone, code } = loginParams
    if (!checkStr(phone)) {
        proxy.$Toast({ title: '请输入正确手机号' });
        return
    }
    if (code.length < 6) {
        proxy.$Toast({ title: '请输入正确验证码' });
        return
    }
    if (!checked.value) {
        proxy.$Toast({ title: '请先同意用户协议' })
        return
    }
    proxy.$Loading();
    verifySmsApi(loginParams).then(async (res: any) => {
        const { code, data, msg, token } = res
        if (code == proxy.$successCode) {
            useUser.setTokenFu(token)
            getUserInfoFu()
        } else {
            proxy.$CloseLoading();
            proxy.$Toast({ title: msg })
        }
    }, (req => {
        proxy.$CloseLoading();
        proxy.$Toast({ title: req.msg })
    }))
}

/**
 * 服务电话
 */
const servicePhoneFu = async () => {
    await servicePhoneApi().then((res: any) => {
        const { code, data, msg } = res
        if (code == proxy.$successCode) {
            useUser.setservicePhoneFu(data)
        } else {
            proxy.$Toast({ title: msg })
        }
    }, (req => {
        proxy.$Toast({ title: req.msg })
    }))
}

/**
 * 续费
 */
const renewalFeeFu = async (miniRole: string) => {
    await renewalFeeApi({ type: miniRole }).then((res: any) => {
        const { code, data, msg } = res
        if (code == proxy.$successCode) {
            useUser.setRenewalFeeFu(data)
        } else {
            proxy.$Toast({ title: msg })
        }
    }, (req => {
        proxy.$Toast({ title: req.msg })
    }))
}

const getUserInfoFu = () => {
    getUserInfoApi().then(async (res: any) => {
        const { code, data, msg } = res
        proxy.$CloseLoading();
        if (code == proxy.$successCode) {
            useUser.setUserInfoFu(data.sysUser)
            useUser.setMiniRoleFu(data.miniRole)
            await servicePhoneFu()
            await renewalFeeFu(data.miniRole)
            if (data.miniRole == 'guest') {
                uni.redirectTo({
                    url: '/pages/chooseIdentity/index'
                })
            } else {
                if (type.value) {
                    if (type.value == 'manufacturer') {
                        if (useUser.miniRole == 'wholesale') {
                            uni.redirectTo({
                                url: '/wholesaler/home/index?popup=true'
                            })
                        } else {
                            if (!typeId.value) {
                                uni.redirectTo({
                                    url: `/manufacturer/shareOrderCard/index?type=${type.value}&cardNo=${cardNo.value}`
                                })
                            } else if (typeId.value == useUser.userInfo.deptId) {
                                uni.redirectTo({
                                    url: `/manufacturer/shareOrderCard/index?type=${type.value}&cardNo=${cardNo.value}`
                                })
                            } else {
                                uni.redirectTo({
                                    url: '/manufacturer/home/index?popup=true'
                                })
                            }
                        }
                    }
                    if (type.value == 'wholesale') {
                        uni.redirectTo({
                            url: `/wholesaler/shareOrderCard/index?type=${type.value}&cardNo=${cardNo.value}`
                        })
                    }
                } else {
                    if (data.miniRole == 'manufacturer') {
                        uni.redirectTo({
                            url: '/manufacturer/home/index'
                        })
                    }
                    if (data.miniRole == 'wholesale') {
                        uni.redirectTo({
                            url: '/wholesaler/home/index'
                        })
                    }
                    if (data.miniRole == 'packaging') {
                        uni.redirectTo({
                            url: '/packagingStation/home/index'
                        })
                    }
                }
            }
        } else {
            proxy.$Toast({ title: msg })
        }
    }, (req => {
        proxy.$Toast({ title: req.msg })
    }))
}

/**
 * 查看协议
 */
const viewProtocolFu = (key: any) => {
    uni.navigateTo({
        url: `/pages/agreement/index?type=${key}`
    })
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
    <view class="container container_defalut_bg flex_floumn">
        <view class="login_title">欢迎登录/注册</view>
        <view class="login_desc">欢迎来到聚衣仓平台</view>
        <form @submit="formSubmit">
            <view class="input_con flex_align">
                <view class="input_area_code">+86</view>
                <input class="input flex_1" type="number" placeholder="请输入手机号" ref="phoneValue" maxlength="11"
                    name="phone"
                    v-model.trim="loginParams.phone">
            </view>
            <view class="input_con flex_align">
                <input class="input flex_1" placeholder="请输入验证码" maxlength="6" name="smsCode" type="number"
                    v-model.trim="loginParams.code">
                <button class="code_btn" @click="setTimeFu" hover-class="pointer"
                    hover-stay-time="2000" :disabled="pointerBtn">
                    {{ codeBtn }}
                </button>
            </view>
            <view class="protocol_con flex_align">
                <view class="checkbox_con" @click="checked = !checked">
                    <image class="checked_icon" slot="icon"
                        :src="checked ? checkbox_active : checkbox" />
                </view>
                <span>
                    我已阅读并同意<span class="protocol_btn" @click="viewProtocolFu('userAgreement')">《用户手册》</span>和<span
                        class="protocol_btn" @click="viewProtocolFu('privacyAgreement')">《隐私政策》</span>
                </span>
            </view>
            <button class="button_defalut" hover-class="pointer" hover-stay-time="2000" form-type="submit">
                登录
            </button>
        </form>
    </view>
</template>


<style lang="scss" scoped>
.container {
    padding: 72rpx;
    box-sizing: border-box;

    .login_title {
        font-weight: bold;
        font-size: 52rpx;
        color: #202020;
        margin-top: 100rpx;
    }

    .login_desc {
        font-weight: 400;
        font-size: 28rpx;
        color: #3F4561;
        margin-top: 24rpx;
        margin-bottom: 100rpx;
    }

    .input_con {
        padding: 0 40rpx;
        background: #FFFFFF;
        border-radius: 48rpx;
        box-sizing: border-box;
        height: 96rpx;
        margin-bottom: 40rpx;

        .input_area_code {
            font-weight: 500;
            font-size: 28rpx;
            color: #202020;
            padding-right: 48rpx;
            position: relative;

            &::after {
                content: "";
                width: 2rpx;
                height: 22rpx;
                background: #9299BA;
                position: absolute;
                left: 80%;
                top: 50%;
                transform: translate(-50%, -50%);
            }
        }

        .input {
            font-size: 28rpx;
            color: #111E36;
            height: 100%;
        }

        .code_btn {
            border: none;
            font-weight: 400;
            font-size: 28rpx;
            color: #0C62FF;
            font-style: normal;
            background-color: transparent;
        }
    }

    .protocol_con {
        margin-top: 40rpx;
        height: 28rpx;
        align-items: center;
        font-weight: 400;
        font-size: 24rpx;
        color: #202020;

        :deep(.van-checkbox) {
            width: 30rpx;
            height: 30rpx;
            margin-right: 18rpx;
        }

        :deep(.van-checkbox__icon-wrap) {
            line-height: 1;
        }

        .checkbox_con {
            width: 28rpx;
            height: 28rpx;
            position: relative;
            margin-right: 14rpx;

            &::after {
                content: "";
                position: absolute;
                width: 100rpx;
                height: 80rpx;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
            }

            .checked_icon {
                width: 28rpx;
                height: 28rpx;
            }
        }

        .protocol_btn {
            color: #2C64C1;
        }
    }

    .button_defalut {
        margin-top: 120rpx;
        width: 606rpx;
    }
}
</style>