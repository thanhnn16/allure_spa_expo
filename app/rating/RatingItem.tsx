import React from 'react'
import { View, Text } from 'react-native-ui-lib'

interface RatingItemProps {
  id: number;
  rating: number;
  comment: string;
  date: string;
  images: string[];
  user: {
    id: number;
    name: string;
    avatar: string;
  };
};

const RatingItem = ({ item }: { item: RatingItemProps }) => {
  return (
    <View>
      <Text>{item.user.name}</Text>
    </View>
  )
}

export default RatingItem