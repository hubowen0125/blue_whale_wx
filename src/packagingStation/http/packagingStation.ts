import request from '../../http/interface';
import { splicingObjects } from '@/utils/utils';

/**
 * 我的批发商
 * @param params
 * @returnsF
 */
export function myWholesaleApi(params: any) {
    return new Promise((resolve, reject) => {
        resolve(
            request({
                url: `api/business/packaging/myWholesale`,
                method: "GET",
                params
            })
        )
    })
}

/**
 * 批发商详情
 * @param params
 * @returnsF
 */
export function wholesaleDetailApi(params: any) {
    return new Promise((resolve, reject) => {
        resolve(
            request({
                url: `api/business/packaging/wholesaleDetail`,
                method: "GET",
                params
            })
        )
    })
}

/**
 * 批发商统计信息
 * @param params
 * @returnsF
 */
export function wholesaleStatisticApi() {
    return new Promise((resolve, reject) => {
        resolve(
            request({
                url: `api/business/packaging/wholesaleStatistic`,
                method: "GET",
            })
        )
    })
}

/**
 * 入库
 * @param params
 * @returnsF
 */
export function stockInApi(data: any) {
    return new Promise((resolve, reject) => {
        resolve(
            request({
                url: `api/business/storageInput/stockIn`,
                method: "POST",
                data
            })
        )
    })
}

/**
 * 分页查询入库记录
 * @param params
 * @returnsF
 */
export function storageInputPageApi(data: any, params: any) {
    return new Promise((resolve, reject) => {
        resolve(
            request({
                url: `api/business/storageInput/page?${splicingObjects(params)}`,
                method: "POST",
                data
            })
        )
    })
}

/**
 * 新增打包站-批发商
 * @param params
 * @returnsF
 */
export function packagingWholesaleAddApi(data: any) {
    return new Promise((resolve, reject) => {
        resolve(
            request({
                url: `api/business/packagingWholesale/add`,
                method: "POST",
                data
            })
        )
    })
}

/**
 * 获取入库记录详细信息
 * @param params
 * @returnsF
 */
export function getByIdApi(params: any) {
    return new Promise((resolve, reject) => {
        resolve(
            request({
                url: `api/business/storageInput/getById`,
                method: "GET",
                params
            })
        )
    })
}

/**
 * 修改入库数量
 * @param params
 * @returnsF
 */
export function storageInputApi(params: any) {
    return new Promise((resolve, reject) => {
        resolve(
            request({
                url: `api/business/storageInput`,
                method: "GET",
                params
            })
        )
    })
}


