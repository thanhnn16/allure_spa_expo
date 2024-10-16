import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Fontisto from '@expo/vector-icons/Fontisto';
import { TouchableOpacity } from 'react-native-ui-lib';

type ButtonNotifyIconProps = {
    onPress?: () => void
}
const ButtonNotifyIcon = ({ onPress }: ButtonNotifyIconProps) => {
  return (
    <TouchableOpacity onPress={onPress}>
        <Fontisto name="bell-alt" size={24} color="rgba(113, 118, 88, 0.5)" />
    </TouchableOpacity>
  )
}

export default ButtonNotifyIcon

const styles = StyleSheet.create({})