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
import { clearOrders } from "@/redux/features/order/orderSlice";

import ShoppingBagIcon from "@/assets/icons/bag.svg";
import { useLanguage } from "@/hooks/useLanguage";

import Animated, { FadeInDown } from "react-native-reanimated";

const { width } = Dimensions.get("window");

const MyOrder = () => {
  const { t } = useLanguage();

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const dispatch = useDispatch();
  const { ordersByStatus, isLoading, isLoadingMore } = useSelector(
    (state: RootState) => state.order
  );

  const statuses = [
    "pending",
    "confirmed",
    "shipping",
    "completed",
    "cancelled",
  ];

  const fetchOrdersByStatus = async (status: string, page: number = 1) => {
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
    dispatch(clearOrders());
    fetchOrdersByStatus(statuses[selectedIndex], 1);
  }, [selectedIndex]);

  const handleLoadMore = () => {
    if (isLoadingMore) return;

    const currentStatus = statuses[selectedIndex];
    const currentPagination = ordersByStatus[currentStatus]?.pagination;

    if (currentPagination?.currentPage < currentPagination?.lastPage) {
      fetchOrdersByStatus(currentStatus, currentPagination.currentPage + 1);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
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
              backgroundColor: Colors.surface_light,
              borderRadius: 12,
              margin: 10,
              padding: 16,
              borderWidth: 1,
              borderColor: Colors.border,
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
          {t("orders.no_order")}
        </Text>
        <Text center h3 marginT-8 grey30>
          {t("orders.buy_more")}
        </Text>
      </Animated.View>
    </View>
  );

  const renderTabContent = (index: number) => {
    const status = statuses[index];
    const currentOrders = ordersByStatus[status]?.data || [];

    if (isLoading && !currentOrders.length) {
      return renderSkeletonLoading();
    }

    if (!isLoading && !currentOrders.length) {
      return renderEmptyState();
    }

    return (
      <Animated.FlatList
        removeClippedSubviews={true}
        maxToRenderPerBatch={5}
        initialNumToRender={8}
        windowSize={5}
        data={currentOrders}
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
          isLoadingMore ? (
            <ActivityIndicator size="small" color={Colors.primary} />
          ) : null
        }
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInDown.delay(index * 50).duration(300)}>
            <OrderProductItem order={item} />
          </Animated.View>
        )}
      />
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View flex bg-white>
        <AppBar back title={t("orders.title")} />
        <TabController
          asCarousel
          items={[
            { label: t("orders.pending") },
            { label: t("orders.confirmed") },
            { label: t("orders.delivering") },
            { label: t("orders.completed") },
            { label: t("orders.cancelled") },
          ]}
          initialIndex={selectedIndex}
          onChangeIndex={setSelectedIndex}
        >
          <AppTabBar />
          <View flex>
            <TabController.PageCarousel>
              {[0, 1, 2, 3, 4].map((index) => (
                <TabController.TabPage key={index} index={index} lazy>
                  {selectedIndex === index && renderTabContent(index)}
                </TabController.TabPage>
              ))}
            </TabController.PageCarousel>
          </View>
        </TabController>
      </View>
    </GestureHandlerRootView>
  );
};

export default MyOrder;
