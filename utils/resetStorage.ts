import { getSecureItem,deleteSecureItem } from './secureStorage'

export async function resetStorage(key: string){
  await deleteSecureItem(key)
}

export const clearAllIndividualCredentials = async () => {
    try {
        // Get credential IDs list
        const idsData = await getSecureItem("credentialIds");
        
        if (idsData) {
            const ids = JSON.parse(idsData);
            
            // Delete each individual credential
            for (const id of ids) {
                await deleteSecureItem(`credential_${id}`);
            }
            
            // Delete the IDs list
            await deleteSecureItem("credentialIds");
            
            console.log(`Cleared ${ids.length} credentials from SecureStore`);
        }
    } catch (error) {
        console.error("Error clearing individual credentials:", error);
    }
};