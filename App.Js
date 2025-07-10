
/screens/
  - HomeScreen.js
  - AboutScreen.js
  - FoundersScreen.js
  - ProgramsScreen.js
  - GalleryScreen.js
  - ResearchScreen.js
  - ApplicationScreen.js
  - ContactScreen.js
  - LoginScreen.js
  - ChatbotScreen.js
/components/
  - Header.js
  - Footer.js
/assets/
  - images/
  - icons/

  import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import AboutScreen from './screens/AboutScreen';
// ...import other screens

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="About" component={AboutScreen} />
        {/* Add more screens as needed */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
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
  title: { fontSize: 8, fontWeight: 'bold', marginBottom: 20 },
});
import React from 'react';
import { WebView } from 'react-native-webview';

export default function ChatbotScreen() {
  return (
    <WebView source={{ uri: 'https://your-chatbot-url' }} />
  );
}
