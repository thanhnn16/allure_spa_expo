import { Dimensions, FlatList, ScrollView } from "react-native";
import { useEffect, useMemo, useRef, useState } from "react";
import AppBar from "@/components/app-bar/AppBar";
import { useLocalSearchParams } from "expo-router";
import AppSearch from "@/components/inputs/AppSearch";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import ServiceItem from "@/components/home/ServiceItem";
import ProductItem from "@/components/home/ProductItem";
import { TouchableOpacity, View, Text, Image, Slider, Chip, Colors, RadioGroup, RadioButton } from "react-native-ui-lib";
import { useLanguage } from "@/hooks/useLanguage";
import FilterIcon from "@/assets/icons/filter.svg";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { Ionicons } from "@expo/vector-icons";
import AppButton from "@/components/buttons/AppButton";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { searchItems, SearchParams } from "@/redux/features/search/searchThunk";
import formatCurrency from "@/utils/price/formatCurrency";
import { ActivityIndicator } from "react-native";

const SeeMore = () => {
  const { t } = useLanguage();
  const dispatch = useDispatch();
  const { type } = useLocalSearchParams();

  // Thêm state cho categories
  const [categories, setCategories] = useState([]);

  // State cho các bộ lọc
  const [searchParams, setSearchParams] = useState<SearchParams>({
    query: '',
    type: type as 'products' | 'services',
    limit: 30,
    sort_by: undefined,
    min_price: undefined,
    max_price: undefined,
    category_id: undefined
  });

  const [sliderPriceValue, setSliderPriceValue] = useState(0);
  const [categoryValue, setCategoryValue] = useState('none');
  const [sortValue, setSortValue] = useState('none');

  // Thêm state cho price range
  const [priceRange, setPriceRange] = useState({
    min: 0,
    max: 10000000 // 10 triệu VND
  });

  // State cho giá trị đang chọn
  const [selectedPriceRange, setSelectedPriceRange] = useState({
    min: priceRange.min,
    max: priceRange.max
  });

  // Refs cho bottom sheets
  const filterBottomSheetRef = useRef<BottomSheet>(null);
  const categoryBottomSheetRef = useRef<BottomSheet>(null);
  const sortBottomSheetRef = useRef<BottomSheet>(null);

  const { width: WINDOW_WIDTH, height: WINDOW_HEIGHT } = Dimensions.get("window");

  const title = useMemo(() => {
    return type === "services" ? t("home.service") : t("home.product");
  }, [type, t]);

  const { results, loading } = useSelector((state: RootState) => state.search);

  // Khởi tạo tìm kiếm ban đầu
  useEffect(() => {
    if (type === "services" || type === "products") {
      // Reset category value
      setCategoryValue('none');

      try {
        dispatch(searchItems({
          ...searchParams,
          type: type as 'services' | 'products'
        })).unwrap()
          .then((response: any) => {
            console.log("Search response:", response);
            const categoryData = type === 'services' ?
              response.categories.service_categories :
              response.categories.product_categories;
            setCategories(categoryData);
          })
          .catch((error: any) => {
            console.error('Lỗi khi tìm kiếm:', error.response?.data?.message);
          });
      } catch (error: any) {
        console.error('Lỗi dispatch:', error.response?.data?.message);
      }
    }
  }, [dispatch, type]);

  // Xử lý lọc theo danh mục
  const handleFilterCategory = async (value: string) => {
    try {
      setCategoryValue(value);

      const newParams: SearchParams = {
        ...searchParams,
        type: type as 'services' | 'products',
        category_id: value === 'none' ? undefined : parseInt(value)
      };

      setSearchParams(newParams);
      await dispatch(searchItems(newParams)).unwrap();
      categoryBottomSheetRef.current?.close();
    } catch (error) {
      console.error('Lỗi khi lọc danh mục:', error);
    }
  };

  // Xử lý sắp xếp
  const handleSort = async (value: string) => {
    try {
      if (['name_asc', 'name_desc', 'price_asc', 'price_desc', 'rating'].includes(value)) {
        await dispatch(searchItems({
          ...searchParams,
          sort_by: value as SearchParams['sort_by']
        })).unwrap();
      }
      sortBottomSheetRef.current?.close();
    } catch (error) {
      console.error('Lỗi khi sắp xếp:', error);
      // Xử lý lỗi tại đây nếu cần
    }
  };

  // Hàm xử lý thay đổi giá
  const handlePriceChange = (values: { min: number, max: number }) => {
    setSelectedPriceRange({
      min: values.min,
      max: values.max
    });
  };

  // Reset bộ lọc
  const resetFilters = async () => {
    try {
      setCategoryValue('none');
      setSortValue('none');
      setSelectedPriceRange({
        min: priceRange.min,
        max: priceRange.max
      });

      const resetParams: SearchParams = {
        query: '',
        type: type as 'products' | 'services',
        limit: 30
      };

      setSearchParams(resetParams);
      await dispatch(searchItems(resetParams)).unwrap();
      filterBottomSheetRef.current?.close();
    } catch (error) {
      console.error('Lỗi khi reset bộ lọc:', error);
      // Xử lý lỗi tại đây nếu cần
    }
  };

  // Áp dụng tất cả bộ lọc
  const applyFilters = async () => {
    try {
      const newParams: SearchParams = {
        ...searchParams,
        type: type as 'products' | 'services',
        category_id: categoryValue === 'none' ? undefined : parseInt(categoryValue),
        sort_by: sortValue === 'none' ? undefined : sortValue as SearchParams['sort_by'],
        min_price: selectedPriceRange.min > 0 ? selectedPriceRange.min : undefined,
        max_price: selectedPriceRange.max < priceRange.max ? selectedPriceRange.max : undefined
      };

      setSearchParams(newParams);
      await dispatch(searchItems(newParams)).unwrap();
      filterBottomSheetRef.current?.close();
    } catch (error) {
      console.error('Lỗi khi áp dụng bộ lọc:', error);
      // Xử lý lỗi tại đây nếu cần
    }
  };

  const getCategoryName = (value: string) => {
    if (value === 'none') {
      return t('see_more.all');
    }

    // Tìm category trong mảng categories dựa vào value
    const selectedCategory: any = categories.find(
      (category: any) => category.id.toString() === value
    );

    return selectedCategory ? selectedCategory?.name : t('see_more.all');
  };

  const getSortName = (value: string) => {
    if (value === 'name_asc') {
      return 'Từ A-Z';
    } else if (value === 'name_desc') {
      return t('see_more.from_z_to_a');
    } else if (value === 'price_asc') {
      return t('see_more.price_low_to_high');
    } else if (value === 'price_desc') {
      return t('see_more.price_high_to_low');
    } else if (value === 'rating') {
      return t('see_more.rating');
    } else {
      return t('see_more.none');
    }
  }

  const renderList = useMemo(() => {
    const data = type === "services" ? results.services : results.products;
    const ItemComponent = type === "services" ? ServiceItem : ProductItem;

    if (!data || data.length === 0) {
      return (
        <View flex center>
          <Text>{t("common.no_data")}</Text>
        </View>
      );
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
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: 10 }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loading ? <View height={52} /> : <View height={52} />
        }
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        initialNumToRender={10}
      />
    );
  }, [type, results, loading, WINDOW_WIDTH, WINDOW_HEIGHT]);

  // Render danh mục dựa trên categories từ API
  const renderCategories = () => {
    return (
      <RadioGroup
        initialValue={categoryValue}
        onValueChange={setCategoryValue}
      >
        <RadioButton value="none" label={t("see_more.all")} color={Colors.primary} paddingV-8 />
        {categories.map((category: any) => (
          <RadioButton
            key={category.id}
            value={category.id.toString()}
            label={category.name}
            color={Colors.primary}
            paddingV-8
          />
        ))}
      </RadioGroup>
    );
  };

  // Render price filter
  const renderPriceFilter = () => {
    return (
      <View marginV-16>
        <Text h3 marginB-8>{t("see_more.price_range")}</Text>

        {/* Hiển thị giá trị đ�� chọn */}
        <View row spread marginB-16>
          <Text>{formatCurrency({ price: selectedPriceRange.min })}</Text>
          <Text>{formatCurrency({ price: selectedPriceRange.max })}</Text>
        </View>

        <View marginH-4>
          <Slider
            useRange
            value={selectedPriceRange.min}
            initialMinimumValue={selectedPriceRange.min}
            initialMaximumValue={selectedPriceRange.max}
            minimumValue={priceRange.min}
            maximumValue={priceRange.max}
            step={100000}
            onRangeChange={handlePriceChange}
            thumbTintColor={Colors.primary}
            minimumTrackTintColor={Colors.primary}
            maximumTrackTintColor={Colors.grey40}
            thumbStyle={{
              width: 20,
              height: 20,
              borderRadius: 10,
              backgroundColor: Colors.primary
            }}
            trackStyle={{
              height: 4,
              borderRadius: 2
            }}
          />
        </View>

        {/* Hiển thị các mốc giá phổ biến */}
        <View row spread marginT-16 style={{ flexWrap: 'wrap', gap: 8 }}>
          <Chip
            label={`< ${formatCurrency({ price: 1000000 })}`}
            onPress={() => setSelectedPriceRange({ min: 0, max: 1000000 })}
            backgroundColor={selectedPriceRange.max === 1000000 ? Colors.primary : Colors.grey60}
          />
          <Chip
            label={`${formatCurrency({ price: 1000000 })} - ${formatCurrency({ price: 3000000 })}`}
            onPress={() => setSelectedPriceRange({ min: 1000000, max: 3000000 })}
            backgroundColor={
              selectedPriceRange.min === 1000000 && selectedPriceRange.max === 3000000
                ? Colors.primary
                : Colors.grey60
            }
          />
          <Chip
            label={`${formatCurrency({ price: 3000000 })} - ${formatCurrency({ price: 5000000 })}`}
            onPress={() => setSelectedPriceRange({ min: 3000000, max: 5000000 })}
            backgroundColor={
              selectedPriceRange.min === 3000000 && selectedPriceRange.max === 5000000
                ? Colors.primary
                : Colors.grey60
            }
          />
          <Chip
            label={`> ${formatCurrency({ price: 5000000 })}`}
            onPress={() => setSelectedPriceRange({ min: 5000000, max: priceRange.max })}
            backgroundColor={selectedPriceRange.min === 5000000 ? Colors.primary : Colors.grey60}
          />
        </View>
      </View>
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View flex bg-white paddingB-20>
        <AppBar back title={title} />
        <View flex paddingH-20 marginB-16>
          <AppSearch />
          <View row marginT-12 spread>
            <Text h2_bold>{t("see_more.filter")}</Text>
            <TouchableOpacity
              onPress={() => filterBottomSheetRef.current?.expand()}
            >
              <View row spread centerV gap-4>
                <Text h2 primary>{t("see_more.filter")} (3)</Text>
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
            <Text h2_bold>{t("see_more.filter")}</Text>
            <View row spread centerV paddingV-8>
              <Text h3>{t("see_more.category")}</Text>
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
              <Text h3>{t("see_more.sort")}</Text>
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
            {renderPriceFilter()}
            <View paddingV-8 gap-8>
              <AppButton
                type="primary"
                title={t("see_more.apply")}
                onPress={() => {
                  applyFilters();
                }}
              />
              {(categoryValue !== "none" || sortValue !== "none" || sliderPriceValue !== 0) && (
                <AppButton
                  type="outline"
                  title={t("see_more.reset")}
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
            <Text h2_bold center>{t("see_more.category")}</Text>
            {renderCategories()}
            <View paddingV-12 gap-8>
              <AppButton
                type="primary"
                title={t("see_more.apply")}
                onPress={() => {
                  const newParams = {
                    ...searchParams,
                    category_id: categoryValue === 'none' ? undefined : parseInt(categoryValue)
                  };
                  setSearchParams(newParams);

                  dispatch(searchItems(newParams));

                  categoryBottomSheetRef.current?.close();
                  filterBottomSheetRef.current?.expand();
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
            <Text h2_bold center>{t("see_more.sort")}</Text>
            <RadioGroup initialValue={sortValue} onValueChange={setSortValue}>
              <RadioButton value={'name_asc'} label={t("see_more.from_a_to_z")} color={Colors.primary} paddingV-8 />
              <RadioButton value={'name_desc'} label={t("see_more.from_z_to_a")} color={Colors.primary} paddingV-8 />
              <RadioButton value={'price_asc'} label={t("see_more.price_low_to_high")} color={Colors.primary} paddingV-8 />
              <RadioButton value={'price_desc'} label={t("see_more.price_high_to_low")} color={Colors.primary} paddingV-8 />
              <RadioButton value={'rating'} label={t("see_more.rating")} color={Colors.primary} paddingV-8 />
              <RadioButton value={'none'} label={t("see_more.none")} color={Colors.primary} paddingV-8 />
            </RadioGroup>
            <View paddingV-12 gap-8>
              <AppButton
                type="primary"
                title={t("see_more.apply")}
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
