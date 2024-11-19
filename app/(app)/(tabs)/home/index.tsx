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
import { Href, router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Dimensions, ScrollView } from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { Colors, Dividers, Image, Text, View } from "react-native-ui-lib";
import { useDispatch, useSelector } from "react-redux";

import WeatherView from "@/components/home/WeatherView";
import { useAuth } from "@/hooks/useAuth";
import i18n from "@/languages/i18n";
import { getAllProductsThunk } from "@/redux/features/products/getAllProductsThunk";
import { RootState } from "@/redux/store";
import { SkeletonView } from "react-native-ui-lib";
import ServiceItem from "@/components/home/ServiceItem";
import { ServiceResponeModel } from "@/types/service.type";
import { Product } from "@/types/product.type";
import { fetchUnreadCount } from "@/redux/features/notification/notificationThunks";
import {fetchBanners} from "@/redux/features/banner/bannerThunk";
import UpcomingAppointment from "@/components/home/UpcomingAppointment";
import { getServicePackagesThunk } from "@/redux/features/servicePackage/getServicePackagesThunk";

const HomePage = () => {
  const dispatch = useDispatch();
  const currentDate = new Date();
  const hours = currentDate.getHours();
  const [greeting, setGreeting] = useState<string>("");

  const { loading } = useSelector((state: RootState) => state.banners);

  useEffect(() => {
    dispatch(fetchBanners());
  }, [dispatch]);

  const { user } = useAuth();

  const scrollOffset = useSharedValue(0);

  const { servicesList, isLoading } = useSelector(
    (state: RootState) => state.service
  );
  const services = servicesList?.data?.data || [];

  const { HEADER_HEIGHT, SCROLL_THRESHOLD, OPACITY_THRESHOLD } =
    useHeaderDimensions();

  const { width: WINDOW_WIDTH, height: WINDOW_HEIGHT } =
    Dimensions.get("window");
  const { products } = useSelector((state: RootState) => state.product);

  const { unreadCount, loading: notificationLoading } = useSelector(
    (state: RootState) => state.notification
  );

  const { packages } = useSelector((state: RootState) => state.servicePackage);

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
    dispatch(getServicesThunk({ page: 1, limit: 5 }));
    dispatch(getAllProductsThunk());
    if (user?.id) {
      dispatch(getServicePackagesThunk(user.id));
    }
  }, [dispatch, user?.id]);



  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollOffset.value = event.contentOffset.y;
    },
  });

  const getUpcomingAppointment = () => {
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

          // Chuyển đổi thời gian start thành giờ và phút
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
  };

  const upcomingAppointment = getUpcomingAppointment();

  const renderContent = () => (
    <View flex>
      <View>
            <CarouselBanner />
      </View>
      <CategoryItem cateData={categories} />

      {upcomingAppointment && (
        <View paddingH-20>
          <View height={1} backgroundColor={Colors.primary} marginV-10 />
          <UpcomingAppointment appointment={upcomingAppointment} />
          <View height={1} backgroundColor={Colors.primary} marginV-10 />
        </View>
      )}

      {services && Array.isArray(services) && services.length > 0 && (
        <SectionContainer
            title={i18n.t("home.featured_services")}
          data={services}
          renderItem={({ item }: { item: ServiceResponeModel }) => (
            <ServiceItem
              item={item}
              widthItem={WINDOW_WIDTH * 0.537}
              heightItem={WINDOW_HEIGHT * 0.378}
              heightImage={WINDOW_HEIGHT * 0.21}
            />
          )}
          onPressMore={() => {
            router.push({
              pathname: "/(app)/see-more",
              params: { type: "service" },
            });
          }}
        />
      )}

      {products && products.length > 0 && (
        <SectionContainer
          title={i18n.t("home.featured_products")}
          data={products}
          renderItem={({ item }: { item: Product }) => (
            <ProductItem
              item={item}
              widthItem={WINDOW_WIDTH * 0.468}
              heightItem={WINDOW_HEIGHT * 0.378}
              heightImage={WINDOW_HEIGHT * 0.19}
            />
          )}
          onPressMore={() => {
            router.push({
              pathname: "/(app)/see-more",
              params: { type: "product" },
            });
          }}
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
        {categories.map((category) => (
            <View key={category.id} center marginH-12>
              <Image source={category.icon} style={{ height: 48, width: 48, borderRadius: 24 }} />
              <Text style={{ marginTop: 5 }}>{category.name}</Text>
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
                width={200}
                marginH-15
                borderRadius={16}
              />
            ))}
        </ScrollView>
      </View>
    </View>
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
            height: HEADER_HEIGHT,
            backgroundColor: "white",
          },
        ]}
      >
        <View bg-white paddingH-20>
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
                  width={32}
                  height={32}
                  borderRadius={30}
                  source={require("@/assets/images/logo/logo.png")}
                />
                <View centerV marginL-10>
                  <Text h2_bold>
                    {user?.full_name || i18n.t("common.guest")}
                  </Text>
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
            style={{ zIndex: 1 }}
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
            <AppSearch isHome />
          </Animated.View>
        </View>
      </Animated.View>

      <Animated.ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={{
          paddingTop: HEADER_HEIGHT,
        }}
      >
        {isLoading ? renderSkeletonContent() : renderContent()}
      </Animated.ScrollView>
    </View>
  );
};

const styles = {
  carouselContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    height: 160,
    marginTop: 10,
    marginHorizontal: 20,
  },
  carousel: {
    height: 200,
  },
  slideContainer: {
    borderRadius: 12,
    overflow: "hidden",
    height: 160,
  },
  image: {
    height: 160,
    width: "100%",
    borderRadius: 12,
  },
};

export default HomePage;

const categories = [
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
