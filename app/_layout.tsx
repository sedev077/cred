// app/_layout.tsx
import "./global.css";
import React, { useState, useEffect } from "react";
import {
    GestureHandlerRootView,
    TapGestureHandler
} from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useAuthStore } from "../store/useAuthStore";
import { useAutoLock } from "../hooks/useAutoLock";
import Toast from "react-native-toast-message";
import { ModalProvider, useModalContext } from "../context/ModalContext";

function RootContent() {
    const { isUnlocked } = useAuthStore();
    const { isModalOpen } = useModalContext();
    const segments = useSegments();
    const router = useRouter();
    const [isNavigationReady, setIsNavigationReady] = useState(false);

    const { resetTimer, pauseTimer, resumeTimer } = useAutoLock(60000);

    // Wait for navigation to be ready
    useEffect(() => {
        const timer = setTimeout(() => setIsNavigationReady(true), 100);
        return () => clearTimeout(timer);
    }, []);

    // Pause timer when modal is open
    useEffect(() => {
        if (isModalOpen) {
            // console.log("Modal open → pausing auto-lock timer");
            pauseTimer();
        } else {
            // console.log("Modal closed → resuming auto-lock timer");
            resumeTimer();
        }
    }, [isModalOpen]);

    // Navigation redirect
    useEffect(() => {
        if (!isNavigationReady) return;

        const inAuthGroup = segments[0] === "(auth)";
        const inTabsGroup = segments[0] === "(tabs)";

        if (!isUnlocked && inTabsGroup) {
            router.replace("/(auth)/");
        } else if (isUnlocked && inAuthGroup) {
            router.replace("/(tabs)/");
        } else if (segments.length === 0) {
            router.replace(isUnlocked ? "/(tabs)/" : "/(auth)/");
        }
    }, [isUnlocked, segments, isNavigationReady]);

    useEffect(() => {
        if (isUnlocked) resetTimer();
    }, [isUnlocked]);

    return (
        <TapGestureHandler onActivated={() => !isModalOpen && resetTimer()}>
            <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
                <StatusBar />
                <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="(auth)" />
                    <Stack.Screen name="(tabs)" />
                </Stack>
                <Toast />
            </SafeAreaView>
        </TapGestureHandler>
    );
}

export default function RootLayout() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <ModalProvider>
                <RootContent />
            </ModalProvider>
        </GestureHandlerRootView>
    );
}
