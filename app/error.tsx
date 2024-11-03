import { View, Text } from 'react-native';

interface ErrorScreenProps {
  error: Error;
}

export const ErrorScreen = ({ error }: ErrorScreenProps) => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Error occurred:</Text>
      <Text>{error.message}</Text>
    </View>
  );
}; 