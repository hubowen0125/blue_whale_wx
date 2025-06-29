<script lang="ts" setup>
declare const wx: any;
import { generatePrintCommands } from '@/utils/escpos';

type PrintContent =
    | { type: 'text'; text: string; align?: 'left' | 'center' | 'right'; bold?: boolean }
    | { type: 'barcode'; content: string }
    | { type: 'qrcode'; content: string }

const devices = ref<Array<any>>([])
const defaultDevice = 'DC:D4:44:9A:7D:E6'
const status = ref('未连接')
const connected = ref(false)
const connectedDeviceId = ref('')
const deviceId = ref('')
const serviceId = ref('')
const characteristicId = ref('')

const content: PrintContent[] = [
    { type: 'text', text: '欢迎光临', align: 'center', bold: true },
    { type: 'text', text: '--------------------------' },
    { type: 'text', text: '商品     数量   单价', bold: true },
    { type: 'text', text: '苹果      2      3.00' },
    { type: 'text', text: '香蕉      1      2.50' },
    { type: 'text', text: '--------------------------' },
    { type: 'text', text: '合计：8.50元', align: 'right' },
    { type: 'text', text: '请扫码付款', align: 'center' }
]

const canvasWidth = ref(384);
const canvasHeight = ref(300); // Adjust height as needed for the content.

onMounted(() => {

})

/**
 * 搜索蓝牙打印机
 */
const searchPrinter = () => {
    status.value = '搜索中...'
    wx.openBluetoothAdapter({
        success: () => {
            console.log('蓝牙适配器初始化成功')
            devices.value = [] // 每次重新搜索时清空列表
            startDiscovery()
        },
        fail: (err: any) => {
            console.error('蓝牙适配器初始化失败', err)
            status.value = '蓝牙初始化失败，请检查手机蓝牙是否开启'
        }
    })
}

/**
 * 开始搜索蓝牙设备
 */
const startDiscovery = () => {
    wx.startBluetoothDevicesDiscovery({
        allowDuplicatesKey: false,
        success: () => {
            console.log('开始搜索蓝牙设备')
            status.value = '正在搜索设备...'
            onDeviceFound()

            // 10秒后自动停止搜索
            setTimeout(() => {
                stopDiscovery()
                status.value = '搜索结束，请点击设备连接'
            }, 10000)
        },
        fail: (err: any) => {
            console.error('搜索蓝牙设备失败', err)
            status.value = '搜索失败，请重试'
        }
    })
}

/**
 * 监听发现新设备
 */
const onDeviceFound = () => {
    wx.onBluetoothDeviceFound((res: { devices: any[]; }) => {
        res.devices.forEach((device) => {
            console.log('发现新设备:', device, device.connectable);
            if (device.name && device.name?.includes('HM-A300')) {
                // 避免重复添加 并判断当前设备是否可连接
                if (device.connectable && !devices.value.find(d => d.deviceId === device.deviceId)) {
                    devices.value.push(device)
                }
            }
        })
    })
}

/**
 * 停止搜索设备
 */
const stopDiscovery = () => {
    wx.stopBluetoothDevicesDiscovery({
        success: () => {
            console.log('已停止搜索蓝牙设备')
        },
        fail: (err: any) => {
            console.error('停止搜索失败', err)
        }
    })
}

/**
 * 连接设备
 */
const connectBLEDevice = (device: any) => {
    deviceId.value = device.deviceId
    wx.createBLEConnection({
        deviceId: device.deviceId,
        timeout: 10000,
        success: () => {
            connected.value = true
            connectedDeviceId.value = device.deviceId
            status.value = `已连接: ${device.name || device.deviceId}`
            console.log('连接成功', device.deviceId)
            getBLEDeviceServices(device.deviceId)
            getBLEMTU(device.deviceId)
            stopDiscovery()
        },
        fail: (err: any) => {
            console.error('连接失败', err)
            status.value = '连接失败，请重试'
        }
    })
}

/**
 * 获取设备MTU
 * @param deviceId 
 */
const getBLEMTU = (deviceId: string) => {
    wx.getBLEMTU({
        deviceId,
        success: (res: any) => {
            console.log('获取设备MTU成功', res)
        },
        fail: (err: any) => {
            console.error('获取设备MTU失败', err)
        }
    })
}

/**
 * 点击设备连接
 */
const connectPrinter = (device: any) => {
    if (connected.value && device.deviceId === connectedDeviceId.value) {
        status.value = `已连接: ${device.name || device.deviceId}`
        return
    }
    status.value = `正在连接: ${device.name || device.deviceId}...`
    connectBLEDevice(device)
}

/**
 * 获取设备服务
 * @param deviceId 
 */
