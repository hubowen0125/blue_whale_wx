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
 * 获取订单列表
 * @param params
 * @returnsF
 */
export function orderPageApi(data: any) {
    return new Promise((resolve, reject) => {
        resolve(
            request({
                url: `api/business/order/page?${splicingObjects(data)}`,
                method: "POST",
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

