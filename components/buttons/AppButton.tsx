import React from 'react';
import { Button, View } from 'react-native-ui-lib';
import colors from '@/rn/colors';
import { StyleSheet } from 'react-native';

export type AppButtonProps = {
    onPress?: () => void;
    title?: string;
    buttonStyle?: any;
    titleStyle?: any;
};

const AppButton = ({ onPress, title = "Title", buttonStyle, titleStyle }: AppButtonProps) => {
    return (
        <View center row flex marginV-6 paddingH-24>
            <Button
                flex
                borderRadius={8}
                backgroundColor={colors.primary}
                onPress={onPress}
                label={title}
                labelStyle={[styles.labelStyle, titleStyle]}
                color={colors.secondary}
                size={Button.sizes.large}
                style={[styles.buttonStyle, buttonStyle]}
                paddingV-12
            />
        </View>
    );
};

export default AppButton;

const styles = StyleSheet.create({
    buttonStyle: {
        marginVertical: 6,
        backgroundColor: colors.secondary,
        borderWidth: 2,
        borderColor: colors.primary,

    },
    labelStyle: {
        color: colors.white,
        fontSize: 20,
        fontFamily: 'OpenSans-Regular',
    },
});