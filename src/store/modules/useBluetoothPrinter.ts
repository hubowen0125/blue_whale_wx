import { defineStore } from "pinia";

export const useBluetoothPrinter = defineStore('bluetoothPrinter', () => {
    // 响应式状态
    const devices = ref<any[]>([]);
    const status = ref('未连接');
    const connected = ref(false);
    const connectedDeviceId = ref('');
    const deviceId = ref('');
    const serviceId = ref('');
    const characteristicId = ref('');
    const printing = ref(false);
    // 搜索中
    const searching = ref(false);

    let timer: any = null;

    // 搜索蓝牙打印机
    const searchPrinter = () => {
        if (searching.value == true) {
            return
        }
        searching.value = true;
        status.value = '准备搜索...';
        uni.getSetting({
            success(res: any) {
                if (!res.authSetting['scope.bluetooth']) {
                    uni.authorize({
                        scope: 'scope.bluetooth',
                        success() {
                            openBluetoothAdapter();
                        },
                        fail() {
                            uni.showModal({
                                content: '检测到您没打开蓝牙权限，是否去设置打开？',
                                success: (res) => {
                                    if (res.confirm) {
                                        uni.openSetting({
                                            success: (res) => {
                                                if (!res.authSetting['scope.bluetooth']) {
                                                    searching.value = false;
                                                    status.value = '取消授权，蓝牙初始化失败';
                                                } else {
                                                    openBluetoothAdapter();
                                                }
                                            }
                                        })
                                    } else {
                                        uni.hideLoading();
                                        status.value = '取消授权，蓝牙初始化失败';
                                        searching.value = false;
                                    }
                                }
                            });
                        }
                    })
                } else {
                    openBluetoothAdapter();
                }
            }
        })
    }

    // 初始化蓝牙适配器
    const openBluetoothAdapter = () => {
        status.value = '搜索中...';
        wx.openBluetoothAdapter({
            success: () => {
                devices.value = [];
                startDiscovery();
            },
            fail: (err: any) => {
                status.value = '蓝牙初始化失败，请检查手机蓝牙是否开启';
                searching.value = false;
                console.error('蓝牙适配器初始化失败', err);
            }
        })
    }

    // 开始搜索蓝牙设备
    const startDiscovery = () => {
        wx.startBluetoothDevicesDiscovery({
            allowDuplicatesKey: false,
            success: () => {
                status.value = '正在搜索设备...';
                onDeviceFound();
                timer = setTimeout(() => {
                    stopDiscovery();
                    searching.value = false;
                    status.value = '搜索结束，请点击设备连接';
                }, 10000);
            },
            fail: (err: any) => {
                searching.value = false;
                status.value = '搜索失败，请重试';
                console.error('搜索蓝牙设备失败', err);
            }
        })
    }

    // 监听发现新设备
    const onDeviceFound = () => {
        wx.onBluetoothDeviceFound((res: { devices: any[]; }) => {
            res.devices.forEach((device) => {
                // if (device.name && device.name.includes('HM-A300')) {
                if (device.name) {
                    if (device.connectable && !devices.value.find(d => d.deviceId === device.deviceId)) {
                        devices.value.push(device);
                    }
                }
            })
        })
    }

    // 停止搜索设备
    const stopDiscovery = () => {
        if (timer) {
            clearTimeout(timer);
            timer = null;
        }
        wx.stopBluetoothDevicesDiscovery({
            success: () => { },
            fail: (err: any) => {
                console.error('停止搜索失败', err);
            }
        })
    }

    // 连接设备
    const connectPrinter = (device: any) => {
        if (connected.value && device.deviceId === connectedDeviceId.value) {
            status.value = `已连接: ${device.name || device.deviceId}`;
            return;
        }
        status.value = `正在连接: ${device.name || device.deviceId}...`;
        connectBLEDevice(device);
    }

    const connectBLEDevice = (device: any) => {
        deviceId.value = device.deviceId;
        wx.createBLEConnection({
            deviceId: device.deviceId,
            timeout: 10000,
            success: () => {
                connected.value = true;
                connectedDeviceId.value = device.deviceId;
                status.value = `已连接: ${device.name || device.deviceId}`;
                getBLEDeviceServices(device.deviceId);
                getBLEMTU(device.deviceId);
                stopDiscovery();
            },
            fail: (err: any) => {
                status.value = '连接失败，请重试';
                console.error('连接失败', err);
            }
        })
    }

    // 获取设备MTU
    const getBLEMTU = (deviceId: string) => {
        wx.getBLEMTU({
            deviceId,
            success: (res: any) => {
                // 可根据需要处理
            },
            fail: (err: any) => {
                console.error('获取设备MTU失败', err);
            }
        })
    }

    // 获取设备服务
    const getBLEDeviceServices = (deviceId: string) => {
        wx.getBLEDeviceServices({
            deviceId,
            success: (res: { services: any[]; }) => {
                const service = res.services.find((s: { isPrimary: any; }) => s.isPrimary);
                if (service) {
                    serviceId.value = service.uuid;
                    getBLEDeviceCharacteristics(deviceId, service.uuid);
                } else {
                    status.value = '未找到主服务';
                }
            },
            fail: (err: any) => {
                console.error('获取设备服务失败', err);
            }
        })
    }

    // 获取设备特征值
    const getBLEDeviceCharacteristics = (deviceId: string, serviceId: string) => {
        wx.getBLEDeviceCharacteristics({
            deviceId,
            serviceId,
            success: (res: { characteristics: any[]; }) => {
                const writeChar = res.characteristics.find((c: { properties: { write: any; writeNoResponse: any; }; }) => c.properties.write || c.properties.writeNoResponse);
                if (writeChar) {
                    characteristicId.value = writeChar.uuid;
                } else {
                    status.value = '未找到可写特征值';
                }
            },
            fail: (err: any) => {
                console.error('获取设备特征值失败', err);
            }
        })
    }

    // 监听连接状态变化
    wx.onBLEConnectionStateChange((res: { connected: any; }) => {
        if (res.connected) {
            connected.value = true;
            status.value = '蓝牙已连接';
        } else {
            resetState('连接已断开');
        }
    });

    const resetState = (text: string = '未连接') => {
        devices.value = [];
        status.value = text;
        connected.value = false;
        connectedDeviceId.value = '';
        deviceId.value = '';
        serviceId.value = '';
        characteristicId.value = '';
        printing.value = false;
        searching.value = false;
    }


    return {
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
        stopDiscovery,
        resetState
        // 其他方法可按需暴露
    };

})