import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { getTimeOfDay } from "@/utils/getTimeOfDay";

const Greeting = () => {
    return <Text style={styles.greeting}>Good {getTimeOfDay()}</Text>;
};

const styles = StyleSheet.create({
    greeting: {
        fontSize: 14,
        color: "#666",
        fontWeight: "500"
    },
});

export default Greeting;
