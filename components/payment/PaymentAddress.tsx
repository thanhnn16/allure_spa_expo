import { StyleSheet } from 'react-native'
import { Card, Text, TouchableOpacity, View, Image } from 'react-native-ui-lib'
import React from 'react'

import BackIcon from '@/assets/icons/arrow_left.svg'

interface PaymentAddressProps {
    isPayment?: boolean;       
}

const PaymentAddress = ({isPayment} : PaymentAddressProps) => {
    return (
        <View marginV-10>
            <Text h2_bold>Thông tin khách hàng</Text>
            <TouchableOpacity
                onPress={() => console.log("Cập nhật sau")}
            >
                <View 
                row centerV padding-15
                style={{
                    borderWidth: 1,
                    borderColor: "#E0E0E0",
                    borderRadius: 10,
                    marginVertical: 10,
                    backgroundColor: "#FCFCFC",
                    justifyContent: "space-between"
                }}
                >
                    <View>
                        <View
                            centerV centerH width={90}
                            style={{
                                backgroundColor: "#F6F6F6",
                                padding: 5,
                                borderRadius: 5,
                                marginBottom: 5,
                            }}
                        >
                            <Text h3_bold>Mặc định</Text>
                        </View>
                        <Text h3>Lộc Nè Con</Text>
                        <Text h3>+84 123 456 789</Text>
                        <Text h3>
                            123 acb, phường Tân Thới Hiệp, Quận 12, TP.HCM
                        </Text>
                    </View>
                    {isPayment && (
                        <View centerV>
                            <Image source={BackIcon} />
                        </View>
                    )
                    }
                </View>
            </TouchableOpacity>
        </View>
    )
}

export default PaymentAddress

const styles = StyleSheet.create({})