
// import { getSignedUriApi } from "@/http/api/system"

import { getSignedUriApi } from "@/http/api/all";
import { toastFu } from "./utils";

/**
 * 上传字节流
 * @param url 上传的目标URL
 * @param data 字节流数据
 * @returns Promise
 */
export const uploadByteStream = (url: string, data: ArrayBuffer): Promise<any> => {
    return new Promise((resolve, reject) => {
        uni.request({
            url: url,
            method: 'PUT',
            header: {
                'Content-Type': 'application/octet-stream',
            },
            data: data,
            success: (res: any) => {
                res.code = 200
                resolve(res);
            },
            fail: (error) => {
                console.error('上传失败', error);
                reject({
                    code: '',
                    msg: '上传失败'
                });
            },
        });
    });
};



/**
 * 读取本地文件为字节流
 * @param filePath 
 */
export const getFileArrayBuffer = (filePath: string): Promise<ArrayBuffer> => {
    return new Promise((resolve, reject) => {
        uni.getFileSystemManager().readFile({
            filePath: filePath,
            success: (res) => {
                resolve(res.data as ArrayBuffer);
            },
            fail: (error) => {
                console.error('读取文件失败', error);
                reject(error);
            }
        });
    });
}

/**
 * 获取取得预签名链接
 * @param code 
 */
export const getSignedUriFu = async (code: string, detail: { tempFilePath: string; }) => {
    const arrayBuffer = await getFileArrayBuffer(detail.tempFilePath);
    return new Promise((resolve) => {
        getSignedUriApi({ code, fileType: "jpg" }).then(async (res: any) => {
            const { code, data, msg } = res
            if (code == 200) {
                const response = await uploadByteStream(data.signedUrl, arrayBuffer) as any
                if (response.code == 200) {
                    resolve(data.uploadPath)
                } else {
                    uni.hideLoading()
                    toastFu({ title: response.msg })
                }
            } else {
                uni.hideLoading()
                toastFu({ title: msg })
            }
        })
    });
}