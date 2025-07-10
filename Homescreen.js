import React from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Welcome to Pratik Adhikari's Portfolio</Text>
      <Button title="About" onPress={() => navigation.navigate('About')} />
      {/* Add buttons to navigate to other sections */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
});
import React from 'react';
import { WebView } from 'react-native-webview';

export default function ChatbotScreen() {
  return (
    <WebView source={{ uri: 'https://your-chatbot-url' }} />
  );
}
