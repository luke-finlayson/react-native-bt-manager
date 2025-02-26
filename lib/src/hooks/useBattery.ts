import { useBluetoothStore } from "../BluetoothStore";

/**
 * A hook that provides access to the current battery level.
 */
const useBattery = () => {
    const level = useBluetoothStore(state => state.batteryLevel);

    return {
        level,
    };
}

export default useBattery;
