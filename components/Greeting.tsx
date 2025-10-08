import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { getTimeOfTheDay } from "@/utils/getTimeOfTheDay";

const Greeting = () => {
    return <Text style={styles.greeting}>Good {getTimeOfTheDay()}</Text>;
};

const styles = StyleSheet.create({
    greeting: {
        fontSize: 14,
        color: "#666",
        fontWeight: "500"
    },
});

export default Greeting;
