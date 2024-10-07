import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React from 'react'
import AntDesign from '@expo/vector-icons/AntDesign'

export type AppTextInputProps = {
  title?: string
  titleStyle?: any
  textInputStyle?: any
  containerStyle?: any
  placeholder?: string
  value?: string
  showIcon?: boolean
  packageIcon?: string
  iconName?: any
  iconColor?: string
  iconSize?: number
  onPressIcon?: () => void
  onChangeText?: (text: string) => void
}

export const AppTextInput = ({
  title, placeholder, value, onChangeText, titleStyle, textInputStyle, containerStyle,
  iconName, iconColor, iconSize, showIcon, onPressIcon
}: AppTextInputProps) => {

  return (
    <View style={containerStyle}>
      <Text style={titleStyle}>{title || 'Title'}</Text>
      <View style={styles.containerContent}>
        <TextInput
          value={value}
          placeholder={placeholder || 'Placeholder'}
          onChangeText={onChangeText}
          style={textInputStyle}
        />
        {showIcon && <TouchableOpacity onPress={onPressIcon}>
          <AntDesign name={iconName || 'questioncircle'} size={iconSize || 24} color={iconColor || 'black'} />
        </TouchableOpacity>}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  containerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  }
})