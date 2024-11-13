import { useState, useEffect } from "react";
import {
  StyleSheet,
  ScrollView,
  ImageSourcePropType,
  SafeAreaView,
} from "react-native";
import { Button, Colors, Text, View } from "react-native-ui-lib";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "expo-router";
import AppBar from "@/components/app-bar/AppBar";
import PaymentAddress from "@/components/payment/PaymentAddress";
import VoucherDropdown from "@/components/payment/VoucherDropdown";
import PaymentPicker from "@/components/payment/PaymentPicker";
import PaymentProductItem from "@/components/payment/PaymentProductItem";
import i18n from "@/languages/i18n";
import formatCurrency from "@/utils/price/formatCurrency";

export interface Product {
  id: number;
  name: string;
  price: string;
  priceValue: number;
  quantity: number;
  image: any;
}
export interface Voucher {
  label: string;
  value: string;
  discountPercentage: number;
}

export interface PaymentAddressProps {
  fullName: string;
  phoneNumber: string;
  fullAddress: string;
  addressType: string;
  isDefault: string;
  note: string;
  addressId: string;
  province: string;
  district: string;
  address: string;
}

const products: Product[] = [
  {
    id: 1,
    name: "Lamellar Lipocollage",
    price: "1.170.000 VNĐ",
    priceValue: 1170000,
    quantity: 1,
    image: require("@/assets/images/sp2.png"),
  },
  {
    id: 2,
    name: "Lamellar Lipocollage",
    price: "1.170.000 VNĐ",
    priceValue: 1170000,
    quantity: 1,
    image: require("@/assets/images/sp2.png"),
  },
];

export interface PaymentMethod {
  id: number;
  name: string;
  icon?: ImageSourcePropType;
  iconName: string;
  code?: string;
  children?: PaymentMethod[];
}

const paymentMethods: PaymentMethod[] = [
  {
    id: 1,
    name: "Thanh toán khi nhận hàng",
    iconName: "cash-outline",
    children: [],
  },
  {
    id: 2,
    name: "Thanh toán online",
    iconName: "card-outline",
    children: [
      {
        id: 21,
        name: "VISA / MasterCard",
        iconName: "card-outline",
        icon: require("@/assets/images/visa.png"),
      },
      {
        id: 22,
        name: "ZaloPay",
        iconName: "card-outline",
        icon: require("@/assets/images/zalopay.png"),
      },
      {
        id: 23,
        name: "Apple Pay",
        iconName: "card-outline",
        icon: require("@/assets/images/apple.png"),
      },
    ],
  },
];

const calculateDiscountedPrice = (giaGoc: number, phanTramGiamGia: number) => {
  const giamGia = giaGoc * (phanTramGiamGia / 100);
  return giaGoc - giamGia;
};

