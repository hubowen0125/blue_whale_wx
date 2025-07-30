<script lang="ts" setup>
import { getByIdApi } from '../http/packagingStation';
import { useUserStore } from '@/store/modules/user';
import { useBluetoothPrinter } from './useBluetoothPrinter';

declare const wx: any;

const useUser = useUserStore()
const { proxy } = getCurrentInstance() as any;

const printCommand: any = {
    left: [27, 97, 46], //居左
    center: [27, 97, 1], //居中
    right: [27, 97, 2], //居右
    clear: [27, 64], //初始化
    enter: [10],
    leftMargin: [29, 76, 0, 0], // 左间距
    // 切换页模式
    enterPageMode: [27, 64],
    // 设置打印区域（60mm x 40mm = 480 x 320 点）
    setPageArea: [27, 87, 0, 0, 0, 0, 224, 1, 64, 1],
    // 打印并走纸到下页首
    lineFeed: [27, 100, 1],
};
console.log(printCommand.clear);

// 蓝牙相关状态和方法
const {
    devices,
    status,
    connected,
    connectedDeviceId,
    deviceId,
    serviceId,
    characteristicId,
    printing,
    searchPrinter,
    connectPrinter,
    stopDiscovery
} = useBluetoothPrinter();

const canvasWidth = ref(448);
const canvasHeight = ref(310); // Adjust height as needed for the content.
const labelImg = ref('')
const inventoryId = ref('')
const inventoryDetails = ref<any>({})
const createTime = ref('')
const imageInfoArray = ref<Array<any>>([])
const allUint8Array = ref<Array<any>>([])

onLoad((e: any) => {
    const currentDate = new Date();
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth() + 1 < 10 ? '0' + (currentDate.getMonth() + 1) : currentDate.getMonth() + 1
    const day = currentDate.getDate() < 10 ? '0' + currentDate.getDate() : currentDate.getDate()
    const hours = currentDate.getHours() < 10 ? '0' + currentDate.getHours() : currentDate.getHours()
    const minutes = currentDate.getMinutes() < 10 ? '0' + currentDate.getMinutes() : currentDate.getMinutes()
    createTime.value = `${year}年${month}月${day}日${hours}:${minutes}`
    if (e.id) {
        inventoryId.value = e.id
        getByIdFu()
    } else {
        generateCanvasFu()
    }
})

onShow(() => {
    if (useUser.bluetoothInfo.status) {
        devices.value = useUser.bluetoothInfo.list
        connected.value = true
        if (useUser.bluetoothInfo.printing) {
            status.value = '正在发送数据...';
        } else {
            status.value = '已连接'
        }
    }
})

const getByIdFu = () => {
    proxy.$Loading()
    getByIdApi({ id: inventoryId.value }).then((res: any) => {
        const { code, data, msg, token } = res
        proxy.$CloseLoading();
        if (code == proxy.$successCode) {
            inventoryDetails.value = data
            generateCanvasFu()
            console.log(data, 'data');
        } else {
            proxy.$Toast({ title: msg })
        }
    }, (req => {
        proxy.$CloseLoading();
        proxy.$Toast({ title: req.msg })
    }))
}

const generateCanvasFu = async () => {
    try {
        const ctx = uni.createCanvasContext('labelCanvas')
        const canvasW = canvasWidth.value
        const canvasH = canvasHeight.value
        const padding = 10
        const lineHeight = 28
        let y = padding + 30
        const leftColX = padding
        const rightColX = canvasW - padding - 120
        let colDividerX = 0
        let colDividerY = 0
        ctx.setFillStyle('#FFFFFF')
        ctx.fillRect(0, 0, canvasW, canvasH)
        ctx.setStrokeStyle('#000000')
        ctx.setFillStyle('#000000')
        ctx.setLineWidth(1)
        ctx.strokeRect(0, 0, canvasW, canvasH)
        ctx.setFontSize(30)
        ctx.setTextAlign('center')
        ctx.fillText(`${useUser.userInfo?.dept?.deptName || '杭盛打包站'}`, canvasW / 2, y)
        y += lineHeight + 10
        drawLine(0, y - lineHeight / 2, canvasW, y - lineHeight / 2)
        colDividerY = y - lineHeight / 2
        y += 36
        ctx.setFontSize(28)
        ctx.setTextAlign('left')
        ctx.fillText(`客户：${inventoryDetails.value.wholesaleName || '云南，潘石屹'}`, leftColX, y)
        ctx.fillText('仓位：', rightColX, y)
        y += lineHeight
        drawLine(0, y - lineHeight / 2, rightColX - 10, y - lineHeight / 2)
        colDividerX = rightColX - 10
        y += 36
        ctx.setFontSize(32)
        ctx.fillText(`厂家：${inventoryDetails.value.manufacturerName || '木童巷多多'}`, leftColX, y)
        ctx.setFontSize(50)
        ctx.setTextAlign('center')
        y += lineHeight
        ctx.fillText(`${inventoryDetails.value.storageNum || '仓位'}`, colDividerX + (canvasW - colDividerX) / 2, y - lineHeight / 2)
        drawLine(0, y - lineHeight / 2, rightColX - 10, y - lineHeight / 2)
        y += 36
        ctx.setFontSize(32)
        ctx.setTextAlign('left')
        ctx.fillText(`数量：${inventoryDetails.value.checkHandNum || 0}手`, leftColX, y)
        y += lineHeight
        drawLine(0, y - lineHeight / 2, canvasW, y - lineHeight / 2)
        drawLine(colDividerX, colDividerY, colDividerX, y - lineHeight / 2)
        y += 20
        ctx.setFontSize(22)
        ctx.setTextAlign('center')
        ctx.fillText(`打印时间：${createTime.value}`, canvasW / 2, y)
        await new Promise(resolve => ctx.draw(false, resolve))
        function drawLine(x1: number, y1: number, x2: number, y2: number) {
            ctx.beginPath()
            ctx.moveTo(x1, y1)
            ctx.lineTo(x2, y2)
            ctx.stroke()
        }
        uni.canvasToTempFilePath({
            canvasId: 'labelCanvas',
            success: async (res: any) => {
                labelImg.value = res.tempFilePath
            },
            fail: (err: any) => {
                console.error('生成临时文件失败', err)
            }
        })
    } catch (err: any) {
        uni.showToast({ title: `打印失败: ${err.message || err.errMsg}`, icon: 'none' });
    }
};


