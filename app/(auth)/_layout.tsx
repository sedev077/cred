// app/(auth)/_layout.tsx
import { useEffect, useState } from "react";
import { Stack, useRouter } from "expo-router";
import { getSecureItem } from "../../utils/secureStorage";
import { useAuthStore } from "../../store/useAuthStore";
import { View, Text } from "react-native";

export default function AuthLayout() {
    const { hasMasterPassword, setHasMasterPassword, isUnlocked } =
        useAuthStore();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    // Check master password status
    useEffect(() => {
        const checkMasterPassword = async () => {
            try {
                const stored = await getSecureItem("masterPasswordHash");
                setHasMasterPassword(!!stored);
                setIsLoading(false);
            } catch (error) {
                console.error("Error checking master password:", error);
                setHasMasterPassword(false);
                setIsLoading(false);
            }
        };

        checkMasterPassword();
    }, [setHasMasterPassword]);

    // Debug: watch for state changes
    useEffect(() => {
        console.log("Auth state:", { hasMasterPassword, isUnlocked });
    }, [hasMasterPassword, isUnlocked]);

    // Redirect to tabs if already unlocked
    useEffect(() => {
        if (!isLoading && isUnlocked) {
            router.replace("/(tabs)/");
        }
    }, [isUnlocked, isLoading]);

    // Show loading while determining master password status
    if (isLoading || hasMasterPassword === null) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center"
                }}
            >
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name="index"
                options={{
                    gestureEnabled: false
                }}
            />
            <Stack.Screen
                name="setup"
                options={{
                    gestureEnabled: false,
                    headerLeft: () => null
                }}
            />
            <Stack.Screen
                name="unlock"
                options={{
                    gestureEnabled: false,
                    headerLeft: () => null
                }}
            />
        </Stack>
    );
}
