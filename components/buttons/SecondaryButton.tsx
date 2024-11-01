import React from 'react';
import { Button, Colors, Text, TouchableOpacity, View } from 'react-native-ui-lib';
import colors from '@/constants/Colors';

export type BackButtonProps = {
    onPress?: () => void;
    title?: string;
    buttonStyle?: any;
    titleStyle?: any;
};

const BackButton = ({ onPress, title = "Quay lại", buttonStyle, titleStyle }: BackButtonProps) => {
    return (
        <View center row flex marginV-6 paddingH-24>
            <Button
                flex
                borderRadius={8}
                backgroundColor={colors.secondary}
                onPress={onPress}
                label={title}
                labelStyle={{ color: colors.primary, fontSize: 20, fontFamily: 'OpenSans-Regular' }}
                color={colors.secondary}
                size={Button.sizes.large}
                paddingV-12
            >
            </Button>
        </View>
    );
};

export default BackButton;