export default function Payment() {
  const [isModalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();
  const [selectedAddress, setSelectedAddress] = useState<PaymentAddressProps | null>(null);
  const [selectedPayment, setSelectedPayment] = useState(
    "Thanh toán khi nhận hàng"
  );
  const [selectedVoucher, setSelectedVoucher] = useState("Không có");

  const [vouchers] = useState<Voucher[]>([
    {
      label: "Giảm 10%",
      value: "voucher1",
      discountPercentage: 10,
    },
    {
      label: "Giảm 20%",
      value: "voucher2",
      discountPercentage: 20,
    },
    {
      label: "Giảm 30%",
      value: "voucher3",
      discountPercentage: 30,
    },
  ]);

  // Tính toán tổng giá dựa trên sản phẩm
  const calculateTotalPrice = () => {
    let total = 0;
    products.forEach((product) => {
      total += product.priceValue * product.quantity;
    });
    return total;
  };
  const [totalPrice, setTotalPrice] = useState(calculateTotalPrice());
  const [discountedPrice, setDiscountedPrice] = useState(totalPrice);

  const handlePaymentSelect = (payment: string) => {
    setSelectedPayment(payment);
  };

  const handleVoucherSelect = (voucher: Voucher) => {
    setSelectedVoucher(voucher.label);
    const newPrice = calculateDiscountedPrice(
      totalPrice,
      voucher.discountPercentage
    );
    setDiscountedPrice(newPrice);
  };

  // Thêm useEffect để theo dõi thay đổi totalPrice
  useEffect(() => {
    setDiscountedPrice(totalPrice);
  }, [totalPrice]);



  // Thêm useEffect để load địa chỉ
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      loadSelectedAddress();
    });

    return unsubscribe;
  }, [navigation]);

  const loadSelectedAddress = async () => {
    try {
      const savedAddress = await AsyncStorage.getItem("selectedAddress");
      if (savedAddress) {
        setSelectedAddress(JSON.parse(savedAddress));
      }
    } catch (error) {
      console.error("Lỗi khi lấy địa chỉ:", error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AppBar back title={i18n.t("checkout.title")} />
      <View flex backgroundColor={Colors.white}>
        <ScrollView style={{paddingHorizontal: 20}} showsVerticalScrollIndicator={false}>
          <PaymentAddress
            isPayment
            onPress={() => router.push('/(app)/address')}
            selectAddress={selectedAddress}
          />

          <View marginV-10 gap-10>
            <Text h2_bold>{i18n.t("checkout.voucher")}</Text>
            <VoucherDropdown
              value={selectedVoucher}
              items={vouchers}
              onSelect={handleVoucherSelect}
            />
          </View>

          <View style={styles.borderInset} />

          <View marginV-10 gap-10>
            <Text h2_bold>{i18n.t("checkout.payment_method")}</Text>
            <PaymentPicker
              value={selectedPayment}
              items={paymentMethods}
              onSelect={handlePaymentSelect}
            />
          </View>

          <View style={styles.borderInset} />

          <View marginV-10 gap-10>
            <Text h2_bold>{i18n.t("checkout.product")}</Text>
            {products.map((product: Product) => (
              <PaymentProductItem
                key={product.id}
                product={product}
              />
            ))}
          </View>


        </ScrollView>

        <View
          style={{
            borderTopWidth: 1,
            borderLeftWidth: 1,
            borderRightWidth: 1,
            borderTopColor: "#E0E0E0",
            borderLeftColor: "#E0E0E0",
            borderRightColor: "#E0E0E0",
            borderTopLeftRadius: 13,
            borderTopRightRadius: 13,
            backgroundColor: "#FFFFFF",
            padding: 20,
          }}
        >
          <View>
            <View row centerV spread >
              <Text h3_bold>{i18n.t("checkout.subtotal")}</Text>
              <Text h3_bold>
                {formatCurrency({ price: totalPrice })}
              </Text>
            </View>
            <View row centerV spread marginT-10>
              <Text h3_bold>{i18n.t("checkout.voucher")}</Text>
              <Text h3>{selectedVoucher}</Text>
            </View>
            <View row centerV spread marginV-10>
              <Text h3_bold>{i18n.t("checkout.total_payment")}</Text>
              <View>
                {discountedPrice !== totalPrice && (
                  <Text
                    h3
                    style={{
                      textDecorationLine: "line-through",
                      color: Colors.grey30,
                      fontSize: 12,
                      textAlign: "right",
                    }}
                  >
                    {formatCurrency({ price: totalPrice })}
                  </Text>
                )}
                <Text h3_bold secondary>
                  {formatCurrency({ price: discountedPrice })}
                </Text>
              </View>
            </View>


            <Button
              label={i18n.t("checkout.payment").toString()}
              labelStyle={{ fontFamily: "SFProText-Bold", fontSize: 16 }}
              backgroundColor={Colors.primary}
              padding-20
              style={{ height: 50 }}
              borderRadius={13}
              onPress={() => router.push("/(app)/transaction")}
            />

          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  totalSection: {
    padding: 10,
    backgroundColor: "#f8f8f8",
    marginHorizontal: 20,
    borderRadius: 8,
  },
  borderInset: {
    width: 370,
    height: 2,
    backgroundColor: "#717658",
    alignSelf: "center",
    marginTop: 20,
    marginBottom: 10,
  }
});