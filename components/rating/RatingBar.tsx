import React, { useEffect, useState } from 'react'
import { View, Image, Text, Colors, ProgressBar } from 'react-native-ui-lib'

import StarIcon from '@/assets/icons/star.svg';

const RatingBar = ({ star, total }: { star: number, total: number }) => {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    setProgress(total / 100);
  }, [total]);

  return (

    <View row gap-10 centerV>

      <View row centerV>
        <Image source={StarIcon} width={16} height={16}/>
        <Text h3_bold>{star}</Text>
      </View>

      <ProgressBar progress={progress} style={{ width: 70, height: 2, borderRadius: 100 }} progressColor={Colors.primary} />

      <Text h3_medium>{total}</Text>

    </View>
  )
}

export default RatingBar