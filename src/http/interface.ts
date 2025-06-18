import { useUserStore } from "@/store/modules/user";
console.log(process.env, 'processprocessprocess');
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

let baseUrl = process.env.VITE_APP_API; // 小程序环境 API
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
                'authorization': token,
                'source': 'wechat'
            },
            dataType: 'json',
            timeout: 20000
        }).then(async (response: any) => {
            const code = response.data.code
            if (code == '401') {
                if (!useUser.jump401) {
                    useUser.setJump401Fu(true)
                    uni.hideLoading()
                    uni.navigateTo({
                        url: `/pages/login/index?code=${code}`
                    })
                }
                return
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
