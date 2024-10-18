import { AppStyles } from '@/constants/AppStyles';
import { useEffect, useState } from 'react';
import { FlatList, Platform, Pressable, ScrollView, StyleSheet } from 'react-native';
import { View, Text, Image, TouchableOpacity, Carousel, PageControlPosition, AnimatedImage, Spacings } from 'react-native-ui-lib';
import getLocation from '@/utils/location/locationHelper';
import getWeather from '@/utils/weather/getWeatherData';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { Double, Float } from 'react-native/Libraries/Types/CodegenTypes';
import ButtonNotifyIcon from '@/components/buttons/ButtonNotifyIcon';
import ButtonMessageIcon from '@/components/buttons/ButtonMessageIcon';
import Animated, { useSharedValue, SharedValue, useAnimatedScrollHandler } from 'react-native-reanimated'
import AppSearch from '@/components/inputs/AppSearch';
import { Href, router } from "expo-router";
import { hideStyle, showStyle } from './animated';
import { useDispatch, useSelector } from 'react-redux'
import { getTreatmentsThunk, getTreatmentCateThunk } from '@/redux/treatment';
import { TreatmentResponeModel } from '@/types/treatment.type';
import RenderSection from '../../../components/home/renderSection';
import RenderCategory from '../../../components/home/renderCategory';
import RenderProductItem from '../../../components/home/renderProductItem';
import RenderCarousel from '@/components/home/renderCarousel';


interface CateItem {
  id: string;
  name: string;
  icon: any;
}

interface LocationsType {
  distance: Double;
  lat: Double;
  lon: Double;
  name: string;
}

interface HeaderStyleParams {
  offset: SharedValue<number>;
  height: number;
}

