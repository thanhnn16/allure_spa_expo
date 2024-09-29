import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'

export type AppButtonProps = {
    onPress?: () => void
    title?: string
    buttonStyle?: any
    titleStyle?: any
}

const AppButton = ({ onPress, title, buttonStyle, titleStyle }: AppButtonProps) => {
    return (
        <TouchableOpacity
            style={[styles.container, buttonStyle]}
            onPress={onPress}
        >
            <Text style={titleStyle}>{title || 'Title'}</Text>
        </TouchableOpacity>
    )
}

export default AppButton

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    }
})
