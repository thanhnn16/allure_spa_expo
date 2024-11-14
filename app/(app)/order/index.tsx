import { FlatList, StyleSheet } from 'react-native'
import { View, Text, TabController, Image } from 'react-native-ui-lib'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { getOrderThunk } from '@/redux/features/order/getOrderThunk';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AppBar from '@/components/app-bar/AppBar';
import VoucherSkeletonView from '@/components/voucher/VoucherSkeletonView';
import AppTabBar from '@/components/app-bar/AppTabBar';
import OrderProductItem from '@/components/order/OrderProductItem';
import { OrderItem } from '@/types/order.type';

import ShoppingBagIcon from "@/assets/icons/bag.svg";

const MyOrder = () => {
    const [pendingOrder, setPendingOrder] = useState<OrderItem[]>([]);
    const [confirmedOrder, setConfirmedOrder] = useState<OrderItem[]>([]);
    const [deliveringOrder, setDeliveringOrder] = useState<OrderItem[]>([]);
    const [completesOrder, setCompletesOrder] = useState<OrderItem[]>([]);
    const [canceledOrder, setCanceledOrder] = useState<OrderItem[]>([]);
    const dispatch = useDispatch();

    const { orders, isLoading } = useSelector((
        state: RootState) => state.order
    );

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                await dispatch(getOrderThunk());
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        fetchOrders();
    }, [dispatch]);

    useEffect(() => {
        if (orders.length > 0) {
            setPendingOrder(orders.filter((order: any) => order.status === 'pending').flatMap((order: any) => order.order_items));
            setConfirmedOrder(orders.filter((order: any) => order.status === 'confirmed').flatMap((order: any) => order.order_items));
            setDeliveringOrder(orders.filter((order: any) => order.status === 'delivering').flatMap((order: any) => order.order_items));
            setCompletesOrder(orders.filter((order: any) => order.status === 'completed').flatMap((order: any) => order.order_items));
            setCanceledOrder(orders.filter((order: any) => order.status === 'cancelled').flatMap((order: any) => order.order_items));
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
                    renderItem={({ item }) => (
                        <OrderProductItem
                            key={item.item_id}
                            order={item}
                            status='pending'
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
                    renderItem={({ item }) => (
                        <OrderProductItem
                            key={item.item_id}
                            order={item}
                            status='confirmed'
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
                    renderItem={({ item }) => (
                        <OrderProductItem
                            key={item.item_id}
                            order={item}
                            status='delivering'
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
                    renderItem={({ item }) => (
                        <OrderProductItem
                            key={item.item_id}
                            order={item}
                            status='completed'
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
                    renderItem={({ item }) => (
                        <OrderProductItem
                            key={item.item_id}
                            order={item}
                            status='cancelled'
                        />
                    )}
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