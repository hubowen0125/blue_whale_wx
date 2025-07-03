import request from '../interface';
import { splicingObjects } from '@/utils/utils';

/**
 * 获取短信验证码
 * @param params
 * @returnsF
 */
export function getSmsCodeApi(params: any) {
    return new Promise((resolve, reject) => {
        resolve(
            request({
                url: `api/getSmsCode`,
                method: "GET",
                params
            })
        )
    })
}

/**
 * 验证短信
 * @param params
 * @returnsF
 */
export function verifySmsApi(params: any) {
    return new Promise((resolve, reject) => {
        resolve(
            request({
                url: `api/verifySms`,
                method: "GET",
                params
            })
        )
    })
}

/**
 * 退出登录
 * @param params
 * @returnsF
 */
export function logoutApi(params: any) {
    return new Promise((resolve, reject) => {
        resolve(
            request({
                url: `api/logout`,
                method: "GET",
                params
            })
        )
    })
}




/**
 * 获取用户信息
 * @param params
 * @returnsF
 */
export function getUserInfoApi() {
    return new Promise((resolve, reject) => {
        resolve(
            request({
                url: `api/getUserInfo`,
                method: "GET",
            })
        )
    })
}

/**
 * 我的-我的信息
 * @param params
 * @returnsF
 */
export function getInfoApi() {
    return new Promise((resolve, reject) => {
        resolve(
            request({
                url: `api/user/info`,
                method: "GET",
            })
        )
    })
}

/**
 * 更新用户角色
 * @param params
 * @returnsF
 */
export function updateUserRoleApi(params: any) {
    return new Promise((resolve, reject) => {
        resolve(
            request({
                url: `api/user/updateUserRole`,
                method: "GET",
                params
            })
        )
    })
}

/**
 * 我的-我的员工
 * @param params
 * @returnsF
 */
export function myEmployeeApi() {
    return new Promise((resolve, reject) => {
        resolve(
            request({
                url: `api/user/myEmployee`,
                method: "GET",
            })
        )
    })
}

/**
 * 添加员工
 * @param params
 * @returnsF
 */
export function addEmployeeApi(params: any) {
    return new Promise((resolve, reject) => {
        resolve(
            request({
                url: `api/user/addEmployee`,
                method: "GET",
                params
            })
        )
    })
}

/**
 * 删除员工
 * @param params
 * @returnsF
 */
export function deleteEmployeeApi(params: any) {
    return new Promise((resolve, reject) => {
        resolve(
            request({
                url: `api/user/deleteEmployee`,
                method: "GET",
                params
            })
        )
    })
}

/**
 * 更改员工状态
 * @param params
 * @returnsF
 */
export function updateEmployeeStatusApi(params: any) {
    return new Promise((resolve, reject) => {
        resolve(
            request({
                url: `api/user/updateEmployeeStatus`,
                method: "GET",
                params
            })
        )
    })
}

/**
 * 获取取得预签名链接
 * @param params
 * @returnsF
 */
export function getSignedUriApi(data: any) {
    return new Promise((resolve, reject) => {
        resolve(
            request({
                url: `api/oss/getSignedUri`,
                method: "POST",
                data
            })
        )
    })
}

/**
 * 查询地区信息
 * @param params
 * @returnsF
 */
export function sysRegionListApi() {
    return new Promise((resolve, reject) => {
        resolve(
            request({
                url: `api/system/SysRegion/list`,
                method: "GET",
            })
        )
    })
}

/**
 * 订货卡 接口
 * @param data
 * @returnsF
 */
export function createOrderApi(data: any) {
    return new Promise((resolve, reject) => {
        resolve(
            request({
                url: `api/business/card/createOrder`,
                method: "POST",
                data
            })
        )
    })
}

/**
 * 新增订货卡
 * @param data
 * @returnsF
 */
export function createAddApi(data: any) {
    return new Promise((resolve, reject) => {
        resolve(
            request({
                url: `api/business/card/add`,
                method: "POST",
                data
            })
        )
    })
}

/**
 * 分享链接打开查询订单
 * @param params
 * @returnsF
 */
export function selectByShareApi(params: any) {
    return new Promise((resolve, reject) => {
        resolve(
            request({
                url: `api/business/card/selectByShare`,
                method: "GET",
                params
            })
        )
    })
}

/**
 * 添加订货卡商品
 * @param data
 * @returnsF
 */
export function addProductApi(data: any) {
    return new Promise((resolve, reject) => {
        resolve(
            request({
                url: `api/business/card/addProduct`,
                method: "POST",
                data
            })
        )
    })
}

/**
 * 获取订货卡详细信息
 * @param params
 * @returnsF
 */
export function getByCardNoApi(params: any) {
    return new Promise((resolve, reject) => {
        resolve(
            request({
                url: `api/business/card/getByCardNo`,
                method: "GET",
                params
            })
        )
    })
}

/**
 * 修改订货卡
 * @param data
 * @returnsF
 */
export function editCardApi(data: any) {
    return new Promise((resolve, reject) => {
        resolve(
            request({
                url: `api/business/card/editCard`,
                method: "POST",
                data
            })
        )
    })
}

/**
 * 查询打包站或批发商
 * @param params
 * @returnsF
 */
export function packagingWholesalePageApi(data: any) {
    return new Promise((resolve, reject) => {
        resolve(
            request({
                url: `api/business/packagingWholesale/page`,
                method: "POST",
                data
            })
        )
    })
}

/**
 * 编辑信息
 * @param data
 * @returnsF
 */
export function manufacturerEditApi(data: any) {
    return new Promise((resolve, reject) => {
        resolve(
            request({
                url: `api/business/manufacturer/edit`,
                method: "POST",
                data
            })
        )
    })
}

/**
 * 编辑信息
 * @param params
 * @returnsF
 */
export function wholesaleEditApi(data: any) {
    return new Promise((resolve, reject) => {
        resolve(
            request({
                url: `api/business/wholesale/edit`,
                method: "POST",
                data
            })
        )
    })
}

/**
 * 编辑信息
 * @param params
 * @returnsF
 */
export function packagingEditApi(data: any) {
    return new Promise((resolve, reject) => {
        resolve(
            request({
                url: `api/business/packaging/edit`,
                method: "POST",
                data
            })
        )
    })
}