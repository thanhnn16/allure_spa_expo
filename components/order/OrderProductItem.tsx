import i18n from "@/languages/i18n";
import { OrderItem, Orders } from "@/types/order.type";
import formatCurrency from "@/utils/price/formatCurrency";
import { router } from "expo-router";
import { View, Image, Text, TouchableOpacity, Colors, SkeletonView, Button } from "react-native-ui-lib"

interface OrderProductItemProps {
  order: Orders;
}

const OrderProductItem = ({ order }: OrderProductItemProps) => {

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
          {(order.status === 'completed' || order.status === 'cancelled') && (
            <TouchableOpacity
              onPress={() => console.log('reorder')}
              style={{ padding: 5 }}
            >
              <Text h3
                style={{ color: Colors.primary }}
              >
                {i18n.t("orders.repurchase")}
              </Text>
            </TouchableOpacity>
          )}
          {order.status === 'completed' ? (
            <TouchableOpacity
              onPress={() => router.push(`/transaction/${order.id}`)}
              style={{ padding: 5 }}
            >
              <Text h3_bold
                style={{ color: '#E4A951' }}
              >
                {i18n.t("orders.rate_now")}
              </Text>
            </TouchableOpacity>
          ) : null
          }
        </View>
      </View>
      <View height={1} marginV-10 bg-$backgroundPrimaryLight></View>

      {order.order_items.map((item: OrderItem) => (
        <View key={item.id} paddingH-15 paddingB-10>
          <TouchableOpacity onPress={() => router.push('/(app)/transaction/detail')}>
            <View row spread marginT-10>
            {item.product.media && item.product.media.length > 0 ? (
              <Image
                source={{ uri: item.product.media[0].full_url }}
                resizeMode={'fit'}
                style={{ width: 100, height: 100, borderRadius: 13 }}
              />
            ) : (
              <SkeletonView width={100} height={100} borderRadius={13} />
                )}
              <View flex marginL-10 gap-5>
                <View>
                  <Text h3_bold numberOfLines={2}>{item.product?.name}</Text>
                  <Text h3>{i18n.t("orders.quantity")}: {item.quantity}</Text>
                </View>
                <View flex bottom>
                  <Text h3_bold secondary>{formatCurrency({ price: item.price ? Number(item.price) : 0 })}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      ))}
      
      <View height={1} marginT-10 bg-$backgroundPrimaryLight></View>
      <View paddingH-15 paddingV-5 backgroundColor={Colors.primary_light}>
        <View row spread marginT-10>
          <Text h3_bold>{i18n.t("orders.total")}</Text>
          <Text h3_bold secondary>{formatCurrency({ price: Number(order.total_amount) })}</Text>
        </View>
      </View>
    </View>
  )
}

export default OrderProductItem