import React, { useEffect, useState } from 'react'
import { View, Image, Text, Colors } from 'react-native-ui-lib'
import * as Progress from 'react-native-progress';

import StarIcon from '@/assets/icons/star.svg';

const RatingBar = ({ star, percent }: { star: number, percent: number }) => {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    setProgress(percent / 100);
  }, [percent]);

  return (

    <View row gap-10 centerV>

        <View row centerV>
          <Image source={StarIcon} size={13}/>
          <Text h3_bold>{star}</Text>
        </View>

        <Progress.Bar progress={progress} width={100} height={2} borderRadius={100} color={Colors.black}/>

        <Text h3_bold>{percent}%</Text>

    </View>
  )
}

export default RatingBar