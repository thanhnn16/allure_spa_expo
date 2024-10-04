import axios from 'axios';
import { Double } from 'react-native/Libraries/Types/CodegenTypes';

const OPENWEATHERMAP_API_KEY = '13b82ae5913353d7c47bb1697c7e90f8'; // Khoá API của tài khoản OpenWeatherMap

const getWeather = async (lat: Double, lon: Double) => {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${OPENWEATHERMAP_API_KEY}`
    );
    return response.data;
  } catch (error) {
    throw new Error('Error fetching weather data');
  }
};

export default getWeather;