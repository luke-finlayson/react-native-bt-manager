import MockBLE from "../mocks/MockBLE";

interface BatterySlice {
    batteryLevel: number;
    initBattery: () => (() => void);
}

/**
 * Manages the state and listeners for the battery level.
 */
const createBatterySlice = (set: any, get: any): BatterySlice => ({
    batteryLevel: 0,

    // Register a listener for battery level updates
    initBattery: () =>
        MockBLE.onBatteryLevel((level: number) => {
            set({ batteryLevel: level });
        }),
});

export { createBatterySlice, BatterySlice };
