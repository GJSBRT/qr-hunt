/**
 * Patch for the `@capacitor/barcode-scanner` plugin for web.
 * This is related to
 * https://github.com/ionic-team/capacitor-barcode-scanner/issues/50
 *
 * This patch registers a new plugin for Capacitor that provides a fixed
 * web implementation of the barcode scanner.
 *
 * The plugin is named `CapacitorBarcodeScannerPatchWeb` and only contains
 * the web version. For iOS and Android, the original plugin needs to be used.
 */

import type {
    CapacitorBarcodeScannerOptions,
    CapacitorBarcodeScannerPlugin,
    CapacitorBarcodeScannerScanResult,
} from "@capacitor/barcode-scanner";
import {
    CapacitorBarcodeScannerCameraDirection,
    CapacitorBarcodeScannerScanOrientation,
} from "@capacitor/barcode-scanner";
import { registerPlugin } from "@capacitor/core";
import {
    applyCss,
    barcodeScannerCss,
} from "./utils";

/**
 * Registers the `OSBarcode` plugin with Capacitor.
 * For web platforms, it applies necessary CSS for the barcode scanner and dynamically imports the web implementation.
 * This allows for lazy loading of the web code only when needed, optimizing overall bundle size.
 */
const CapacitorBarcodeScannerImpl =
    registerPlugin<CapacitorBarcodeScannerPlugin>(
        "CapacitorBarcodeScannerPatchWeb",
        {
            web: () => {
                applyCss(barcodeScannerCss); // Apply the CSS styles necessary for the web implementation of the barcode scanner.
                return import("./web").then((m) => new m.CapacitorBarcodeScannerWeb()); // Dynamically import the web implementation and instantiate it.
            },
        }
    );

class CapacitorBarcodeScannerPatchWeb {
    public static async scanBarcode(
        options: CapacitorBarcodeScannerOptions
    ): Promise<CapacitorBarcodeScannerScanResult> {
        // Ensure scanInstructions is at least a space.
        options.scanInstructions = options.scanInstructions || " ";

        // Set scanButton to false if not provided.
        options.scanButton = options.scanButton || false;

        // Ensure scanText is at least a space.
        options.scanText = options.scanText || " ";

        // Set cameraDirection to 'BACK' if not provided.
        options.cameraDirection =
            options.cameraDirection || CapacitorBarcodeScannerCameraDirection.BACK;

        options.scanOrientation =
            options.scanOrientation ||
            // Set scanOrientation to 'ADAPTIVE' if not provided.
            CapacitorBarcodeScannerScanOrientation.ADAPTIVE;
        return CapacitorBarcodeScannerImpl.scanBarcode(options);
    }
}

export { CapacitorBarcodeScannerPatchWeb };
