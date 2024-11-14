import { FlatList, StyleSheet } from 'react-native'
import { View, Text, TabController, Image } from 'react-native-ui-lib'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { getAllOrderThunk } from '@/redux/features/order/getAllOrderThunk';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AppBar from '@/components/app-bar/AppBar';
import VoucherSkeletonView from '@/components/voucher/VoucherSkeletonView';
import AppTabBar from '@/components/app-bar/AppTabBar';
import OrderProductItem from '@/components/order/OrderProductItem';
import { Orders } from '@/types/order.type';

import ShoppingBagIcon from "@/assets/icons/bag.svg";
import i18n from '@/languages/i18n';

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
        const fetchOrders = async () => {
            try {
                await dispatch(getAllOrderThunk());
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        fetchOrders();
    }, [dispatch]);

    useEffect(() => {
        if (orders.length > 0) {
            setPendingOrder(orders.filter((order: any) => order.status === 'pending'));
            setConfirmedOrder(orders.filter((order: any) => order.status === 'confirmed'));
            setDeliveringOrder(orders.filter((order: any) => order.status === 'delivering'));
            setCompletesOrder(orders.filter((order: any) => order.status === 'completed'));
            setCanceledOrder(orders.filter((order: any) => order.status === 'cancelled'));
        }
    }, [orders]);

    const renderPendingPage = () => {
        if (pendingOrder.length === 0) {
            return (
                <View flex center>
                    <Image
                        source={ShoppingBagIcon}
                        width={200}
                        height={200}
                    />
                    <View marginT-20 centerH>
                        <Text h3_bold>{i18n.t("orders.no_order")}</Text>
                        <Text h3>{i18n.t("orders.buy_more")}</Text>
                    </View>
                </View>
            );
        } else if (pendingOrder.length > 0) {
            return (
                <FlatList
                    data={pendingOrder}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <OrderProductItem
                            key={item.id}
                            order={item}
                        />
                    )}
                />
            );
        };
    };

    const renderConfimedPage = () => {
        if (confirmedOrder.length === 0) {
            return (
                <View flex center>
                    <Image
                        source={ShoppingBagIcon}
                        width={200}
                        height={200}
                    />
                    <View marginT-20 centerH>
                        <Text h3_bold>{i18n.t("orders.no_order")}</Text>
                        <Text h3>{i18n.t("orders.buy_more")}</Text>
                    </View>
                </View>
            );
        } else if (confirmedOrder.length > 0) {
            return (
                <FlatList
                    data={confirmedOrder}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <OrderProductItem
                            key={item.id}
                            order={item}
                        />
                    )}
                />
            );
        };
    };

    const renderDeliveringPage = () => {
        if (deliveringOrder.length === 0) {
            return (
                <View flex center>
                    <Image
                        source={ShoppingBagIcon}
                        width={200}
                        height={200}
                    />
                    <View marginT-20 centerH>
                        <Text h3_bold>{i18n.t("orders.no_order")}</Text>
                        <Text h3>{i18n.t("orders.buy_more")}</Text>
                    </View>
                </View>
            );
        } else if (deliveringOrder.length > 0) {
            return (
                <FlatList
                    data={deliveringOrder}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <OrderProductItem
                            key={item.id}
                            order={item}
                        />
                    )}
                />
            );
        };
    };

    const renderCompletesPage = () => {
        if (completesOrder.length === 0) {
            return (
                <View flex center>
                    <Image
                        source={ShoppingBagIcon}
                        width={200}
                        height={200}
                    />
                    <View marginT-20 centerH>
                        <Text h3_bold>{i18n.t("orders.no_order")}</Text>
                        <Text h3>{i18n.t("orders.buy_more")}</Text>
                    </View>
                </View>
            );
        } else if (completesOrder.length > 0) {
            return (
                <FlatList
                    data={completesOrder}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <OrderProductItem
                            key={item.id}
                            order={item}
                        />
                    )}
                />
            );
        };
    };

    const renderCanceledPage = () => {
        if (canceledOrder.length === 0) {
            return (
                <View flex center>
                    <Image
                        source={ShoppingBagIcon}
                        width={200}
                        height={200}
                    />
                    <View marginT-20 centerH>
                        <Text h3_bold>{i18n.t("orders.no_order")}</Text>
                        <Text h3>{i18n.t("orders.buy_more")}</Text>
                    </View>
                </View>
            );
        } else if (canceledOrder.length > 0) {
            return (
                <FlatList
                    data={canceledOrder}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <OrderProductItem
                            key={item.id}
                            order={item}
                        />
                    )}
                />
            );
        };
    };

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View flex bg-white>
                <AppBar back title={i18n.t("orders.title")} />
                {isLoading ? (
                    <VoucherSkeletonView />
                ) : (
                    <TabController
                        items={[
                            { label: i18n.t("orders.pending") },
                            { label: i18n.t("orders.confirmed") },
                            { label: i18n.t("orders.delivering") },
                            { label: i18n.t("orders.completed") },
                            { label: i18n.t("orders.cancelled") }
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