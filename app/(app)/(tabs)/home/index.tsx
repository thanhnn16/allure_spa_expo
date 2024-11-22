import HomeHeaderButton from "@/components/buttons/HomeHeaderButton";
import CarouselBanner from "@/components/home/CarouselBanner";
import CategoryItem from "@/components/home/CategoryItem";
import ProductItem from "@/components/home/ProductItem";
import SectionContainer from "@/components/home/SectionContainer";
import AppSearch from "@/components/inputs/AppSearch";
import { getServicesThunk } from "@/redux/features/service/getServicesThunk";
import {
  hideStyle,
  showStyle,
  useHeaderDimensions,
} from "@/utils/animated/home/header";
import { router } from "expo-router";
import { useEffect, useMemo, useState, useCallback, memo } from "react";
import { Dimensions } from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
  FadeIn,
  FadeInDown,
  FadeInUp,
} from "react-native-reanimated";
import { Colors, Image, Text, View } from "react-native-ui-lib";
import { useDispatch, useSelector } from "react-redux";

import ServiceItem from "@/components/home/ServiceItem";
import UpcomingAppointment from "@/components/home/UpcomingAppointment";
import WeatherView from "@/components/home/WeatherView";
import { useAuth } from "@/hooks/useAuth";
import i18n from "@/languages/i18n";
import { fetchBanners } from "@/redux/features/banner/bannerThunk";
import { getAllProductsThunk } from "@/redux/features/products/getAllProductsThunk";
import { getServicePackagesThunk } from "@/redux/features/servicePackage/getServicePackagesThunk";
import { RootState } from "@/redux/store";
import { Product } from "@/types/product.type";
import { ServiceResponeModel } from "@/types/service.type";
import { SkeletonView } from "react-native-ui-lib";
import { fetchUnreadCount } from "@/redux/features/notification/notificationThunks";
import { HOME_CATEGORIES } from "@/constants/categories";
import { fetchCartItems } from "@/redux/features/cart/fetchCartThunk";
interface HomeHeaderProps {
  user: any; // Replace 'any' with your user type
  greeting: string;
  greetingHeaderStyle: {
    opacity: number;
    transform: { translateY: number }[];
  };
  searchBarStyle: {
    opacity: number;
    transform: { translateY: number }[];
  };
}

interface HomeSkeletonContentProps {
  WINDOW_WIDTH: number;
}

const HomeHeader = memo(
  ({
    user,
    greeting,
    greetingHeaderStyle,
    searchBarStyle,
  }: HomeHeaderProps) => {
    return (
      <View bg-white paddingH-20>
        <Animated.View style={[greetingHeaderStyle]}>
          <View row spread marginB-10>
            <View row centerV gap-10>
              <Image
                width={32}
                height={32}
                borderRadius={30}
                source={require("@/assets/images/logo/logo.png")}
              />
              <View centerV>
                <Text h2_bold>{user?.full_name || i18n.t("common.guest")}</Text>
                <Text h4>{greeting}</Text>
              </View>
            </View>
          </View>
          <WeatherView />
        </Animated.View>

        <View
          row
          centerV
          gap-15
          absR
          style={{ zIndex: 2 }}
          right-0
          top-0
          paddingV-10
          marginH-20
        >
          <HomeHeaderButton
            onPress={() => {
              router.push("/notification");
            }}
            iconName="notifications-outline"
            type="notification"
          />
          <HomeHeaderButton
            onPress={() => {
              router.push("/cart");
            }}
            iconName="cart-outline"
            type="cart"
          />
        </View>

        <Animated.View
          style={[
            searchBarStyle,
            {
              position: "absolute",
              bottom: 10,
              left: 20,
              right: 20,
            },
          ]}
        >
          <Text h0_bold color="#717658" marginB-10>
            {i18n.t("home.discover")}
          </Text>
          <AppSearch isHome />
        </Animated.View>
      </View>
    );
  }
);

const HomeSkeletonContent = memo(
  ({ WINDOW_WIDTH }: HomeSkeletonContentProps) => {
    return (
      <View flex paddingH-20>
        {/* Banner skeleton */}
        <View marginB-20>
          <SkeletonView
            height={160}
            width={WINDOW_WIDTH - 40}
            borderRadius={12}
          />
        </View>

        {/* Category skeleton */}
        <View row centerH marginB-20 spread>
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <View key={index} center marginH-8>
                <SkeletonView
                  height={48}
                  width={48}
                  style={{ borderRadius: 24 }}
                />
                <SkeletonView height={16} width={60} marginT-8 />
              </View>
            ))}
        </View>

        {/* Upcoming Appointment skeleton */}
        <View marginB-20>
          <View height={1} backgroundColor={Colors.primary} marginV-10 />
          <SkeletonView
            height={120}
            width={WINDOW_WIDTH - 40}
            borderRadius={12}
          />
          <View height={1} backgroundColor={Colors.primary} marginV-10 />
        </View>

        {/* Services section skeleton */}

        <View>
          <View row spread marginB-10>
            <SkeletonView height={20} width={120} />
            <SkeletonView height={20} width={80} />
          </View>
        </View>

        <View>
          <View row spread marginB-10>
            <SkeletonView height={20} width={120} />
            <SkeletonView height={20} width={80} />
          </View>
        </View>
      </View>
    );
  }
);

