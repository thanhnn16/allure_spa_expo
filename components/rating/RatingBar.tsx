import React from 'react'
import { View, Image, Text } from 'react-native-ui-lib'

import StarIcon from '@/assets/icons/star.svg';

const RatingBar = () => {
  return (
    <View row centerV>
        <Image source={StarIcon} size={13}/>
        <View width={100} height={2} bg-$primary borderRadius-100 paddingH-5 paddingV-2></View>
        <Text h3_bold>90%</Text>
    </View>
  )
}

export default RatingBar