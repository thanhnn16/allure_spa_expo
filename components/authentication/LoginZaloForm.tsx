import React, { useState } from 'react';
import i18n from '@/languages/i18n';
import AppButton from '@/components/buttons/AppButton';
import { useZaloAuth } from '@/hooks/useZaloAuth';
import { Text, View } from 'react-native-ui-lib';
import AppDialog from '@/components/dialog/AppDialog';

interface LoginZaloFormProps {
    onBackPress: () => void;
}

const LoginZaloForm: React.FC<LoginZaloFormProps> = ({ onBackPress }) => {
    const { login, loading } = useZaloAuth();
    const [dialogVisible, setDialogVisible] = useState(false);
    const [dialogType, setDialogType] = useState<'success' | 'error' | 'info' | 'warning'>('info');
    const [dialogTitle, setDialogTitle] = useState('');
    const [dialogDescription, setDialogDescription] = useState('');

    const showDialog = (type: 'success' | 'error' | 'info' | 'warning', title: string, description: string) => {
        setDialogType(type);
        setDialogTitle(title);
        setDialogDescription(description);
        setDialogVisible(true);
    };

    const handleLogin = async () => {
        try {
            await login();
            showDialog('success', i18n.t('auth.login.success'), i18n.t('auth.login.zalo_login_success'));
        } catch (error: any) {
            showDialog('error', i18n.t('auth.login.error'), error.message || i18n.t('auth.login.unknown_error'));
        }
    };

    return (
        <View>
            <Text text70H>{i18n.t('auth.login.zalo_login_description')}</Text>
            <View marginT-10 marginB-20>
                <AppButton
                    type="primary"
                    title={i18n.t('continue')}
                    loading={loading}
                    onPress={handleLogin}
                />
                <AppButton
                    title={i18n.t('back')}
                    type="outline"
                    marginT-12
                    onPress={onBackPress}
                />
            </View>

            <AppDialog
                visible={dialogVisible}
                severity={dialogType}
                title={dialogTitle}
                description={dialogDescription}
                closeButton={true}
                onClose={() => setDialogVisible(false)}
            />
        </View>
    );
};

export default LoginZaloForm;
