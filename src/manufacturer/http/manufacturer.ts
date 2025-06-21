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
export function manufacturerWholesalePageApi(data: any) {
    return new Promise((resolve, reject) => {
        resolve(
            request({
                url: `api/business/manufacturerWholesale/page`,
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




