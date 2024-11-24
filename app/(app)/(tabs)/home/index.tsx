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
import { memo, useCallback, useEffect, useMemo } from "react";
import { Dimensions } from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { Colors, Image, Text, View } from "react-native-ui-lib";
import { useDispatch, useSelector } from "react-redux";

import AppDialog from "@/components/dialog/AppDialog";
import ServiceItem from "@/components/home/ServiceItem";
import UpcomingAppointment from "@/components/home/UpcomingAppointment";
import WeatherView from "@/components/home/WeatherView";
import { HOME_CATEGORIES } from "@/constants/categories";
import { useAuth } from "@/hooks/useAuth";
import { useDialog } from "@/hooks/useDialog";
import { useLanguage } from "@/hooks/useLanguage";
import { fetchBanners } from "@/redux/features/banner/bannerThunk";
import { fetchCartItems } from "@/redux/features/cart/fetchCartThunk";
import { fetchUnreadCount } from "@/redux/features/notification/notificationThunks";
import { getAllProductsThunk } from "@/redux/features/products/getAllProductsThunk";
import { RootState } from "@/redux/store";
import { Product } from "@/types/product.type";
import { ServiceResponeModel } from "@/types/service.type";
import { User } from "@/types/user.type";
import { SkeletonView } from "react-native-ui-lib";

interface HomeHeaderProps {
  user: User;
  greeting: string;
  greetingHeaderStyle: {
    opacity: number;
    transform: { translateY: number }[];
  };
  searchBarStyle: {
    opacity: number;
    transform: { translateY: number }[];
  };
  t: (key: string) => string;
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
    t,
  }: HomeHeaderProps) => {
    const { isGuest } = useAuth();
    const { showDialog, dialogConfig } = useDialog();

    const handleNotificationPress = useCallback(() => {
      if (isGuest) {
        showDialog(
          "Thông báo",
          "Bạn cần đăng nhập để sử dụng chức năng này",
          "error"
        );
      } else {
        router.push("/notification");
      }
    }, [isGuest, showDialog]);

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
                <Text h2_bold>{user?.full_name || t("common.guest")}</Text>
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
            onPress={handleNotificationPress}
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
            {t("home.discover")}
          </Text>
          <AppSearch isHome />
        </Animated.View>
        <AppDialog
          visible={dialogConfig.visible}
          title={dialogConfig.title}
          severity={dialogConfig.severity}
        />
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
          <SkeletonView
            height={120}
            width={WINDOW_WIDTH - 40}
            borderRadius={12}
          />
        </View>

        {/* Services section skeleton */}
        <View marginB-20>
          <View row spread marginB-10>
            <SkeletonView height={20} width={120} />
            <SkeletonView height={20} width={80} />
          </View>
        </View>

        {/* Products section skeleton */}
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
  const { t } = useLanguage();
  const dispatch = useDispatch();
  const { user } = useAuth();
  
  const scrollOffset = useSharedValue(0);
  const { packages } = useSelector((state: RootState) => state.servicePackage);
  const { servicesList, isLoading, hasMore, currentPage } = useSelector(
    (state: RootState) => state.service
  );
  const { products } = useSelector((state: RootState) => state.product);
  const { HEADER_HEIGHT, SCROLL_THRESHOLD, OPACITY_THRESHOLD } =
    useHeaderDimensions();

  const currentGreeting = useMemo(() => {
    const hours = new Date().getHours();
    if (hours < 12) return t("greeting.morning");
    if (hours < 18) return t("greeting.afternoon");
    return t("greeting.evening");
  }, [t]);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      "worklet";
      scrollOffset.value = event.contentOffset.y;
    },
  });

  const getUpcomingAppointment = (packages: any[]) => {
    if (!packages || !Array.isArray(packages)) return null;

    const now = new Date();
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(now.getDate() + 7);

    for (const pkg of packages) {
      if (pkg.next_appointment_details) {
        try {
          const [day, month, year] = pkg.next_appointment_details.date.split("/");
          const appointmentDate = new Date(
            parseInt(year),
            parseInt(month) - 1,
            parseInt(day),
            0,
            0,
            0
          );

          const [startHour, startMinute] = pkg.next_appointment_details.time.start.split(":");
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
  };

  const upcomingAppointment = useMemo(
    () => getUpcomingAppointment(packages),
    [packages]
  );

  const { width: WINDOW_WIDTH, height: WINDOW_HEIGHT } =
    Dimensions.get("window");

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

  const loadMoreServices = useCallback(() => {
    if (hasMore && !isLoading) {
      dispatch(getServicesThunk({ page: currentPage + 1, limit: 5 }));
    }
  }, [hasMore, isLoading, currentPage, dispatch]);

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

      {servicesList &&
        Array.isArray(servicesList) &&
        servicesList.length > 0 && (
          <Animated.View entering={FadeInUp.duration(600).delay(400)}>
            <SectionContainer
              title={t("home.featured_services")}
              data={servicesList}
              renderItem={renderServiceItem}
              onPressMore={() => {
                handlePressMore("service");
              }}
              onEndReached={loadMoreServices}
              isLoadingMore={isLoading && currentPage > 1}
            />
          </Animated.View>
        )}

      {products && products.length > 0 && (
        <Animated.View entering={FadeInUp.duration(600).delay(500)}>
          <SectionContainer
            title={t("home.featured_products")}
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
          greeting={currentGreeting}
          greetingHeaderStyle={greetingHeaderStyle}
          searchBarStyle={searchBarStyle}
          t={t}
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
