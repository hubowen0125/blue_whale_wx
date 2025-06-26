/// <reference types="@dcloudio/types" />

/**
 * Generates ESC/POS commands to print an image.
 * @param imagePath - The temporary path of the image to print.
 * @param imageWidth - The width of the image in pixels.
 * @returns An ArrayBuffer containing the ESC/POS commands.
 */
export const generatePrintCommands = async (imagePath: string, imageWidth: number): Promise<ArrayBuffer> => {
    const canvasId = 'imageProcessorCanvas';
    const ctx = uni.createCanvasContext(canvasId);

    // Draw the image onto a new canvas to access its pixel data
    ctx.drawImage(imagePath, 0, 0);
    console.log('456');
    
    await new Promise(resolve => ctx.draw(false, resolve));
    console.log('123');
    

    // Get image data
    const { data: rgba, height } = await uni.canvasGetImageData({
        canvasId,
        x: 0,
        y: 0,
        width: imageWidth,
        height: 9999, // A large value to get the whole canvas image data
    });

    const monoData = toMonochrome(rgba, imageWidth, height);
    const imageData = toRasterFormat(monoData, imageWidth, height);

    // ESC/POS commands
    const initPrinter = [0x1B, 0x40]; // ESC @ - Initialize printer
    const setLineSpacing = [0x1B, 0x33, 0x00]; // ESC 3 n - Set line spacing to n dots
    const printImageCmd = [0x1D, 0x76, 0x30, 0x00]; // GS v 0 - Print raster bit image

    // Image dimensions
    const xL = imageWidth & 0xFF;
    const xH = (imageWidth >> 8) & 0xFF;
    const yL = height & 0xFF;
    const yH = (height >> 8) & 0xFF;

    const commandHeader = [
        ...initPrinter,
        ...setLineSpacing,
        ...printImageCmd,
        xL, xH, yL, yH,
    ];

    const command = new Uint8Array(commandHeader.length + imageData.length);
    command.set(commandHeader, 0);
    command.set(imageData, commandHeader.length);

    return command.buffer;
};

/**
 * Converts RGBA pixel data to a monochrome (black and white) array.
 * @param data - The RGBA pixel data (Uint8ClampedArray).
 * @param width - The width of the image.
 * @param height - The height of the image.
 * @returns A Uint8Array where 1 is black and 0 is white.
 */
function toMonochrome(data: any, width: number, height: number): Uint8Array {
    const mono = new Uint8Array(width * height);
    const threshold = 128; // Grayscale threshold

    for (let i = 0; i < data.length; i += 4) {
        // Simple luminance calculation
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];

        const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
        const pixelIndex = i / 4;

        // If alpha is transparent, treat as white. Otherwise, check threshold.
        mono[pixelIndex] = (a < threshold || luminance > threshold) ? 0 : 1; // 0 for white, 1 for black
    }
    return mono;
}

/**
 * Converts monochrome pixel data into the ESC/POS raster format.
 * The printer prints images column by column. We need to pack 8 pixels into a byte.
 * @param data - The monochrome pixel data.
 * @param width - The width of the image.
 * @param height - The height of the image.
 * @returns A Uint8Array with the image data in raster format.
 */
function toRasterFormat(data: Uint8Array, width: number, height: number): Uint8Array {
    const raster = new Uint8Array(width * Math.ceil(height / 8));
    let rasterIndex = 0;

    // Process the image in vertical slices of 8 pixels
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y += 8) {
            let byte = 0;
            for (let bit = 0; bit < 8; bit++) {
                if (y + bit < height) {
                    const pixelIndex = x + (y + bit) * width;
                    if (data[pixelIndex]) {
                        byte |= (1 << (7 - bit));
                    }
                }
            }
            raster[rasterIndex++] = byte;
        }
    }
    return raster;
}

// We need a canvas in the DOM for canvasGetImageData to work, even if it's off-screen.
// The main page `index.vue` should have two canvases. One for drawing the label,
// and another one for processing the image. I will add this canvas to index.vue
// with an ID 'imageProcessorCanvas'.
// Or I can just use the same canvas, but it's cleaner to have a separate one.
// The `index.vue` file I wrote only has one canvas. I need to add a second one. 