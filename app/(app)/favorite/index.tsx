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
      setFavorites(result || []); // Add null check here
    } catch (error) {
      console.error("Error fetching favorites:", error);
      setFavorites([]); // Set empty array on error
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites(selectedTab);
  }, [selectedTab]);

  const renderItem = ({ item }: { item: any }) => {
    if (
      !item ||
      (selectedTab === "product" && !item.product) ||
      (selectedTab === "service" && !item.service)
    ) {
      return null;
    }
    return <FavoriteItem item={item} type={selectedTab} />;
  };

  const renderListComponent = () => {
    return (
      <FlatList
        data={favorites}
        renderItem={renderItem}
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
        onChangeIndex={(index) => {
          setSelectedTabIndex(index);
          setSelectedTab(index === 0 ? "product" : "service");
        }}
        items={[
          { label: i18n.t("favorite.products") },
          { label: i18n.t("favorite.services") },
        ]}
      >
        <AppTabBar />
        <View flex>
          <TabController.TabPage index={0}>
            {renderListComponent()}
          </TabController.TabPage>
          <TabController.TabPage index={1} lazy>
            {renderListComponent()}
          </TabController.TabPage>
        </View>
      </TabController>
    </View>
  );
}
