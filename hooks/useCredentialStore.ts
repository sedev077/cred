// hooks/useCredentialStore.ts
import { create } from "zustand";
import { getPrismaClient } from "@/lib/db";
import { AppToast } from "@/utils/toast";
import type { Credential } from "@prisma/client";

interface State {
    credentials: Credential[];
    isHydrated: boolean;
    loadCredentials: () => Promise<void>;
    addCredential: (
        credential: Omit<Credential, "id" | "createdAt" | "updatedAt">
    ) => Promise<void>;
    updateCredential: (id: string, data: Partial<Credential>) => Promise<void>;
    deleteCredential: (id: string) => Promise<void>;
    resetCredentials: () => Promise<void>;
}

export const useCredentialStore = create<State>((set, get) => ({
    credentials: [],
    isHydrated: false,

    loadCredentials: async () => {
        try {
            const prisma = getPrismaClient();
            const data = await prisma.credential.findMany({
                orderBy: { createdAt: "desc" }
            });
            set({ credentials: data, isHydrated: true });
        } catch (error) {
            console.error("Failed to load credentials:", error);
            set({ isHydrated: false });
        }
    },

    addCredential: async data => {
        try {
            const prisma = getPrismaClient();
            await prisma.credential.create({ data });

            const updated = await prisma.credential.findMany({
                orderBy: { createdAt: "desc" }
            });
            set({ credentials: updated });

            AppToast.add.success(`${data.service} has been added`);
        } catch (error) {
            console.error("Failed to add credential:", error);
            AppToast.add.error("Failed to add credential");
            throw error;
        }
    },

    updateCredential: async (id: string, data: Partial<Credential>) => {
        try {
            const prisma = getPrismaClient();
            await prisma.credential.update({ where: { id }, data });

            const updated = await prisma.credential.findMany({
                orderBy: { createdAt: "desc" }
            });
            set({ credentials: updated });

            AppToast.update.success(
                `${data.service || "Credential"} has been updated`
            );
        } catch (error) {
            console.error("Failed to update credential:", error);
            AppToast.update.error("Failed to update credential");
            throw error;
        }
    },

    deleteCredential: async (id: string) => {
        try {
            const prisma = getPrismaClient();

            // Get credential name before deleting for toast message
            const credential = await prisma.credential.findUnique({
                where: { id }
            });

            await prisma.credential.delete({ where: { id } });

            const updated = await prisma.credential.findMany({
                orderBy: { createdAt: "desc" }
            });
            set({ credentials: updated });

            AppToast.delete.success(
                credential
                    ? `${credential.service} has been removed`
                    : "Credential removed"
            );
        } catch (error) {
            console.error("Failed to delete credential:", error);
            AppToast.delete.error("Failed to delete credential");
            throw error;
        }
    },

    resetCredentials: async () => {
        try {
            const prisma = getPrismaClient();
            await prisma.credential.deleteMany();
            set({ credentials: [] });
            AppToast.delete.success("All credentials cleared");
        } catch (error) {
            console.error("Failed to reset credentials:", error);
            AppToast.delete.error("Failed to clear credentials");
            throw error;
        }
    }
}));
