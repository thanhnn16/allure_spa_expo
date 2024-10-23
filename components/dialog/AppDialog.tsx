// components/dialog/AppDialog.tsx

import React from 'react';
import { Dialog, Button, Text, Image, View } from 'react-native-ui-lib';

import SuccessIcon from '@/assets/icons/arrow_left.svg'
import ErrorIcon from '@/assets/icons/arrow_left.svg'
import InfoIcon from '@/assets/icons/arrow_left.svg'
import WarningIcon from '@/assets/icons/arrow_left.svg'

interface AppDialogProps {
    visible: boolean;
    title: string;
    description: string;
    closeButton?: boolean;
    confirmButton?: boolean;
    onClose?: () => void;
    onConfirm?: () => void;
    severity: 'success' | 'error' | 'info' | 'warning';
}

const AppDialog = ({ visible, onClose, onConfirm, severity, title, description, closeButton, confirmButton }: AppDialogProps) => {
    const iconMap = {
        success: <SuccessIcon />,
        error: <ErrorIcon />,
        info: <InfoIcon />,
        warning: <WarningIcon />,
    };

    const icon = iconMap[severity];

    return (
        <Dialog
            visible={visible}
            onDismiss={onClose}
        >
            <View style={{ alignItems: 'center', padding: 20 }}>
                <Image
                    source={icon}
                    style={{ width: 100, height: 100 }}
                />
                <Text text60BO>{title}</Text>
                <Text text70>{description}</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
                    {closeButton && <Button label="Cancel" onPress={onClose} />}
                    {confirmButton && <Button label="Confirm" onPress={onConfirm} />}
                </View>
            </View>
        </Dialog>
    );
};

export default AppDialog;
