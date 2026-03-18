import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  session: null,
  profile: null,
  setSession: (session) => set({ session }),
  setProfile: (profile) => set({ profile }),
  logout: () => {
    set({ session: null, profile: null });
  }
}));

export const useUIStore = create((set) => ({
  theme: 'light',
  toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
}));
