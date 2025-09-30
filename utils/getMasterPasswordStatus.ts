import { getSecureItem } from './secureStorage'

export const getMasterPasswordStatus = async (): Promise<boolean> => {
    try {
        const stored = await getSecureItem("masterPasswordHash");
        return !!stored;
    } catch (error) {
        console.error("Error checking master password:", error);
        return false;
    }
};
