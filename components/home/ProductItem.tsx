import { AppStyles } from '@/constants/AppStyles';
import { router } from 'expo-router';
import React from 'react';
import { TouchableOpacity, Image, View, Text } from 'react-native-ui-lib';

interface RenderProductItemProps {
  item: any
}
const RenderProductItem: React.FC<RenderProductItemProps> = ({ item }) => {

  return (
    <TouchableOpacity
      marginR-15
      style={[AppStyles.shadowItem, { borderRadius: 8, width: 150, height: 270 }]}
      onPress={() => router.push({ pathname: '/product/[id]', params: { id: item.id } })}
    >
      <Image source={require('@/assets/images/home/product1.png')} width={'100%'} height={180} />
      <View flex paddingH-10 paddingV-5 gap-2 >
        <Text text70H>{item?.name}</Text>
        <View flex-1 gap-5 row>
          <Image source={require('@/assets/images/home/icons/yellowStar.png')} width={15} height={15} />
          <Text style={{ color: '#8C8585' }}>5.0  <Text> | 475 Đã bán</Text></Text>
        </View>
        <View bottom>
          <Text text70H style={{ color: '#A85A29' }}>{item?.price + ' đ'}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default RenderProductItem
