import HomeHeaderButton from "@/components/buttons/HomeHeaderButton";
import CarouselBanner from "@/components/home/CarouselBanner";
import CategoryItem from "@/components/home/CategoryItem";
import ProductItem from "@/components/home/ProductItem";
import SectionContainer from "@/components/home/SectionContainer";
import AppSearch from "@/components/inputs/AppSearch";
import { AppStyles } from "@/constants/AppStyles";
import { getServicesThunk } from "@/redux/features/service/getServicesThunk";
import {
  hideStyle,
  showStyle,
  useHeaderDimensions,
} from "@/utils/animated/home/header";
import { Href, Link, router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Platform, Dimensions, ScrollView, StatusBar } from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { Image, Text, TouchableOpacity, View } from "react-native-ui-lib";
import { useDispatch, useSelector } from "react-redux";

import NotificationIcon from "@/assets/icons/notification_bing.svg";
import CartIcon from "@/assets/icons/shopping_bag.svg";
import { RootState } from "@/redux/store";
import { BlurView } from "expo-blur";
import { SafeAreaView } from "react-native-safe-area-context";
import { SkeletonView } from "react-native-ui-lib";
import { getAllProductsThunk } from "@/redux/features/products/getAllProductsThunk";
import i18n from "@/languages/i18n";
import WeatherView from "@/components/home/WeatherView";

