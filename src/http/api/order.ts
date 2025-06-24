import request from '../interface';
import { splicingObjects } from '@/utils/utils';


/**
 * 获取订单详细信息
 * @param data
 * @returnsF
 */
export function createOrderApi(data: any) {
    return new Promise((resolve, reject) => {
        resolve(
            request({
                url: `api/business/order/createOrder`,
                method: "POST",
                data
            })
        )
    })
}

/**
 * 获取订单详细信息
 * @param params
 * @returnsF
 */
export function getByOrderNoApi(params: any) {
    return new Promise((resolve, reject) => {
        resolve(
            request({
                url: `api/business/order/getByOrderNo`,
                method: "GET",
                params
            })
        )
    })
}

/**
 * 作废订单
 * @param params
 * @returnsF
 */
export function delByOrderNoApi(params: any) {
    return new Promise((resolve, reject) => {
        resolve(
            request({
                url: `api/business/order/delByOrderNo`,
                method: "GET",
                params
            })
        )
    })
}

/**
 * 分页查询订单
 * @param params
 * @returnsF
 */
export function getOrderPageApi(data: any, params: any) {
    return new Promise((resolve, reject) => {
        resolve(
            request({
                url: `api/business/order/page?${splicingObjects(params)}`,
                method: "POST",
                data
            })
        )
    })
}

/**
 * 查询订单发货记录
 * @param params
 * @returnsF
 */
export function orderShipRecordListApi(params: any) {
    return new Promise((resolve, reject) => {
        resolve(
            request({
                url: `api/business/orderShipRecord/list`,
                method: "GET",
                params
            })
        )
    })
}

/**
 * 查询订单支付记录
 * @param params
 * @returnsF
 */
export function orderPaymentRecordListApi(params: any) {
    return new Promise((resolve, reject) => {
        resolve(
            request({
                url: `api/business/orderPaymentRecord/list`,
                method: "GET",
                params
            })
        )
    })
}

/**
 * 查询订单操作记录
 * @param params
 * @returnsF
 */
export function orderOperationRecordListApi(params: any) {
    return new Promise((resolve, reject) => {
        resolve(
            request({
                url: `api/business/orderOperationRecord/list`,
                method: "GET",
                params
            })
        )
    })
}

/**
 * 新增订单发货记录
 * @param data
 * @returnsF
 */
export function orderShipRecordShipApi(data: any) {
    return new Promise((resolve, reject) => {
        resolve(
            request({
                url: `api/business/orderShipRecord/ship`,
                method: "POST",
                data
            })
        )
    })
}

/**
 * 查询收款方式
 * @returnsF
 */
export function paymentTypeApi() {
    return new Promise((resolve, reject) => {
        resolve(
            request({
                url: `api/business/orderPaymentRecord/paymentType`,
                method: "GET",
            })
        )
    })
}

/**
 * 收款
 * @returnsF
 */
export function paymentApi(data: any) {
    return new Promise((resolve, reject) => {
        resolve(
            request({
                url: `api/business/orderPaymentRecord/payment`,
                method: "POST",
                data
            })
        )
    })
}

/**
 * 查询收款信息
 * @returnsF
 */
export function getPaymentInfoApi(params: any) {
    return new Promise((resolve, reject) => {
        resolve(
            request({
                url: `api/business/orderPaymentRecord/getPaymentInfo`,
                method: "GET",
                params
            })
        )
    })
}


