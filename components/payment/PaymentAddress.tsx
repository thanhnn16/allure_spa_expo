import { StyleSheet } from "react-native";
import {
  Text,
  TouchableOpacity,
  View,
  Colors,
} from "react-native-ui-lib";

import { Ionicons } from "@expo/vector-icons";
import { useLanguage } from "@/hooks/useLanguage";

interface PaymentAddressProps {
  addressType: string;
  fullName: string;
  phoneNumber: string;
  address: string;
  district: string;
  province: string;
}

interface PaymentAddressComponentProps {
  isPayment?: boolean;
  onPress?: () => void;
  selectAddress?: PaymentAddressProps | null;
}

const PaymentAddress = ({
  isPayment,
  onPress,
  selectAddress,
}: PaymentAddressComponentProps) => {
  const { t } = useLanguage();

  return (
    <View marginV-10>
      <Text h2_bold>{t("checkout.customer_info")}</Text>
      <TouchableOpacity onPress={onPress}>
        <View
          row
          centerV
          padding-15
          style={{
            borderWidth: 1,
            borderColor: "#E0E0E0",
            borderRadius: 10,
            marginVertical: 10,
            backgroundColor: "#FCFCFC",
            justifyContent: "space-between",
          }}
        >
          {selectAddress ? (
            <View>
              <View
                centerV
                centerH
                width={90}
                style={{
                  backgroundColor: "#F6F6F6",
                  padding: 5,
                  borderRadius: 5,
                  marginBottom: 5,
                }}
              >
                <Text h3_bold>{selectAddress.addressType}</Text>
              </View>
              <Text h3>{selectAddress.fullName}</Text>
              <Text h3>{selectAddress.phoneNumber}</Text>
              <Text h3>
                {selectAddress.address}, {selectAddress.district},{" "}
                {selectAddress.province}
              </Text>
            </View>
          ) : (
            <View>
              <Text h3_bold>Chưa có địa chỉ</Text>
            </View>
          )}
          {isPayment && (
            <View centerV>
              <Ionicons
                name="chevron-forward"
                size={24}
                color={Colors.primary}
              />
            </View>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default PaymentAddress;

const styles = StyleSheet.create({});
