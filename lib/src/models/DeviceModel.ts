import MockBLE, { BLEDevice } from "../mocks/MockBLE";

interface DeviceSlice {
    isScanning: boolean;
    devices: BLEDevice[];
    connectedDevice: BLEDevice | undefined;
    serialNumber: string | undefined;
    firmwareVersion: string | undefined;
    startScan: () => void;
    stopScan: () => void;
    connectToDevice: (deviceId: string) => Promise<void>;
    disconnectFromDevice: () => Promise<void>;
}

/**
 * Manages the Bluetooth device connection, along with scanning and device discovery.
 */
const createDeviceSlice = (set: any, get: any): DeviceSlice => {
    let clearDeviceListener: (() => void) | undefined = undefined;

    return {
        isScanning: false,
        devices: [] as BLEDevice[],

        connectedDevice: undefined as BLEDevice | undefined,
        serialNumber: undefined as string | undefined,
        firmwareVersion: undefined as string | undefined,

        // Start scanning for Bluetooth devices
        startScan: () => {
            set({ isScanning: true, devices: [] });

            // Subscribe to device discovery events
            clearDeviceListener = MockBLE.onDeviceDiscovered(
                (device: BLEDevice) => {
                    set((state: any) => ({
                        devices: [...state.devices, device],
                    }));
                }
            );

            MockBLE.startScan();
        },

        // Stop scanning for Bluetooth devices
        stopScan: () => {
            MockBLE.stopScan();
            set({ isScanning: false });

            // Unsubscribe from device discovery events
            if (clearDeviceListener) {
                clearDeviceListener();
            }
        },

        // Connect to a Bluetooth device
        connectToDevice: async (deviceId: string) => {
            await MockBLE.connect(deviceId);
            let info = await MockBLE.getDeviceInfo();

            set({
                connectedDevice: MockBLE.connectedDevice,
                serialNumer: info?.serial,
                firmwareVersion: info?.firmware,
            });
        },

        // Disconnect from the current Bluetooth device
        disconnectFromDevice: async () => {
            set({
                connectedDevice: undefined,
                serialNumber: undefined,
                firmwareVersion: undefined,
            });
        },
    };
};

export { createDeviceSlice, DeviceSlice };
