import axios from 'axios';
import { Double } from 'react-native/Libraries/Types/CodegenTypes';

let KEY = process.env.EXPO_PUBLIC_WEATHER_API_KEY;

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
    console.error('Error fetching weather data:', error);
    throw new Error('Error fetching weather data');
  }
};

export default getWeather;