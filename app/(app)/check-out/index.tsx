import { useState, useEffect } from "react";
import { ScrollView, Modal, TouchableOpacity } from "react-native";
import {
  Button,
  Card,
  Colors,
  Text,
  Image,
  View,
  ExpandableSection,
} from "react-native-ui-lib";
import { Link, router } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "expo-router";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { clearOrder } from "@/redux/features/order/orderSlice";

const VoucherExpandable = ({
  value,
  items,
  onSelect,
}: {
  value: string;
  items: Voucher[];
  onSelect: (voucher: Voucher) => void;
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <ExpandableSection
      expanded={expanded}
      sectionHeader={
        <View row spread centerV padding-s4>
          <Text text70>{value || "Không có"}</Text>
          <Ionicons
            name={expanded ? "chevron-up" : "chevron-down"}
            size={20}
            color="#BCBABA"
          />
        </View>
      }
      onPress={() => setExpanded(!expanded)}
    >
      <View bg-white>
        {items.map((item) => (
          <TouchableOpacity
            key={item.value}
            onPress={() => {
              onSelect(item);
              setExpanded(false);
            }}
          >
            <View
              row
              spread
              centerV
              padding-s4
              bg-white
              style={{
                backgroundColor:
                  value === item.label ? Colors.grey60 : Colors.white,
              }}
            >
              <Text text70>{item.label}</Text>
              <View row centerV>
                <Text text90 primary marginR-s2>
                  Giảm {item.discountPercentage}%
                </Text>
                {value === item.label && (
                  <View
                    center
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 12,
                      borderWidth: 1,
                      borderColor: Colors.primary,
                    }}
                  >
                    <Ionicons
                      name="checkmark"
                      size={14}
                      color={Colors.primary}
                    />
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ExpandableSection>
  );
};

// Thay thế PaymentPicker bằng PaymentExpandable
const PaymentExpandable = ({
  value,
  items,
  onSelect,
}: {
  value: string;
  items: PaymentMethod[];
  onSelect: (value: string) => void;
}) => {
  const [expanded, setExpanded] = useState(false);
  const [showOnlineMethods, setShowOnlineMethods] = useState(false);

  return (
    <ExpandableSection
      expanded={expanded}
      sectionHeader={
        <View row spread centerV padding-s4>
          <Text text70>{value || "Chọn phương thức thanh toán"}</Text>
          <Ionicons
            name={expanded ? "chevron-up" : "chevron-down"}
            size={20}
            color="#BCBABA"
          />
        </View>
      }
      onPress={() => {
        setExpanded(!expanded);
        if (!expanded) {
          setShowOnlineMethods(false);
        }
      }}
    >
      <View bg-white>
        {!showOnlineMethods ? (
          items.map((method) => (
            <Card
              key={method.id}
              row
              centerV
              padding-s4
              marginB-s2
              backgroundColor={
                value === method.name ? Colors.grey60 : Colors.white
              }
              onPress={() => {
                if (method.id === 1) {
                  onSelect(method.name);
                  setExpanded(false);
                } else if (method.id === 2) {
                  setShowOnlineMethods(true);
                }
              }}
            >
              <View row centerV flex>
                <Ionicons
                  name={method.iconName as any}
                  size={24}
                  color={Colors.grey10}
                  marginR-s2
                />
                <Text grey10>{method.name}</Text>
              </View>
              {value === method.name && (
                <Ionicons
                  name="checkmark-circle"
                  size={20}
                  color={Colors.primary}
                />
              )}
            </Card>
          ))
        ) : (
          <View>
            <TouchableOpacity onPress={() => setShowOnlineMethods(false)}>
              <View row centerV padding-s4 bg-grey60>
                <Ionicons name="chevron-back" size={20} marginR-s2 />
                <Text text70>Quay lại</Text>
              </View>
            </TouchableOpacity>
            {items[1].children?.map((method) => (
              <TouchableOpacity
                key={method.id}
                onPress={() => {
                  onSelect(method.name);
                  setExpanded(false);
                  setShowOnlineMethods(false);
                }}
              >
                <View
                  row
                  spread
                  centerV
                  padding-s4
                  bg-white
                  style={{
                    backgroundColor:
                      value === method.name ? Colors.grey60 : Colors.white,
                  }}
                >
                  <View row centerV>
                    {method.icon && (
                      <Image
                        source={method.icon}
                        style={{ width: 100, height: 45, marginRight: 10 }}
                        resizeMode="contain"
                      />
                    )}
                    <Text text70>{method.name}</Text>
                  </View>
                  {value === method.name && (
                    <View
                      center
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: 12,
                        borderWidth: 1,
                        borderColor: Colors.primary,
                      }}
                    >
                      <Ionicons
                        name="checkmark"
                        size={14}
                        color={Colors.primary}
                      />
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </ExpandableSection>
  );
};

// Thêm tiện ích tính giá
const calculateDiscountedPrice = (giaGoc: number, phanTramGiamGia: number) => {
  const giamGia = giaGoc * (phanTramGiamGia / 100);
  return giaGoc - giamGia;
};

// In your Payment component
export default function Payment() {
  const { products, totalAmount } = useSelector(
    (state: RootState) => state.order
  );
  const dispatch = useDispatch();

  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(
    "Thanh toán khi nhận hàng"
  );
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState("Không có");
  const [discountAmount, setDiscountAmount] = useState(0);
  // Update vouchers state
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

  // State for total price
  const [totalPrice, setTotalPrice] = useState(calculateTotalPrice());
  const [discountedPrice, setDiscountedPrice] = useState(totalPrice);

  const handlePaymentSelect = (payment: string) => {
    setSelectedPayment(payment);
    setModalVisible(false);
  };
  // Update handleVoucherSelect
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

  const navigation = useNavigation();
  const [selectedAddress, setSelectedAddress] = useState<{
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
  } | null>(null);

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

  // Replace products state with orderSlice data
  useEffect(() => {
    if (!products.length) {
      router.back();
      return;
    }

    setTotalPrice(totalAmount);
    setDiscountedPrice(totalAmount);

    return () => {
      dispatch(clearOrder());
    };
  }, []);

  // Update the main render section
  return (
    <View flex bg-white>
      <View row centerV padding-s4>
        <Button
          iconSource={() => (
            <Ionicons name="arrow-back" size={24} color={Colors.grey10} />
          )}
          onPress={() => router.back()}
          link
        />
        <Text text60 grey10 center flex>
          Thanh toán
        </Text>
      </View>

      <ScrollView>
        <Card margin-s4>
          <Card.Section
            content={[
              { text: "Thông tin khách hàng", text70BO: true, grey10: true },
            ]}
            contentStyle={{ marginBottom: 8 }}
          />
          <Link href="/address" asChild>
            <TouchableOpacity activeOpacity={0.7}>
              <Card.Section
                backgroundColor={Colors.grey60}
                content={[
                  selectedAddress
                    ? [
                        {
                          text: selectedAddress.fullName,
                          text70: true,
                          grey10: true,
                        },
                        {
                          text: selectedAddress.phoneNumber,
                          text90: true,
                          grey20: true,
                        },
                        {
                          text: selectedAddress.fullAddress,
                          text90: true,
                          grey20: true,
                          numberOfLines: 2,
                        },
                      ]
                    : [
                        {
                          text: "Vui lòng chọn địa chỉ giao hàng",
                          text90: true,
                          grey30: true,
                        },
                      ],
                ]}
                trailingIcon={{
                  source: () => (
                    <Ionicons
                      name="chevron-forward"
                      size={24}
                      color={Colors.grey30}
                    />
                  ),
                }}
              />
            </TouchableOpacity>
          </Link>
        </Card>
        <View padding-s4>
          <Text text70BO marginB-s2>
            Voucher
          </Text>
          <Card>
            <VoucherExpandable
              value={selectedVoucher}
              items={vouchers}
              onSelect={handleVoucherSelect}
            />
          </Card>
          <View height={1} bg-grey60 marginT-s4 marginB-s2 />
        </View>

        <View padding-s4>
          <Text text70BO marginB-s2>
            Hình thức thanh toán
          </Text>
          <Card>
            <PaymentExpandable
              value={selectedPayment}
              items={paymentMethods}
              onSelect={handlePaymentSelect}
            />
          </Card>
          <View height={1} bg-grey60 marginT-s4 marginB-s2 />
        </View>

        <Modal
          visible={isModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => setModalVisible(false)}
          >
            <View style={styles.modalContent}>
              <View style={styles.modalTitleContainer}>
                <Text style={styles.modalTitle}>
                  Chọn phương thức thanh toán
                </Text>
              </View>
              <View
                style={[
                  styles.productDivider,
                  { height: 1, backgroundColor: "#E0E0E0" },
                ]}
              />
              {paymentMethods.map((method) => (
                <TouchableOpacity
                  key={method.id}
                  style={styles.paymentOption}
                  onPress={() => handlePaymentSelect(method.name)}
                >
                  <View style={styles.optionLeft}>
                    <View style={styles.paymentIconContainer}>
                      <Image source={method.icon} style={styles.paymentIcon} />
                    </View>
                  </View>
                  {selectedPayment === method.name && (
                    <View style={styles.checkIconContainer}>
                      <Ionicons
                        name="checkmark"
                        size={14}
                        style={styles.checkIcon}
                      />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
              <Button
                label="Tiếp tục"
                backgroundColor={Colors.primary}
                padding-20
                borderRadius={10}
                style={{
                  width: 338,
                  height: 47,
                  alignSelf: "center",
                  marginVertical: 10,
                }}
                onPress={() => setModalVisible(false)}
              />
            </View>
          </TouchableOpacity>
        </Modal>

        <View padding-s4>
          <Text text70BO marginB-s2>
            Sản phẩm
          </Text>
          {products.map((product) => (
            <Card key={product.id} marginV-s2 enableShadow={false}>
              <Card.Section
                imageSource={{ uri: product.image }}
                imageStyle={{ width: 96, height: 89, borderRadius: 10 }}
                content={[
                  { text: product.name, text70BO: true },
                  { text: product.price, text70: true },
                  {
                    text: `Số lượng: ${product.quantity}`,
                    text90: true,
                    grey20: true,
                  },
                ]}
                contentStyle={{
                  marginLeft: 12,
                  justifyContent: "space-between",
                }}
              />
              <View height={1} backgroundColor={Colors.grey60} marginT-s2 />
            </Card>
          ))}
        </View>

        <View margin-s4 bg-grey60 br20 padding-s4>
          <View row spread marginB-s2>
            <Text text70BO>Tạm tính</Text>
            <Text text70BO>{totalPrice.toLocaleString("vi-VN")} VNĐ</Text>
          </View>

          <View row spread marginB-s2>
            <Text text70BO>Voucher</Text>
            <Text text70>{selectedVoucher}</Text>
          </View>

          <View row spread marginT-s2>
            <Text text70BO>Tổng thanh toán</Text>
            <View right>
              {discountedPrice !== totalPrice && (
                <Text
                  text90
                  grey30
                  style={{ textDecorationLine: "line-through" }}
                >
                  {totalPrice.toLocaleString("vi-VN")} VNĐ
                </Text>
              )}
              <Text text70BO red30>
                {discountedPrice.toLocaleString("vi-VN")} VNĐ
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
