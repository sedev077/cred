import Header from "../components/Header";
import CredentialList from "../components/CredentialList";
import FAB from "../components/FAB";
import CredentialForm from "../components/CredentialForm";
import React, { useState, useEffect } from "react";
import { getSecureItem, deleteSecureItem } from "@/utils/secureStorage";
import {
    StyleSheet,
    SafeAreaView,
    StatusBar,
    Animated
} from "react-native";
import { useCredentialStore } from "../hooks/useCredentialStore";

export default function HomeScreen() {
    const { credentials, loadCredentials } = useCredentialStore();

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

    useEffect(() => {
        // resetStorage('credentials')
        // One-time migration function
        // clearAllIndividualCredentials();
        // migrateCredentials();
        loadCredentials();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <Header />
            <CredentialList
                data={credentials}
                editFn={handleEdit}
                addFn={handleAddNew}
            />
            <FAB onPress={handleAddNew} />
            <CredentialForm
                visible={modalVisible}
                onClose={handleClose}
                credential={selectedCredential}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8f9fa"
    },
    searchContainer: {
        paddingHorizontal: 16,
        paddingVertical: 8
    },
    searchInputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: "#e9ecef",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1
        },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2
    },
    searchIcon: {
        marginRight: 12
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: "#333"
    },
    statsContainer: {
        flexDirection: "row",
        backgroundColor: "#fff",
        marginHorizontal: 16,
        marginVertical: 8,
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: "#e9ecef",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1
        },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2
    },
    statItem: {
        flex: 1,
        alignItems: "center"
    },
    statNumber: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#0066cc",
        marginBottom: 4
    },
    statLabel: {
        fontSize: 12,
        color: "#666",
        textTransform: "uppercase",
        letterSpacing: 0.5
    },
    statDivider: {
        width: 1,
        backgroundColor: "#e9ecef",
        marginHorizontal: 16
    },
    noResultsContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 80
    },
    noResultsText: {
        fontSize: 18,
        fontWeight: "600",
        color: "#666",
        marginTop: 16,
        marginBottom: 8
    },
    noResultsSubtext: {
        fontSize: 14,
        color: "#999",
        textAlign: "center"
    }
});
