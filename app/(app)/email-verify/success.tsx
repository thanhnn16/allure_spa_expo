import { View, Text } from 'react-native-ui-lib';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AppButton from '@/components/buttons/AppButton';
import Colors from '@/constants/Colors';
import { useLanguage } from '@/hooks/useLanguage';

export default function EmailVerifySuccess() {
    const { t } = useLanguage();
    return (
        <View flex center bg-surface>
            <View center padding-24>
                <View
                    center
                    width={80}
                    height={80}
                    br60
                    backgroundColor={Colors.primary_blur}
                    marginB-24
                >
                    <Ionicons name="checkmark-circle" size={40} color={Colors.primary} />
                </View>

                <Text text60BO marginB-8 color={Colors.text}>
                    {t('email_verify.success')}
                </Text>

                <Text text70 center marginB-24 color={Colors.text_secondary}>
                    {t('email_verify.success_description')}
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
