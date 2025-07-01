<script lang="ts" setup>
declare const wx: any;

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

const canvasWidth = ref(432);
const canvasHeight = ref(310); // Adjust height as needed for the content.

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

const printReceipt = async () => {
    status.value = '正在生成打印数据...';

    try {
        const ctx = uni.createCanvasContext('labelCanvas')
        const canvasW = canvasWidth.value
        const canvasH = canvasHeight.value
        const padding = 10
        const lineHeight = 28
        let y = padding + 20
        const leftColX = padding
        const rightColX = canvasW - padding - 120
        let colDividerX = 0
        let colDividerY = 0
        ctx.setFillStyle('#FFFFFF')
        ctx.fillRect(0, 0, canvasW, canvasH)
        ctx.setStrokeStyle('#000000')
        ctx.setFillStyle('#000000')
        ctx.setLineWidth(1)
        // === 外边框 ===
        ctx.strokeRect(0, 0, canvasW, canvasH)
        // === 标题 ===
        ctx.setFontSize(30)
        ctx.setTextAlign('center')
        ctx.fillText('杭盛打包站', canvasW / 2, y)
        y += lineHeight
        // === 分隔线（标题下）===
        drawLine(0, y - lineHeight / 2, canvasW, y - lineHeight / 2)
        colDividerY = y - lineHeight / 2
        y += 36
        // === 客户 / 仓位 ===
        ctx.setFontSize(28)
        ctx.setTextAlign('left')
        ctx.fillText('客户：云南，潘石屹', leftColX, y)
        ctx.fillText('仓位：', rightColX, y)
        y += lineHeight
        // === 分隔线 ===
        drawLine(0, y - lineHeight / 2, rightColX - 10, y - lineHeight / 2)
        colDividerX = rightColX - 10
        y += 36
        // === 厂家 / 仓位号 ===
        ctx.setFontSize(32)
        ctx.fillText('厂家：木童巷多多', leftColX, y)
        ctx.setFontSize(60)
        ctx.setTextAlign('center')
        y += lineHeight
        ctx.fillText('B38', colDividerX + (canvasW - colDividerX) / 2, y - lineHeight / 2)
        // === 分隔线 ===
        drawLine(0, y - lineHeight / 2, rightColX - 10, y - lineHeight / 2)
        y += 36
        // === 数量 ===
        ctx.setFontSize(32)
        ctx.setTextAlign('left')
        ctx.fillText('数量：135手', leftColX, y)
        y += lineHeight
        // === 横线 ===
        drawLine(0, y - lineHeight / 2, canvasW, y - lineHeight / 2)
        // === 竖线（分栏）===
        drawLine(colDividerX, colDividerY, colDividerX, y - lineHeight / 2)
        y += 36
        // === 打印时间 ===
        ctx.setFontSize(22)
        ctx.setTextAlign('center')
        ctx.fillText('打印时间：2024年12月28日19:36', canvasW / 2, y)
        // === 渲染 ===
        await new Promise(resolve => ctx.draw(false, resolve))
        // === 辅助函数 ===
        function drawLine(x1: number, y1: number, x2: number, y2: number) {
            ctx.beginPath()
            ctx.moveTo(x1, y1)
            ctx.lineTo(x2, y2)
            ctx.stroke()
        }

        status.value = '正在将Canvas转为图片...';
        status.value = '正在生成打印指令...';
        const commands = await canvasGetImageDataFu()
        console.log(commands, 'commandscommandscommandscommandscommands');

        status.value = '正在发送数据...';
        await writeData(commands);

        // status.value = '打印完成';
        // uni.showToast({ title: '打印指令已发送', icon: 'success' });

    } catch (err: any) {
        status.value = `打印失败: ${err.message || err.errMsg}`;
        uni.showToast({ title: `打印失败: ${err.message || err.errMsg}`, icon: 'none' });
    } finally {
    }
};

const canvasGetImageDataFu = () => {
    return new Promise<Uint8Array>((resolve, reject) => {
        const canvasW = canvasWidth.value
        const canvasH = canvasHeight.value

        wx.canvasGetImageData({
            canvasId: 'labelCanvas',
            x: 0,
            y: 0,
            width: canvasW,
            height: canvasH,
            success(res: any) {
                const imageData = res.data // Uint8ClampedArray
                const monoData: number[] = []

                // === 灰度 + 二值化 ===
                for (let i = 0; i < imageData.length; i += 4) {
                    const r = imageData[i]
                    const g = imageData[i + 1]
                    const b = imageData[i + 2]
                    const gray = 0.299 * r + 0.587 * g + 0.114 * b
                    monoData.push(gray < 128 ? 1 : 0)
                }

                // === 打包成 ESC/POS 位图 ===
                const bytesPerLine = Math.ceil(canvasW / 8)
                const escPosData: number[] = []

                for (let y = 0; y < canvasH; y++) {
                    for (let x = 0; x < bytesPerLine; x++) {
                        let byte = 0
                        for (let bit = 0; bit < 8; bit++) {
                            const pxIndex = y * canvasW + x * 8 + bit
                            if (pxIndex < monoData.length && monoData[pxIndex]) {
                                byte |= (0x80 >> bit)
                            }
                        }
                        escPosData.push(byte)
                    }
                }

                // === ESC/POS header ===
                const xL = bytesPerLine & 0xFF
                const xH = (bytesPerLine >> 8) & 0xFF
                const yL = canvasH & 0xFF
                const yH = (canvasH >> 8) & 0xFF
                const header = [0x1D, 0x76, 0x30, 0x00, xL, xH, yL, yH]

                const printData = new Uint8Array(header.length + escPosData.length)
                printData.set(header, 0)
                printData.set(escPosData, header.length)
                resolve(printData)
            },
            fail(err: any) {
                console.error('canvasGetImageData failed', err)
            }
        })
    })
}


const writeData = async (data: Uint8Array) => {
    if (!deviceId || !serviceId || !characteristicId) {
        throw new Error('Not connected to a device or service/characteristic not found.');
    }
    const len = data.length;
    console.log(`Writing data of length: ${len}`);
    for (let i = 0; i < len; i += 20) {
        const chunk = data.slice(i, i + 20);
        console.log(chunk.buffer, 'chunkchunkchunkchunkchunk');
        try {
            await wx.writeBLECharacteristicValue({
                deviceId: deviceId.value,
                serviceId: serviceId.value,
                characteristicId: characteristicId.value,
                value: chunk.buffer,
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
            :style="{ width: canvasWidth + 'px', height: canvasHeight + 'px', transform: 'scale(.8)' }"></canvas>
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