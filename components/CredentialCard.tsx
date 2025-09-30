// components/CredentialCard.tsx
import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Alert,
    StyleSheet,
    Animated
} from "react-native";
import { useCredentialStore } from "../hooks/useCredentialStore";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import Toast from "react-native-toast-message";
import { AppToast } from '@/utils/toast'

export default function CredentialCard({
    item,
    onEdit
}: {
    item: any;
    onEdit: (item: any) => void;
}) {
    const deleteCredential = useCredentialStore(
        state => state.deleteCredential
    );
    const [showPassword, setShowPassword] = useState(false);
    const [pressAnim] = useState(new Animated.Value(1));

    const handlePressIn = () => {
        Animated.spring(pressAnim, {
            toValue: 0.98,
            useNativeDriver: true
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(pressAnim, {
            toValue: 1,
            useNativeDriver: true
        }).start();
    };

    const handleDelete = () => {
        Alert.alert(
            "Delete Credential",
            `Are you sure you want to delete "${item.service}"?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => {
                        deleteCredential(item.id);
                        AppToast.delete.success(
                            `${item.service} has been deleted`
                        );
                    }
                }
            ]
        );
    };

    const copyToClipboard = async (text: string, type: string) => {
        await Clipboard.setStringAsync(text);
        Toast.show({
            type: "success",
            text1: `${type} copied!`,
            position: "bottom",
            visibilityTime: 2000
        });
    };

    const getServiceIcon = (service: string) => {
        const serviceLower = service.toLowerCase();
        if (serviceLower.includes("gmail") || serviceLower.includes("google"))
            return "logo-google";
        if (serviceLower.includes("apple") || serviceLower.includes("icloud"))
            return "logo-apple";
        if (serviceLower.includes("facebook")) return "logo-facebook";
        if (serviceLower.includes("twitter")) return "logo-twitter";
        if (serviceLower.includes("instagram")) return "logo-instagram";
        if (serviceLower.includes("linkedin")) return "logo-linkedin";
        if (serviceLower.includes("github")) return "logo-github";
        if (serviceLower.includes("microsoft")) return "logo-microsoft";
        if (serviceLower.includes("amazon")) return "logo-amazon";
        if (serviceLower.includes("tiktok")) return "logo-tiktok";
        if (serviceLower.includes("youtube")) return "logo-youtube";
        if (serviceLower.includes("linux")) return "logo-tux";
        return "globe-outline";
    };

    return (
        <Animated.View
            style={[styles.container, { transform: [{ scale: pressAnim }] }]}
        >
            <TouchableOpacity
                style={styles.card}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                onPress={() => onEdit(item)}
                activeOpacity={0.9}
            >
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.serviceInfo}>
                        <View style={styles.iconContainer}>
                            <Ionicons
                                name={getServiceIcon(item.service)}
                                size={24}
                                color="#0066cc"
                            />
                        </View>
                        <View style={styles.serviceText}>
                            <Text style={styles.serviceName}>
                                {item.service}
                            </Text>
                            <Text style={styles.serviceUrl}>
                                {item.website || "No website"}
                            </Text>
                        </View>
                    </View>

                    <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={handleDelete}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <Ionicons
                            name="trash-outline"
                            size={20}
                            color="#ff6b6b"
                        />
                    </TouchableOpacity>
                </View>

                {/* Content */}
                <View style={styles.content}>
                    {/* Username */}
                    <View style={styles.credentialRow}>
                        <View style={styles.credentialInfo}>
                            <Text style={styles.credentialLabel}>Username</Text>
                            <Text
                                style={styles.credentialValue}
                                numberOfLines={1}
                            >
                                {item.username || item.email || "Not provided"}
                            </Text>
                        </View>
                        <TouchableOpacity
                            style={styles.copyButton}
                            onPress={() =>
                                copyToClipboard(
                                    item.username || item.email || "",
                                    "Username"
                                )
                            }
                        >
                            <Ionicons
                                name="copy-outline"
                                size={16}
                                color="#666"
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Password */}
                    <View style={styles.credentialRow}>
                        <View style={styles.credentialInfo}>
                            <Text style={styles.credentialLabel}>Password</Text>
                            <Text
                                style={styles.credentialValue}
                                numberOfLines={1}
                            >
                                {showPassword
                                    ? item.password
                                    : item.passwordPlaceholder}
                            </Text>
                        </View>
                        <View style={styles.passwordActions}>
                            <TouchableOpacity
                                style={styles.actionButton}
                                onPress={() => setShowPassword(!showPassword)}
                            >
                                <Ionicons
                                    name={
                                        showPassword
                                            ? "eye-off-outline"
                                            : "eye-outline"
                                    }
                                    size={16}
                                    color="#666"
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.actionButton}
                                onPress={() =>
                                    copyToClipboard(item.password, "Password")
                                }
                            >
                                <Ionicons
                                    name="copy-outline"
                                    size={16}
                                    color="#666"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Notes (if any) */}
                    {item.notes && (
                        <View style={styles.notesRow}>
                            <Text style={styles.credentialLabel}>Notes</Text>
                            <Text style={styles.notesText} numberOfLines={2}>
                                {item.notes}
                            </Text>
                        </View>
                    )}
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.lastUpdated}>
                        Updated{" "}
                        {new Date(
                            item.updatedAt || item.createdAt
                        ).toLocaleDateString()}
                    </Text>
                    <View style={styles.editIndicator}>
                        <Ionicons
                            name="create-outline"
                            size={14}
                            color="#999"
                        />
                        <Text style={styles.editText}>Tap to edit</Text>
                    </View>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 16,
        marginVertical: 6
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 16,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        borderWidth: 1,
        borderColor: "#f0f0f0"
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16
    },
    serviceInfo: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#f8f9fa",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12
    },
    serviceText: {
        flex: 1
    },
    serviceName: {
        fontSize: 18,
        fontWeight: "600",
        color: "#333",
        marginBottom: 2
    },
    serviceUrl: {
        fontSize: 14,
        color: "#666"
    },
    deleteButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "#fff5f5",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#ffe0e0"
    },
    content: {
        marginBottom: 16
    },
    credentialRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 12,
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: "#f8f9fa",
        borderRadius: 8
    },
    credentialInfo: {
        flex: 1,
        marginRight: 12
    },
    credentialLabel: {
        fontSize: 12,
        color: "#666",
        fontWeight: "500",
        marginBottom: 2,
        textTransform: "uppercase",
        letterSpacing: 0.5
    },
    credentialValue: {
        fontSize: 16,
        color: "#333",
        fontWeight: "500"
    },
    copyButton: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#e9ecef"
    },
    passwordActions: {
        flexDirection: "row",
        alignItems: "center"
    },
    actionButton: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#e9ecef",
        marginLeft: 8
    },
    notesRow: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: "#f8f9fa",
        borderRadius: 8
    },
    notesText: {
        fontSize: 14,
        color: "#666",
        fontStyle: "italic",
        lineHeight: 20
    },
    footer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: "#f0f0f0"
    },
    lastUpdated: {
        fontSize: 12,
        color: "#999"
    },
    editIndicator: {
        flexDirection: "row",
        alignItems: "center"
    },
    editText: {
        fontSize: 12,
        color: "#999",
        marginLeft: 4
    }
});
