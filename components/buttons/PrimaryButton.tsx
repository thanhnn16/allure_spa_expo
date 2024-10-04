import { Button, View } from 'react-native-ui-lib';
import colors from '@/constants/Colors';

export type PrimaryButtonProps = {
    onPress?: () => void;
    title?: string;
};

const PrimaryButton = ({ onPress, title, }: PrimaryButtonProps) => {
    return (
        <View center row flex marginV-6 height={48}>
            <Button
                flex
                borderRadius={8}
                backgroundColor={colors.primary}
                onPress={onPress}
                label={title}
                labelStyle={{ color: colors.white, fontSize: 20 }}
                color={colors.secondary}
                size={Button.sizes.large}
            />
        </View>
    );
};

export default PrimaryButton;
