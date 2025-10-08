// components/FormInput.tsx
import {
    Modal,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const FormInput = ({
    label,
    value,
    onChangeText,
    placeholder,
    secureTextEntry = false,
    autoCapitalize = "none",
    keyboardType = "default",
    multiline = false,
    rightIcon,
    onRightIconPress,
    error
}: any) => (
    <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>{label}</Text>
        <View style={[styles.inputWrapper, error && styles.inputError]}>
            <TextInput
                style={[styles.input, multiline && styles.multilineInput]}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor="#999"
                secureTextEntry={secureTextEntry}
                autoCapitalize={autoCapitalize}
                keyboardType={keyboardType}
                multiline={multiline}
                numberOfLines={multiline ? 3 : 1}
            />
            {rightIcon && (
                <TouchableOpacity
                    style={styles.inputRightIcon}
                    onPress={onRightIconPress}
                >
                    <Ionicons name={rightIcon} size={20} color="#666" />
                </TouchableOpacity>
            )}
        </View>
        {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
);

const styles = StyleSheet.create({
    // Individual input container
    inputContainer: {
        marginBottom: 20
    },

    // Input label
    inputLabel: {
        fontSize: 14,
        fontWeight: "600",
        color: "#333",
        marginBottom: 8
    },

    // Input wrapper (contains input and right icon)
    inputWrapper: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f8f9fa",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#e9ecef",
        paddingHorizontal: 16,
        minHeight: 50
    },

    // Input with error styling
    inputError: {
        borderColor: "#ff6b6b",
        backgroundColor: "#fff5f5"
    },

    // Text input field
    input: {
        flex: 1,
        fontSize: 16,
        color: "#333",
        paddingVertical: 12
    },

    // Multiline input styling
    multilineInput: {
        paddingTop: 12,
        paddingBottom: 12,
        textAlignVertical: "top",
        minHeight: 80
    },

    // Right icon in input (eye icon, etc.)
    inputRightIcon: {
        marginLeft: 12,
        padding: 4
    },

    // Error message text
    errorText: {
        fontSize: 12,
        color: "#ff6b6b",
        marginTop: 4,
        marginLeft: 4
    }
});

export default FormInput;
