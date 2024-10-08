import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import AppButton from '@/components/buttons/AppButton'
import { AppStyles } from '@/assets/styles/AppStyles'
import { TextInput } from '@/components/inputs/TextInput'

// export type LoginProps = {
//     navigation: any
// }

export const Login = () => {
    return (
        <View style={styles.container}>
            {/* <TextInput showIcon={true}/> */}
            {/* <AppButton
                title='Login'
                buttonStyle={AppStyles.buttonFill}
                titleStyle={styles.buttonTitle}
                onPress={() => alert('Hello')}
            /> */}
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