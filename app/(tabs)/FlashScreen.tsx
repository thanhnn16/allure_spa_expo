import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Image } from 'react-native-ui-lib'

export const FlashScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.container}>
        <Image source={require('@/assets/images/logo/logo.png')} style={styles.centerLogo} />
      </View>
      <Image source={require('@/assets/images/logo/nameAllure.png')} style={styles.centerLogo} />
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerLogo: {
    width: 237, height: 175,
  },
  bottomLogo: {
    width: 215, height: 202,
  }
})