const HomePage = () => {
  const dispatch = useDispatch();
  const selectUser = (state: RootState) => state.auth;
  const { user } = useSelector(selectUser);
  const currentDate = new Date();
  const hours = currentDate.getHours();
  const [greeting, setGreeting] = useState<string>("");
  const [banner, setBanner] = useState([
    { uri: "https://intphcm.com/data/upload/banner-spa-cta.jpg" },
    { uri: "https://easysalon.vn/wp-content/uploads/2019/12/banner-spa.jpg" },
    {
      uri: "https://i.pinimg.com/originals/4f/25/c1/4f25c16a936656f89e38796eda8898e2.jpg",
    },
  ]);

  const scrollOffset = useSharedValue(0);

  const { servicesList, isLoading } = useSelector(
    (state: RootState) => state.service
  );
  const { HEADER_HEIGHT, SCROLL_THRESHOLD, OPACITY_THRESHOLD } =
    useHeaderDimensions();

  const { width: WINDOW_WIDTH } = Dimensions.get("window");

  const { products, isLoading: productsLoading } = useSelector(
    (state: RootState) => state.product
  );
  useMemo(() => {
    if (hours < 12) {
      setGreeting(i18n.t("greeting.morning"));
    } else if (hours >= 12 && hours < 18) {
      setGreeting(i18n.t("greeting.afternoon"));
    } else {
      setGreeting(i18n.t("greeting.evening"));
    }
  }, [hours]);

  useEffect(() => {
    dispatch(getServicesThunk(1));
  }, [dispatch]);

  useEffect(() => {
    dispatch(getAllProductsThunk());
  }, [dispatch]);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollOffset.value = event.contentOffset.y;
    },
  });

  const renderServicesItem = ({ item }: { item: any }) => {
    if (!item || !item.service_name) {
      return null;
    }
    const urlImage = item.media[0]?.full_url;
    const truncateText = (text: string, maxLength: number) => {
      if (text?.length <= maxLength) return text;
      return text?.slice(0, maxLength).trim() + "...";
    };

    return (
      <TouchableOpacity
        marginR-15
        marginB-5
        style={[
          AppStyles.shadowItem,
          { borderRadius: 22, width: 230, height: "auto" },
        ]}
        onPress={() => {
          router.push(`/service/${item.id}`);
        }}
      >
        <Image
          source={
            urlImage !== null
              ? { uri: urlImage }
              : require("@/assets/images/logo/logo.png")
          }
          width={230}
          height={225}
          style={{ resizeMode: "cover" }}
        />
        <View paddingH-12 flex marginB-5>
          <Text text70H>{item.service_name}</Text>
        </View>
        <View paddingH-12>
          <Text style={{ color: "#8C8585" }}>
            {truncateText(item.description, 50)}
          </Text>
        </View>
        <View paddingH-12 paddingB-10 bottom>
          <Text marginT-10 text70H style={{ color: "#A85A29" }}>
            {item.single_price.toLocaleString("vi-VN")} VNĐ
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderContent = () => (
    <View flex>
      <CarouselBanner banner={banner} />
      <CategoryItem cateData={cateArr} />
      {servicesList && servicesList.data && servicesList.data.length > 0 && (
        <SectionContainer
          title={i18n.t("home.featured_services")}
          data={servicesList.data}
          renderItem={renderServicesItem}
          onPressMore={() => { }}
        />
      )}
      {products && products.length > 0 && (
        <SectionContainer
          title={i18n.t("home.featured_products")}
          data={products}
          renderItem={ProductItem}
          onPressMore={() => router.push("/(app)/products" as Href<string>)}
        />
      )}
    </View>
  );

  const renderSkeletonContent = () => (
    <View flex paddingH-20>
      {/* Banner skeleton */}
      <View marginT-10 marginB-20>
        <SkeletonView
          height={160}
          width={WINDOW_WIDTH - 40}
          style={{ borderRadius: 12 }}
        />
      </View>

      {/* Category skeleton */}
      <View row centerH marginB-20>
        {Array(6)
          .fill(0)
          .map((_, index) => (
            <View key={index} center marginH-12>
              <SkeletonView
                height={48}
                width={48}
                style={{ borderRadius: 24 }}
              />
              <SkeletonView height={15} width={40} style={{ marginTop: 5 }} />
            </View>
          ))}
      </View>

      {/* Services section skeleton */}
      <View marginB-20>
        <View row spread marginB-10>
          <SkeletonView height={20} width={120} />
          <SkeletonView height={20} width={80} />
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {Array(3)
            .fill(0)
            .map((_, index) => (
              <SkeletonView
                key={index}
                height={280}
                width={230}
                style={{ marginRight: 15, borderRadius: 16 }}
              />
            ))}
        </ScrollView>
      </View>

      {/* Products section skeleton */}
      <View>
        <View row spread marginB-10>
          <SkeletonView height={20} width={120} />
          <SkeletonView height={20} width={80} />
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {Array(4)
            .fill(0)
            .map((_, index) => (
              <SkeletonView
                key={index}
                height={270}
                width={150}
                style={{ marginRight: 15, borderRadius: 8 }}
              />
            ))}
        </ScrollView>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar backgroundColor="white" />
      <View bg-$white flex>
        <Animated.View
          style={[
            {
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              zIndex: 1,
              height: HEADER_HEIGHT,
              backgroundColor: "white",
            },
          ]}
        >
          <BlurView style={{ paddingHorizontal: 20 }}>
            <Animated.View
              style={[
                hideStyle(
                  scrollOffset,
                  HEADER_HEIGHT,
                  SCROLL_THRESHOLD,
                  OPACITY_THRESHOLD
                ),
              ]}
            >
              <View row spread centerV marginB-10>
                <View row>
                  <Image
                    width={48}
                    height={48}
                    borderRadius={30}
                    source={require("@/assets/images/logo/logo.png")}
                  />
                  <View centerV marginL-10>
                    <Text h2_bold>{user?.full_name}</Text>
                    <Text h4>{greeting}</Text>
                  </View>
                </View>
              </View>
              <WeatherView />
            </Animated.View>

            <View
              row
              gap-15
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                zIndex: 1,
                paddingEnd: 20,
                paddingVertical: 5,
              }}
            >
              <HomeHeaderButton
                onPress={() => {
                  router.push("notification" as Href<string>);
                }}
                source={NotificationIcon}
              />
              <HomeHeaderButton
                onPress={() => {
                  router.push("cart" as Href<string>);
                }}
                source={CartIcon}
              />
            </View>

            <Animated.View
              style={[
                showStyle(scrollOffset, HEADER_HEIGHT, SCROLL_THRESHOLD),
                {
                  position: "absolute",
                  bottom: 10,
                  left: 0,
                  right: 0,
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  paddingHorizontal: 24,
                },
              ]}
            >
              <Text h0_bold color="#717658" marginB-10>
                {i18n.t("home.discover")}
              </Text>
              <AppSearch isHome style={{ marginBottom: 15 }} />
            </Animated.View>
          </BlurView>
        </Animated.View>

        <Animated.ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          contentContainerStyle={{
            paddingTop: HEADER_HEIGHT,
            paddingBottom: Platform.OS === "ios" ? 70 : 60,
          }}
        >
          {isLoading ? renderSkeletonContent() : renderContent()}
        </Animated.ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default HomePage;

const cateArr = [
  {
    id: "1",
    name: i18n.t("home.introduce"),
    icon: require("@/assets/images/home/icons/Introduce.png"),
    url: "https://allurespa.com.vn/gioi-thieu/",
  },
  {
    id: "2",
    name: i18n.t("home.voucher"),
    icon: require("@/assets/images/home/icons/Voucher.png"),
    url: "https://allurespa.com.vn/voucher/",
  },
  {
    id: "3",
    name: i18n.t("home.service"),
    icon: require("@/assets/images/home/icons/Service.png"),
    url: "https://allurespa.com.vn/dich-vu/",
  },
  {
    id: "4",
    name: i18n.t("home.product"),
    icon: require("@/assets/images/home/icons/Product.png"),
    url: "https://allurespa.com.vn/san-pham/",
  },
  {
    id: "5",
    name: i18n.t("home.course"),
    icon: require("@/assets/images/home/icons/Course.png"),
    url: "https://allurespa.com.vn/khoa-hoc/",
  },
  {
    id: "6",
    name: i18n.t("home.news"),
    icon: require("@/assets/images/home/icons/News.png"),
    url: "https://allurespa.com.vn/category/tin-tuc/",
  },
];