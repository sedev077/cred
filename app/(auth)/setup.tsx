// app/(auth)/setup.ts
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { getSecureItem, saveSecureItem } from "../../utils/secureStorage";
import * as LocalAuthentication from "expo-local-authentication";
import { hashPassword } from "../../utils/hash";
import { useAuthStore } from "../../store/useAuthStore";
import { useRouter } from "expo-router";

import PinInput from "../../components/PinInput";

export default function SetupMasterPasswordScreen() {
    const [firstPin, setFirstPin] = useState<string | null>(null);
    const [step, setStep] = useState(1);
    const { hasMasterPassword, setHasMasterPassword } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if (hasMasterPassword) {
            router.replace("(auth)/unlock");
        }
    }, [hasMasterPassword]);

    const setupBiometric = async () => {
        const hasHardware = await LocalAuthentication.hasHardwareAsync();
        const supportedTypes =
            await LocalAuthentication.supportedAuthenticationTypesAsync();
        const enrolled = await LocalAuthentication.isEnrolledAsync();

        if (hasHardware && supportedTypes.length > 0 && enrolled) {
            Alert.alert(
                "Biometric Setup",
                "Would you like to enable biometric unlock for faster access?",
                [
                    { text: "No", style: "cancel" },
                    {
                        text: "Yes",
                        onPress: async () => {
                            await saveSecureItem("biometricEnabled", "true");
                            
                            Alert.alert(
                                "Enabled",
                                "Biometric unlock has been enabled!"
                            );
                        }
                    }
                ]
            );
        }
    };

    const handlePinComplete = async (code: string) => {
        if (step === 1) {
            setFirstPin(code);
            setStep(2);
        } else {
            if (firstPin === code) {
                const { hash, salt } = await hashPassword(code);
                await saveSecureItem(
                    "masterPasswordHash",
                    JSON.stringify({ hash, salt })
                );

                setHasMasterPassword(true);
                Alert.alert("Success", "Master PIN set successfully!", [
                    {
                        text: "OK",
                        onPress: async () => {
                            await setupBiometric();
                            router.replace("(auth)/unlock");
                        }
                    }
                ]);
            } else {
                Alert.alert("Mismatch", "PINs do not match");
                setFirstPin(null);
                setStep(1);
            }
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                {step === 1
                    ? "Create your Master PIN"
                    : "Confirm your Master PIN"}
            </Text>
            <PinInput
                length={4}
                onComplete={handlePinComplete}
                resetKey={step}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20
    },
    title: { fontSize: 20, fontWeight: "bold", marginBottom: 20 }
});
