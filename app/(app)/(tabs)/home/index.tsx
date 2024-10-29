import HomeHeaderButton from "@/components/buttons/HomeHeaderButton";
import RenderCarousel from "@/components/home/CarouselBanner";
import RenderCategory from "@/components/home/CategoryItem";
import RenderProductItem from "@/components/home/ProductItem";
import RenderSection from "@/components/home/RenderSection";
import AppSearch from "@/components/inputs/AppSearch";
import { AppStyles } from "@/constants/AppStyles";
import { getServicesThunk } from "@/redux/features/service/getServicesThunk";
import {
  hideStyle,
  showStyle,
  useHeaderDimensions,
} from "@/utils/animated/home/header";
import getLocation from "@/utils/location/locationHelper";
import getWeather from "@/utils/weather/getWeatherData";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Href, Link, router } from "expo-router";
import { useEffect, useState } from "react";
import { Platform, Dimensions, ScrollView } from "react-native";
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
import { SkeletonView, Spacings } from "react-native-ui-lib";

interface LocationsType {
  distance: number;
  lat: number;
  lon: number;
  name: string;
}

const HomePage = () => {
  const dispatch = useDispatch();

  const [services, setServices] = useState<any[]>([]);
  const [temperature, setTemperature] = useState<number>(0);
  const [location, setLocation] = useState<LocationsType | null>(null);
  const [weatherIcon, setWeatherIcon] = useState<string>("");
  const [currentDate, setCurrentDate] = useState<string>("");
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

  useEffect(() => {
    dispatch(getServicesThunk(1));
  }, [dispatch]);

  useEffect(() => {
    if (servicesList && servicesList.data) {
      setServices(servicesList.data);
    }
  }, [servicesList]);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const res = await fetch(
          "https://66fa1d4eafc569e13a9a70d9.mockapi.io/api/v1/products"
        );
        const data = await res.json();
        if (data) setServices(data);
      } catch (error: any) {
        console.error("Error fetching products:", error);
      }
    };

    (async () => {
      try {
        const nearestProvince = await getLocation();
        if (!nearestProvince) {
          throw new Error("Failed to get location");
        }

        const weatherData = await getWeather(
          nearestProvince.lat,
          nearestProvince.lon
        );
        if (!weatherData) {
          throw new Error("Failed to fetch weather data");
        }

        setLocation(nearestProvince);
        setWeatherIcon(weatherData.weather[0].icon);
        const temperatureData = weatherData["main"]["temp"];
        if (temperatureData > 50) {
          setTemperature(temperatureData - 273.15);
        } else {
          setTemperature(weatherData["main"]["temp"]);
        }
      } catch (error: any) {
        console.log("Get weather error: ", error.message);
        // Add error handling here
        setWeatherIcon("01d"); // Set a default weather icon
        setTemperature(25); // Set a default temperature
      }
    })();

    getProducts();
  }, []);

  useEffect(() => {
    const date = new Date();
    const weekdays = [
      "Chủ Nhật",
      "Thứ Hai",
      "Thứ Ba",
      "Thứ Tư",
      "Thứ Năm",
      "Thứ Sáu",
      "Thứ Bảy",
    ];
    const weekday = weekdays[date.getDay()];
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    setCurrentDate(`${weekday}, ngày ${day}/${month}/${year}`);
  }, []);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollOffset.value = event.contentOffset.y;
    },
  });

  const renderServicesItem = ({ item }: { item: any }) => {
    if (!item || !item.service_name) {
      return null;
    }

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
          { borderRadius: 16, width: 230, height: "auto" },
        ]}
      >
        <Image
          source={
            item.image_url
              ? { uri: item.image_url }
              : require("@/assets/images/home/service1.png")
          }
          width={"100%"}
          height={210}
          style={{ resizeMode: "cover" }}
        />
        <View paddingH-12 marginT-6>
          <Text text70H>{item.service_name}</Text>
          <Text style={{ color: "#8C8585" }}>
            {truncateText(item.description, 50)}
          </Text>
          <Text marginT-10 text70H style={{ color: "#A85A29" }}>
            {item.single_price.toLocaleString("vi-VN")} VNĐ
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderContent = () => (
    <View flex>
      <RenderCarousel banner={banner} />
      <RenderCategory cateData={cateArr} />
      {servicesList && servicesList.data && servicesList.data.length > 0 && (
        <RenderSection
          title="Dịch vụ nổi bật"
          data={servicesList.data}
          renderItem={renderServicesItem}
          onPressMore={() => {}}
        />
      )}
      {servicesList && servicesList.data && servicesList.data.length > 0 && (
        <RenderSection
          title="Sản phẩm nổi bật"
          data={servicesList.data}
          renderItem={RenderProductItem}
          onPressMore={() => {}}
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
      <View bg-$backgroundDefault flex>
        <Animated.View
          style={[
            {
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              zIndex: 1,
              height: HEADER_HEIGHT,
              backgroundColor: "$white",
            },
          ]}
        >
          <View paddingH-24 flex>
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
                    <Link href={"/(tabs)/profile" as Href<string>}>
                      <Text h2_bold>Đức Lộc</Text>
                    </Link>
                    <Text h3>Allure Spa chúc bạn buổi sáng vui vẻ!</Text>
                  </View>
                </View>
                <View row gap-15 marginL-auto>
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
              </View>
              <View
                row
                height={60}
                centerV
                style={{
                  borderRadius: 8,
                  borderColor: "#C9C9C9",
                  borderWidth: 1,
                  overflow: "hidden",
                }}
                marginB-15
              >
                <BlurView
                  style={{
                    width: "100%",
                    height: "100%",
                    flexDirection: "row",
                    alignItems: "center",
                    paddingHorizontal: 15,
                  }}
                >
                  <View row centerV>
                    <Image
                      source={{
                        uri: `https://openweathermap.org/img/wn/${weatherIcon}@2x.png`,
                      }}
                      width={40}
                      height={40}
                    />
                    <Text marginL-5 text60>
                      {temperature.toFixed(0)}°C
                    </Text>
                  </View>
                  <View
                    height={30}
                    width={2}
                    backgroundColor="#717658"
                    marginL-15
                    marginR-15
                  />
                  <View>
                    <Text h3_bold>{currentDate}</Text>
                    <View row centerV>
                      <FontAwesome6
                        name="location-dot"
                        size={16}
                        color="black"
                      />
                      <Text marginL-5 h3_medium>
                        {location?.name}
                      </Text>
                    </View>
                  </View>
                </BlurView>
              </View>
            </Animated.View>

            <Animated.View
              style={[
                showStyle(scrollOffset, HEADER_HEIGHT, SCROLL_THRESHOLD),
                {
                  position: "absolute",
                  bottom: 10,
                  left: 0,
                  right: 0,
                  backgroundColor: "white",
                  paddingHorizontal: 24,
                  paddingVertical: 10,
                },
              ]}
            >
              <Text h0_bold color="#717658" marginB-10>
                Khám phá
              </Text>
              <AppSearch isHome style={{ marginBottom: 15 }} />
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
    name: "Giới thiệu",
    icon: require("@/assets/images/home/icons/Introduce.png"),
    url: "https://allurespa.com.vn/gioi-thieu/",
  },
  {
    id: "2",
    name: "Voucher",
    icon: require("@/assets/images/home/icons/Voucher.png"),
    url: "https://allurespa.com.vn/voucher/",
  },
  {
    id: "3",
    name: "Dịch vụ",
    icon: require("@/assets/images/home/icons/Service.png"),
    url: "https://allurespa.com.vn/dich-vu/",
  },
  {
    id: "4",
    name: "Sản phẩm",
    icon: require("@/assets/images/home/icons/Product.png"),
    url: "https://allurespa.com.vn/san-pham/",
  },
  {
    id: "5",
    name: "Khoá học",
    icon: require("@/assets/images/home/icons/Course.png"),
    url: "https://allurespa.com.vn/khoa-hoc/",
  },
  {
    id: "6",
    name: "Tin tức",
    icon: require("@/assets/images/home/icons/News.png"),
    url: "https://allurespa.com.vn/category/tin-tuc/",
  },
];
