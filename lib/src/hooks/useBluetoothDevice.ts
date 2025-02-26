import { useBluetoothStore } from "../BluetoothStore";

/**
 * A hook that provides access to Bluetooth device management.
 */
const useBluetoothDevice = () => {
    const serialNumber = useBluetoothStore(state => state.serialNumber);
    const firmwareVersion = useBluetoothStore(state => state.firmwareVersion);
    const devices = useBluetoothStore(state => state.devices);
    const connectedDevice = useBluetoothStore(state => state.connectedDevice);
    const isScanning = useBluetoothStore(state => state.isScanning);

    const startScan = useBluetoothStore(state => state.startScan);
    const stopScan = useBluetoothStore(state => state.stopScan);
    const connectToDevice = useBluetoothStore(state => state.connectToDevice);
    const disconnectFromDevice = useBluetoothStore(state => state.disconnectFromDevice);

    return {
        serialNumber,
        firmwareVersion,
        devices,
        connectedDevice,
        isScanning,
        startScan,
        stopScan,
        connectToDevice,
        disconnectFromDevice,
    }
}

export default useBluetoothDevice;
