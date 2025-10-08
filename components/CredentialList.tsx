import EmptyState from "./EmptyState";
import React, { useState } from "react";
import { StyleSheet, Animated } from "react-native";
import { useCredentialStore } from "@/hooks/useCredentialStore";
import CredentialCard from "./CredentialCard";
import CredentialListSkeleton from "./CredentialListSkeleton";

type CredentialListProps = {
    data: any;
    editFn: (item: any) => any;
    addFn: () => void;
};

const CredentialList = ({
    data,
    editFn,
    addFn
}: CredentialListProps) => {
    const { isHydrated } = useCredentialStore();
    const [scrollY] = useState(new Animated.Value(0));

    if (!isHydrated) {
        return <CredentialListSkeleton />;
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
                data.length === 0
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
