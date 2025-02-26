import React from "react";
import { create } from "zustand";
import { BatterySlice, createBatterySlice } from "./models/BatteryModel";
import { createDeviceSlice, DeviceSlice } from "./models/DeviceModel";
import { createDfuSlice, DfuSlice } from "./models/DfuModel";
import MockBLE from "./mocks/MockBLE";

interface BluetoothState extends DeviceSlice, BatterySlice, DfuSlice {
    cleanup: () => void;
}

/**
 * A store that manages the state of the Bluetooth connection and devices.
 */
const useBluetoothStore = create<BluetoothState>((set, get) => {
    const cleanupFunctions: (() => void)[] = [];

    // Create our store slices
    const deviceSlice = createDeviceSlice(set, get);
    const batterySlice = createBatterySlice(set, get);
    const dfuSlice = createDfuSlice(set, get);

    // Initialize slices
    cleanupFunctions.push(batterySlice.initBattery());
    cleanupFunctions.push(...dfuSlice.initDfu());

    return {
        ...deviceSlice,
        ...batterySlice,
        ...dfuSlice,

        cleanup: () => {
            cleanupFunctions.forEach((fn) => fn());
            MockBLE.cleanup();
        },
    };
});


/**
 * A hook that manages the Bluetooth store. Cleanup is handled
 * automatically when the component unmounts.
 * 
 * Use by placing in the root of your app or a parent component that will
 * always be mounted.
 */
const useBluetoothManager = () => {
    const cleanup = useBluetoothStore(state => state.cleanup);

    React.useEffect(() => {
        return cleanup;
    }, [cleanup]);
}

export { useBluetoothStore, useBluetoothManager };
