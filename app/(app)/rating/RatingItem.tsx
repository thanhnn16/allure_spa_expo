import { useState } from 'react'
import { View, Text, Image, Carousel, TouchableOpacity } from 'react-native-ui-lib'

import { Href, Link, router } from 'expo-router';

import StarIcon from '@/assets/icons/star.svg';

interface RatingItemProps {
  id: number;
  rating: number;
  comment: string;
  date: string;
  video: string;
  images: string[];
  user: {
    id: number;
    name: string;
    avatar: string;
  };
};

const RatingItem = ({ item }: { item: RatingItemProps }) => {

  const handleImagePress = () => {
    router.push(
      `/pager_view?id=${item.id}`
    );
  };

  return (
    <View 
      margin-10 
      padding-15 
      backgroundColor='#F9FAFB'
      style={{ borderRadius: 13 }}
    >

      <View row centerV>
        <View row gap-10 centerV>
          <Image width={40} height={40} borderRadius={20} source={{ uri: item.user.avatar }} />
          <Text h3_bold>{item.user.name}</Text>
        </View>
        <View row gap-5 centerV flex right>
          <Image source={StarIcon} width={20} height={20}/>
          <Text h3_bold center>{item.rating}</Text>
        </View>
      </View>

      <View marginV-10>
        <Text h3>{item.comment}</Text>
      </View>

      {item.images.length > 0 && (
        <View marginT-10 row gap-10>
          {item.images.slice(0, 3).map((image, index) => (
              <TouchableOpacity
                key={index}
                onPress={handleImagePress}
              >
                <Image width={40} height={40} source={{ uri: image }} />
              </TouchableOpacity>
          ))}
          {item.images.length > 3 && (
              <TouchableOpacity
                key={item.images.length - 1}
                onPress={handleImagePress}
              >
                <Image width={40} height={40} source={{ uri: item.images[3] }} />
                <View style={{ position: 'absolute', width: 40, height: 40, backgroundColor: 'rgba(0, 0, 0, 0.1)', justifyContent: 'center', alignItems: 'center' }}>
                  <Text h2_bold secondary>{'+' + (item.images.length - 3)}</Text>
                </View>
              </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  )
}

export default RatingItem