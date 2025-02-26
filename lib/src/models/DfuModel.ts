import MockBLE, { DfuStatus } from "../mocks/MockBLE";

interface DfuSlice {
    dfuStatus: DfuStatus;
    dfuProgress: number;
    initDfu: () => (() => void)[];
}

/**
 * Manages the state and listeners for the DFU status and progress.
 */
const createDfuSlice = (set: any, get: any): DfuSlice => ({
    dfuStatus: DfuStatus.IDLE,
    dfuProgress: 0,

    // Register listeners for DFU status and progress updates
    initDfu: () => {
        return [
            MockBLE.onDfuStatus((status: DfuStatus) => {
                set({ dfuStatus: status });
            }),
            MockBLE.onDfuProgress((progress: number) => {
                set({ dfuProgress: progress });
            }),
        ]
    },
});

export { createDfuSlice, DfuSlice };
