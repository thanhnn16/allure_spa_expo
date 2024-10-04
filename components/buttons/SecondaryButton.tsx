import { Button, View } from 'react-native-ui-lib';
import colors from '@/constants/Colors';

export type SecondaryButtonProps = {
    onPress?: () => void;
    title?: string;
    buttonStyle?: any;
    titleStyle?: any;
};

const SecondaryButton = ({ onPress, title = "Quay lại", buttonStyle, titleStyle }: SecondaryButtonProps) => {
    return (
        <View center row flex marginV-6 height={48}>
            <Button
                flex
                borderRadius={8}
                backgroundColor={colors.secondary}
                onPress={onPress}
                label={title}
                labelStyle={{ color: colors.primary, fontSize: 20}}
                color={colors.secondary}
                size={Button.sizes.large}
                style={buttonStyle}
            >
            </Button>
        </View>
    );
};

export default SecondaryButton;