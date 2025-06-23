import request from '../../http/interface';
import { splicingObjects } from '@/utils/utils';

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



