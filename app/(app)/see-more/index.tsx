import { Dimensions, FlatList, SafeAreaView } from "react-native";
import { useEffect, useMemo, useState } from "react";
import AppBar from "@/components/app-bar/AppBar";
import { useLocalSearchParams } from "expo-router";
import AppSearch from "@/components/inputs/AppSearch";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import ServiceItem from "@/components/home/ServiceItem";
import ProductItem from "@/components/home/ProductItem";
import { getServicesThunk } from "@/redux/features/service/getServicesThunk";
import { View } from "react-native-ui-lib";
import { useLanguage } from "@/hooks/useLanguage";

const { t } = useLanguage();

const SeeMore = () => {
  const dispatch = useDispatch();
  const { type } = useLocalSearchParams();
  const [title, setTitle] = useState("");

  const { servicesList, currentPage, hasMore, isLoading } = useSelector(
    (state: RootState) => state.service
  );

  const serviceList = servicesList?.data?.data || [];
  const productList = useSelector((state: RootState) => state.product.products);

  const { width: WINDOW_WIDTH, height: WINDOW_HEIGHT } =
    Dimensions.get("window");

  useEffect(() => {
    if (type === "service") {
      dispatch(getServicesThunk({ page: 1 }));
    }
  }, [type]);

  const handleLoadMore = () => {
    if (isLoading || !hasMore) return;

    if (type === "service") {
      dispatch(getServicesThunk({ page: currentPage + 1 }));
    } else if (type === "product") {
      dispatch({
        type: "product/fetchProducts",
        payload: { page: currentPage + 1 },
      });
    }
  };

  const renderList = useMemo(() => {
    if (type === "service") {
      setTitle(t("home.service"));
    } else if (type === "product") {
      setTitle(t("home.product"));
    }

    const data = type === "service" ? serviceList : productList;
    const ItemComponent = type === "service" ? ServiceItem : ProductItem;

    return (
      <FlatList
        data={data}
        renderItem={({ item }) => (
          <ItemComponent
            item={item}
            widthItem={WINDOW_WIDTH * 0.425}
            heightItem={WINDOW_HEIGHT * 0.35}
            heightImage={WINDOW_HEIGHT * 0.18}
          />
        )}
        keyExtractor={(item) => `${type}-${item.id}`}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: 10 }}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={<View height={32} />}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
      />
    );
  }, [type, serviceList, productList, isLoading]);

  return (
    <View flex bg-white>
      <AppBar back title={title} />
      <View flex paddingH-20 marginB-16>
        <AppSearch />
        <View paddingT-16>{renderList}</View>
      </View>
    </View>
  );
};

export default SeeMore;
