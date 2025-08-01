import request from '../../http/interface';
import { splicingObjects } from '@/utils/utils';

/**
 * 分页查询商品信息
 * 没有厂家id调这个
 * @param params
 * @returnsF
 */
export function wholesaleListApi(data: any, params: any) {
    return new Promise((resolve, reject) => {
        resolve(
            request({
                url: `api/business/products/wholesaleList?${splicingObjects(params)}`,
                method: "POST",
                data
            })
        )
    })
}

/**
 * 查询商品信息
 * 有厂家ID调这个
 * @param params
 * @returnsF
 */
export function productListApi(data: any,) {
    return new Promise((resolve, reject) => {
        resolve(
            request({
                url: `api/business/products/productList`,
                method: "POST",
                data
            })
        )
    })
}

/**
 * 分页查询商品信息(批发商)(厂家列表)
 * @param params
 * @returnsF
 */
export function wholesaleListByManufacturerIdApi(data: any, params: any) {
    return new Promise((resolve, reject) => {
        resolve(
            request({
                url: `api/business/products/wholesaleListByManufacturerId?${splicingObjects(params)}`,
                method: "POST",
                data
            })
        )
    })
}

/**
 * 未发货退单
 * @param params
 * @returnsF
 */
export function businessOrderApi(data: any) {
    return new Promise((resolve, reject) => {
        resolve(
            request({
                url: `api/business/order/returnOrder`,
                method: "POST",
                data
            })
        )
    })
}

/**
 * 获取订单统计信息
 * @param params
 * @returnsF
 */
export function getWholesaleOrderStatisticsApi() {
    return new Promise((resolve, reject) => {
        resolve(
            request({
                url: `api/business/wholesale/getWholesaleOrderStatistics`,
                method: "GET",
            })
        )
    })
}

/**
 * 分页查询入库记录(批发商)
 * @param params
 * @returnsF
 */
export function wholesalePageApi(data: any, params: any) {
    return new Promise((resolve, reject) => {
        resolve(
            request({
                url: `api/business/storageInput/wholesalePage?${splicingObjects(params)}`,
                method: "POST",
                data
            })
        )
    })
}



