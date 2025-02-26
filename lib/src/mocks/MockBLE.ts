import { DeviceEventEmitter, EmitterSubscription } from "react-native";

export type BLEDevice = {
    id: string;
    name: string;
    firmware: string;
    serial: string;
};

export enum DfuStatus {
    IDLE = "idle",
    IN_PROGRESS = "in_progress",
    SUCCESS = "success",
    FAILURE = "failure",
}

/** Some example BLE devices */
const MOCK_DEVICES = [
    { id: "device1", name: "Device 1", firmware: "1.0.3", serial: "SN123456" },
    { id: "device2", name: "Device 2", firmware: "1.0.3", serial: "SN123457" },
    { id: "device3", name: "Device 3", firmware: "1.0.3", serial: "SN123458" },
    { id: "device4", name: "Device 4", firmware: "1.0.3", serial: "SN123459" },
    { id: "device5", name: "Device 5", firmware: "1.0.3", serial: "SN123460" },
];

/**
 * Mock implementation of a BLE service.
 *
 * This class simulates a BLE service that can scan for devices, connect to them, retrieve device information, and handle DFU processes.
 *
 * @method startScan - Start scanning for BLE devices.
 * @method stopScan - Stop scanning for BLE devices.
 * @method onDeviceDiscovered - Register a callback to be called when a new device is discovered.
 * @method connect - Connect to a BLE device.
 * @method getDeviceInfo - Get information about the connected device.
 * @method startDfu - Start a DFU process.
 * @method abortDfu - Abort the current DFU process.
 * @method onDfuStatus - Register a callback to be called when the DFU status changes.
 * @method onDfuProgress - Register a callback to be called to report DFU progress.
 * @method onBatteryLevel - Register a callback to be called to report battery level changes.
 *
 */
class MockBLE {
    devices = MOCK_DEVICES;
    connectedDevice?: BLEDevice = undefined;
    batteryLevel = 100;

    scanInterval?: NodeJS.Timeout = undefined;
    dfuInterval?: NodeJS.Timeout = undefined;
    batteryInterval?: NodeJS.Timeout = undefined;

    listeners: EmitterSubscription[] = [];

    constructor() {
        this.batteryInterval = setInterval(() => {
            if (this.batteryLevel > 5) {
                this.batteryLevel -= 1;
            } else {
                this.batteryLevel = 100;
            }

            DeviceEventEmitter.emit("battery-level", this.batteryLevel);
        }, 1000);
    }

    startScan() {
        if (this.scanInterval != undefined) {
            this.stopScan();
            return;
        }

        let index = 0;
        this.scanInterval = setInterval(() => {
            if (index < this.devices.length) {
                DeviceEventEmitter.emit("device-discovered", this.devices[index]);
                index++;
            }
        }, 1000);
    }

    stopScan() {
        if (this.scanInterval != undefined) {
            clearInterval(this.scanInterval);
            this.scanInterval = undefined;
        }
    }

    onDeviceDiscovered(callback: (device: BLEDevice) => void) {
        let listener = DeviceEventEmitter.addListener("device-discovered", callback);
        this.listeners.push(listener);
        return () => listener.remove();
    }

    async connect(deviceId: string) {
        return new Promise<void>((resolve, reject) => {
            this.connectedDevice = this.devices.find(
                (device) => device.id === deviceId
            );
            setTimeout(() => resolve(), 1000);
        });
    }

    async getDeviceInfo() {
        return this.connectedDevice
            ? {
                  firmware: this.connectedDevice.firmware,
                  serial: this.connectedDevice.serial,
              }
            : undefined;
    }

    startDfu() {
        if (this.dfuInterval != undefined) {
            this.abortDfu();
            return;
        }

        DeviceEventEmitter.emit("dfu-status", DfuStatus.IN_PROGRESS);

        let progress = 0;
        DeviceEventEmitter.emit("dfu-progress", progress);

        this.dfuInterval = setInterval(() => {
            progress += 1;
            DeviceEventEmitter.emit("dfu-progress", progress);
            if (progress >= 100) {
                clearInterval(this.dfuInterval);
                DeviceEventEmitter.emit("dfu-status", DfuStatus.SUCCESS);
            }
        }, 100);
    }

    abortDfu() {
        if (this.dfuInterval != undefined) {
            clearInterval(this.dfuInterval);
            this.dfuInterval = undefined;
            DeviceEventEmitter.emit("dfu-status", DfuStatus.FAILURE);
        }
    }

    onDfuStatus(callback: (status: DfuStatus) => void) {
        let listener = DeviceEventEmitter.addListener("dfu-status", callback);
        this.listeners.push(listener);
        return () => listener.remove();
    }

    onDfuProgress(callback: (progress: number) => void) {
        let listener = DeviceEventEmitter.addListener("dfu-progress", callback);
        this.listeners.push(listener);
        return () => listener.remove();
    }

    onBatteryLevel(callback: (level: number) => void) {
        let listener = DeviceEventEmitter.addListener("battery-level", callback);
        this.listeners.push(listener);
        return () => listener.remove();
    }

    cleanup() {
        this.stopScan();
        this.abortDfu();
        this.listeners.forEach((listener) => listener.remove());
        
        if (this.batteryInterval != undefined) {
            clearInterval(this.batteryInterval);
        }

        this.batteryInterval = undefined;
        this.listeners = [];
    }
}

export default new MockBLE();
