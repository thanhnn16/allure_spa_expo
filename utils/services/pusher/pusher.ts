import Pusher from 'pusher-js/react-native';
import Constants from "expo-constants";

const pusher = new Pusher(
  Constants.expoConfig?.extra?.EXPO_PUBLIC_PUSHER_APP_KEY,
  {
    cluster: Constants.expoConfig?.extra?.EXPO_PUBLIC_PUSHER_APP_CLUSTER,
  }
);

export default pusher;