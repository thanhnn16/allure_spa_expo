import { OrderItem } from "@/types/order.type";
import formatCurrency from "@/utils/price/formatCurrency";
import { router } from "expo-router";
import { View, Image, Text, TouchableOpacity, Colors } from "react-native-ui-lib"

interface OrderProductItemProps {
  order: OrderItem;
  status: string;
}

const OrderProductItem = ({ order, status }: OrderProductItemProps) => {
  const productImage = require("@/assets/images/home/product1.png");
  console.log('orders', order)
  return (
    <View
      paddingT-10
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 3,
        backgroundColor: 'white',
        borderRadius: 10,
        marginVertical: 10,
        marginHorizontal: 20,
        borderColor: '#e3e4de',
      }}
    >
      <View row spread centerV paddingH-15>
        <View
          row gap-15 centerV
        >
          <Text h3_bold>#{order.id}</Text>
        </View>
        <View row gap-10 centerV>
          {(status === 'completed' || status === 'cancelled') && (
            <TouchableOpacity
              onPress={() => console.log('reorder')}
              style={{ padding: 5 }}
            >
              <Text h3
                style={{ color: Colors.primary }}
              >
                Mua lại
              </Text>
            </TouchableOpacity>
          )}
          {status === 'completed' ? (
            <TouchableOpacity
              onPress={() => router.push('/(app)/transaction/detail')}
              style={{ padding: 5 }}
            >
              <Text h3_bold
                style={{ color: '#E4A951' }}
              >
                Đánh giá ngay
              </Text>
            </TouchableOpacity>
          ) : null
          }
        </View>
      </View>
      <View height={1} marginV-10 bg-$backgroundPrimaryLight></View>
      <View paddingH-15>
        <TouchableOpacity onPress={() => router.push('/(app)/transaction/detail')}>
          <View row spread marginT-10>
            <Image
              source={productImage}
              resizeMode={'fit'}
              style={{ width: 100, height: 100, borderRadius: 13 }}
            />
            <View flex marginL-10 gap-5>
              <View>
                <Text h3_bold numberOfLines={2}>{order.product ? order.product.name : 'no name'}</Text>
                <Text h3>Số lượng: {order.quantity}</Text>
              </View>
              <View flex bottom>
                <Text h3_bold secondary>{formatCurrency({ price: order.product ? Number(order.product.price) : 0 })}</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
      <View height={1} marginT-10 bg-$backgroundPrimaryLight></View>
      <View paddingH-15 paddingV-5 backgroundColor={Colors.primary_light}>
        <View row spread marginT-10>
          <Text h3_bold>Tổng tiền:</Text>
          <Text h3_bold secondary>{formatCurrency({ price: Number(order.price) })}</Text>
        </View>
      </View>
    </View>
  )
}

export default OrderProductItem