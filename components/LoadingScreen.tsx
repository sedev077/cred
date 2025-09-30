// components/LoadingScreen.tsx
import { View, ActivityIndicator, Text } from 'react-native';

const LoadingScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <ActivityIndicator size="large" />
    <Text style={{ marginTop: 10 }}>Loading...</Text>
  </View>
);

export default LoadingScreen;