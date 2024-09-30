import React from 'react';
import { Button, Colors, Text, TouchableOpacity, View } from 'react-native-ui-lib';
import colors from '@/rn/colors';
import { StyleSheet } from 'react-native';

export type SendButtonProps = {
    onPress?: () => void;
    title?: string;
    buttonStyle?: any;
    titleStyle?: any;
};

const PrimaryButton = ({ onPress, title = "Gửi mã OTP", buttonStyle, titleStyle }: SendButtonProps) => {
    return (
        <View center row flex marginV-6 paddingH-24>
            <Button
                flex
                borderRadius={8}
                backgroundColor={colors.primary}
                onPress={onPress}
                label={title}
                labelStyle={{ color: colors.white, fontSize: 20, fontFamily: 'OpenSans-Regular' }}
                color={colors.secondary}
                size={Button.sizes.large}
                paddingV-12
            >
            </Button>
        </View>
    );
};

export default PrimaryButton;
