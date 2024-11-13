import i18n from "@/languages/i18n";
import getLocation from "@/utils/location/locationHelper";
import getWeather from "@/utils/weather/getWeatherData";
import FontAwesome6 from "@expo/vector-icons/build/FontAwesome6";
import { BlurView } from "expo-blur";
import { useEffect, useState } from "react";
import { Text, View, Image } from "react-native-ui-lib";

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
  useEffect(() => {
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
        setWeatherIcon("01d");
        setTemperature(25);
      }
    })();
  }, []);

  useEffect(() => {
    const date = new Date();
    const weekdays = [
      i18n.t("days.sun"),
      i18n.t("days.mon"),
      i18n.t("days.tue"),
      i18n.t("days.wed"),
      i18n.t("days.thu"),
      i18n.t("days.fri"),
      i18n.t("days.sat"),
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
      <View row centerV paddingH-10>
        <Image
          source={{
            uri: `https://openweathermap.org/img/wn/${weatherIcon}@2x.png`,
          }}
          width={40}
          height={40}
        />
        <Text text60>{temperature.toFixed(0)}°C</Text>
      </View>
      <View
        height={30}
        width={2}
        backgroundColor="#717658"
        marginL-15
        marginR-15
      />
      <View>
        <Text h3_bold>
          {weekday}, {i18n.t("days.day")} {currentDate}
        </Text>
        <View row centerV>
          <FontAwesome6 name="location-dot" size={16} color="black" />
          <Text marginL-5 h3_medium>
            {location?.name}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default WeatherView;
