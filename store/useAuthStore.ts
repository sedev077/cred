// store/useAuthStore.ts
import { create } from "zustand";

interface AuthState {
    isUnlocked: boolean; // tells if the vault is unlocked
    biometricEnabled: boolean;
    setBiometricEnabled: (value: boolean) => void;
    setUnlocked: (value: boolean) => void; // function to change the state
    lock: () => void; // resets back to locked
    hasMasterPassword: boolean | null;
    setHasMasterPassword: (value: boolean | null) => void;
    
    // Global auto-lock reset functionality
    globalResetTimer: (() => void) | null;
    setGlobalResetTimer: (resetFn: () => void) => void;
    resetAutoLockTimer: () => void;
}

// Zustand store definition
export const useAuthStore = create<AuthState>((set, get) => ({
    isUnlocked: false, // initial state: locked
    setUnlocked: value => set({ isUnlocked: value }), // update state
    lock: () => set({ isUnlocked: false }), // helper to lock again
    hasMasterPassword: null,
    biometricEnabled: false,
    setBiometricEnabled: value => set({ biometricEnabled: value }),
    setHasMasterPassword: value => set({ hasMasterPassword: value }),
    
    // Global auto-lock timer management
    globalResetTimer: null,
    
    // Store the reset function from useAutoLock hook
    setGlobalResetTimer: (resetFn: () => void) => {
        set({ globalResetTimer: resetFn });
    },
    
    // Global function to reset auto-lock timer from anywhere in the app
    resetAutoLockTimer: () => {
        const { globalResetTimer, isUnlocked } = get();
        
        // Only reset if user is unlocked and reset function is available
        if (isUnlocked && globalResetTimer) {
            globalResetTimer();
        }
    },
}));