import { Pressable, StyleSheet } from 'react-native'
import { Text, View, Image } from 'react-native-ui-lib'
import { BlurView } from 'expo-blur'
import React from 'react'

import BackIcon from '@/assets/icons/arrow_left.svg'
import { router } from 'expo-router'

interface AppBarProps {
    title: string;
    rightComponent?: React.ReactNode;
}

const AppBar = ({ title, rightComponent }: AppBarProps) => {
  return (
    <BlurView 
        intensity={200}    
    >
        <View style={styles.container}>
            <Pressable onPress={() => router.back()}>
                <View width={50} height={50} centerV>
                    <Image source={BackIcon} />
                </View>
            </Pressable>
            <Text h0_bold>{title}</Text>
            <View width={50} height={50} centerV>
                {rightComponent}
            </View>
        </View>
    </BlurView>
  )
}

export default AppBar

const styles = StyleSheet.create({
    container: {
        height: 60, 
        paddingVertical: 10, 
        paddingHorizontal: 16, 
        alignItems: 'center', 
        justifyContent: 'space-between',
        flexDirection: 'row',
    }
})