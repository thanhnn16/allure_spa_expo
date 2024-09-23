import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AppTextInput } from '@/components/AppTextInput';

const Login = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login Screen</Text>
      <AppTextInput
        title="Số điện thoại"
        placeholder="Nhập số điện thoại của bạn"
        titleStyle={styles.inputTitle}
        textInputStyle={styles.inputText}
        containerStyle={styles.inputContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  inputContainer: {
    width: '100%',
  },
  inputTitle: {
    fontSize: 18,
    color: '#333',
  },
  inputText: {
    fontSize: 16,
    padding: 10,
  },
});

export default Login;