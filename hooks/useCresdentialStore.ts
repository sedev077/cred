// store/useCredentialStore.ts
import { create } from "zustand";
import { database, initDatabase } from "../lib/database";
import { encryptData, decryptData } from "../utils/crypto";

interface Credential {
    id: string;
    title: string;
    username?: string;
    password: string;
    website?: string;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

interface CredentialStore {
    // State
    credentials: Credential[];
    isLoading: boolean;
    isInitialized: boolean;

    // Actions
    initialize: () => Promise<void>;
    addCredential: (
        credential: Omit<Credential, "id" | "createdAt" | "updatedAt">
    ) => Promise<void>;
    updateCredential: (
        id: string,
        updates: Partial<Credential>
    ) => Promise<void>;
    deleteCredential: (id: string) => Promise<void>;
    refreshCredentials: () => Promise<void>;
    clearAll: () => Promise<void>;

    // Getters
    getCredentialById: (id: string) => Credential | undefined;
    searchCredentials: (query: string) => Credential[];
}

export const useCredentialStore = create<CredentialStore>((set, get) => ({
    // Initial state
    credentials: [],
    isLoading: false,
    isInitialized: false,

    // Initialize database and load credentials
    initialize: async () => {
        try {
            set({ isLoading: true });
            await initDatabase();
            const credentials =
                (await database.getCredentials()) as Credential[];

            // Decrypt passwords when loading
            const decryptedCredentials = credentials.map(cred => ({
                ...cred,
                password: decryptData(cred.password) // You'll need to implement this
            }));

            set({
                credentials: decryptedCredentials,
                isLoading: false,
                isInitialized: true
            });
        } catch (error) {
            console.error("Error initializing credentials:", error);
            set({ isLoading: false });
        }
    },

    // Add new credential
    addCredential: async credentialData => {
        try {
            set({ isLoading: true });

            // Encrypt the password before storing
            const encryptedPassword = encryptData(credentialData.password);

            const newCredential = (await database.createCredential({
                ...credentialData,
                password: encryptedPassword
            })) as Credential;

            // Add to store (decrypted for UI)
            set(state => ({
                credentials: [
                    ...state.credentials,
                    { ...newCredential, password: credentialData.password }
                ],
                isLoading: false
            }));
        } catch (error) {
            console.error("Error adding credential:", error);
            set({ isLoading: false });
            throw error;
        }
    },

    // Update credential
    updateCredential: async (id: string, updates: Partial<Credential>) => {
        try {
            set({ isLoading: true });

            // Encrypt password if it's being updated
            const updateData = { ...updates };
            if (updateData.password) {
                updateData.password = encryptData(updateData.password);
            }

            await database.updateCredential(id, updateData);

            // Update in store
            set(state => ({
                credentials: state.credentials.map(cred =>
                    cred.id === id
                        ? {
                              ...cred,
                              ...updates,
                              updatedAt: new Date().toISOString()
                          }
                        : cred
                ),
                isLoading: false
            }));
        } catch (error) {
            console.error("Error updating credential:", error);
            set({ isLoading: false });
            throw error;
        }
    },

    // Delete credential
    deleteCredential: async (id: string) => {
        try {
            set({ isLoading: true });
            await database.deleteCredential(id);

            set(state => ({
                credentials: state.credentials.filter(cred => cred.id !== id),
                isLoading: false
            }));
        } catch (error) {
            console.error("Error deleting credential:", error);
            set({ isLoading: false });
            throw error;
        }
    },

    // Refresh credentials from database
    refreshCredentials: async () => {
        try {
            const credentials =
                (await database.getCredentials()) as Credential[];

            // Decrypt passwords
            const decryptedCredentials = credentials.map(cred => ({
                ...cred,
                password: decryptData(cred.password)
            }));

            set({ credentials: decryptedCredentials });
        } catch (error) {
            console.error("Error refreshing credentials:", error);
        }
    },

    // Clear all credentials (for logout)
    clearAll: async () => {
        set({ credentials: [], isInitialized: false });
    },

    // Get credential by ID
    getCredentialById: (id: string) => {
        return get().credentials.find(cred => cred.id === id);
    },

    // Search credentials
    searchCredentials: (query: string) => {
        const { credentials } = get();
        if (!query.trim()) return credentials;

        const lowercaseQuery = query.toLowerCase();
        return credentials.filter(
            cred =>
                cred.title.toLowerCase().includes(lowercaseQuery) ||
                cred.username?.toLowerCase().includes(lowercaseQuery) ||
                cred.website?.toLowerCase().includes(lowercaseQuery) ||
                cred.notes?.toLowerCase().includes(lowercaseQuery)
        );
    }
}));
