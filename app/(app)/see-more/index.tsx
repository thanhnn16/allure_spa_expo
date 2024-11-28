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

const SeeMore = () => {
  const { t } = useLanguage();

  const dispatch = useDispatch();
  const { type } = useLocalSearchParams();

  const [sliderPriceValue, setSliderPriceValue] = useState(0);
  const [categoryValue, setCategoryValue] = useState('Không có');
  const [sortValue, setSortValue] = useState('Không có');

  const filterBottomSheetRef = useRef<BottomSheet>(null);
  const categoryBottomSheetRef = useRef<BottomSheet>(null);
  const sortBottomSheetRef = useRef<BottomSheet>(null);
  const slider = useRef<typeof Slider>(null);

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

  const handleFilterCategory = async (value: string) => {
    if (value === 'Dịch vụ') {
      console.log('Dịch vụ');
      await dispatch(
        getServicesThunk({
          page: currentPage + 1,
          limit: 10,
        })
      );
      categoryBottomSheetRef.current?.close();
      return;
    } else if (value === 'Sản phẩm') {
      console.log('Sản phẩm');
      dispatch({
        type: "product/fetchProducts",
        payload: { page: currentPage + 1 },
      });
      categoryBottomSheetRef.current?.close();
      return;
    } else {
      console.log('Không có');
      categoryBottomSheetRef.current?.close();
      return;
    }
  }

  const handleSort = async (value: string) => {
    if (value === 'Từ A-Z') {
      console.log('Từ A-Z');
      sortBottomSheetRef.current?.close();
      return;
    } else if (value === 'Từ Z-A') {
      console.log('Từ Z-A');
      sortBottomSheetRef.current?.close();
      return;
    } else if (value === 'Giá tăng dần') {
      console.log('Giá tăng dần');
      sortBottomSheetRef.current?.close();
      return;
    } else if (value === 'Giá giảm dần') {
      console.log('Giá giảm dần');
      sortBottomSheetRef.current?.close();
      return;
    } else if (value === 'Đánh giá cao nhất') {
      console.log('Đánh giá cao nhất');
      sortBottomSheetRef.current?.close();
      return;
    } else {
      console.log('Không có');
      sortBottomSheetRef.current?.close();
      return;
    }
  }

  const resetFilters = () => {
    setCategoryValue('Không có');
    setSortValue('Không có');
    setSliderPriceValue(0);
    filterBottomSheetRef.current?.close();
  }

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
                label={categoryValue}
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
                label={sortValue}
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
              {(categoryValue !== "Không có" || sortValue !== "Không có" || sliderPriceValue !== 0) && (
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
              <RadioButton value={'Dịch vụ'} label={'Dịch vụ'} color={Colors.primary} paddingV-8 />
              <RadioButton value={'Sản phẩm'} label={'Sản phẩm'} color={Colors.primary} paddingV-8 />
              <RadioButton value={'Không có'} label={'Không có'} color={Colors.primary} paddingV-8 />
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
              <RadioButton value={'Từ A-Z'} label={'Từ A-Z'} color={Colors.primary} paddingV-8 />
              <RadioButton value={'Từ Z-A'} label={'Từ Z-A'} color={Colors.primary} paddingV-8 />
              <RadioButton value={'Giá tăng dần'} label={'Giá tăng dần'} color={Colors.primary} paddingV-8 />
              <RadioButton value={'Giá giảm dần'} label={'Giá giảm dần'} color={Colors.primary} paddingV-8 />
              <RadioButton value={'Đánh giá cao nhất'} label={'Đánh giá cao nhất'} color={Colors.primary} paddingV-8 />
              <RadioButton value={'Không có'} label={'Không có'} color={Colors.primary} paddingV-8 />
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
