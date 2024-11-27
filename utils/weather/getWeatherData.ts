import axios from 'axios';
import { Double } from 'react-native/Libraries/Types/CodegenTypes';
const KEY = process.env.EXPO_PUBLIC_OPEN_WEATHER_API_KEY;

const getWeather = async (lat: Double, lon: Double) => {
  try {
    if (!KEY) {
      console.warn('Weather API key is not defined');
      return null;
    }
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${KEY}`
    );
    return response.data;
  } catch (error) {
    console.warn('Error fetching weather data:', error);
    return null;
  }
};

export default getWeather;