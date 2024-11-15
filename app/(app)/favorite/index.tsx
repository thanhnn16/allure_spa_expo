import React, { useEffect, useState } from "react";
import { View, Text, TabController } from "react-native-ui-lib";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { fetchFavoritesThunkByType } from "@/redux/features/favorite/favoritesThunk";
import { FlatList } from "react-native";
import FavoriteItem from "./FavoriteItem";
import AppBar from "@/components/app-bar/AppBar";
import i18n from "@/languages/i18n";
import AppTabBar from "@/components/app-bar/AppTabBar";

export default function FavoriteScreen() {
  const [selectedTab, setSelectedTab] = useState<"product" | "service">(
    "product"
  );
  const [selectedTabIndex, setSelectedTabIndex] = useState<number>(0);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const fetchFavorites = async (type: "product" | "service") => {
    try {
      setIsLoading(true);
      const result = await dispatch(
        fetchFavoritesThunkByType({ type })
      ).unwrap();
      setFavorites(result);
    } catch (error) {
      console.error("Error fetching favorites:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites(selectedTab);
  }, [selectedTab]);

  const renderProductsPage = () => {
    return (
      <FlatList
        data={favorites}
        renderItem={({ item }) => (
          <FavoriteItem item={item} type={"product"} />
        )}
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: "space-between",
          paddingHorizontal: 20,
          marginTop: 10,
        }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View center padding-20>
            <Text>{i18n.t("favorite.empty")}</Text>
          </View>
        )}
      />
    );
  };

  const renderServicesPage = () => {
    return (
      <FlatList
        data={favorites}
        renderItem={({ item }) => (
          <FavoriteItem item={item} type={"service"} />
        )}
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: "space-between",
          paddingHorizontal: 20,
          marginTop: 10,
        }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View center padding-20>
            <Text>{i18n.t("favorite.empty")}</Text>
          </View>
        )}
      />
    );
  };

  return (
    <View flex bg-$white>
      <AppBar back title={i18n.t("favorite.title")} />

      <TabController
        initialIndex={selectedTabIndex}
        onChangeIndex={setSelectedTabIndex}
        items={[
          { label: i18n.t("favorite.products") },
          { label: i18n.t("favorite.services") },
        ]}
      >
        <AppTabBar />
        <View flex>
          <TabController.TabPage index={0}>{renderProductsPage()}</TabController.TabPage>
          <TabController.TabPage index={1} lazy>{renderServicesPage()}</TabController.TabPage>
        </View>
      </TabController>
    </View>
  );
}
