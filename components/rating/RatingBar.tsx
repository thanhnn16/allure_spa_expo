import React, { useEffect, useState } from 'react'
import { View, Image, Text, Colors, ProgressBar } from 'react-native-ui-lib'

import StarIcon from '@/assets/icons/star.svg';

const RatingBar = ({ star, percent }: { star: number, percent: number }) => {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    setProgress(percent / 100);
  }, [percent]);

  return (

    <View row gap-10 centerV>

      <View row centerV>
        <Image source={StarIcon} size={13} />
        <Text h3_bold>{star}</Text>
      </View>

      <ProgressBar progress={progress} style={{ width: 100, height: 2, borderRadius: 100 }} progressColor={Colors.primary} />

      <Text h3_bold>{percent}%</Text>

    </View>
  )
}

export default RatingBar