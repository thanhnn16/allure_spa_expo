import { StyleSheet, } from 'react-native'
import { Text, View, TouchableOpacity, Colors } from 'react-native-ui-lib'
import {
    MaterialCommunityIcons,
} from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { PaymentMethod } from '@/app/(app)/payment';
import { useEffect, useState } from 'react';
import i18n from '@/languages/i18n';


interface PaymentMethodSelectProps {
    onPress?: () => void;
    selectedPayment?: PaymentMethod | null;
    isPayment?: boolean;
}

const PaymentMethodSelect = ({ onPress, selectedPayment, isPayment }: PaymentMethodSelectProps) => {
    const renderPaymentIcon = (method: PaymentMethod) => {
        if (method.iconType === "Ionicons") {
            return (
                <Ionicons
                    name={method.icon as any}
                    size={24}
                    color={Colors.primary}
                />
            );
        }
        return (
            <MaterialCommunityIcons
                name={method.icon as any}
                size={24}
                color={Colors.primary}
            />
        );
    };

    return (
        <View gap-10 marginB-20>
            <Text h2_bold>{i18n.t("payment.payment_method")}</Text>
            <TouchableOpacity
                onPress={isPayment ? onPress : undefined}
            >
                <View
                    row paddingH-15 paddingV-20 centerV spread
                    style={{
                        borderWidth: 1,
                        borderColor: "#E0E0E0",
                        borderRadius: 10,
                        backgroundColor: "#FCFCFC",
                    }}
                >
                    {selectedPayment && (
                        <View row gap-7 centerV>
                            {renderPaymentIcon(selectedPayment)}
                            <Text h3>
                                {selectedPayment.name}
                            </Text>
                        </View>
                    )}
                    {!selectedPayment && (
                        <Text h3>
                            {i18n.t("payment.select_payment_method")}
                        </Text>
                    )}
                    {isPayment && (
                        <View centerV>
                            <Ionicons
                                name="chevron-down"
                                size={24}
                                color={Colors.primary}
                            />
                        </View>
                    )
                    }
                </View>
            </TouchableOpacity>
        </View>
    )
}

export default PaymentMethodSelect

const styles = StyleSheet.create({})