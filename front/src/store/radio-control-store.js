import {create} from "zustand";

/**
 * Status can be "IDLE", "LOADING", "READY", "PLAYING", "ERROR"
 */
export const useRadioControlStore = create((set) => ({
    radioStatus: 'IDLE',
    setRadioStatus: (status) => set(() => ({ radioStatus: status })),
}))
