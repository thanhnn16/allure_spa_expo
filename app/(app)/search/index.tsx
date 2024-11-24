import {
  Dimensions,
  ScrollView,
} from "react-native";
import { Text, View, SkeletonView } from "react-native-ui-lib";
import { useState, useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { debounce } from "lodash";
import AppSearch, { AppSearchRef } from "@/components/inputs/AppSearch";
import SearchListItem from "@/components/list/SearchListItem";
import { searchItems } from "@/redux/features/search/searchThunk";
import { RootState } from "@/redux/store";
import { Product } from "@/types/product.type";
import { ServiceResponeModel } from "@/types/service.type";
import {
  clearSearch,
  setRecentSearches,
  addRecentSearch,
  removeRecentSearch,
  clearRecentSearches,
} from "@/redux/features/search/searchSlice";
import AppBar from "@/components/app-bar/AppBar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RecentSearches from "@/components/search/RecentSearches";
import { useLanguage } from "@/hooks/useLanguage";


const { width: SCREEN_WIDTH } = Dimensions.get("window");

const SearchScreen = () => {
  const { t } = useLanguage();

  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const { results, loading, recentSearches } = useSelector(
    (state: RootState) => state.search
  );

  const RECENT_SEARCHES_KEY = "@recent_searches";
  const searchInputRef = useRef<AppSearchRef>(null);

  useEffect(() => {
    const loadRecentSearches = async () => {
      try {
        const savedSearches = await AsyncStorage.getItem(RECENT_SEARCHES_KEY);
        if (savedSearches) {
          dispatch(setRecentSearches(JSON.parse(savedSearches)));
        }
      } catch (error) {
        console.error("Error loading recent searches:", error);
      }
    };
    loadRecentSearches();
  }, []);

  const debouncedSearch = useCallback(
    debounce((query: string) => {
      if (query.length > 2) {
        dispatch(searchItems({ query }));
      }
    }, 500),
    []
  );

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length > 2) {
      dispatch(addRecentSearch(query));
      debouncedSearch(query);
    }
  };

  const handleClear = () => {
    setSearchQuery("");
    dispatch(clearSearch());
  };

  const handleRecentSearchPress = (search: string) => {
    setSearchQuery(search);
    dispatch(searchItems({ query: search }));
    searchInputRef.current?.focus();
  };

  const renderSkeletonLoading = () => {
    return Array(3)
      .fill(0)
      .map((_, index) => (
        <View
          key={`skeleton-${index}`}
          center
          marginV-4
          br20
          bg-grey80
          row
          padding-12
        >
          <SkeletonView width={60} height={60} borderRadius={8} />
          <View flex marginL-12>
            <SkeletonView height={20} width={SCREEN_WIDTH - 120} />
            <SkeletonView height={16} width={100} marginT-8 />
          </View>
        </View>
      ));
  };

  const renderSearchResults = () => {
    if (loading) {
      return renderSkeletonLoading();
    }

    return (
      <>
        {results.products?.length > 0 && (
          <View marginB-20>
            <Text h2_bold marginB-10>
              {t("search.product")}
            </Text>
            {results.products.map((product: Product) => (
              <SearchListItem
                key={`product-${product.id}`}
                item={product}
                type="product"
              />
            ))}
          </View>
        )}

        {results.services?.length > 0 && (
          <View>
            <Text h2_bold marginB-10>
              {t("search.service")}
            </Text>
            {results.services.map((service: ServiceResponeModel) => (
              <SearchListItem
                key={`service-${service.id}`}
                item={service}
                type="service"
              />
            ))}
          </View>
        )}

        {searchQuery.length > 2 &&
          !results.products?.length &&
          !results.services?.length && (
            <View center marginT-40>
              <Text h3>{t("search.no_result")}</Text>
            </View>
          )}
      </>
    );
  };

  return (
    <View flex bg-white>
      <AppBar back title={t("search.title")} />
      <View flex marginH-20>
        <AppSearch
          value={searchQuery}
          onChangeText={handleSearch}
          onClear={handleClear}
          ref={searchInputRef}
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {searchQuery ? (
            <View marginT-20>{renderSearchResults()}</View>
          ) : (
            <View marginT-20>
              <RecentSearches
                searches={recentSearches}
                onSearchPress={handleRecentSearchPress}
                onRemoveSearch={(search) =>
                  dispatch(removeRecentSearch(search))
                }
                onClearAll={() => dispatch(clearRecentSearches())}
              />
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

export default SearchScreen;
