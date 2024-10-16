import React, { useState } from 'react'
import {router, useLocalSearchParams} from 'expo-router';
import { View, Text, Image, Button, Colors } from 'react-native-ui-lib';
import { Rating } from 'react-native-ratings';

import StarIcon from '@/assets/icons/star.svg';
import RatingBar from '@/components/rating/RatingBar';
import RatingItem from './RatingItem';
import { FlatList, SafeAreaView } from 'react-native';
import { data } from './data';
import { AppStyles } from '@/constants/AppStyles';
import { BlurView } from 'expo-blur';
import AppBar from '@/components/app_bar/app_bar';

const RatingPage = () => {
  const { id } = useLocalSearchParams();
  const [isBuy, setIsBuy] = useState(true);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <View bg-$backgroundDefault flex>
        <AppBar title='' />
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
            <RatingBar star={1} percent={90} />
            <RatingBar star={2} percent={80} />
            <RatingBar star={3} percent={70} />
            <RatingBar star={4} percent={60} />
            <RatingBar star={5} percent={50} />
          </View>
        </View>

        <View style={{ flex: 1 }}>
          <FlatList
            data={data}
            renderItem={({ item }) => <RatingItem item={item} />}
            contentContainerStyle={{ gap: 10 }}
            ListFooterComponent={
              <View height={90} />
            }
          />
        </View>

        {isBuy && (
          <BlurView
            style={{
              flex: 1,
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: 60,
            }}
            intensity={200}
            // tint='light'
            // experimentalBlurMethod='dimezisBlurView'
          >
            <Button
              label='Thêm đánh giá'
              labelStyle={{ fontFamily: 'SFProText-Bold', fontSize: 16 }}
              backgroundColor={Colors.primary}
              padding-20
              borderRadius={10}
              style={{ width: 240, height: 40, alignSelf: 'center', marginVertical: 10 }}
              onPress={() => console.log('mua ha')}
            />
          </BlurView>
        )}
      </View>
    </SafeAreaView>
  )
}

export default RatingPage
