// components/CustomNumPad.tsx
import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Animated
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface NumPadProps {
    onNumberPress: (number: string) => void;
    onBackspace: () => void;
    onBiometric?: () => void;
    showBiometric: boolean;
    isLoading?: boolean;
    biometricIcon?: string;
}

export default function CustomNumPad({
    onNumberPress,
    onBackspace,
    onBiometric,
    showBiometric,
    isLoading = false,
    biometricIcon = "finger-print"
}: NumPadProps) {
    const NumberButton = ({
        number,
        onPress
    }: {
        number: string;
        onPress: () => void;
    }) => {
        const scaleValue = React.useRef(new Animated.Value(1)).current;

        const handlePressIn = () => {
            Animated.spring(scaleValue, {
                toValue: 0.95,
                useNativeDriver: true,
                tension: 300,
                friction: 10
            }).start();
        };

        const handlePressOut = () => {
            Animated.spring(scaleValue, {
                toValue: 1,
                useNativeDriver: true,
                tension: 300,
                friction: 10
            }).start();
        };

        return (
            <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
                <TouchableOpacity
                    style={styles.numberButton}
                    onPress={onPress}
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                    activeOpacity={0.8}
                >
                    <Text style={styles.numberText}>{number}</Text>
                </TouchableOpacity>
            </Animated.View>
        );
    };

    const ActionButton = ({
        onPress,
        children,
        disabled = false
    }: {
        onPress: () => void;
        children: React.ReactNode;
        disabled?: boolean;
    }) => {
        const scaleValue = React.useRef(new Animated.Value(1)).current;

        const handlePressIn = () => {
            if (!disabled) {
                Animated.spring(scaleValue, {
                    toValue: 0.95,
                    useNativeDriver: true,
                    tension: 300,
                    friction: 10
                }).start();
            }
        };

        const handlePressOut = () => {
            Animated.spring(scaleValue, {
                toValue: 1,
                useNativeDriver: true,
                tension: 300,
                friction: 10
            }).start();
        };

        return (
            <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
                <TouchableOpacity
                    style={[
                        styles.actionButton,
                        disabled && styles.disabledButton
                    ]}
                    onPress={onPress}
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                    activeOpacity={0.7}
                    disabled={disabled}
                >
                    {children}
                </TouchableOpacity>
            </Animated.View>
        );
    };

    return (
        <View style={styles.container}>
            {/* Row 1: 1, 2, 3 */}
            <View style={styles.row}>
                <NumberButton number="1" onPress={() => onNumberPress("1")} />
                <NumberButton number="2" onPress={() => onNumberPress("2")} />
                <NumberButton number="3" onPress={() => onNumberPress("3")} />
            </View>

            {/* Row 2: 4, 5, 6 */}
            <View style={styles.row}>
                <NumberButton number="4" onPress={() => onNumberPress("4")} />
                <NumberButton number="5" onPress={() => onNumberPress("5")} />
                <NumberButton number="6" onPress={() => onNumberPress("6")} />
            </View>

            {/* Row 3: 7, 8, 9 */}
            <View style={styles.row}>
                <NumberButton number="7" onPress={() => onNumberPress("7")} />
                <NumberButton number="8" onPress={() => onNumberPress("8")} />
                <NumberButton number="9" onPress={() => onNumberPress("9")} />
            </View>

            {/* Row 4: Forgot/Empty, 0, Biometric/Backspace */}
            <View style={styles.row}>
                <ActionButton onPress={() => {}} disabled>
                    <Text style={styles.forgotText}>FORGOT?</Text>
                </ActionButton>

                <NumberButton number="0" onPress={() => onNumberPress("0")} />

                <ActionButton
                    onPress={
                        showBiometric ? onBiometric || (() => {}) : onBackspace
                    }
                    disabled={isLoading}
                >
                    {showBiometric ? (
                        <Ionicons
                            name={biometricIcon as any}
                            size={28}
                            color={isLoading ? "#999" : "#0066cc"}
                        />
                    ) : (
                        <Ionicons
                            name="backspace-outline"
                            size={28}
                            color="#666"
                        />
                    )}
                </ActionButton>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 20,
        paddingHorizontal: 20
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        marginBottom: 20
    },
    numberButton: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: "#f8f9fa",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#e9ecef",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2
    },
    numberText: {
        fontSize: 32,
        fontWeight: "400",
        color: "#333"
    },
    actionButton: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: "transparent",
        justifyContent: "center",
        alignItems: "center"
    },
    disabledButton: {
        opacity: 0.5
    },
    forgotText: {
        fontSize: 14,
        color: "#0066cc",
        fontWeight: "600",
        letterSpacing: 0.5
    }
});
