// src/types/util.d.ts 或 src/packagingStation/printerSettings/types.d.ts
declare module './util.js' {
    export function hexStringToArrayBuffer(str: string): ArrayBuffer;
    export function hexStringToBuff(str: string): ArrayBuffer;
    export function send0X0A(): ArrayBuffer;
}
