// components/CredentialForm.tsx
import React, { useState, useEffect, useRef } from "react";
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Animated,
    Dimensions,
    Alert,
    KeyboardAvoidingView,
    Platform
} from "react-native";
import { AppToast } from "../utils/toast";
import { useModalContext } from "../context/ModalContext";
import { useCredentialStore } from "../hooks/useCredentialStore";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import FormInput from "./FormInput";

const { width, height } = Dimensions.get("window");

type CredentialFormProps = {
    visible: boolean;
    onClose: () => void;
    credential?: any; // For editing existing credentials
};

export default function CredentialForm({
    visible,
    onClose,
    credential
}: CredentialFormProps) {
    // Form state
    const [service, setService] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [website, setWebsite] = useState("");
    const [notes, setNotes] = useState("");

    // UI state
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const { openModal, closeModal } = useModalContext();

    // Animation references - initialize to closed state
    const slideAnim = useRef(new Animated.Value(height)).current;
    const scaleAnim = useRef(new Animated.Value(0.9)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    // Get store functions
    const { addCredential, updateCredential } = useCredentialStore();

    // Determine if we're editing
    const isEditing = !!credential;

    // Initialize form with credential data if editing
    useEffect(() => {
        if (credential) {
            setService(credential.service || "");
            setUsername(credential.username ||  "");
            setPassword(credential.password || "");
            setWebsite(credential.website || "");
            setNotes(credential.notes || "");
        } else {
            resetForm();
        }
    }, [credential]);

    // Enhanced animation handling
    useEffect(() => {
        if (visible) {
            // Reset animations to starting positions
            slideAnim.setValue(height);
            scaleAnim.setValue(0.9);
            fadeAnim.setValue(0);

            // Show modal with staggered animations for better effect
            Animated.sequence([
                // Start backdrop fade immediately
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 250,
                    useNativeDriver: true
                }),
                // Slide and scale together with slight delay
                Animated.parallel([
                    Animated.spring(slideAnim, {
                        toValue: 0,
                        tension: 120,
                        friction: 8,
                        useNativeDriver: true
                    }),
                    Animated.spring(scaleAnim, {
                        toValue: 1,
                        tension: 120,
                        friction: 8,
                        useNativeDriver: true
                    })
                ])
            ]).start();
        }
    }, [visible]);

    // Handle close with animation
    const animateClose = (callback: () => void) => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true
            }),
            Animated.spring(slideAnim, {
                toValue: height,
                tension: 150,
                friction: 8,
                useNativeDriver: true
            }),
            Animated.spring(scaleAnim, {
                toValue: 0.9,
                tension: 150,
                friction: 8,
                useNativeDriver: true
            })
        ]).start(() => {
            callback();
        });
    };

    // Reset form to initial state
    const resetForm = () => {
        setService("");
        setUsername("");
        setPassword("");
        setWebsite("");
        setNotes("");
        setErrors({});
        setShowPassword(false);
    };

    // Validate form fields
    const validateForm = (): boolean => {
        const newErrors: { [key: string]: string } = {};

        if (!service.trim()) {
            newErrors.service = "Service name is required";
        }

        if (!username.trim()) {
            newErrors.username = "Username or email is required";
        }

        if (!password.trim()) {
            newErrors.password = "Password is required";
        } else if (password.length < 8) {
            newErrors.password = "Password should be at least 8 characters";
        }

        if (website.trim() && !isValidUrl(website)) {
            newErrors.website = "Please enter a valid URL";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Simple URL validation
    const isValidUrl = (url: string): boolean => {
        try {
            const urlToTest = url.startsWith("http") ? url : `https://${url}`;
            new URL(urlToTest);
            return true;
        } catch {
            return false;
        }
    };

    // Generate a strong random password
    const generatePassword = () => {
        const charset =
            "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
        let result = "";
        for (let i = 0; i < 16; i++) {
            result += charset.charAt(
                Math.floor(Math.random() * charset.length)
            );
        }
        setPassword(result);
        setShowPassword(true);
        Toast.show({
            type: "success",
            text1: "Password generated!",
            text2: "Strong password created",
            position: "bottom"
        });
    };

    // Handle save button press
    const handleSave = async () => {
        if (!validateForm()) {
            Toast.show({
                type: "error",
                text1: "Please fix the errors",
                text2: "Check the highlighted fields",
                position: "bottom"
            });
            return;
        }

        setIsLoading(true);

        try {
            const credentialData = {
                service: service.trim(),
                username: username.trim(),
                password: password,
                website: website.trim(),
                notes: notes.trim(),
                // passwordPlaceholder: "•".repeat(Math.min(password.length, 12)),
            };

            if (isEditing) {
                updateCredential(credential.id, {
                    updatedAt: new Date().toISOString(),
                    ...credentialData});
            } else {
                
                addCredential(credentialData);
            }

            handleClose();
        } catch (error) {
            console.error("Error saving credential:", error);
            Toast.show({
                type: "error",
                text1: "Save failed",
                text2: "Please try again",
                position: "bottom"
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Handle modal close with animation
    const handleClose = () => {
        animateClose(() => {
            resetForm();
            closeModal();
            onClose();
        });
    };

    // Confirm close if form has unsaved changes
    const handleBackdropPress = () => {
        const hasChanges = service || username || password || website || notes;

        if (hasChanges) {
            Alert.alert(
                "Discard changes?",
                "You have unsaved changes. Are you sure you want to close?",
                [
                    { text: "Keep editing", style: "cancel" },
                    {
                        text: "Discard",
                        style: "destructive",
                        onPress: handleClose
                    }
                ]
            );
        } else {
            handleClose();
        }
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="none"
            onShow={openModal}
            onRequestClose={handleBackdropPress}
        >
            {/* Animated backdrop */}
            <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]}>
                <TouchableOpacity
                    style={styles.backdropTouch}
                    activeOpacity={1}
                    onPress={handleBackdropPress}
                />
            </Animated.View>

            {/* Modal container with animations */}
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <Animated.View
                    style={[
                        styles.modal,
                        {
                            transform: [
                                { translateY: slideAnim },
                                { scale: scaleAnim }
                            ]
                        }
                    ]}
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={handleBackdropPress}
                        >
                            <Ionicons name="close" size={24} color="#666" />
                        </TouchableOpacity>

                        <Text style={styles.title}>
                            {isEditing ? "Edit  Credential" : "Add Credential"}
                        </Text>

                        <TouchableOpacity
                            style={[
                                styles.saveButton,
                                isLoading && styles.saveButtonDisabled
                            ]}
                            onPress={handleSave}
                            disabled={isLoading}
                        >
                            <Text style={styles.saveButtonText}>
                                {isLoading ? (isEditing ? "Updating..." : "Saving...") : (isEditing ? "Update" : "Save")}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Form */}
                    <ScrollView
                        style={styles.form}
                        contentContainerStyle={styles.formContent}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >
                        <FormInput
                            label="Service Name *"
                            value={service}
                            onChangeText={setService}
                            placeholder="e.g. Gmail, Facebook, Netflix"
                            autoCapitalize="words"
                            error={errors.service}
                        />

                        <FormInput
                            label="Username / Email *"
                            value={username}
                            onChangeText={setUsername}
                            placeholder="your@email.com or username"
                            keyboardType="email-address"
                            error={errors.username}
                        />

                        <FormInput
                            label="Password *"
                            value={password}
                            onChangeText={setPassword}
                            placeholder="Enter your password"
                            secureTextEntry={!showPassword}
                            rightIcon={showPassword ? "eye-off" : "eye"}
                            onRightIconPress={() =>
                                setShowPassword(!showPassword)
                            }
                            error={errors.password}
                        />

                        {/* Password generator button */}
                        <TouchableOpacity
                            style={styles.generatePasswordButton}
                            onPress={generatePassword}
                        >
                            <Ionicons
                                name="refresh"
                                size={16}
                                color="#0066cc"
                            />
                            <Text style={styles.generatePasswordText}>
                                Generate strong password
                            </Text>
                        </TouchableOpacity>

                        <FormInput
                            label="Website (Optional)"
                            value={website}
                            onChangeText={setWebsite}
                            placeholder="https://example.com"
                            keyboardType="url"
                            autoCapitalize="none"
                            error={errors.website}
                        />

                        <FormInput
                            label="Notes (Optional)"
                            value={notes}
                            onChangeText={setNotes}
                            placeholder="Additional notes or security questions..."
                            multiline
                            error={errors.notes}
                        />

                        {/* Security tip */}
                        <View style={styles.tipContainer}>
                            <Ionicons
                                name="shield-checkmark"
                                size={16}
                                color="#0066cc"
                            />
                            <Text style={styles.tipText}>
                                Your credentials are encrypted and stored
                                securely on this device only.
                            </Text>
                        </View>
                    </ScrollView>
                </Animated.View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    backdrop: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)"
    },
    backdropTouch: {
        flex: 1
    },
    modal: {
        flex: 1,
        width: width * 0.95,
        maxHeight: height * 0.85,
        backgroundColor: "#fff",
        borderRadius: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 10
        },
        shadowOpacity: 0.25,
        shadowRadius: 20,
        elevation: 10
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0"
    },
    closeButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#f8f9fa",
        justifyContent: "center",
        alignItems: "center"
    },
    title: {
        fontSize: 20,
        fontWeight: "600",
        color: "#333",
        flex: 1,
        textAlign: "center",
        marginHorizontal: 16
    },
    saveButton: {
        backgroundColor: "#0066cc",
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        minWidth: 60,
        alignItems: "center"
    },
    saveButtonDisabled: {
        backgroundColor: "#ccc"
    },
    saveButtonText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "600"
    },
    form: {
        flex: 1
    },
    formContent: {
        flexGrow: 1,
        padding: 20,
        paddingBottom: 40
    },
    generatePasswordButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f8f9fa",
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: "#e9ecef"
    },
    generatePasswordText: {
        fontSize: 14,
        color: "#0066cc",
        fontWeight: "500",
        marginLeft: 8
    },
    tipContainer: {
        flexDirection: "row",
        alignItems: "flex-start",
        backgroundColor: "#f0f8ff",
        padding: 16,
        borderRadius: 12,
        marginBottom: 20,
        borderLeftWidth: 3,
        borderLeftColor: "#0066cc"
    },
    tipText: {
        fontSize: 12,
        color: "#666",
        lineHeight: 18,
        marginLeft: 8,
        flex: 1
    }
});
