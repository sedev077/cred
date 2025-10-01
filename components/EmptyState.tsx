import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const EmptyState = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedCredential, setSelectedCredential] = useState<any | null>(
        null
    );
    const [scrollY] = useState(new Animated.Value(0));

    const handleAddNew = () => {
        setModalVisible(true);
    };

    const handleClose = () => {
        setModalVisible(false);
        setSelectedCredential(null);
    };

    const handleEdit = (item: any) => {
        setSelectedCredential(item);
        setModalVisible(true);
    };

    return (
        <View style={styles.emptyContainer}>
            <View style={styles.emptyIconContainer}>
                <Ionicons name="key-outline" size={64} color="#ccc" />
            </View>
            <Text style={styles.emptyTitle}>No credentials yet</Text>
            <Text style={styles.emptySubtitle}>
                Add your first credential to get started with secure password
                management
            </Text>
            <TouchableOpacity style={styles.emptyButton} onPress={handleAddNew}>
                <Ionicons name="add" size={20} color="#fff" />
                <Text style={styles.emptyButtonText}>Add First Credential</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 32,
        paddingTop: 60
    },
    emptyIconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: "#f8f9fa",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 24,
        borderWidth: 2,
        borderColor: "#e9ecef",
        borderStyle: "dashed"
    },
    emptyTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 8,
        textAlign: "center"
    },
    emptySubtitle: {
        fontSize: 16,
        color: "#666",
        textAlign: "center",
        lineHeight: 24,
        marginBottom: 32
    },
    emptyButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#0066cc",
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 25,
        shadowColor: "#0066cc",
        shadowOffset: {
            width: 0,
            height: 4
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4
    },
    emptyButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
        marginLeft: 8
    }
});

export default EmptyState;
