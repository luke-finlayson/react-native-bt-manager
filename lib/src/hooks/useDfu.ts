import { useEffect } from "react";
import { useBluetoothStore } from "../BluetoothStore";
import MockBLE, { DfuStatus } from "../mocks/MockBLE";

/**
 * A hook that provides access to DFU feature.
 */
const useDfu = () => {
    const progress = useBluetoothStore((state) => state.dfuProgress);
    const status = useBluetoothStore((state) => state.dfuStatus);

    let resolve: ((value: unknown) => void) | undefined = undefined;
    let reject: ((reason?: any) => void) | undefined = undefined;

    // Start the DFU process and return a promise that resolves when the DFU is complete
    const startDfu = async () => {
        return new Promise((res, rej) => {
            resolve = res;
            reject = rej;
            MockBLE.startDfu();
        });
    };

    // Resolve or reject any outstanding promise when the DFU status changes
    useEffect(() => {
        if (!(resolve && reject)) return;

        if (status === DfuStatus.SUCCESS) {
            resolve(true);
        } else if (status === DfuStatus.FAILURE) {
            reject("DFU failed");
        }

        resolve = undefined;
        reject = undefined;
    }, [status]);

    return {
        progress,
        status,
        startDfu,
    };
};

export default useDfu;
