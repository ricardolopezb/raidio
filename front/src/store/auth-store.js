import {create} from "zustand";
import {createJSONStorage, persist} from "zustand/middleware";

export const useAuthStore = create(persist((set) => ({
    spotify_token: '',
    setToken: (token) => set({spotify_token: token})
}), {
    name: 'spotify-auth',
    storage: createJSONStorage(() => localStorage)
}))
