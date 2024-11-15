import { FlatList, StyleSheet, ActivityIndicator } from "react-native";
import { View, Text, TabController, Image } from "react-native-ui-lib";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { getAllOrderThunk } from "@/redux/features/order/getAllOrderThunk";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AppBar from "@/components/app-bar/AppBar";
import VoucherSkeletonView from "@/components/voucher/VoucherSkeletonView";
import AppTabBar from "@/components/app-bar/AppTabBar";
import OrderProductItem from "@/components/order/OrderProductItem";
import { Orders } from "@/types/order.type";
import { resetOrders } from "@/redux/features/order/orderSlice";

import ShoppingBagIcon from "@/assets/icons/bag.svg";
import i18n from "@/languages/i18n";

const MyOrder = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const dispatch = useDispatch();
  const { orders, isLoading, isLoadingMore, pagination } = useSelector(
    (state: RootState) => state.order
  );

  const fetchOrdersByStatus = async (status?: string, page: number = 1) => {
    try {
      await dispatch(
        getAllOrderThunk({
          status,
          page,
          per_page: 10,
        })
      ).unwrap();
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    const statuses = [
      "pending",
      "confirmed",
      "shipping",
      "delivered",
      "cancelled",
    ];
    dispatch(resetOrders());
    const timer = setTimeout(() => {
      fetchOrdersByStatus(statuses[selectedIndex], 1);
    }, 100);

    return () => clearTimeout(timer);
  }, [selectedIndex]);

  const handleLoadMore = () => {
    if (isLoadingMore) return;

    const { currentPage, lastPage } = pagination;
    if (currentPage < lastPage) {
      const statuses = [
        "pending",
        "confirmed",
        "shipping",
        "delivered",
        "cancelled",
      ];
      fetchOrdersByStatus(statuses[selectedIndex], currentPage + 1);
    }
  };

  const renderContent = () => {
    if (isLoading && orders.length === 0) {
      return (
        <View flex>
          <VoucherSkeletonView />
          <VoucherSkeletonView />
          <VoucherSkeletonView />
        </View>
      );
    }

    if (orders.length === 0) {
      return (
        <View flex center>
          <Image source={ShoppingBagIcon} width={200} height={200} />
          <View marginT-20 centerH>
            <Text h3_bold>{i18n.t("orders.no_order")}</Text>
            <Text h3>{i18n.t("orders.buy_more")}</Text>
          </View>
        </View>
      );
    }

    return (
      <FlatList
        data={orders}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <OrderProductItem key={item.id} order={item} />
        )}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={() =>
          isLoadingMore ? (
            <View padding-10>
              <ActivityIndicator />
            </View>
          ) : null
        }
      />
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View flex bg-white>
        <AppBar back title={i18n.t("orders.title")} />
        <TabController
          items={[
            { label: i18n.t("orders.pending") },
            { label: i18n.t("orders.confirmed") },
            { label: i18n.t("orders.delivering") },
            { label: i18n.t("orders.completed") },
            { label: i18n.t("orders.cancelled") },
          ]}
          initialIndex={selectedIndex}
          onChangeIndex={(index: number) => setSelectedIndex(index)}
        >
          <AppTabBar />
          <View flex>
            <TabController.TabPage index={0}>
              {renderContent()}
            </TabController.TabPage>
            <TabController.TabPage index={1} lazy>
              {renderContent()}
            </TabController.TabPage>
            <TabController.TabPage index={2} lazy>
              {renderContent()}
            </TabController.TabPage>
            <TabController.TabPage index={3} lazy>
              {renderContent()}
            </TabController.TabPage>
            <TabController.TabPage index={4} lazy>
              {renderContent()}
            </TabController.TabPage>
          </View>
        </TabController>
      </View>
    </GestureHandlerRootView>
  );
};

export default MyOrder;
