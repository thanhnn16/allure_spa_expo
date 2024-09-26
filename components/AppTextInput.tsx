import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React from 'react';
import AntDesign from '@expo/vector-icons/AntDesign';
import colors from '@/rn/colors';

export type AppTextInputProps = {
  title?: string;
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  titleStyle?: any;
  textInputStyle?: any;
  containerStyle?: any;
  iconColor?: string;
  iconSize?: number;
  showIcon?: boolean;
  onPressIcon?: () => void;
}

export const AppTextInput = ({
  title,
  placeholder,
  value,
  onChangeText,
  titleStyle,
  textInputStyle,
  containerStyle,
  iconColor,
  iconSize,
  showIcon,
  onPressIcon
}: AppTextInputProps) => {
  return (
    <View style={containerStyle}>
      <Text style={titleStyle}>{title || 'Title'}</Text>
      <View style={{ marginTop: 5 }}>
        <View style={[styles.inputContainer, { borderColor: colors.primary }]}>
          <TextInput
            value={value}
            placeholder={placeholder || 'Placeholder'}
            onChangeText={onChangeText}
            style={[styles.textInput, textInputStyle]}
          />
          {showIcon && (
            <TouchableOpacity onPress={onPressIcon}>
              <AntDesign name={'questioncircle'} size={iconSize || 24} color={iconColor || 'black'} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  containerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputContainer: {
    borderWidth: 2, 
    borderRadius: 8,
    padding: 8, 
    borderColor: colors.primary, 
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
  },
});