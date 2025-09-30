// screens/HomeScreen.tsx
import FAB from "../components/FAB";
import AddCredentialModal from "../components/AddCredentialModal";
import React, { useState, useEffect } from "react";
import {
    Text,
    View,
    StyleSheet,
    FlatList,
    SafeAreaView,
    StatusBar,
    TextInput,
    TouchableOpacity,
    Animated
} from "react-native";
import { useCredentialStore } from "../hooks/useCredentialStore";
import CredentialCard from "../components/CredentialCard";
import Toast from "react-native-toast-message";
import { Ionicons } from "@expo/vector-icons";

export default function HomeScreen() {
    const { credentials, loadCredentials } = useCredentialStore();
    const [selectedCredential, setSelectedCredential] = useState<any | null>(
        null
    );
    const [modalVisible, setModalVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [scrollY] = useState(new Animated.Value(0));

    const filteredCredentials = credentials.filter(
        item =>
            item.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (item.username &&
                item.username
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())) ||
            (item.email &&
                item.email.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const handleEdit = (item: any) => {
        setSelectedCredential(item);
        setModalVisible(true);
    };

    const handleAddNew = () => {
        // setSelectedCredential(null);
        setModalVisible(true);
    };

    useEffect(() => {
        loadCredentials();
    }, []);

    const headerOpacity = scrollY.interpolate({
        inputRange: [0, 50],
        outputRange: [0, 1],
        extrapolate: "clamp"
    });

    const EmptyState = () => (
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

    const SearchHeader = () => (
        <View style={styles.searchContainer}>
            <View style={styles.searchInputContainer}>
                <Ionicons
                    name="search"
                    size={20}
                    color="#666"
                    style={styles.searchIcon}
                />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search credentials..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholderTextColor="#999"
                />
                {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={() => setSearchQuery("")}>
                        <Ionicons name="close-circle" size={20} color="#999" />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );

    const StatsBar = () => (
        <View style={styles.statsContainer}>
            <View style={styles.statItem}>
                <Text style={styles.statNumber}>{credentials.length}</Text>
                <Text style={styles.statLabel}>Total</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                    {filteredCredentials.length}
                </Text>
                <Text style={styles.statLabel}>Showing</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                    {
                        credentials.filter(
                            c =>
                                new Date(c.updatedAt || c.createdAt) >
                                new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                        ).length
                    }
                </Text>
                <Text style={styles.statLabel}>This week</Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />

            {/* Animated Header Background */}
            <Animated.View
                style={[styles.headerBackground, { opacity: headerOpacity }]}
            />

            {/* Fixed Header */}
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.greeting}>
                            Good {getTimeOfDay()}
                        </Text>
                        <Text style={styles.title}>Your Vault</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.profileButton}
                        onPress={() => console.log("profileButton soon")}
                    >
                        <Ionicons
                            name="person-circle-outline"
                            size={28}
                            color="#666"
                        />
                    </TouchableOpacity>
                </View>
            </View>

            <Animated.FlatList
                data={filteredCredentials}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <CredentialCard item={item} onEdit={handleEdit} />
                )}
                ListHeaderComponent={
                    <View>
                        <SearchHeader />
                        {credentials.length > 0 && <StatsBar />}
                    </View>
                }
                ListEmptyComponent={
                    searchQuery ? (
                        <View style={styles.noResultsContainer}>
                            <Ionicons name="search" size={48} color="#ccc" />
                            <Text style={styles.noResultsText}>
                                No credentials found
                            </Text>
                            <Text style={styles.noResultsSubtext}>
                                Try adjusting your search terms
                            </Text>
                        </View>
                    ) : (
                        <EmptyState />
                    )
                }
                contentContainerStyle={
                    credentials.length === 0
                        ? styles.emptyContentContainer
                        : styles.contentContainer
                }
                showsVerticalScrollIndicator={false}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: false }
                )}
                scrollEventThrottle={16}
            />

            <FAB onPress={handleAddNew} />

            <AddCredentialModal
                visible={modalVisible}
                onClose={() => {
                    setModalVisible(false);
                    setSelectedCredential(null);
                }}
                credential={selectedCredential}
            />
        </SafeAreaView>
    );
}

const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "morning";
    if (hour < 17) return "afternoon";
    return "evening";
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8f9fa"
    },
    headerBackground: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 120,
        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        zIndex: 1
    },
    header: {
        backgroundColor: "transparent",
        paddingTop: 10,
        paddingBottom: 20,
        zIndex: 2
    },
    headerContent: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20
    },
    titleContainer: {
        flex: 1
    },
    greeting: {
        fontSize: 14,
        color: "#666",
        fontWeight: "500"
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#333",
        marginTop: 2
    },
    profileButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#f8f9fa",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#e9ecef"
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
    contentContainer: {
        paddingBottom: 100
    },
    emptyContentContainer: {
        flexGrow: 1,
        paddingBottom: 100
    },
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
