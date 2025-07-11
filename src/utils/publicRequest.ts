
import { toastFu, loadingFu } from "./utils";


/**
 * 复制
 * @param text 
 */
export const copyAllFu = (text: string, toast = '下载链接') => {
    return new Promise<void>((resolve) => {
        uni.setClipboardData({
            data: text,
            success: (res) => {
                console.log(res, 'resresres');
                toastFu({ title: `复制${toast}成功` })
                resolve()
            },
            fail: (err) => {
                console.log(err, 'errerrerr');
                toastFu({ title: `复制${toast}失败` })
            }
        })
    })
}


/**
 * 获取相机权限
 */
export const savePhoto = () => {
    return new Promise<void>((resolve) => {
        uni.getSetting({
            success(res) {
                console.log(res, 'resresres');
                if (!res.authSetting['scope.writePhotosAlbum']) {
                    uni.authorize({
                        scope: 'scope.writePhotosAlbum',
                        success() {
                            resolve();
                        },
                        fail() {
                            console.log('000000');
                            openConfirm()
                        }
                    })
                } else {
                    resolve();
                }
            }
        })

        const openConfirm = () => {
            uni.showModal({
                content: '检测到您没打开相机权限，是否去设置打开？',
                success: function (res) {
                    if (res.confirm) {
                        uni.openSetting({
                            success: (res) => {
                                if (!res.authSetting['scope.writePhotosAlbum']) {
                                    uni.hideLoading()
                                    toastFu({ title: '取消授权，下载失败' })
                                } else {
                                    resolve();
                                }
                            }
                        })
                    } else {
                        uni.hideLoading()
                        toastFu({ title: '取消授权，下载失败' })
                    }
                }
            });
        }
    })
}



/**
 * 文件下载
 * @param url 
 */
export const saveFileFu = (obj = { suffix: '', name: '', url: '', type: '' }) => {
    return new Promise<void>((resolve) => {
        loadingFu({ title: '下载中...' })
        console.log(obj.url, 'urlurlurlurl', encodeURI(obj.url));
        uni.downloadFile({
            url: encodeURI(obj.url),
            filePath: `${wx.env.USER_DATA_PATH}/${obj.name}.${obj.type === 'img' ? 'jpg' : 'mp4'}`, // 强制 .jpg 扩展名
            success: async (res: any) => {
                await savePhoto()
                let url = res.filePath;
                console.log(res, '本地地址获取成功');
                if (obj.type === 'img') {
                    await saveImageToPhotosAlbumFu(url)
                    resolve()
                }
                if (obj.type === 'video') {
                    await saveVideoToPhotosAlbumFu(url)
                    resolve()
                }
            },
            fail: (req) => {
                // 下载失败
                console.log(req, 'fail');
                uni.hideLoading()
                toastFu({ title: '获取本地图片地址失败，文件下载失败' })
            }
        })
    })
}

/**
 * 保存图片到本地
 */
const saveImageToPhotosAlbumFu = (url: string) => {
    return new Promise<void>((resolve) => {
        uni.saveImageToPhotosAlbum({
            filePath: url,
            success: (res) => {
                // 保存成功
                console.log(res, '保存成功保存成功保存成功保存成功');
                uni.hideLoading()
                toastFu({ title: '文件保存成功' })
                resolve()
            },
            fail: (req) => {
                console.log(req, '文件下载失败');
                // 下载失败
                uni.hideLoading()
                toastFu({ title: '保存图片失败，文件下载失败' })
            }
        })
    })
}

/**
 * 保存视频到本地
 * @param url 
 * @returns 
 */
const saveVideoToPhotosAlbumFu = (url: string) => {
    return new Promise<void>((resolve) => {
        uni.saveVideoToPhotosAlbum({
            filePath: url,
            success: (res) => {
                // 保存成功
                console.log(res, '保存成功');
                uni.hideLoading()
                toastFu({ title: '文件保存成功' })
                resolve()
            },
            fail: (req) => {
                console.log(req, '文件下载失败');
                // 下载失败
                uni.hideLoading()
                toastFu({ title: '文件下载失败' })
            }
        })
    })
}

// // 修改文件名称
// const renameFile = (oldPath: string, obj = { suffix: '', name: '' }) => {
//     return new Promise<string>((resolve) => {
//         const fs = uni.getFileSystemManager();
//         console.log(uni, 'uniuninuiuni');
//         const newFilePath = uni.env.USER_DATA_PATH + `/name.${obj.suffix}`;
//         console.log(uni.env.USER_DATA_PATH, 'wx.env.USER_DATA_PATH');
//         // 先把下载的临时文件重命名
//         fs.access({
//             path: oldPath,
//             success: (res) => {
//                 console.log(res, '文件可写');
//                 // 文件可写，进行重命名操作
//                 fs.rename({
//                     oldPath,
//                     newPath: newFilePath,
//                     success: () => {
//                         resolve(newFilePath)
//                     },
//                     fail: (err) => {
//                         console.log(err, '文件下载失败');
//                         // 下载失败
//                         uni.hideLoading()
//                         toastFu({ title: '重命名失败' })
//                     }
//                 });
//             },
//             fail: (err) => {
//                 console.error(err, '文件不可写');
//                 uni.hideLoading();
//                 toastFu({ title: '文件不可写' });
//             }
//         });
//     })
// }

// ------------------------------订阅---------------------------
export const requestSubscribeMessage = (arr: Array<string>) => {
    return new Promise((resolve, reject) => {
        uni.requestSubscribeMessage({
            tmplIds: arr,
            success: res => {
                resolve(res)
            },
            fail: err => {
                resolve(err)
            }
        });
    })
}