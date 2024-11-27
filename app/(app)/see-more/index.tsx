import { Dimensions, FlatList } from "react-native";
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
import { ServiceResponeModel } from "@/types/service.type";

const SeeMore = () => {
  const { t } = useLanguage();

  const dispatch = useDispatch();
  const { type } = useLocalSearchParams();
  const title = useMemo(() => {
    return type === "service" ? t("home.service") : t("home.product");
  }, [type, t]);

  const { servicesList, currentPage, hasMore, isLoading } = useSelector(
    (state: RootState) => {
      return state.service;
    }
  );

  const [accumulatedServices, setAccumulatedServices] = useState<
    ServiceResponeModel[]
  >([]);

  const [isFirstLoading, setIsFirstLoading] = useState(false);

  useEffect(() => {
    if (Array.isArray(servicesList)) {
      if (currentPage === 1) {
        setAccumulatedServices(servicesList);
      } else {
        setAccumulatedServices((prev) => [...prev, ...servicesList]);
      }
    }
  }, [servicesList, currentPage]);

  const productList = useSelector((state: RootState) => state.product.products);

  const { width: WINDOW_WIDTH, height: WINDOW_HEIGHT } =
    Dimensions.get("window");

  useEffect(() => {
    if (type === "service") {
      setIsFirstLoading(true);
      setAccumulatedServices([]);
      dispatch(getServicesThunk({ page: 1, limit: 10 }))
        .then(() => {
          setIsFirstLoading(false);
        })
        .catch((error: any) => {
          console.error("Error loading services:", error);
          setIsFirstLoading(false);
        });
    }
  }, [type]);

  const handleLoadMore = () => {
    console.log("Load more triggered", {
      isLoading,
      hasMore,
      isFirstLoading,
      currentPage,
    });
    if (isLoading || !hasMore || isFirstLoading) return;

    if (type === "service") {
      dispatch(
        getServicesThunk({
          page: currentPage + 1,
          limit: 10,
        })
      );
    } else if (type === "product") {
      dispatch({
        type: "product/fetchProducts",
        payload: { page: currentPage + 1 },
      });
    }
  };

  const renderList = useMemo(() => {
    const data = type === "service" ? accumulatedServices : productList;
    const ItemComponent = type === "service" ? ServiceItem : ProductItem;

    if (type === "service" && isFirstLoading) {
      return <View height={32} />;
    }

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
        keyExtractor={(item, index) => `${type}-${item.id}-${index}`}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: 10 }}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isLoading ? <View height={32} /> : <View height={32} />
        }
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        initialNumToRender={10}
      />
    );
  }, [
    type,
    accumulatedServices,
    productList,
    isLoading,
    isFirstLoading,
    WINDOW_WIDTH,
    WINDOW_HEIGHT,
  ]);

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
