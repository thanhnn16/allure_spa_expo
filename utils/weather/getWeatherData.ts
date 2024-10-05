import axios from 'axios';
import { Double } from 'react-native/Libraries/Types/CodegenTypes';

const KEY = ''; 

const getWeather = async (lat: Double, lon: Double) => {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${KEY}`
    );
    return response.data;
  } catch (error) {
    throw new Error('Error fetching weather data');
  }
};

export default getWeather;