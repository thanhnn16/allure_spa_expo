import { View, Text } from 'react-native-ui-lib';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AppButton from '@/components/buttons/AppButton';
import Colors from '@/constants/Colors';
import { useLanguage } from '@/hooks/useLanguage';

export default function EmailVerifyFailed() {
    const { t } = useLanguage();
    return (
        <View flex center bg-surface>
            <View center padding-24>
                <View
                    center
                    br60
                    bg-primary_blur
                    marginB-24
                >
                    <Ionicons name="close-circle" size={40} color="#FF3B30" />
                </View>

                <Text text60BO marginB-8 color={Colors.text}>
                    {t('email_verify.failed')}
                </Text>

                <Text text70 center marginB-24 color={Colors.text_secondary}>
                    {t('email_verify.failed_description')}
                </Text>

                <AppButton
                    type="primary"
                    title={t('common.back_to_home')}
                    onPress={() => router.replace('/(app)/(tabs)/home')}
                />
            </View>
        </View>
    );
}
