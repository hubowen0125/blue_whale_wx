import request from '../../http/interface';
import { splicingObjects } from '@/utils/utils';

/**
 * 我的-厂家信息
 * @param params
 * @returnsF
 */
export function infoApi() {
    return new Promise((resolve, reject) => {
        resolve(
            request({
                url: `api/business/manufacturer/info`,
                method: "GET",
            })
        )
    })
}

/**
 * 获取通用尺码列表
 * @param params
 * @returnsF
 */
export function getSizesListApi(data: any) {
    return new Promise((resolve, reject) => {
        resolve(
            request({
                url: `api/comm/sizes/list`,
                method: "POST",
                data
            })
        )
    })
}

/**
 * 新增通用尺码
 * @param params
 * @returnsF
 */
export function sizeAddApi(params: any) {
    return new Promise((resolve, reject) => {
        resolve(
            request({
                url: `api/comm/sizes/add`,
                method: "GET",
                params
            })
        )
    })
}

/**
 * 获取通用颜色列表
 * @param params
 * @returnsF
 */
export function getColorsListApi(data: any) {
    return new Promise((resolve, reject) => {
        resolve(
            request({
                url: `api/comm/colors/list`,
                method: "POST",
                data
            })
        )
    })
}

/**
 * 新增通用尺码
 * @param params
 * @returnsF
 */
export function colorsAddApi(params: any) {
    return new Promise((resolve, reject) => {
        resolve(
            request({
                url: `api/comm/colors/add`,
                method: "GET",
                params
            })
        )
    })
}

/**
 * 新增商品信息
 * @param params
 * @returnsF
 */
export function productsAddApi(data: any) {
    return new Promise((resolve, reject) => {
        resolve(
            request({
                url: `api/business/products/add`,
                method: "POST",
                data
            })
        )
    })
}

/**
 * 修改商品信息
 * @param params
 * @returnsF
 */
export function productsEditApi(data: any) {
    return new Promise((resolve, reject) => {
        resolve(
            request({
                url: `api/business/products/edit`,
                method: "POST",
                data
            })
        )
    })
}



/**
 * 分页查询商品信息
 * @param params
 * @returnsF
 */
export function productsPageApi(data: any, page: any) {
    return new Promise((resolve, reject) => {
        resolve(
            request({
                url: `api/business/products/page?${splicingObjects(page)}`,
                method: "POST",
                data
            })
        )
    })
}

/**
 * 获取商品信息详细信息
 * @param params
 * @returnsF
 */
export function getByIdApi(params: any) {
    return new Promise((resolve, reject) => {
        resolve(
            request({
                url: `api/business/products/getById`,
                method: "GET",
                params
            })
        )
    })
}

/**
 * 查询厂家-批发商
 * @param data
 * @returnsF
 */
export function manufacturerWholesalePageApi(data: any , params: any) {
    return new Promise((resolve, reject) => {
        resolve(
            request({
                url: `api/business/manufacturerWholesale/page?${splicingObjects(params)}`,
                method: "POST",
                data
            })
        )
    })
}

/**
 * 新增厂家-批发商
 * @param data
 * @returnsF
 */
export function manufacturerWholesaleAddApi(data: any) {
    return new Promise((resolve, reject) => {
        resolve(
            request({
                url: `api/business/manufacturerWholesale/add`,
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
 * 查询商品信息(厂家-订货卡新增商品时查询)
 * @param data
 * @returnsF
 */
export function productListApi(data: any) {
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
 * 获取订单统计信息
 * @returns
 */
export function getOrderStatisticsApi() {
    return new Promise((resolve, reject) => {
        resolve(
            request({
                url: `api/business/manufacturer/getOrderStatistics`,
                method: "GET",
            })
        )
    })
}

/**
 * 获取货架统计信息
 * @returns
 */
export function getShelfStatisticsApi() {
    return new Promise((resolve, reject) => {
        resolve(
            request({
                url: `api/business/manufacturer/getShelfStatistics`,
                method: "GET",
            })
        )
    })
}

/**
 * 获取日报表统计信息
 * @returns
 */
export function getSalesStatisticsApi(params: any) {
    return new Promise((resolve, reject) => {
        resolve(
            request({
                url: `api/business/manufacturer/getSalesStatistics`,
                method: "GET",
                params
            })
        )
    })
}


/**
 * 分页查询打包站-批发商
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


