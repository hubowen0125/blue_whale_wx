import configDefault from "@/common/js/config.default"
import { useUserStore } from "@/store/modules/user";
console.log(process.env.UNI_PLATFORM, 'processprocessprocess');
const envVariable = process.env.UNI_PLATFORM
let envVersion
switch (envVariable) {
    case 'h5':
        envVersion = process.env.NODE_ENV == "development" ? 'develop' : 'prod';
        break;
    case 'mp-weixin':
        const accountInfo = uni.getAccountInfoSync();
        envVersion = accountInfo.miniProgram.envVersion;
        break;
    default:
        break;
}

let baseUrl = ''
if (envVersion == 'develop') {
    baseUrl = configDefault.dev.interfaceApi
} else {
    baseUrl = configDefault.prod.interfaceApi
}
console.log(configDefault, envVersion, 'config');
const request = (requestData: any) => {
    return new Promise((resolve, reject) => {
        // 定义一个符合要求的变量/常量
        const useUser = useUserStore()
        const token = useUser.token
        uni.request({
            method: requestData.method,
            url: baseUrl + requestData.url,
            data: requestData.method == 'GET' ? requestData.params : requestData.data,
            header: {
                'content-type': 'application/json',
                'token': token
            },
            dataType: 'json',
            timeout: 20000
        }).then(async (response: any) => {
            const code = response.data.code
            if (code == 'F000001') {
                uni.hideLoading()
                // uni.navigateTo({
                //     url: `/pages/login/index?code=${code}`
                // })
            } else {
                resolve(response.data)
            }
        }).catch((error) => {
            if (error.errMsg.includes('timeout')) {   // 判断请求异常信息中是否含有超时timeout字符串
                error.msg = '请求超时，请稍后再试'
            }
            reject(error)
        })
    });
}

export default request
