import {create} from "zustand";
import {createJSONStorage, persist} from "zustand/middleware";

export const usePlaybackStore = create(persist((set) => ({
    queueUris: [],
    currentIndex: 0,
    setQueueUris: (uris) => set({queueUris: uris}),
    setCurrentIndex: (index) => set({currentIndex: index}),
    currentPlaylist: null,
    setCurrentPlaylist: (playlist) => set({currentPlaylist: playlist}),

}), {
    name: 'playback',
    storage: createJSONStorage(() => localStorage)
}))
