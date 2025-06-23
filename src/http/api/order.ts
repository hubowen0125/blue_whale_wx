import request from '../interface';
import { splicingObjects } from '@/utils/utils';



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

