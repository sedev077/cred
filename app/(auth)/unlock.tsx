// app/(auth)/unlock.tsx
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Alert, Image } from "react-native";
import { useRouter } from "expo-router";
import * as LocalAuthentication from "expo-local-authentication";
import { getSecureItem } from "../../utils/secureStorage";
import { verifyPassword } from "../../utils/hash";
import { useAuthStore } from "../../store/useAuthStore";
import {
    getBiometricInfo,
    getBiometricPromptMessage
} from "../../utils/biometricUtils";
import CustomNumPad from "../../components/CustomNumPad";
import PinDisplay from "../../components/PinDisplay";

export default function UnlockScreen() {
    const [pin, setPin] = useState("");
    const [attempts, setAttempts] = useState(1);
    const [isBiometricAvailable, setIsBiometricAvailable] = useState(false);
    const [biometricInfo, setBiometricInfo] = useState({
        type: "",
        displayName: "",
        iconName: "shield-checkmark-outline"
    });
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const [hasError, setHasError] = useState(false);
    const router = useRouter();

    const { biometricEnabled, setBiometricEnabled, setUnlocked, isUnlocked } =
        useAuthStore();

    // Redirect if already unlocked
    useEffect(() => {
        if (isUnlocked) {
            router.replace("/(tabs)/");
        }
    }, [isUnlocked]);

    // Check biometric availability and user preference on mount
    useEffect(() => {
        const initializeBiometric = async () => {
            try {
                const bioInfo = await getBiometricInfo();

                setBiometricInfo({
                    type: bioInfo.type,
                    displayName: bioInfo.displayName,
                    iconName: bioInfo.iconName
                });
                setIsBiometricAvailable(bioInfo.isAvailable);

                if (bioInfo.isAvailable) {
                    // Check if user has enabled biometric in settings
                    const stored = await getSecureItem("biometricEnabled");
                    setBiometricEnabled(stored === "true");
                } else {
                    setBiometricEnabled(false);
                }
            } catch (error) {
                console.log("Error initializing biometric:", error);
                setIsBiometricAvailable(false);
                setBiometricEnabled(false);
            }
        };

        initializeBiometric();
    }, []);

    // Handle number press from numpad
    const handleNumberPress = (number: string) => {
        if (pin.length < 4) {
            const newPin = pin + number;
            setPin(newPin);
            setHasError(false);

            // Auto verify when 6 digits entered
            if (newPin.length === 4) {
                setTimeout(() => verifyPin(newPin), 50);
            }
        }
    };

    // Handle backspace from numpad
    const handleBackspace = () => {
        if (pin.length > 0) {
            setPin(pin.slice(0, -1));
            setHasError(false);
        }
    };

    // PIN verification
    const verifyPin = async (enteredPin: string) => {
        try {
            const storedData = await getSecureItem("masterPasswordHash");
            if (!storedData) {
                Alert.alert(
                    "Error",
                    "No master password found. Please contact support."
                );
                return;
            }

            const { hash, salt } = JSON.parse(storedData);
            const isValid = await verifyPassword(enteredPin, salt, hash);

            if (isValid) {
                setUnlocked(true);
                // Navigation will be handled by the useEffect above
            } else {
                setHasError(true);
                setAttempts(prev => prev + 1);

                // Clear PIN after error
                setTimeout(() => {
                    setPin("");
                    setHasError(false);
                }, 600);

                if (attempts >= 3) {
                    Alert.alert(
                        "Too Many Attempts",
                        "Please wait before trying again.",
                        [{ text: "OK" }]
                    );
                }
            }
        } catch (error) {
            console.log("PIN verification error:", error);
            Alert.alert("Error", "Something went wrong. Please try again.");
            setPin("");
            setHasError(false);
        }
    };

    // Manual biometric authentication
    const handleBiometricAuth = async () => {
        if (!isBiometricAvailable || isAuthenticating) return;

        setIsAuthenticating(true);

        try {
            const promptMessage = getBiometricPromptMessage(biometricInfo.type);

            const result = await LocalAuthentication.authenticateAsync({
                promptMessage,
                fallbackLabel: "Use PIN instead",
                cancelLabel: "Cancel",
                disableDeviceFallback: true
            });

            if (result.success) {
                setUnlocked(true);
            } else if (
                result.error === "user_cancel" ||
                result.error === "user_fallback"
            ) {
                // User cancelled or chose to use PIN - do nothing
            } else {
                Alert.alert(
                    "Authentication Failed",
                    "Please try again or use your PIN."
                );
            }
        } catch (error) {
            console.log("Biometric authentication error:", error);
            Alert.alert(
                "Error",
                "Biometric authentication failed. Please use your PIN."
            );
        } finally {
            setIsAuthenticating(false);
        }
    };

    // Determine if we should show biometric or backspace
    const showBiometric =
        pin.length === 0 && isBiometricAvailable && biometricEnabled;

    return (
        <View style={styles.container}>
            {/* App Logo/Icon */}
            <View style={styles.logoContainer}>
                <View style={styles.logoBackground}>
                    <Text style={styles.logoEmoji}>🐧</Text>
                </View>
            </View>

            {/* Title */}
            <Text style={styles.title}>
                Your secret code is required to unlock CredVault
            </Text>

            {/* PIN Display */}
            <PinDisplay length={4} value={pin} error={hasError} />

            {/* Custom NumPad */}
            <CustomNumPad
                onNumberPress={handleNumberPress}
                onBackspace={handleBackspace}
                onBiometric={handleBiometricAuth}
                showBiometric={showBiometric}
                isLoading={isAuthenticating}
                biometricIcon={biometricInfo.iconName}
            />

            {/* Attempt counter (if more than 1 attempt) */}
            {attempts > 1 && (
                <View style={styles.attemptContainer}>
                    <Text style={styles.attemptText}>
                        {attempts >= 3
                            ? "Too many incorrect attempts"
                            : `Attempt ${attempts}`}
                    </Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    logoContainer: {
        alignItems: "center",
        paddingTop: 80,
        paddingBottom: 40
    },
    logoBackground: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: "#f8f9fa",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 3,
        borderColor: "#e9ecef",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4
        },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 4
    },
    logoEmoji: {
        fontSize: 40
    },
    title: {
        fontSize: 18,
        fontWeight: "500",
        color: "#333",
        textAlign: "center",
        marginBottom: 20,
        lineHeight: 24,
        paddingHorizontal: 20
    },
    attemptContainer: {
        alignItems: "center",
        paddingTop: 20
    },
    attemptText: {
        fontSize: 14,
        color: "#ff6b6b",
        textAlign: "center",
        fontWeight: "500"
    }
});
