import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import AppButton from '@/components/AppButton'
import { AppStyles } from '@/assets/styles/AppStyles'
import { AppTextInput } from '@/components/AppTextInput'

// export type LoginProps = {
//     navigation: any
// }

export const LoginPage = () => {
    return (
        <View style={styles.container}>
            <AppTextInput showIcon={true}/>
            <AppButton
                title='Login'
                buttonStyle={AppStyles.buttonFill}
                titleStyle={styles.buttonTitle}
                onPress={() => alert('Hello')}
            />
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    buttonTitle: {
        color: 'black',
    }
})