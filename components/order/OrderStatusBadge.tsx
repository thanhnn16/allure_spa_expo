import { View, Text, Colors } from "react-native-ui-lib";
import { useLanguage } from "@/hooks/useLanguage";

const { t } = useLanguage();

const getStatusColor = (status: string) => {
  const colors = {
    pending: Colors.orange40,
    confirmed: Colors.blue40,
    shipping: Colors.purple40,
    completed: Colors.green40,
    cancelled: Colors.red40,
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
        {t(`orders.status.${status}`)}
      </Text>
    </View>
  );
};

export default OrderStatusBadge;