/**
 * 打印中
 */
const printReceipt = async () => {
    // if (!connected.value) {
    //     proxy.$Toast({ title: '请先连接打印机' });
    //     return;
    // }
    // if (printing.value) {
    //     proxy.$Toast({ title: '正在打印中，请稍候...' });
    //     return;
    // }
    printing.value = true; // 设置打印中状态
    status.value = '正在将Canvas转为图片...';
    status.value = '正在生成打印指令...';
    await canvasGetImageDataFu()
    status.value = '正在发送数据...';
    getPrintImageWriteArray()
}

const canvasGetImageDataFu = () => {
    return new Promise<void>((resolve, reject) => {
        const canvasW = canvasWidth.value
        const canvasH = canvasHeight.value
        wx.canvasGetImageData({
            canvasId: 'labelCanvas',
            x: 0,
            y: 0,
            width: canvasW,
            height: canvasH,
            async success(res: any) {
                console.log(res, 'resres');
                let sendWidth = canvasW,
                    sendHeight = canvasH;
                const threshold = 200
                let sendImageData: any = new ArrayBuffer((sendWidth * sendHeight) / 8);
                sendImageData = new Uint8Array(sendImageData);
                let pix = res.data
                const part = [];
                let index = 0;
                for (let i = 0; i < pix.length; i += 32) {
                    //横向每8个像素点组成一个字节（8位二进制数）。
                    for (let k = 0; k < 8; k++) {
                        const grayPixle1 = grayPixle(pix.slice(i + k * 4, i + k * 4 + (4 - 1)));
                        //阈值调整
                        if (grayPixle1 > threshold) {
                            //灰度值大于128位   白色 为第k位0不打印
                            part[k] = 0;
                        } else {
                            part[k] = 1;
                        }
                    }
                    let temp = 0;
                    for (let a = 0; a < part.length; a++) {
                        temp += part[a] * Math.pow(2, part.length - 1 - a);
                    }
                    sendImageData[index++] = temp;
                }
                imageInfoArray.value = Array.from(sendImageData);
                resolve()
            },
            fail(err: any) {
                printing.value = false; // 重置打印中状态
            }
        })
    })
}

const grayPixle = (pix: number[]) => {
    return pix[0] * 0.299 + pix[1] * 0.587 + pix[2] * 0.114;
}

/**
 * 获取一张图片数据与指令整合的writeArray，结合 sendDataToPrint 发送二进制数据到蓝牙打印机
 */
const getPrintImageWriteArray = () => {
    let arr = imageInfoArray.value
    const width = canvasWidth.value / 8
    let writeArray = [];
    // const iniTcommand = [].concat(printCommand.clear).concat(printCommand.center);
    const iniTcommand = [...printCommand.clear, ...printCommand.enterPageMode, ...printCommand.setPageArea, ...printCommand.center]
    const command = getImageCommandArray();
    writeArray.push(new Uint8Array(iniTcommand));
    // 分段逐行打印的数据
    for (let i = 0; i < arr.length / width; i++) {
        const subArr = arr.slice(i * width, i * width + width);
        const tempArr = command.concat(subArr);
        writeArray.push(new Uint8Array(tempArr));
    }
    console.log(writeArray, 'writeArray');
    writeArray.push(new Uint8Array(printCommand.lineFeed));
    console.log(writeArray, 'writeArray');
    allUint8Array.value = writeArray
    sendDataToPrint()
}