const HomePage = () => {
  const dispatch = useDispatch();
  const currentDate = new Date();
  const hours = currentDate.getHours();
  const { user } = useAuth();
  const scrollOffset = useSharedValue(0);
  const { packages } = useSelector((state: RootState) => state.servicePackage);

  const getUpcomingAppointment = useCallback(() => {
    if (!packages || !Array.isArray(packages)) {
      return null;
    }

    const now = new Date();
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(now.getDate() + 7);

    for (const pkg of packages) {
      if (pkg.next_appointment_details) {
        try {
          const [day, month, year] =
            pkg.next_appointment_details.date.split("/");
          const appointmentDate = new Date(
            parseInt(year),
            parseInt(month) - 1,
            parseInt(day),
            0,
            0,
            0
          );

          const [startHour, startMinute] =
            pkg.next_appointment_details.time.start.split(":");
          appointmentDate.setHours(parseInt(startHour), parseInt(startMinute));

          if (
            !isNaN(appointmentDate.getTime()) &&
            appointmentDate > now &&
            appointmentDate <= threeDaysFromNow
          ) {
            return {
              ...pkg.next_appointment_details,
              service_name: pkg.service_name,
              id: pkg.id,
            };
          }
        } catch (error) {
          console.error("Error parsing date:", error);
          continue;
        }
      }
    }
    return null;
  }, [packages]);

  const upcomingAppointment = useMemo(
    () => getUpcomingAppointment(),
    [getUpcomingAppointment]
  );

  const { servicesList, isLoading } = useSelector(
    (state: RootState) => state.service
  );
  const services = servicesList?.data?.data || [];

  const { HEADER_HEIGHT, SCROLL_THRESHOLD, OPACITY_THRESHOLD } =
    useHeaderDimensions();

  const { width: WINDOW_WIDTH, height: WINDOW_HEIGHT } =
    Dimensions.get("window");
  const { products } = useSelector((state: RootState) => state.product);

  const greeting = useMemo(() => {
    if (hours < 12) return i18n.t("greeting.morning");
    if (hours < 18) return i18n.t("greeting.afternoon");
    return i18n.t("greeting.evening");
  }, [hours]);

  const scrollHandler = useCallback(
    useAnimatedScrollHandler({
      onScroll: (event) => {
        "worklet";
        scrollOffset.value = event.contentOffset.y;
      },
    }),
    []
  );

  const handlePressMore = useCallback((type: "service" | "product") => {
    router.push({
      pathname: "/(app)/see-more",
      params: { type },
    });
  }, []);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        await Promise.all([
          dispatch(getServicesThunk({ page: 1, limit: 5 })),
          dispatch(getAllProductsThunk()),
          dispatch(fetchBanners()),
          dispatch(fetchUnreadCount()),
          dispatch(fetchCartItems()),
        ]);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };

    fetchInitialData();
  }, [dispatch, user?.id]);

  const renderServiceItem = useCallback(
    ({ item }: { item: ServiceResponeModel }) => (
      <ServiceItem
        item={item}
        widthItem={WINDOW_WIDTH * 0.537}
        heightItem={WINDOW_HEIGHT * 0.378}
        heightImage={WINDOW_HEIGHT * 0.21}
      />
    ),
    [WINDOW_WIDTH, WINDOW_HEIGHT]
  );

  const renderProductItem = useCallback(
    ({ item }: { item: Product }) => (
      <ProductItem
        item={item}
        widthItem={WINDOW_WIDTH * 0.468}
        heightItem={WINDOW_HEIGHT * 0.378}
        heightImage={WINDOW_HEIGHT * 0.19}
      />
    ),
    [WINDOW_WIDTH, WINDOW_HEIGHT]
  );

  const renderContent = () => (
    <View flex>
      <Animated.View entering={FadeIn.duration(500)}>
        <CarouselBanner />
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(400).delay(100)}>
        <CategoryItem cateData={HOME_CATEGORIES} />
      </Animated.View>

      {upcomingAppointment && (
        <Animated.View entering={FadeInUp.duration(600).delay(300)}>
          <View paddingH-20 gap-10>
            <View height={0.5} backgroundColor={Colors.primary} />
            <UpcomingAppointment appointment={upcomingAppointment} />
            <View height={0.5} backgroundColor={Colors.primary} />
          </View>
        </Animated.View>
      )}

      {services && Array.isArray(services) && services.length > 0 && (
        <Animated.View entering={FadeInUp.duration(600).delay(400)}>
          <SectionContainer
            title={i18n.t("home.featured_services")}
            data={services}
            renderItem={renderServiceItem}
            onPressMore={() => {
              handlePressMore("service");
            }}
          />
        </Animated.View>
      )}

      {products && products.length > 0 && (
        <Animated.View entering={FadeInUp.duration(600).delay(500)}>
          <SectionContainer
            title={i18n.t("home.featured_products")}
            data={products}
            renderItem={renderProductItem}
            onPressMore={() => {
              handlePressMore("product");
            }}
          />
        </Animated.View>
      )}
    </View>
  );

  const greetingHeaderStyle = hideStyle(
    scrollOffset,
    HEADER_HEIGHT,
    SCROLL_THRESHOLD,
    OPACITY_THRESHOLD
  );

  const searchBarStyle = showStyle(
    scrollOffset,
    HEADER_HEIGHT,
    SCROLL_THRESHOLD
  );

  return (
    <View bg-$white flex>
      <Animated.View
        style={[
          {
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1,
            height: HEADER_HEIGHT + 8,
            backgroundColor: "white",
            overflow: "hidden",
          },
        ]}
      >
        <HomeHeader
          user={user}
          greeting={greeting}
          greetingHeaderStyle={greetingHeaderStyle}
          searchBarStyle={searchBarStyle}
        />
      </Animated.View>

      <Animated.ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={1}
        contentContainerStyle={{
          paddingTop: HEADER_HEIGHT,
          marginTop: 24,
        }}
      >
        {isLoading ? (
          <HomeSkeletonContent WINDOW_WIDTH={WINDOW_WIDTH} />
        ) : (
          renderContent()
        )}
      </Animated.ScrollView>
    </View>
  );
};

export default HomePage;
