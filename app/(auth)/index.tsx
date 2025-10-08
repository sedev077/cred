// app/(auth)/index.tsx
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { useAuthStore } from "../../store/useAuthStore";
import { View, Text, ActivityIndicator } from "react-native";

export default function AuthIndex() {
    const { hasMasterPassword, isUnlocked } = useAuthStore();
    const router = useRouter();
    const [hasRedirected, setHasRedirected] = useState(false);

    useEffect(() => {
        if (hasRedirected) return;

        const redirect = () => {
            if (isUnlocked) {
                setHasRedirected(true);
                router.replace("/(tabs)/");
            } else if (hasMasterPassword === false) {
                setHasRedirected(true);
                router.replace("/(auth)/setup");
            } else if (hasMasterPassword === true) {
                setHasRedirected(true);
                router.replace("/(auth)/unlock");
            }
        };

        // Add a small delay to ensure navigation is ready
        const timer = setTimeout(redirect, 100);
        return () => clearTimeout(timer);
    }, [hasMasterPassword, isUnlocked, hasRedirected]);

    // Show loading while determining where to redirect
    return (
        <View style={{ 
            flex: 1, 
            justifyContent: 'center', 
            alignItems: 'center',
            backgroundColor: '#fff'
        }}>
            <ActivityIndicator size="large" color="#0066cc" />
            <Text style={{ marginTop: 16, fontSize: 16, color: '#666' }}>
                Loading...
            </Text>
        </View>
    );
}