/**
 * 获取打印图片的指令
 */
const getImageCommandArray = () => {
    const width = canvasWidth.value / 8
    const h = canvasHeight.value
    const xl = width % 256;
    const xh = (width - xl) / 256;
    const yl = h % 256;
    const yh = (h - yl) / 256;
    //打印图片的十进制指令数组
    let command: any[] = [];
    // 分段逐行的指令
    command = command.concat([29, 118, 48, 0, xl, xh, 1, 0]);
    return command;
}

/**
 * 分段发送二进制数据，按allUint8Array的length产生发送的进度
 */
const sendDataToPrint = () => {
    const writeArrayCopyer = allUint8Array.value.slice(0);
    console.log(new Date(), '开始时间');
    const print = (options: { lasterSuccess?: any; }, writeArray: any[]) => {
        // console.log('writeArraywriteArray', writeArray.length, 'writeArray.lengthwriteArray.lengthwriteArray.length');
        if (writeArray.length) {
            sendDataToDevice({
                value: writeArray.shift().buffer,
                lasterSuccess: () => {
                    if (writeArray.length) {
                        print(options, [...writeArray]);
                    } else {
                        console.log('打印成功');
                        console.log(new Date(), '结束时间');
                        status.value = '打印完成';
                        printing.value = false; // 重置打印中状态
                        // options.lasterSuccess && options.lasterSuccess();
                    }
                },
            });
        }
    };
    print({}, [...writeArrayCopyer]);
}

const sendDataToDevice = (options: any) => {
    let byteLength = options.value.byteLength;
    //这里默认一次20个字发送
    const speed = options.onceByleLength || 20;
    if (byteLength > 0) {
        wx.writeBLECharacteristicValue({
            deviceId: deviceId.value,
            serviceId: serviceId.value,
            characteristicId: characteristicId.value,
            value: options.value.slice(0, byteLength > speed ? speed : byteLength),
            success: function (res: any) {
                if (byteLength > speed) {
                    sendDataToDevice({
                        ...options,
                        value: options.value.slice(speed, byteLength),
                    });
                } else {
                    options.lasterSuccess && options.lasterSuccess();
                }
            },
            fail: function (res: any) {
                if (byteLength > speed) {
                    sendDataToDevice({
                        ...options,
                        value: options.value.slice(speed, byteLength),
                    });
                } else {
                    options.lasterSuccess && options.lasterSuccess();
                }
                //     sendDataToDevice({
                //         ...options,
                //         value: options.value.slice(speed, byteLength),
                //     });
                //     console.log(res, 'wewqeqwewe');
                //     options.onError && options.onError(res);
            },
        });
    }
}

/**
 * 页面
 */
onUnmounted(() => {
    useUser.setBluetoothInfo({
        status: connected.value,
        list: devices.value,
        printing: printing.value
    })
})

</script>


<template>
    <view class="container flex_column">
        <com-header header-title="打印机设置" />
        <view class="main_con flex_1 flex_column">
            <view class="section_con">
                <view class="section_title">页面预览</view>
                <view class="label_img_con">
                    <image class="label_img" :src="labelImg"></image>
                </view>
            </view>
            <template>
                <!-- 搜索 -->
                <button class="button_defalut" @click="searchPrinter">搜索蓝牙</button>
                <view class="device_list flex_1">
                    <view v-for="item in devices" :key="item.deviceId" class="device_item"
                        @click="connectPrinter(item)">
                        {{ item.name || '未知设备' }} ({{ item.deviceId }})
                    </view>
                </view>
                <view class="status">状态: {{ status }}</view>
            </template>
        </view>
        <canvas canvas-id="labelCanvas" id="labelCanvas"
            :style="{ width: canvasWidth + 'px', height: canvasHeight + 'px', transform: 'scale(.8)', position: 'absolute', left: '-99999px' }"></canvas>
        <view class="footer_con"><button class="button_defalut" @click="printReceipt">打印</button>
        </view>
    </view>
</template>



<style lang="scss" scoped>
.main_con {
    padding: 24rpx;
    overflow: hidden;

    .section_con {
        background: #FFFFFF;
        border-radius: 24rpx;
        padding: 36rpx 28rpx;
        margin-bottom: 20rpx;

        .section_title {
            font-weight: bold;
            font-size: 32rpx;
            color: #202020;
            margin-bottom: 30rpx;
        }

        .label_img_con {
            background: #F6F6F6;
            border-radius: 24rpx;
            padding: 20rpx 0;

            .label_img {
                width: 550rpx;
                height: 380rpx;
                margin: auto;
                display: block;
            }
        }

    }

}

.device_list {
    overflow-x: hidden;
    overflow-y: auto;
    margin: 10rpx 0;

    .device_item {
        padding: 15px;
        border-bottom: 1px solid #eee;
        cursor: pointer;

        &:hover {
            background-color: #f5f5f5;
        }
    }
}

.status {
    color: #666;
    font-size: 14px;
}
</style>