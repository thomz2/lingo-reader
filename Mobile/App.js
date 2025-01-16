import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import "./global.css"
import { ReaderProvider } from '@epubjs-react-native/core';

export default function App() {
  return (
    <ReaderProvider>
      <View style={styles.container}>
        <Text className="font-bold text-3xl bg-yellow-600 text-red-400">OLA MUNDO</Text>
        <StatusBar style="auto" />
      </View>
    </ReaderProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
