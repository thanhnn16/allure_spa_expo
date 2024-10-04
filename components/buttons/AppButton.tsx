import { Button, View } from 'react-native-ui-lib';
import Colors from '@/constants/Colors';
import { StyleSheet } from 'react-native';

export type AppButtonProps = {
    onPress?: () => void;
    title?: string;
    type: 'primary' | 'secondary' | 'outline' | 'text';
    buttonStyle?: any;
    titleStyle?: any;
    disabled?: boolean;
};

const AppButton = ({ onPress, title, type, buttonStyle, titleStyle, disabled }: AppButtonProps) => {
    const getButtonStyles = () => {
        switch (type) {
            case 'primary':
                return {
                    backgroundColor: Colors.primary,
                    labelStyle: { color: Colors.background, fontSize: 16, fontWeight: 'bold', ...titleStyle },
                };
            case 'secondary':
                return {
                    backgroundColor: Colors.secondary,
                    labelStyle: { color: Colors.primary, fontSize: 16, fontWeight: 'bold', ...titleStyle },
                };
            case 'outline':
                return {
                    backgroundColor: 'transparent',
                    outlineColor: Colors.primary,
                    outlineWidth: 1,
                    labelStyle: { color: Colors.primary, fontSize: 16, fontWeight: 'bold', ...titleStyle },
                };
            case 'text':
                return {
                    backgroundColor: 'transparent',
                    labelStyle: { color: Colors.primary, fontSize: 16, fontWeight: 'bold', ...titleStyle },
                };
        }
    };

    const buttonStyles = getButtonStyles();

    return (
        <View marginV-6>
            <Button
                label={title}
                onPress={onPress}
                disabled={disabled}
                {...buttonStyles}
                style={[styles.button, buttonStyles, buttonStyle]}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    button: {
        height: 48,
        borderRadius: 8,
        paddingHorizontal: 16,
    },
});

export default AppButton;