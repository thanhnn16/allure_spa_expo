import { StyleSheet, Text, TextInput, TouchableOpacity, View, KeyboardTypeOptions } from 'react-native';
import React from 'react';
import AntDesign from '@expo/vector-icons/AntDesign';
import colors from '@/rn/colors';
import { Colors } from '@/constants/Colors';

export type AppTextInputProps = {
  title?: string;
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  titleStyle?: any;
  textInputStyle?: any;
  containerStyle?: any;
  keyboardType?: KeyboardTypeOptions;
  maxLength?: number;
  secureTextEntry?: boolean;

}

export const AppTextInput = ({
  title,
  placeholder,
  value,
  onChangeText,
  titleStyle,
  textInputStyle,
  containerStyle,
  secureTextEntry,
  keyboardType, 
  maxLength, 
}: AppTextInputProps) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {title && <Text style={[styles.title, titleStyle]}>{title}</Text>}
      <View style={styles.inputWrapper}>
        <TextInput
          value={value}
          placeholder={placeholder || 'Placeholder'}
          onChangeText={onChangeText}
          style={[styles.textInput, textInputStyle]}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType} // Sử dụng thuộc tính này
          maxLength={maxLength} // Sử dụng thuộc tính này
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  title: {
    marginBottom: 5,
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.black,
  },
  inputWrapper: {
    borderWidth: 2,
    borderRadius: 8,
    padding: 8,
    borderColor: colors.primary,
    height: 48,
    color: colors.black,
  },
  textInput: {
    flex: 1,
    height: '100%',
    color: colors.black,
  },
});