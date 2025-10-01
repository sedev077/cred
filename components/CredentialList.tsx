import LoadingScreen from "./LoadingScreen";
import EmptyState from "./EmptyState";
import React from "react";
import { StyleSheet, FlatList, Animated } from "react-native";
import { useCredentialStore } from "@/hooks/CredentialList";
import CredentialCard from "./CredentialCard";

type CredentialListProps = {
    data: any;
    editFn: () => void;
    addFn: () => void;
};

const CredentialList = ({
    credentials,
    editFn,
    addFn
}: CredentialListProps) => {
    const { isHydrated } = useCredentialStore();
    const [scrollY] = useState(new Animated.Value(0));

    if (!isHydrated) {
        return <LoadingScreen />;
    }

    return (
        <Animated.FlatList
            data={data}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
                <CredentialCard item={item} onEdit={editFn} />
            )}
            ListEmptyComponent={<EmptyState onAdd={addFn} />}
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
    );
};

const styles = StyleSheet.create({
    contentContainer: {
        paddingBottom: 100
    },
    emptyContentContainer: {
        flexGrow: 1,
        paddingBottom: 100
    },
});

export default CredentialList;
