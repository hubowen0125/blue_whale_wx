import request from '../../http/interface';
import { splicingObjects } from '@/utils/utils';

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


