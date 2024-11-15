import { StyleSheet } from "react-native";
import {
  Card,
  Text,
  TouchableOpacity,
  View,
  Image,
  Colors,
} from "react-native-ui-lib";
import React from "react";

import BackIcon from "@/assets/icons/arrow_left.svg";
import { Ionicons } from "@expo/vector-icons";
import i18n from "@/languages/i18n";
import { PaymentAddressProps } from "@/app/(app)/check-out";

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
  return (
    <View marginV-10>
      <Text h2_bold>{i18n.t("checkout.customer_info")}</Text>
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
