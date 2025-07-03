/**
 * 全局提示文案
 * @param toastParams 
 */
export const toastFu = (toastParams: {
    title?: string,  // 提示的内容
    icon?: 'none' | 'success' | 'loading', // 图标
    image?: string, // 自定义图标的本地路径
    mask?: boolean,  // 是否显示透明蒙层
    duration?: number, // 提示的延迟时间
    successCB?: () => void,  // 成功的回调函数
    failCB?: () => void,  // 失败的回调函数
    completeCB?: () => void,   // 回调函数（调用成功、失败都会执行）
} = {}) => {
    const {
        title = '接口错误，请稍后...',
        icon = 'none',
        image = '',
        mask = true,
        duration = 2000,
        successCB = () => { },
        failCB = () => { },
        completeCB = () => { }
    } = toastParams;

    uni.showToast({
        title,
        icon,
        image,
        mask,
        duration,
        success: successCB,
        fail: failCB,
        complete: completeCB,
    });
};



/**
 * 全局加载中
 */
export const loadingFu = (toastParams: {
    title?: string,  // 提示的内容
    mask?: boolean,  // 是否显示透明蒙层
    successCB?: () => void,  // 成功的回调函数
    failCB?: () => void,  // 失败的回调函数
    completeCB?: () => void,   // 回调函数（调用成功、失败都会执行）
} = {}) => {
    const {
        title = '加载中...',
        mask = true,
        successCB = () => { },
        failCB = () => { },
        completeCB = () => { }
    } = toastParams;
    uni.showLoading({
        title,
        mask,
        success: successCB,
        fail: failCB,
        complete: completeCB,
    });
}

/**
 *  设置对象拼接
 */
export const splicingObjects = (obj: { [x: string]: any; }) => {
    const arr = []
    for (const k in obj) {
        if (obj[k] instanceof Array) {
            arr.push(`${k}=${obj[k].join(",")}`)
        } else {
            arr.push(`${k}=${obj[k]}`)
        }
    }
    return arr.join('&')
}

/**
 * 设置只能输入手机号
 */
export function phoneFu(data: any) {
    console.log(data, 'phoneFuphoneFuphoneFuphoneFu');

    if (data[0] != 1) {
        return ''
    }
    if (data.length == 1) {
        return data = data.replace(/[^1]/g, '');
    } else {
        return data = data.replace(/\D/g, '');
    }
}


/**
 * 校验输入框只能输入整数
 * @param value 
 * @returns 
 */
export const handleInput = (value: string): Promise<string | number> => {
    console.log(value, 'valuevaluevaluevalue');

    return new Promise<number | string>((resolve) => {
        let input;
        // 允许输入的格式：整数且不能为0
        const formattedInput = value.replace(/[^0-9]/g, ''); // 过滤非数字字符
        if (formattedInput === '0') {
            input = ''; // 如果输入是0，则清空
        } else {
            input = formattedInput;
        }
        resolve(input);
    });
}

