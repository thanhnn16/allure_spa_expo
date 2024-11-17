import { View, Text, Colors } from "react-native-ui-lib";
import i18n from "@/languages/i18n";

const getStatusColor = (status: string) => {
  const colors = {
    pending: Colors.orange30,
    confirmed: Colors.blue30,
    shipping: Colors.purple30,
    delivered: Colors.green30,
    completed: Colors.green10,
    cancelled: Colors.red30,
  };
  return colors[status as keyof typeof colors] || Colors.grey30;
};

const OrderStatusBadge = ({ status }: { status: string }) => {
  return (
    <View
      paddingH-12
      paddingV-4
      br20
      style={{ backgroundColor: getStatusColor(status) }}
    >
      <Text white h3>
        {i18n.t(`orders.status.${status}`)}
      </Text>
    </View>
  );
};

export default OrderStatusBadge;
