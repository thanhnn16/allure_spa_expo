import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Colors, Wizard } from 'react-native-ui-lib'

const TransactionHeader = ({ status }: { status: string }) => {
    const handleGetOrderStatus = (status: string) => {
        if (status === "pending") {
            return 0;
        } else if (status === "confirmed") {
            return 1;
        } else if (status === "shipping") {
            return 2;
        } else if (status === "completed") {
            return 3;
        } else {
            return 4;
        }
    };
    return (
        <Wizard activeIndex={handleGetOrderStatus(status)} onActiveIndexChanged={() => handleGetOrderStatus(status)}>
            <Wizard.Step state={Wizard.States.COMPLETED} enabled={false} label={'Chờ xác nhận'} />
            <Wizard.Step state={Wizard.States.COMPLETED} enabled={false} label={'Chở lấy hàng'} />
            <Wizard.Step state={Wizard.States.COMPLETED} enabled={false} label={'Đang giao hàng'} />
            <Wizard.Step state={Wizard.States.COMPLETED} enabled={false} label={'Hoàn thành'} />
            <Wizard.Step state={Wizard.States.COMPLETED} enabled={false} label={'Đã hủy'} />
        </Wizard>
    )
}

export default TransactionHeader