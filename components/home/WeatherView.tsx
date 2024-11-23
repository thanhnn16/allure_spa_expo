import { useLanguage } from "@/hooks/useLanguage";

const { t } = useLanguage();
import getLocation from "@/utils/location/locationHelper";
import getWeather from "@/utils/weather/getWeatherData";
import FontAwesome6 from "@expo/vector-icons/build/FontAwesome6";
import { BlurView } from "expo-blur";
import { useEffect, useState } from "react";
import { Text, View, Image, SkeletonView, Colors } from "react-native-ui-lib";

interface LocationsType {
  distance: number;
  lat: number;
  lon: number;
  name: string;
}

const WeatherView = () => {
  const [temperature, setTemperature] = useState<number>(0);
  const [location, setLocation] = useState<LocationsType | null>(null);
  const [weatherIcon, setWeatherIcon] = useState<string>("");
  const [currentDate, setCurrentDate] = useState<string>("");
  const [weekday, setWeekday] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const nearestProvince = await getLocation();
        if (!nearestProvince) {
          throw new Error("Failed to get location");
        }
        setError(null);

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
        setError("Không có quyền truy cập vị trí");
        setWeatherIcon("01d");
        setTemperature(25);
      }
    })();
  }, [weatherIcon]);

  useEffect(() => {
    const date = new Date();
    const weekdays = [
      t("days.sun"),
      t("days.mon"),
      t("days.tue"),
      t("days.wed"),
      t("days.thu"),
      t("days.fri"),
      t("days.sat"),
    ];

    const weekday = weekdays[date.getDay()];
    const dayOfMonth = date.getDate();
    const month = date.getMonth() + 1;

    setWeekday(`${weekday}`);
    setCurrentDate(`${dayOfMonth}/${month}`);
  }, []);

  return (
    <View
      row
      centerV
      paddingV-8
      br30
      style={{
        borderColor: "#C9C9C9",
        borderWidth: 1,
      }}
    >
      <View row centerV gap-4 paddingH-4>
        {weatherIcon ? (
          <Image
            source={{
              uri: `https://openweathermap.org/img/wn/${weatherIcon}@2x.png`,
            }}
            width={42}
            height={42}
          />
        ) : (
          <SkeletonView width={42} height={42} />
        )}
        <Text text70>{temperature.toFixed(0)}°C</Text>
      </View>
      <View
        height={25}
        width={1}
        backgroundColor="#C9C9C9"
        marginL-12
        marginR-12
      />
      <View>
        <Text text70 color="#4A4A4A">
          {weekday}, {t("days.day")} {currentDate}
        </Text>
        <View row gap-6 centerV>
          <FontAwesome6 name="location-dot" size={12} color="#4A4A4A" />
          {error ? (
            <Text marginL-2 text90R color={Colors.primary}>
              {error}
            </Text>
          ) : location ? (
            <Text marginL-4 text80 color={Colors.primary}>
              {location?.name}
            </Text>
          ) : (
            <SkeletonView width={80} height={16} />
          )}
        </View>
      </View>
    </View>
  );
};

export default WeatherView;