// ---------------------------------数据验证
//常用正则
export const checkStr = (str: string, type = 0) => {
    let reg: any
    if (str) {
        switch (type) {
            case 0:
                // eslint-disable-next-line prefer-regex-literals
                reg = new RegExp(/^1\d{10}$/); //手机号码验证
                break;
            case 1:
                // eslint-disable-next-line prefer-regex-literals
                reg = new RegExp(/^[1-9]\d{5}$/); //邮政编码验证
                break;
            case 2:
                // eslint-disable-next-line prefer-regex-literals
                reg = new RegExp(/^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/); //匹配EMAIL
                break;
            case 3:
                // eslint-disable-next-line prefer-regex-literals
                reg = new RegExp(/(^\d{18}$)|(^\d{17}(\d|X|x)$)/); //匹配身份证
                break;
            case 4:
                // eslint-disable-next-line prefer-regex-literals
                reg = new RegExp(/^\d+$/); //是否为0-9的数字
                break;
            case 5:
                // eslint-disable-next-line prefer-regex-literals
                reg = new RegExp(/^[a-zA-Z\u0391-\uFFE5]*[\w\u0391-\uFFE5]*$/); //不能以数字或符号开头
                break;
            case 6:
                // eslint-disable-next-line prefer-regex-literals
                reg = new RegExp(/^\w+$/); //匹配由数字、26个英文字母或者下划线组成的字符串
                break;
            case 7:
                // eslint-disable-next-line prefer-regex-literals
                reg = new RegExp(/^[\u0391-\uFFE5]+$/); //匹配中文
                break;
            case 8:
                // eslint-disable-next-line prefer-regex-literals
                reg = new RegExp(/^[a-zA-Z\u0391-\uFFE5]+$/); //不能包含数字和符号
                break;
            case 9:
                // eslint-disable-next-line prefer-regex-literals
                reg = new RegExp(/^\d{6}$/); //6位验证码验证
                break;
            case 10:
                // eslint-disable-next-line prefer-regex-literals
                reg = new RegExp(/^\d{4}$/); //4位验证码验证
                break;
            case 11:
                // eslint-disable-next-line prefer-regex-literals
                reg = new RegExp(/^[HMhm]\d{8}$/); //港澳通行证
                break;
            case 12:
                // eslint-disable-next-line prefer-regex-literals
                reg = new RegExp(/((?=.*[0-9]))(^[A-Za-z0-9]{8}$)/); //台湾通行证 必须包含数字；字母数字 共8位
                break;
            case 13:
                // eslint-disable-next-line prefer-regex-literals
                reg = new RegExp(
                    /(^([a-zA-Z]+\s)*[a-zA-Z]+$)|(^[\u4e00-\u9fa5]+$)/); //JS 限制用户名只能中文、字母和数字 ， 不能包含特殊字符
                break;
            case 14:
                // eslint-disable-next-line prefer-regex-literals
                reg = new RegExp(/^[a-z0-9]+$/i); //只能是数字和字母
                break;
        } //end switch
        if (reg.test(str)) {
            return true;
        }
        return false;
    } else {
        return false;
    }
} //end func


/**
 * 加密手机号
 */
export function processPhoneNumber(phoneNumber: string) {
    if (!phoneNumber) {
        return phoneNumber
    }
    // 正则表达式匹配已处理的号码格式（如180****4250）
    const maskedPattern = /^\d{3}\*{4}\d{4}$/;

    // 如果号码已经是处理过的格式，则不做任何处理
    if (maskedPattern.test(phoneNumber)) {
        return phoneNumber;
    }

    // 如果号码未处理，则将中间四位数字替换为星号
    return phoneNumber.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
}


/**
 * area数据格式转换
*/
export function areasMap(arr: any[], value = 'districtName', id = 'districtId') {
    arr.forEach(item => {
        item.text = item[value]
        item.value = item[id]
        if (item.children && item.children.length) {
            areasMap(item.children, value, id)
        }
    })
    return arr
}

export function formatNumber(num: number | string): string {
    // 将输入转换为数字（如果是字符串）
    const parsedNum = typeof num === 'string' ? parseFloat(num) : num;
    // 将数字保留两位小数并四舍五入
    const formattedNum = parsedNum ? parsedNum.toFixed(2) : '0.00';
    return formattedNum;
}

/**
 * 使用正则表达式限制输入只能是两位小数
 * @param value 
 * @returns 
 */
export const validateInput = (value: string) => {
    // 1. 移除所有非数字和小数点的字符
    let filteredValue = value.replace(/[^0-9.]/g, '');

    // 2. 不能以 . 开头：如果以 . 开头，移除开头的 .
    if (filteredValue.startsWith('.')) {
        filteredValue = filteredValue.slice(1);
    }

    // 3. 限制只能有一个小数点，并保留第一个小数点
    filteredValue = filteredValue.replace(/(\..*?)\..*/g, '$1');

    // 4. 限制小数点后最多两位小数
    filteredValue = filteredValue.replace(/(\d*\.\d{2}).*/g, '$1');

    return filteredValue;
};

