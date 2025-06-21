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


