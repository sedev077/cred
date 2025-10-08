// utils/SecureStorage.ts
import * as SecureStore from "expo-secure-store";

export async function saveSecureItem(key: string, value: string) {
  try {
    await SecureStore.setItemAsync(key, value, {
      keychainService: "credentials-vault",
    });
  } catch (error) {
    console.error("Error saving item:", error);
  }
}

export async function getSecureItem(key: string): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(key, {
      keychainService: "credentials-vault",
    });
  } catch (error) {
    console.error("Error reading item:", error);
    return null;
  }
}

export async function deleteSecureItem(key: string) {
  try {
    await SecureStore.deleteItemAsync(key, {
      keychainService: "credentials-vault",
    });
  } catch (error) {
    console.error("Error deleting item:", error);
  }
}