const getBLEDeviceServices = (deviceId: string) => {
    wx.getBLEDeviceServices({
        deviceId,
        success: (res: { services: any[]; }) => {
            const service = res.services.find((s: { isPrimary: any; }) => s.isPrimary)
            if (service) {
                serviceId.value = service.uuid
                getBLEDeviceCharacteristics(deviceId, service.uuid)
            } else {
                console.warn('未找到主服务')
            }
        },
        fail: (err: any) => {
            console.error('获取设备服务失败', err)
        }
    })
}

/**
 * 获取设备特征值
 * @param deviceId 
 * @param serviceId 
 */
const getBLEDeviceCharacteristics = (deviceId: string, serviceId: string) => {
    wx.getBLEDeviceCharacteristics({
        deviceId,
        serviceId,
        success: (res: { characteristics: any[]; }) => {
            console.log('获取设备特征值成功', res)
            const writeChar = res.characteristics.find((c: { properties: { write: any; writeNoResponse: any; }; }) => c.properties.write || c.properties.writeNoResponse)
            if (writeChar) {
                characteristicId.value = writeChar.uuid
                console.log('找到可写特征值:', characteristicId)
                // printReceipt() // 找到后自动开始打印
            } else {
                console.error('未找到可写特征值')
            }
        },
        fail: (err: any) => {
            console.error('获取设备特征值失败', err)
        }
    })
}

/**
 * 监听连接状态变化
 */
wx.onBLEConnectionStateChange((res: { connected: any; }) => {
    console.log('连接状态变化:', res)
    if (res.connected) {
        connected.value = true
        status.value = '蓝牙已连接'
    } else {
        connected.value = false
        status.value = '连接已断开'
        if (connectedDeviceId.value) {
            uni.showToast({
                title: '蓝牙连接已断开',
                icon: 'none'
            })
        }
    }
})

/**
 * 设置打印机打印内容
 * @param data 
 */
const generatePrintCommand = (data: PrintContent[]): ArrayBuffer => {
    const ESC = 0x1b
    const cmds: number[] = []
    const append = (...bytes: number[]) => cmds.push(...bytes)

    // GBK编码函数
    const textToGBK = (text: string): number[] => {
        // 使用我们之前实现的gbkEncoder
        // const gbkBytes = encodeToGBK(text);
        // return Array.from(gbkBytes);
        return []
    }

    append(ESC, 0x40) // 初始化
    for (const item of data) {
        if (item.type === 'text') {
            // 对齐
            const alignMap = { left: 0, center: 1, right: 2 }
            append(ESC, 0x61, alignMap[item.align ?? 'left'])
            // 加粗
            append(ESC, 0x45, item.bold ? 1 : 0)
            // 文本（使用GBK编码）
            append(...textToGBK(item.text))
            append(0x0a) // 换行
        }
    }
    // 结束切纸（部分打印机会执行）
    append(0x1d, 0x56, 0x41, 0x10)

    return new Uint8Array(cmds).buffer
}

/**
 * 发送打印数据
 */
// const printReceipt = () => {
//     try {
//         const buffer = generatePrintCommand(content)
//         const maxChunkSize = 20
//         const chunks: Array<ArrayBuffer> = []
//         for (let i = 0; i < buffer.byteLength; i += maxChunkSize) {
//             chunks.push(buffer.slice(i, i + maxChunkSize))
//         }
//         let index = 0
//         const maxRetryCount = 3
//         let retryCount = 0
//         const sendChunk = () => {
//             if (index >= chunks.length) {
//                 console.log('打印数据发送完成')
//                 return
//             }
//             console.log(chunks[index], 'chunks[index]chunks[index]chunks[index]');
//             index++

//             // wx.writeBLECharacteristicValue({
//             //     deviceId: deviceId.value,
//             //     serviceId: serviceId.value,
//             //     characteristicId: characteristicId.value,
//             //     value: chunks[index],
//             //     success: () => {
//             //         console.log(`第 ${index + 1} 包发送成功`)
//             //         index++
//             //         retryCount = 0 // 成功后清零重试次数
//             //         setTimeout(sendChunk, 20)
//             //     },
//             //     fail: (err: any) => {
//             //         console.warn(`第 ${index + 1} 包发送失败`, err)
//             //         if (retryCount < maxRetryCount) {
//             //             retryCount++
//             //             console.warn(`重试第 ${index + 1} 包，第 ${retryCount} 次`)
//             //             setTimeout(sendChunk, 100) // 稍作延时再试
//             //         } else {
//             //             console.error(`第 ${index + 1} 包发送失败，已重试 ${maxRetryCount} 次，跳过`)
//             //             index++
//             //             retryCount = 0
//             //             setTimeout(sendChunk, 20)
//             //         }
//             //     }
//             // })
//         }

//         sendChunk()
//     } catch (error) {
//         console.log(error, 'error');

//     }
// }

