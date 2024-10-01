import React from 'react'
import { useLocalSearchParams } from 'expo-router';
import { View, Text, Image } from 'react-native-ui-lib';
import { Rating } from 'react-native-ratings';

import StarIcon from '@/assets/icons/star.svg';
import RatingBar from '@/components/rating/RatingBar';
import RatingItem from './RatingItem';
import { FlatList } from 'react-native';

const data = [
  {
    id: 1,
    rating: 5,
    comment: 'Tôi rất hài lòng với sản phẩm này',
    date: '2024-01-01',
    images: [
      'https://via.placeholder.com/150',
      'https://via.placeholder.com/150',
      'https://via.placeholder.com/150',
      'https://via.placeholder.com/150',
      'https://via.placeholder.com/150',
    ],
    user: {
      id: 1,
      name: 'Nguyễn Văn A',
      avatar: 'https://via.placeholder.com/150'
    }
  },
  {
    id: 2,
    rating: 4,
    comment: 'Tôi rất hài lòng với sản phẩm này',
    date: '2024-01-01',
    images: [
      'https://via.placeholder.com/150',
      'https://via.placeholder.com/150',
      'https://via.placeholder.com/150',
    ],
    user: {
      id: 2,
      name: 'Nguyễn Văn B',
      avatar: 'https://via.placeholder.com/150'
    }
  },
  {
    id: 3,
    rating: 3,
    comment: 'Tôi rất hài lòng với sản phẩm này',
    date: '2024-01-01',
    images: [
      'https://via.placeholder.com/150',
      'https://via.placeholder.com/150',
    ],
    user: {
      id: 3,
      name: 'Nguyễn Văn C',
      avatar: 'https://via.placeholder.com/150'
    }
  },
  {
    id: 4,
    rating: 2,
    comment: 'Tôi rất hài lòng với sản phẩm này',
    date: '2024-01-01',
    images: [
      'https://via.placeholder.com/150',
      'https://via.placeholder.com/150',
      'https://via.placeholder.com/150'
    ],
    user: {
      id: 4,
      name: 'Nguyễn Văn D',
      avatar: 'https://via.placeholder.com/150'
    }
  },
  {
    id: 5,
    rating: 1,
    comment: 'Tôi rất hài lòng với sản phẩm này',
    date: '2024-01-01',
    images: [
      'https://via.placeholder.com/150',
      'https://via.placeholder.com/150',
      'https://via.placeholder.com/150',
      'https://via.placeholder.com/150',
      'https://via.placeholder.com/150',
    ],
    user: {
      id: 5,
      name: 'Nguyễn Văn E',
      avatar: 'https://via.placeholder.com/150'
    }
  }
]

const RatingPage = () => {
  const { id } = useLocalSearchParams();
  return (
    <View bg-$backgroundDefault flex>
      <View padding-20 row centerV>
        <View>
          <Text h0_bold>4.9/5</Text>
          <View height={2}></View>
          <Text h3_medium>dựa trên 69 reviews</Text>
          <View height={10}></View>
          <View left>
            <Rating
              ratingCount={5}
              imageSize={16}
              ratingBackgroundColor='#E0E0E0'
              ratingColor='#FFC700'
              ratingTextColor='#000'
              
            />
          </View>
        </View>

        <View flex right>
          <RatingBar />
          <RatingBar />
          <RatingBar />
          <RatingBar />
          <RatingBar />
        </View>
        
      </View>
      <View>
        <FlatList
          data={data}
          renderItem={({ item }) => <RatingItem item={item} />}
        />
      </View>
    </View>
  )
}

export default RatingPage