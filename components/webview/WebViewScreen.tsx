import React from 'react';
import { WebView } from 'react-native-webview';
import { View, StyleSheet } from 'react-native';
import Constants from 'expo-constants';

interface WebViewScreenProps {
  url: string;
}

const WebViewScreen: React.FC<WebViewScreenProps> = ({ url }) => {
  return (
    <View style={styles.container}>
      <WebView source={{ uri: url }} style={styles.webview} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
  },
  webview: {
    flex: 1,
  },
});

export default WebViewScreen;

