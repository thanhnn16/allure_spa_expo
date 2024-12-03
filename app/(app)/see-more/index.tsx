import { Dimensions, FlatList, ScrollView } from "react-native";
import { useEffect, useMemo, useRef, useState } from "react";
import AppBar from "@/components/app-bar/AppBar";
import { useLocalSearchParams } from "expo-router";
import AppSearch from "@/components/inputs/AppSearch";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import ServiceItem from "@/components/home/ServiceItem";
import ProductItem from "@/components/home/ProductItem";
import { getServicesThunk } from "@/redux/features/service/getServicesThunk";
import { TouchableOpacity, View, Text, Image, Slider, Chip, Colors, Picker, PickerProps, RenderCustomModalProps, Incubator, PanningProvider, RadioGroup, RadioButton } from "react-native-ui-lib";
import { useLanguage } from "@/hooks/useLanguage";
import { ServiceResponeModel } from "@/types/service.type";

import FilterIcon from "@/assets/icons/filter.svg";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { Ionicons } from "@expo/vector-icons";
import AppButton from "@/components/buttons/AppButton";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { searchMoreItems } from "@/redux/features/search/searchThunk";

const SeeMore = () => {
  const { t } = useLanguage();

  const dispatch = useDispatch();
  const { type } = useLocalSearchParams();

  const [sliderPriceValue, setSliderPriceValue] = useState(0);
  const [categoryValue, setCategoryValue] = useState('none');
  const [sortValue, setSortValue] = useState('none');

  const filterBottomSheetRef = useRef<BottomSheet>(null);
  const categoryBottomSheetRef = useRef<BottomSheet>(null);
  const sortBottomSheetRef = useRef<BottomSheet>(null);
  const slider = useRef<typeof Slider>(null);
  const { width: WINDOW_WIDTH, height: WINDOW_HEIGHT } = Dimensions.get("window");

  const title = useMemo(() => {
    return type === "services" ? t("home.service") : t("home.product");
  }, [type, t]);

  const { results, loading } = useSelector(
    (state: RootState) => state.search
  );

  useEffect(() => {
    if (type === "services") {
      setCategoryValue('services');
      dispatch(searchMoreItems({
        type: "services",
        limit: 100,
      }))
    } else if (type === "products") {
      setCategoryValue('products');
      dispatch(searchMoreItems({
        type: "products",
        limit: 100,
      }))
    }
  }, [dispatch]);

  // const { servicesList, currentPage, hasMore, isLoading } = useSelector(
  //   (state: RootState) => {
  //     return state.service;
  //   }
  // );

  // const [accumulatedServices, setAccumulatedServices] = useState<
  //   ServiceResponeModel[]
  // >([]);

  // const [isFirstLoading, setIsFirstLoading] = useState(false);

  // const productList = useSelector((state: RootState) => state.product.products);

  // useEffect(() => {
  //   if (Array.isArray(servicesList)) {
  //     if (currentPage === 1) {
  //       setAccumulatedServices(servicesList);
  //     } else {
  //       setAccumulatedServices((prev) => [...prev, ...servicesList]);
  //     }
  //   }
  // }, [servicesList, currentPage]);

  // const handleLoadMore = () => {
  //   console.log("Load more triggered", {
  //     isLoading,
  //     hasMore,
  //     isFirstLoading,
  //     currentPage,
  //   });
  //   if (isLoading || !hasMore || isFirstLoading) return;

  //   if (type === "service") {
  //     dispatch(
  //       searchMoreItems({
  //         page: currentPage + 1,
  //         type: "services",
  //         limit: 20,
  //       })
  //     );
  //   } else if (type === "product") {
  //     dispatch({
  //       type: "product/fetchProducts",
  //       payload: { page: currentPage + 1 },
  //     });
  //   }
  // };

  const handleFilterCategory = async (value: string) => {
    if (value === 'services') {
      await dispatch(searchMoreItems({
        type: value,
        limit: 100,
      }));
      categoryBottomSheetRef.current?.close();
      return;
    } else if (value === 'products') {
      await dispatch(searchMoreItems({
        type: value,
        limit: 100,
      }))
      categoryBottomSheetRef.current?.close();
      return;
    } else {
      categoryBottomSheetRef.current?.close();
      return;
    }
  }

  const handleSort = async (value: string) => {
    if (value === 'name_asc') {
      dispatch(searchMoreItems({
        type: type,
        sort_by: 'name_asc',
        limit: 100,
      }))
      sortBottomSheetRef.current?.close();
      return;
    } else if (value === 'name_desc') {
      dispatch(searchMoreItems({
        type: type,
        sort_by: 'name_desc',
        limit: 100,
      }))
      sortBottomSheetRef.current?.close();
      return;
    } else if (value === 'price_asc') {
      dispatch(searchMoreItems({
        type: type,
        sort_by: 'price_asc',
        limit: 100,
      }))
      sortBottomSheetRef.current?.close();
      return;
    } else if (value === 'price_desc') {
      dispatch(searchMoreItems({
        type: type,
        sort_by: 'price_desc',
        limit: 100,
      }))
      sortBottomSheetRef.current?.close();
      return;
    } else if (value === 'rating') {
      dispatch(searchMoreItems({
        type: type,
        sort_by: 'rating',
        limit: 100,
      }))
      sortBottomSheetRef.current?.close();
      return;
    } else {
      dispatch(searchMoreItems({
        type: type,
        limit: 100,
      }))
      sortBottomSheetRef.current?.close();
      return;
    }
  }

  const resetFilters = () => {
    setCategoryValue('none');
    setSortValue('none');
    setSliderPriceValue(0);
    filterBottomSheetRef.current?.close();
  }

  const getCategoryName = (value: string) => {
    if (value === 'services') {
      return 'Dịch vụ';
    } else if (value === 'products') {
      return 'Sản phẩm';
    } else {
      return 'Không có';
    }
  }

  const getSortName = (value: string) => {
    if (value === 'name_asc') {
      return 'Từ A-Z';
    } else if (value === 'name_desc') {
      return 'Từ Z-A';
    } else if (value === 'price_asc') {
      return 'Giá tăng dần';
    } else if (value === 'price_desc') {
      return 'Giá giảm dần';
    } else if (value === 'rating') {
      return 'Đánh giá cao nhất';
    } else {
      return 'Không có';
    }
  }

  const renderList = useMemo(() => {
    const data = results;
    const ItemComponent = type === "services" ? ServiceItem : ProductItem;

    if (type === "services" && !data.services) {
      return <View height={32} />;
    }

    return (
      <FlatList
        data={data.services}
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
        // onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loading ? <View height={52} /> : <View height={52} />
        }
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        initialNumToRender={10}
      />
    );
  }, [
    type,
    results,
    loading,
    WINDOW_WIDTH,
    WINDOW_HEIGHT,
  ]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View flex bg-white>
        <AppBar back title={title} />
        <View flex paddingH-20 marginB-16>
          <AppSearch />
          <View row marginT-12 spread>
            <Text h2_bold>Bộ lọc</Text>
            <TouchableOpacity
              onPress={() => filterBottomSheetRef.current?.expand()}
            >
              <View row spread centerV gap-4>
                <Text h2 primary>Bộ lọc (3)</Text>
                <Image
                  source={FilterIcon}
                  style={{ width: 20, height: 20 }}
                  tintColor={Colors.primary}
                />
              </View>

            </TouchableOpacity>
          </View>
          <View paddingT-16>{renderList}</View>
        </View>
        <BottomSheet
          ref={filterBottomSheetRef}
          index={-1}
          enablePanDownToClose={true}
          enableHandlePanningGesture={true}
          enableOverDrag={true}
        >
          <BottomSheetView style={{ paddingHorizontal: 16 }}>
            <Text h2_bold>Bộ lọc</Text>
            <View row spread centerV paddingV-8>
              <Text h3>Danh mục</Text>
              <Chip
                label={getCategoryName(categoryValue)}
                rightElement={
                  <Ionicons
                    name="chevron-down"
                    size={16}
                    style={{ paddingRight: 6 }}
                  />
                }
                onPress={() => {
                  filterBottomSheetRef.current?.close()
                  categoryBottomSheetRef.current?.expand()
                }}
              />
            </View>
            <View row spread centerV paddingV-8>
              <Text h3>Sắp xếp theo</Text>
              <Chip
                label={getSortName(sortValue)}
                rightElement={
                  <Ionicons
                    name="chevron-down"
                    size={16}
                    style={{ paddingRight: 6 }}
                  />
                }
                onPress={() => {
                  filterBottomSheetRef.current?.close()
                  sortBottomSheetRef.current?.expand()
                }}
              />
            </View>
            <View row spread centerV paddingV-8>
              <Text h3>Giá</Text>
              <Text h3>Tất cả</Text>
            </View>
            <View>
              <Slider
                onValueChange={(value) => setSliderPriceValue(value)}
                value={sliderPriceValue}
                minimumValue={0}
                maximumValue={5}
                step={1}
                ref={slider}
                thumbTintColor={Colors.primary}
                minimumTrackTintColor={Colors.primary}
              // onReset={.onSliderReset}
              />
            </View>
            <View paddingV-8 gap-8>
              <AppButton
                type="primary"
                title="Áp dụng"
                onPress={() => {
                  handleFilterCategory(categoryValue)
                  handleSort(sortValue)
                  filterBottomSheetRef.current?.close()
                }}
              />
              {(categoryValue !== "none" || sortValue !== "none" || sliderPriceValue !== 0) && (
                <AppButton
                  type="outline"
                  title="Xóa bộ lọc"
                  onPress={() => resetFilters()}
                />
              )}
            </View>
          </BottomSheetView>
        </BottomSheet>

        <BottomSheet
          ref={categoryBottomSheetRef}
          index={-1}
          enablePanDownToClose={true}
          enableHandlePanningGesture={true}
          enableOverDrag={true}
        >
          <BottomSheetView style={{ paddingHorizontal: 16 }}>
            <Text h2_bold center>Danh mục</Text>
            <RadioGroup initialValue={categoryValue} onValueChange={setCategoryValue}>
              <RadioButton value={'none'} label={'Dịch vụ'} color={Colors.primary} paddingV-8 />
              <RadioButton value={'products'} label={'Sản phẩm'} color={Colors.primary} paddingV-8 />
              <RadioButton value={'services'} label={'Không có'} color={Colors.primary} paddingV-8 />
            </RadioGroup>
            <View paddingV-12 gap-8>
              <AppButton
                type="primary"
                title="Chọn"
                onPress={() => {
                  categoryBottomSheetRef.current?.close()
                  filterBottomSheetRef.current?.expand()
                }}
              />
            </View>
          </BottomSheetView>
        </BottomSheet>

        <BottomSheet
          ref={sortBottomSheetRef}
          index={-1}
          enablePanDownToClose={true}
          enableHandlePanningGesture={true}
          enableOverDrag={true}
        >
          <BottomSheetView style={{ paddingHorizontal: 16 }}>
            <Text h2_bold center>Sắp xếp theo</Text>
            <RadioGroup initialValue={sortValue} onValueChange={setSortValue}>
              <RadioButton value={'name_asc'} label={'Từ A-Z'} color={Colors.primary} paddingV-8 />
              <RadioButton value={'name_desc'} label={'Từ Z-A'} color={Colors.primary} paddingV-8 />
              <RadioButton value={'price_asc'} label={'Giá tăng dần'} color={Colors.primary} paddingV-8 />
              <RadioButton value={'price_desc'} label={'Giá giảm dần'} color={Colors.primary} paddingV-8 />
              <RadioButton value={'rating'} label={'Đánh giá cao nhất'} color={Colors.primary} paddingV-8 />
              <RadioButton value={'none'} label={'Không có'} color={Colors.primary} paddingV-8 />
            </RadioGroup>
            <View paddingV-12 gap-8>
              <AppButton
                type="primary"
                title="Chọn"
                onPress={() => {
                  sortBottomSheetRef.current?.close()
                  filterBottomSheetRef.current?.expand()
                }}
              />
            </View>
          </BottomSheetView>
        </BottomSheet>
      </View>
    </GestureHandlerRootView>
  );
};

export default SeeMore;
