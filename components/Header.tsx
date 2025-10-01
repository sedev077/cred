import Greeting from "./Greeting";
import React from "react";
import {
    View,
    Text,
    Animated,
    TouchableOpacity,
    StyleSheet
} from "react-native";

const Header = () => {
    const [scrollY] = useState(new Animated.Value(0));

    const headerOpacity = scrollY.interpolate({
        inputRange: [0, 50],
        outputRange: [0, 1],
        extrapolate: "clamp"
    });

    return (
        <>
            {/* Animated Header Background */}
            <Animated.View
                style={[styles.headerBackground, { opacity: headerOpacity }]}
            />
            {/* Fixed Header */}
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <View style={styles.titleContainer}>
                        <Greeting />

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
        </>
    );
};

const styles = StyleSheet.create({
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
    }
});

export default Header;
