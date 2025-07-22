/// <reference types="vite/client" />

declare module '*.vue' {
    import { DefineComponent } from 'vue'
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
    const component: DefineComponent<{}, {}, any>
    export default component
}


declare module "uview-plus"

declare var process: {
    env: {
        [key: string]: string | undefined
    }
}

declare module 'weapp-qrcode'


declare const wx: any

// src/types/util.d.ts
declare module '@/packagingStation/printerSettings/util.js' {
    export function hexStringToArrayBuffer(str: string): ArrayBuffer;
    export function hexStringToBuff(str: string): ArrayBuffer;
    export function send0X0A(): ArrayBuffer;
}