/**
 * 日期格式转换
*/
export const dateStrToDateFormat = (str: string, format = 'yyyy-mm-dd') => {
    if (!str) return ''
    console.log('dateStrToDateFormat');

    // 处理 iOS 日期兼容性
    let normalizedStr
    if (typeof str == 'string') {
        normalizedStr = str.replace(/-/g, '/'); // 将 '-' 替换为 '/'，确保 iOS 支持
    } else {
        normalizedStr = str
    }

    let isISO8601 = false;
    // 处理 ISO 8601 格式的日期字符串
    if (typeof normalizedStr == 'string' && normalizedStr.includes('T')) {
        isISO8601 = true;
        normalizedStr = normalizedStr.split('.')[0]; // 去掉毫秒部分
        normalizedStr = normalizedStr.replace('T', ' '); // 将 'T' 替换为 ' '
    }

    // 创建 Date 对象
    const date = new Date(normalizedStr);

    if (isISO8601) {
        date.setHours(date.getHours() + 8); // 仅调整 ISO 8601 格式的时间差
    }

    const year = date.getFullYear()
    let month = (date.getMonth() + 1) + ''
    let day = date.getDate() + ''
    let hours = date.getHours() + ''
    let minutes = date.getMinutes() + ''
    let seconds = date.getSeconds() + ''
    month = month.padStart(2, '0')
    day = day.padStart(2, '0')
    hours = hours.padStart(2, '0')
    minutes = minutes.padStart(2, '0')
    seconds = seconds.padStart(2, '0')
    if (format == 'yyyy-mm-dd') {
        return `${year}-${month}-${day}`
    } else if (format == "mm-dd hh-mm") {
        return `${month}-${day}  ${hours}:${minutes}`
    } else if (format == "yy年mm月dd日") {
        return `${year}年${month}月${day}日`
    } else if (format == 'yy mm dd') {
        return { year, month, day }
    } else if (format == 'yyyy.mm.dd') {
        return `${year}.${month}.${day}`
    } else if (format == 'start') {
        return `${year}-${month}-${day} 00:00:00`
    } else if (format == 'end') {
        return `${year}-${month}-${day} 23:59:59`
    } else if (format == '年-月-日') {
        return [`${year}年`, `${month}月${day}日`]
    } else {
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    }
}


// 获取当前时间跟前几天的事件
export function getCurrentDate(dayNum: number = 30) {
    // 获取当前日期
    const currentDate = new Date();
    const endYear = currentDate.getFullYear()
    const endMonth = currentDate.getMonth() + 1 < 10 ? '0' + (currentDate.getMonth() + 1) : currentDate.getMonth() + 1
    const endDay = currentDate.getDate() < 10 ? '0' + currentDate.getDate() : currentDate.getDate()
    // 设置日期为30天前
    currentDate.setDate(currentDate.getDate() - dayNum);
    // 获取30天前的年、月、日
    const startYear = currentDate.getFullYear();
    const startMonth = currentDate.getMonth() + 1 < 10 ? '0' + (currentDate.getMonth() + 1) : currentDate.getMonth() + 1
    const startDay = currentDate.getDate() < 10 ? '0' + currentDate.getDate() : currentDate.getDate()
    const endTime = `${endYear}/${endMonth}/${endDay}`
    const startTime = `${startYear}/${startMonth}/${startDay}`
    return { startTime, endTime, startYear, startMonth, startDay, endYear, endMonth, endDay }
}


