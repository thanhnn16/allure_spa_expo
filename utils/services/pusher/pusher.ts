import Pusher from 'pusher-js/react-native';

const pusher = new Pusher(process.env.EXPO_PUBLIC_PUSHER_APP_KEY, {
  cluster: process.env.EXPO_PUBLIC_PUSHER_APP_CLUSTER,
});

export default pusher;