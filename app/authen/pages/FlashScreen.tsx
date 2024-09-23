import { StyleSheet, Text, View } from 'react-native'
import React, {useEffect, useRef} from 'react'
import { Image } from 'react-native-ui-lib'
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/types'; // Adjust the import path as necessary


export const FlashScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      navigation.navigate('Onboard'); // Change 'Login' to the screen you want to navigate to
    }, 3000);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current); // Cleanup the timer on component unmount
      }
    };
  }, [navigation]);
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