// 定义一个精确处理浮点数的对象
export function preciseMath() {
    return {
        // 加法
        add(num1: any, num2: any) {
            const decimalPlaces = Math.max(preciseMath().countDecimals(num1), preciseMath().countDecimals(num2));
            const adjuster = Math.pow(10, decimalPlaces);
            return (preciseMath().adjust(num1, adjuster) + preciseMath().adjust(num2, adjuster)) / adjuster;
        },
        // 减法
        subtract(num1: any, num2: any) {
            const decimalPlaces = Math.max(preciseMath().countDecimals(num1), preciseMath().countDecimals(num2));
            const adjuster = Math.pow(10, decimalPlaces);
            return (preciseMath().adjust(num1, adjuster) - preciseMath().adjust(num2, adjuster)) / adjuster;
        },
        // 乘法
        multiply(num1: any, num2: any) {
            const totalDecimalPlaces = preciseMath().countDecimals(num1) + preciseMath().countDecimals(num2);
            const adjuster = Math.pow(10, totalDecimalPlaces);
            return (preciseMath().adjust(num1, adjuster) * preciseMath().adjust(num2, adjuster)) / (adjuster ** 2);
        },
        // 除法
        divide(num1: any, num2: any) {
            const num1DecimalPlaces = preciseMath().countDecimals(num1);
            const num2DecimalPlaces = preciseMath().countDecimals(num2);
            const adjuster = Math.pow(10, Math.max(num1DecimalPlaces, num2DecimalPlaces));
            return (preciseMath().adjust(num1, adjuster) / preciseMath().adjust(num2, adjuster));
        },
        // 辅助函数：计算数字的小数位数
        countDecimals(value: number) {
            if (Math.floor(value) === value) return 0;
            return value.toString().split(".")[1].length || 0;
        },
        // 辅助函数：调整数字到整数进行计算
        adjust(value: number, adjuster: number) {
            return Math.round(value * adjuster);
        }
    }
}


// 获取指定url中的所有参数
export function getParams(url: string) {
    const params: any = {};
    const urlArr = url.split('?');
    if (urlArr.length > 1) {
        const queryStr = urlArr[1];
        const queryArr = queryStr.split('&');
        queryArr.forEach(item => {
            const keyValueArr = item.split('=');
            if (keyValueArr.length > 1) {
                params[keyValueArr[0]] = keyValueArr[1];
            }
        });
    }
    return params;
}

// 深拷贝方法
export const deepCopy = (obj: any): any => {
    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }
    const newObj: Record<string, any> = Array.isArray(obj) ? [] : {}; // 指定 newObj 的类型
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            newObj[key] = deepCopy(obj[key]);
        }
    }
    return newObj;
}

/**
 * 获取当前时间的前后几天的日期
 * @param baseDateStr 
 * @returns 
 */
export const createDateShifter = (baseDateStr?: string) => {
    let current = baseDateStr ? new Date(baseDateStr) : new Date()

    const format = (date: Date) => {
        const y = date.getFullYear()
        const m = String(date.getMonth() + 1).padStart(2, '0')
        const d = String(date.getDate()).padStart(2, '0')
        return `${y}-${m}-${d}`
    }

    return {
        next() {
            current.setDate(current.getDate() + 1)
            return format(current)
        },
        prev() {
            current.setDate(current.getDate() - 1)
            return format(current)
        },
        reset() {
            current = new Date()
            return format(current)
        },
        get() {
            return format(current)
        }
    }
}


// 计算当前时间跟指定时间的差值
export const calculateTimeDifference = (time: string) => {
    const now = new Date()
    const target = new Date(time)
    const diff = target.getTime() - now.getTime()
    const day = Math.floor(diff / (24 * 3600 * 1000))
    const hour = Math.floor((diff % (24 * 3600 * 1000)) / (3600 * 1000))
    const minute = Math.floor((diff % (3600 * 1000)) / (60 * 1000))
    const second = Math.floor((diff % (60 * 1000)) / 1000)
    return { day, hour, minute, second }
}

// 判断两个时间大小
export const compareTime = (time1: string, time2: string) => {
    const time1Obj = new Date(time1)
    const time2Obj = new Date(time2)
    if (time1Obj.getTime() > time2Obj.getTime()) {
        return 1
    } else if (time1Obj.getTime() < time2Obj.getTime()) {
        return -1
    } else {
        return 0
    }
}

// 计算两个时间差多少天
export const calculateDaysDifference = (time1: string, time2: string) => {
    const time1Obj = new Date(time1)
    const time2Obj = new Date(time2)
    const diff = time1Obj.getTime() - time2Obj.getTime()
    const day = Math.floor(diff / (24 * 3600 * 1000))
    return day
}