const printReceipt = async () => {
    status.value = '正在生成打印数据...';

    try {
        const ctx = uni.createCanvasContext('labelCanvas');

        // Background
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvasWidth.value, canvasHeight.value);

        // --- Draw Content ---
        ctx.fillStyle = '#000000';

        // Title
        ctx.font = 'bold 24px sans-serif';
        ctx.setTextAlign('center');
        ctx.fillText('杭盛打包站', canvasWidth.value / 2, 40);

        // Line
        ctx.setStrokeStyle('#000000');
        ctx.setLineWidth(1);
        ctx.moveTo(10, 60);
        ctx.lineTo(canvasWidth.value - 10, 60);
        ctx.stroke();

        // Table-like structure
        ctx.font = '18px sans-serif';
        ctx.setTextAlign('left');

        const startY = 90;
        const lineHeight = 30;
        const paddingLeft = 20;

        ctx.fillText('客户: 云南, 潘石屹', paddingLeft, startY);
        ctx.fillText('厂家: 木童巷多多', paddingLeft, startY + lineHeight);
        ctx.fillText('数量: 135手', paddingLeft, startY + lineHeight * 2);

        // Vertical line for the table
        const verticalLineX = canvasWidth.value * 0.6;
        ctx.moveTo(verticalLineX, 60);
        ctx.lineTo(verticalLineX, startY + lineHeight * 2.5);
        ctx.stroke();

        // Right side of the table
        ctx.fillText('仓位:', verticalLineX + 10, startY);
        ctx.font = 'bold 48px sans-serif';
        ctx.fillText('B38', verticalLineX + 10, startY + 55);

        // Reset font for footer
        ctx.font = '14px sans-serif';

        // Horizontal line
        ctx.moveTo(10, startY + lineHeight * 3);
        ctx.lineTo(canvasWidth.value - 10, startY + lineHeight * 3);
        ctx.stroke();

        // Print time
        ctx.setTextAlign('center');
        ctx.fillText('打印时间: 2024年12月28日 19:36', canvasWidth.value / 2, startY + lineHeight * 3 + 20);

        // Draw on canvas
        await new Promise(resolve => ctx.draw(false, resolve));

        status.value = '正在将Canvas转为图片...';

        // Get image path
        const { tempFilePath } = await uni.canvasToTempFilePath({
            canvasId: 'labelCanvas',
            fileType: 'png',
            quality: 1
        });

        status.value = '正在生成打印指令...';
        const commands = await generatePrintCommands(tempFilePath, canvasWidth.value);

        status.value = '正在发送数据...';
        await writeData(commands);

        status.value = '打印完成';
        uni.showToast({ title: '打印指令已发送', icon: 'success' });

    } catch (err: any) {
        status.value = `打印失败: ${err.message || err.errMsg}`;
        uni.showToast({ title: `打印失败: ${err.message || err.errMsg}`, icon: 'none' });
    } finally {
    }
};

const writeData = async (data: ArrayBuffer) => {
    if (!deviceId || !serviceId || !characteristicId) {
        throw new Error('Not connected to a device or service/characteristic not found.');
    }

    const len = data.byteLength;
    console.log(`Writing data of length: ${len}`);

    for (let i = 0; i < len; i += 20) {
        const chunk = data.slice(i, i + 20);
        try {
            await wx.writeBLECharacteristicValue({
                deviceId: deviceId.value,
                serviceId: serviceId.value,
                characteristicId: characteristicId.value,
                value: chunk,
            });
            // A small delay might be needed for some printers
            await new Promise(resolve => setTimeout(resolve, 20));
        } catch (err) {
            console.error('Failed to write chunk:', err);
            throw err;
        }
    }
};


</script>


<template>
    <view class="container flex_column">
        <com-header header-title="蓝牙列表" />
        <view class="main_con flex_1">
            <button @click="searchPrinter">搜索蓝牙</button>
            <view v-for="item in devices" :key="item.deviceId" class="device-item" @click="connectPrinter(item)">
                {{ item.name || '未知设备' }} ({{ item.deviceId }})
            </view>
            <view class="status">状态: {{ status }}</view>
        </view>
        <canvas canvas-id="labelCanvas" id="labelCanvas"
            :style="{ width: canvasWidth + 'px', height: canvasHeight + 'px', position: 'absolute', left: '-9999px' }"></canvas>

        <canvas canvas-id="imageProcessorCanvas" id="imageProcessorCanvas"
            :style="{ width: canvasWidth + 'px', height: canvasHeight + 'px', position: 'absolute', left: '-9999px' }"></canvas>
        <view class="footer_con"><button class="button_defalut" @click="printReceipt">打印</button></view>
    </view>
</template>



<style lang="scss" scoped>
.device-item {
    padding: 15px;
    border-bottom: 1px solid #eee;
    cursor: pointer;

    &:hover {
        background-color: #f5f5f5;
    }
}

button {
    margin-top: 15px;
}

.status {
    margin-top: 20px;
    color: #666;
    font-size: 14px;
}
</style>