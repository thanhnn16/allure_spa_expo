import axios from 'axios';
import { Double } from 'react-native/Libraries/Types/CodegenTypes';
import Constants from "expo-constants";
let KEY = Constants.expoConfig?.extra?.EXPO_PUBLIC_OPEN_WEATHER_API_KEY;

const getWeather = async (lat: Double, lon: Double) => {
  try {
    if (!KEY) {
      throw new Error('Weather API key is not defined');
    }
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${KEY}`
    );
    return response.data;
  } catch (error) {
    throw new Error('Error fetching weather data');
  }
};

export default getWeather;