const HomePage = () => {
  const dispatch = useDispatch();

  const [cateData, setCateData] = useState<CateItem[]>(cateArr)
  const [services, setServices] = useState<any>([]);
  const [temperature, setTemperature] = useState<Float>(0);
  const [location, setLocation] = useState<LocationsType | null>(null);
  const [weatherIcon, setWeatherIcon] = useState<string>('')
  const [currentDate, setCurrentDate] = useState<string>('')
  const [banner, setBanner] = useState([
    { uri: 'https://intphcm.com/data/upload/banner-spa-cta.jpg' },
    { uri: 'https://easysalon.vn/wp-content/uploads/2019/12/banner-spa.jpg' },
    { uri: 'https://i.pinimg.com/originals/4f/25/c1/4f25c16a936656f89e38796eda8898e2.jpg' },
  ]);
  
  const [treatments, setTreatments] = useState([]);

  const scrollOffset = useSharedValue(0);

  const { treatmentsList } = useSelector((state: any) => state.treatment);
  useEffect(() => {
    dispatch(getTreatmentsThunk(1));
  }, [dispatch]);

  useEffect(() => {
    if (treatmentsList && treatmentsList.data) {
      setTreatments(treatmentsList.data);
    }
  }, [treatmentsList]);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const res = await fetch("https://66fa1d4eafc569e13a9a70d9.mockapi.io/api/v1/products");
        const data = await res.json();
        if (data) setServices(data);
      } catch (error: any) {
        console.log("Get products error: ", error.message)
      }
    };
    (async () => {
      try {
        const nearestProvince = await getLocation();
        const weatherData = await getWeather(nearestProvince.lat, nearestProvince.lon);

        if (nearestProvince) setLocation(nearestProvince);
        if (weatherData) {
          setWeatherIcon(weatherData.weather[0].icon);
          const temperatureData = weatherData['main']['temp'];
          if (temperatureData > 50) {
            setTemperature((temperatureData - 273.15));
          } else {
            setTemperature(weatherData['main']['temp']);
          }

        }

      } catch (error: any) {
        console.log("Get weather error: ", error.message)
      }
    })();
    getProducts();
  }, []);

  useEffect(() => {
    const date = new Date();
    const weekdays = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
    const weekday = weekdays[date.getDay()];
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    setCurrentDate(`${weekday}, ngày ${day}/${month}/${year}`);
  }, []);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollOffset.value = event.contentOffset.y;
    },
  });


  const renderTreatmentsItem = (item: any) => {
    const rItem = item.item;

    const truncateText = (text: string, maxLength: number) => {
      if (text?.length <= maxLength) return text;
      return text?.slice(0, maxLength).trim() + '...';
    };

    return (
      <TouchableOpacity marginR-15 style={[AppStyles.shadowItem, { borderRadius: 16, width: 230, height: 'auto' }]} >
        <Image source={require('@/assets/images/home/service1.png')} width={'100%'} height={210} style={{ resizeMode: 'stretch' }} />
        <View flex paddingH-10 paddingV-5 gap-2 >
          <Text text70H>{rItem.name}</Text>
          <View flex-1>
            <Text style={{ color: '#8C8585' }}>{truncateText(rItem.description, 50)}</Text>
          </View>
          <View bottom>
            <Text text70H style={{ color: '#A85A29' }}>{rItem.price + ' VNĐ'}</Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <View bg-$backgroundDefault useSafeArea flex>
      <View marginH-24 center style={{ marginTop: Platform.OS === 'ios' ? 15 : 25 }}>

        {/* Header */}
        <View row centerV width={'100%'} height={60} style={{ justifyContent: 'space-between' }}>
          <View >
            <Animated.View style={hideStyle(scrollOffset)}>
              <View row>
                <Image width={48} height={48} borderRadius={30} source={require('@/assets/images/logo/logo.png')} />
                <View>
                  <Text text60BO>Đức Lộc</Text>
                  <Text marginT-2>Allure Spa chúc bạn buổi sáng vui vẻ!</Text>
                </View>
              </View>
            </Animated.View>
            <Animated.View style={showStyle(scrollOffset)}>
              <Text text50BO color='#717658'>Khám phá</Text>
            </Animated.View>
          </View>
          <View row gap-15 >
            <ButtonNotifyIcon onPress={() => {
              router.push('notification' as Href<string>);
            }} />
            <ButtonMessageIcon onPress={() => { alert('Add navigate in line 135') }} />
          </View>
        </View>

        {/* Weather */}
        <Animated.View style={[hideStyle(scrollOffset), { width: '100%' }]}>
          <View row height={60} centerV style={[AppStyles.shadowItem, { borderRadius: 10 }]} marginB-15 marginH-4 paddingH-5>
            <View row centerV>
              <Image source={{ uri: `https://openweathermap.org/img/wn/${weatherIcon}@2x.png` }} width={40} height={40} />
              <Text marginL-5 text60>{temperature.toFixed(0)}°C</Text>
            </View>
            <View height={30} width={2} backgroundColor="#717658" marginL-15 marginR-15 />
            <View>
              <Text text70BO>{currentDate}</Text>
              <View row marginT-2 centerV>
                <FontAwesome6 name="location-dot" size={16} color="black" />
                <Text marginL-5 text80>{location?.name}</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Search */}
        <Animated.View style={showStyle(scrollOffset)}>
          <AppSearch />
        </Animated.View>

        <Animated.ScrollView
          style={{}}
          showsVerticalScrollIndicator={false}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          contentContainerStyle={{
            paddingBottom: Platform.OS === 'ios' ? 70 : 60,
            paddingTop: 15
          }}
        >

          {/* <RenderCarousel banner={banner} /> */}

          {/* Danh mục */}
          <RenderCategory cateData={cateArr} />

          <RenderSection
            title='Dịch vụ nổi bật'
            data={treatments}
            renderItem={renderTreatmentsItem}
            onPressMore={() => {

            }} />

          <RenderSection
            title='Sản phẩm nổi bật'
            data={services}
            renderItem={RenderProductItem}
            onPressMore={() => {

            }} />

          <RenderSection
            title='Sản phẩm bán chạy'
            data={services}
            renderItem={RenderProductItem}
            onPressMore={() => {

            }} />

        </Animated.ScrollView>
      </View>
    </View>
  );
}
export default HomePage;



const cateArr = [
  {
    id: '1',
    name: 'Giới thiệu',
    icon: require('@/assets/images/home/icons/Introduce.png')
  },
  {
    id: '2',
    name: 'Voucher',
    icon: require('@/assets/images/home/icons/Voucher.png')
  },
  {
    id: '3',
    name: 'Dịch vụ',
    icon: require('@/assets/images/home/icons/Service.png')
  },
  {
    id: '4',
    name: 'Sản phẩm',
    icon: require('@/assets/images/home/icons/Product.png')
  },
  {
    id: '5',
    name: 'Khoá học',
    icon: require('@/assets/images/home/icons/Course.png')
  },
  {
    id: '6',
    name: 'Tin tức',
    icon: require('@/assets/images/home/icons/News.png')
  }
]
