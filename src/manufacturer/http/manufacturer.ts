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
 * 查询厂家-批发商
 * @param params
 * @returnsF
 */
export function wholesalePageApi() {
    return new Promise((resolve, reject) => {
        resolve(
            request({
                url: `api/business/manufacturerWholesale/page`,
                method: "POST",
            })
        )
    })
}
