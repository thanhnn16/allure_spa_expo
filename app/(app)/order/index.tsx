import { ActivityIndicator, RefreshControl, Dimensions } from "react-native";
import {
  View,
  Text,
  TabController,
  Image,
  Colors,
  SkeletonView,
} from "react-native-ui-lib";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { getAllOrderThunk } from "@/redux/features/order/getAllOrderThunk";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AppBar from "@/components/app-bar/AppBar";
import AppTabBar from "@/components/app-bar/AppTabBar";
import OrderProductItem from "@/components/order/OrderProductItem";
import { resetOrders } from "@/redux/features/order/orderSlice";

import ShoppingBagIcon from "@/assets/icons/bag.svg";
import i18n from "@/languages/i18n";
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  withTiming,
  useSharedValue,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");

const MyOrder = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isTabChanging, setIsTabChanging] = useState(false);
  const dispatch = useDispatch();
  const { orders, isLoading, isLoadingMore, pagination } = useSelector(
    (state: RootState) => state.order
  );
  const [refreshing, setRefreshing] = useState(false);

  // Thay thế fadeAnim bằng useSharedValue
  const fadeAnim = useSharedValue(0);

  // Tạo animated style
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: fadeAnim.value,
    };
  });

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
    } finally {
      setIsTabChanging(false);
    }
  };

  useEffect(() => {
    const statuses = [
      "pending",
      "confirmed",
      "shipping",
      "completed",
      "cancelled",
    ];
    setIsTabChanging(true);
    dispatch(resetOrders());
    fetchOrdersByStatus(statuses[selectedIndex], 1);
  }, [selectedIndex]);

  const handleLoadMore = () => {
    if (isLoadingMore) return;

    const { currentPage, lastPage } = pagination;
    if (currentPage < lastPage) {
      const statuses = [
        "pending",
        "confirmed",
        "shipping",
        "completed",
        "cancelled",
      ];
      fetchOrdersByStatus(statuses[selectedIndex], currentPage + 1);
    }
  };

  const fadeIn = () => {
    fadeAnim.value = withTiming(1, { duration: 500 });
  };

  useEffect(() => {
    fadeIn();
  }, [orders]);

  const onRefresh = async () => {
    setRefreshing(true);
    const statuses = [
      "pending",
      "confirmed",
      "shipping",
      "completed",
      "cancelled",
    ];
    await fetchOrdersByStatus(statuses[selectedIndex], 1);
    setRefreshing(false);
  };

  const renderSkeletonLoading = () => (
    <View flex paddingH-16>
      {[1, 2, 3].map((_, index) => (
        <View key={index}>
          <Animated.View
            entering={FadeInDown.delay(index * 100).duration(400)}
            style={{
              backgroundColor: "white",
              borderRadius: 10,
              margin: 10,
              padding: 16,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              elevation: 3,
            }}
          >
            <View row spread centerV>
              <SkeletonView width={width * 0.3} height={20} />
              <SkeletonView width={width * 0.2} height={20} />
            </View>
            <View height={1} marginV-10 bg-grey50 />
            <View row marginT-16>
              <SkeletonView width={100} height={100} borderRadius={13} />
              <View marginL-10 flex>
                <SkeletonView width={width * 0.5} height={20} />
                <SkeletonView width={width * 0.3} height={20} marginT-8 />
                <SkeletonView width={width * 0.2} height={20} marginT-8 />
              </View>
            </View>
            <View height={1} marginT-16 bg-grey50 />
            <View row spread marginT-16>
              <SkeletonView width={width * 0.3} height={20} />
              <SkeletonView width={width * 0.2} height={20} />
            </View>
          </Animated.View>
        </View>
      ))}
    </View>
  );

  const renderEmptyState = () => (
    <View flex center>
      <Animated.View entering={FadeInDown.duration(400)}>
        <Image
          source={ShoppingBagIcon}
          width={150}
          height={150}
          style={{ opacity: 0.8, alignSelf: "center" }}
        />
        <Text h3_bold center marginT-16>
          {i18n.t("orders.no_order")}
        </Text>
        <Text center h3 marginT-8 grey30>
          {i18n.t("orders.buy_more")}
        </Text>
      </Animated.View>
    </View>
  );

  const renderContent = () => {
    if (isLoading || isTabChanging) {
      return renderSkeletonLoading();
    }

    if (!isLoading && orders.length === 0) {
      return renderEmptyState();
    }

    return (
      <Animated.FlatList
        data={orders}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.primary]}
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={() =>
          isLoadingMore && (
            <ActivityIndicator size="small" color={Colors.primary} />
          )
        }
        renderItem={({ item, index }) => (
          <View>
            <Animated.View
              entering={FadeInDown.delay(index * 100).duration(400)}
            >
              <OrderProductItem order={item} />
            </Animated.View>
          </View>
        )}
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
          onChangeIndex={(index: number) => {
            setSelectedIndex(index);
          }}
        >
          <AppTabBar />
          <View flex>
            <TabController.TabPage index={0}>
              {renderContent()}
            </TabController.TabPage>
            <TabController.TabPage index={1}>
              {renderContent()}
            </TabController.TabPage>
            <TabController.TabPage index={2}>
              {renderContent()}
            </TabController.TabPage>
            <TabController.TabPage index={3}>
              {renderContent()}
            </TabController.TabPage>
            <TabController.TabPage index={4}>
              {renderContent()}
            </TabController.TabPage>
          </View>
        </TabController>
      </View>
    </GestureHandlerRootView>
  );
};

export default MyOrder;
