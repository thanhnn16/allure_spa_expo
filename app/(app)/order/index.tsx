import { FlatList, StyleSheet } from 'react-native'
import { View, Text, TabController, Image } from 'react-native-ui-lib'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { getAllVouchersThunk } from '@/redux/features/voucher/getAllVoucherThunk';
import { Voucher as VoucherType } from "@/types/voucher.type";
import VoucherShape from "@/assets/icons/discount-shape.svg";
import VoucherItem from '@/components/voucher/VoucherItem';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AppBar from '@/components/app-bar/AppBar';
import i18n from '@/languages/i18n';
import VoucherSkeletonView from '@/components/voucher/VoucherSkeletonView';
import AppTabBar from '@/components/app-bar/AppTabBar';
import { Orders } from '@/types/order.type';
import OrderProductItem from '@/components/order/OrderProductItem';


const MyOrder = () => {
    const [pendingOrder, setPendingOrder] = useState<Orders[]>([]);
    const [confirmedOrder, setConfirmedOrder] = useState<Orders[]>([]);
    const [deliveringOrder, setDeliveringOrder] = useState<Orders[]>([]);
    const [completesOrder, setCompletesOrder] = useState<Orders[]>([]);
    const [canceledOrder, setCanceledOrder] = useState<Orders[]>([]);
    const dispatch = useDispatch();

    const { orders, isLoading } = useSelector((
        state: RootState) => state.order
    );

    useEffect(() => {
        const fetchOrders = async (
            status: string,
            setOrderState: React.Dispatch<React.SetStateAction<Orders[]>>
        ) => {
            try {
                await dispatch(getAllVouchersThunk());
                setOrderState(orders);
            } catch (error) {
                console.error(`Error fetching ${status} order:`, error);
            }
        };

        fetchOrders("pending", setPendingOrder);
        fetchOrders("confirmed", setConfirmedOrder);
        fetchOrders("delivering", setDeliveringOrder);
        fetchOrders("completed", setCompletesOrder);
        fetchOrders("canceled", setCanceledOrder);
        console.log('orders:', orders);
    }, [dispatch, orders]);

    const renderPendingPage = () => {
        if (pendingOrder.length === 0) {
            return (
                <View flex center>
                    <Image
                        source={VoucherShape}
                        width={200}
                        height={200}
                    />
                    <View marginT-20 centerH>
                        <Text h3_bold>Chưa có đơn hàng nào nào cả!</Text>
                        <Text h3>Mua hàng ngay nhé</Text>
                    </View>
                </View>
            );
        } else if (pendingOrder.length > 0) {
            return (
                <FlatList
                    data={pendingOrder}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => (<OrderProductItem />)}
                />
            );
        };
    };

    const renderConfimedPage = () => {
        if (confirmedOrder.length === 0) {
            return (
                <View flex center>
                    <Image
                        source={VoucherShape}
                        width={200}
                        height={200}
                    />
                    <View marginT-20 centerH>
                        <Text h3_bold>Chưa có đơn hàng nào nào cả!</Text>
                        <Text h3>Mua hàng ngay nhé</Text>
                    </View>
                </View>
            );
        } else if (confirmedOrder.length > 0) {
            return (
                <FlatList
                    data={confirmedOrder}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => (<OrderProductItem />)}
                />
            );
        };
    };

    const renderDeliveringPage = () => {
        if (deliveringOrder.length === 0) {
            return (
                <View flex center>
                    <Image
                        source={VoucherShape}
                        width={200}
                        height={200}
                    />
                    <View marginT-20 centerH>
                        <Text h3_bold>Chưa có đơn hàng nào nào cả!</Text>
                        <Text h3>Mua hàng ngay nhé</Text>
                    </View>
                </View>
            );
        } else if (deliveringOrder.length > 0) {
            return (
                <FlatList
                    data={deliveringOrder}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => (<OrderProductItem />)}
                />
            );
        };
    };

    const renderCompletesPage = () => {
        if (completesOrder.length === 0) {
            return (
                <View flex center>
                    <Image
                        source={VoucherShape}
                        width={200}
                        height={200}
                    />
                    <View marginT-20 centerH>
                        <Text h3_bold>Chưa có đơn hàng nào nào cả!</Text>
                        <Text h3>Mua hàng ngay nhé</Text>
                    </View>
                </View>
            );
        } else if (completesOrder.length > 0) {
            return (
                <FlatList
                    data={completesOrder}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => (<OrderProductItem />)}
                />
            );
        };
    };

    const renderCanceledPage = () => {
        if (canceledOrder.length === 0) {
            return (
                <View flex center>
                    <Image
                        source={VoucherShape}
                        width={200}
                        height={200}
                    />
                    <View marginT-20 centerH>
                        <Text h3_bold>Chưa có đơn hàng nào nào cả!</Text>
                        <Text h3>Mua hàng ngay nhé</Text>
                    </View>
                </View>
            );
        } else if (canceledOrder.length > 0) {
            return (
                <FlatList
                    data={canceledOrder}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => (<OrderProductItem />)}
                />
            );
        };
    };

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View flex bg-white>
                <AppBar back title="Đơn hàng" />
                {isLoading ? (
                    <VoucherSkeletonView />
                ) : (
                    <TabController
                        items={[
                            { label: 'Chờ xác nhận' },
                            { label: 'Chờ lấy hàng' },
                            { label: 'Đang giao hàng' },
                            { label: 'Đã giao hàng' },
                            { label: 'Đã hủy' }
                        ]}
                    >
                        <AppTabBar />
                        <View flex>
                            <TabController.TabPage index={0}>{renderPendingPage()}</TabController.TabPage>
                            <TabController.TabPage index={1} lazy>{renderConfimedPage()}</TabController.TabPage>
                            <TabController.TabPage index={2} lazy>{renderDeliveringPage()}</TabController.TabPage>
                            <TabController.TabPage index={3} lazy>{renderCompletesPage()}</TabController.TabPage>
                            <TabController.TabPage index={4} lazy>{renderCanceledPage()}</TabController.TabPage>
                        </View>
                    </TabController>
                )}

            </View>
        </GestureHandlerRootView>
    )
}

export default MyOrder

const styles = StyleSheet.create({})