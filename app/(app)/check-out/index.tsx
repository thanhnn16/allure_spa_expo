import React, { useState, useRef, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Image, ScrollView, Modal, View, Text, TouchableOpacity, Animated, ImageSourcePropType } from 'react-native';
import { Button, Card, Colors } from 'react-native-ui-lib';
import { Link, router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { FontAwesome5 } from '@expo/vector-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faMoneyBillWave, faCreditCard } from '@fortawesome/free-solid-svg-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from 'expo-router';

// Cập nhật giao diện Product để bao gồm giá số
interface Product {
  id: number;
  name: string;
  price: string;
  priceValue: number; // Add this field
  quantity: number;
  image: any;
}
interface Voucher {
  label: string;
  value: string;
  discountPercentage: number;
}

// Update the products array with numeric price values
const products: Product[] = [
  {
    id: 1,
    name: 'Lamellar Lipocollage',
    price: '1.170.000 VNĐ',
    priceValue: 1170000,
    quantity: 1,
    image: require('@/assets/images/sp2.png')
  },
  {
    id: 2,
    name: 'Lamellar Lipocollage',
    price: '1.170.000 VNĐ',
    priceValue: 1170000,
    quantity: 1,
    image: require('@/assets/images/sp2.png')
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginRight: 30,
  },
  section: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    paddingHorizontal: 15,
    marginTop: 5,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
    alignItems: 'center',
  },
  totalSection: {
    padding: 16,
    paddingHorizontal: 20,
    backgroundColor: '#f8f8f8',
    marginHorizontal: 20,
    borderRadius: 8,
  },
  productCard: {
    marginVertical: 8,
    width: '100%',
    height: 91.03,
    paddingRight: 10,
    backgroundColor: 'transparent',
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
  },
  productImage: {
    width: 96,
    height: 89,
    borderRadius: 10,
  },
  customerInfoCard: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    justifyContent: 'space-between',
    height: 'auto', 
  },
  customerInfo: {
    flex: 1,
    marginRight: 16,
    maxWidth: '65%',
  },
  customerInfoText: {
    fontSize: 14,
    marginBottom: 2, // Reduced from 4
    fontWeight: '500',
    color: '#666666',
  },
  arrowIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 8,
  },
  arrowIcon: {
    width: 24,
    height: 24,
    transform: [{ rotate: '180deg' }],
    tintColor: 'black',
  },
  inputField: {
    width: 335,
    height: 44,
    borderWidth: 0,
    padding: 8,
    borderRadius: 8,
  },
  textFieldContainer: {
    padding: 10,
    width: '100%',
  },
  placeholderStyle: {
    color: '#000000',
    fontWeight: '500',
    fontSize: 14,
    marginLeft: 0,
  },
  productInfo: {
    marginLeft: 12,
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  productRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  categoryText: {
    color: '#B0ACAC',
  },
  productDetails: {
    marginLeft: 'auto',
  },
  quantityText: {
    marginTop: 4,
    color: '#666666',
  },
  productDivider: {
    width: '100%',
    height: 1,
    backgroundColor: 'rgba(176, 172, 172, 0.5)',
    marginVertical: 8,
  },
  paymentSelector: {
    width: '100%',
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 0,
    marginHorizontal: 0,
    borderRadius: 8,
  },
  icon: {
    fontSize: 20,
    color: 'gray',
    marginRight: 0,
  },
  modalContent: {
    width: '100%',
    height: 413,
    backgroundColor: '#fff',
    paddingTop: 20,
    paddingHorizontal: 10, // Reduced horizontal padding
    alignItems: 'center',
  },

  paymentIconContainer: {
    width: 100, // Increased from 90
    height: 45, // Increased from 38
    justifyContent: 'center',
  },
  modalTitleContainer: {
    width: '100%',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  paymentIcon: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain'
  },
  selectedOption: {
    backgroundColor: Colors.grey70,
  },
  selectedItem: {
    backgroundColor: '#f0f0f0',
  },
  checkIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white'
  },
  checkIcon: {
    color: Colors.primary,
  },
  productListContainer: {
    flexGrow: 1,
    paddingBottom: 10,
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  productCardGrid: {
    width: '48%',
    marginBottom: 15,
    height: 200,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionNoBorder: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    paddingHorizontal: 20,
  },
  sectionDarkBorder: {
    padding: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#E0E0E0',
    marginHorizontal: 20,
  },
  borderInset: {
    width: 370,
    height: 2,
    backgroundColor: '#717658',
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  dropDownPicker: {
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,


  },
  dropDownContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 8,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    zIndex: 1000,
    elevation: 5,
  },
  dropDownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownModal: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  dropdownItemText: {
    fontSize: 16,
  },
  paymentDropdown: {
    backgroundColor: '#f8f8f8',
    padding: 12,
    borderRadius: 8,
  },
  paymentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  paymentItemText: {
    marginLeft: 12,
    fontSize: 14,
    color: '#000000',
  },
  selectedPayment: {
    backgroundColor: '#f0f0f0',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
  },
  discountText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '500',
  },
  optionRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  paymentOption: {
    width: '95%',
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', 
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 12,
    backgroundColor: '#fff',
    marginTop: 5,
    marginBottom: 8,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  customerInfoSection: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 8,
  },
  customerCard: {
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  customerInfoContent: {
    flex: 1,
    marginRight: 16,
  },
  customerName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  customerPhone: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  customerAddress: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  placeholderText: {
    fontSize: 14,
    color: '#999999',
    fontStyle: 'italic',
  },
});

const dropdownStyles = StyleSheet.create({
  container: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  headerText: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '500',
  },
  iconContainer: {
    transform: [{ rotate: '0deg' }]
  },
  content: {
    maxHeight: 200,
    backgroundColor: '#ffffff',
  },
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0'
  },
  itemText: {
    fontSize: 14,
    color: '#000000'
  },
  selectedItem: {
    backgroundColor: '#f0f0f0'
  },
  discountText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '500',
  }
});

// Update VoucherDropdown component
const VoucherDropdown = ({
  value,
  items,
  onSelect
}: {
  value: string;
  items: Voucher[];
  onSelect: (voucher: Voucher) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;

  const toggleDropdown = () => {
    const toValue = isOpen ? 0 : 1;
    setIsOpen(!isOpen);

    Animated.timing(animation, {
      toValue,
      duration: 300,
      useNativeDriver: false
    }).start();
  };

  const rotateIcon = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg']
  });

  return (
    <View style={dropdownStyles.container}>
      <TouchableOpacity onPress={toggleDropdown}
        style={dropdownStyles.header}
      >
        <Text style={dropdownStyles.headerText}>
          {value || 'Không có'}
        </Text>
        <Animated.View style={[
          dropdownStyles.iconContainer,
          { transform: [{ rotate: rotateIcon }] }
        ]}>
          <Ionicons name="chevron-down" size={20} color="#BCBABA" />
        </Animated.View>
      </TouchableOpacity>

      {isOpen && (
        <Animated.View
          style={[
            dropdownStyles.content,
            {
              maxHeight: animation.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 300]
              })
            }
          ]}
        >
          {items.map((item) => (
            <TouchableOpacity
              key={item.value}
              style={[
                styles.paymentOption,
                value === item.label && styles.selectedOption
              ]}
              onPress={() => {
                onSelect(item);
                toggleDropdown();
              }}
            >
              <View style={styles.optionLeft}>
                <Text style={styles.paymentItemText}>{item.label}</Text>
              </View>
              <View style={styles.optionRight}>
                <Text style={styles.discountText}>
                  Giảm {item.discountPercentage}%
                </Text>
                {value === item.label && (
                  <View style={styles.checkIconContainer}>
                    <Ionicons name="checkmark" size={14} style={styles.checkIcon} />
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </Animated.View>
      )}
    </View>
  );
};
// Add new PaymentPicker component
interface PaymentMethod {
  id: number;
  name: string;
  icon?: ImageSourcePropType;
  faIcon?: any; // Thêm field cho Font Awesome icon
  code?: string;
  children?: PaymentMethod[];
}

// Cập nhật danh sách phương thức thanh toán với Font Awesome icons
const paymentMethods: PaymentMethod[] = [
  {
    id: 1,
    name: 'Thanh toán khi nhận hàng',
    faIcon: faMoneyBillWave, // Icon tiền mặt
    children: []
  },
  {
    id: 2, 
    name: 'Thanh toán online',
    faIcon: faCreditCard, // Icon thẻ credit
    children: [
      { id: 21, name: 'VISA / MasterCard', icon: require('@/assets/images/visa.png') },
      { id: 22, name: 'ZaloPay', icon: require('@/assets/images/zalopay.png') },
      { id: 23, name: 'Apple Pay', icon: require('@/assets/images/apple.png') }
    ]
  }
];

const PaymentPicker = ({
  value,
  items,
  onSelect
}: {
  value: string;
  items: PaymentMethod[];
  onSelect: (value: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showOnlineMethods, setShowOnlineMethods] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;

  const toggleDropdown = () => {
    const toValue = isOpen ? 0 : 1;
    setIsOpen(!isOpen);
    
    if (!isOpen) {
      setShowOnlineMethods(false);
    }

    Animated.timing(animation, {
      toValue,
      duration: 300,
      useNativeDriver: false
    }).start();
  };

  const handleSelect = (method: PaymentMethod) => {
    if (method.id === 1) {
      onSelect(method.name);
      setIsOpen(false);
      setShowOnlineMethods(false);
    } 
    else if (method.id === 2) {
      setShowOnlineMethods(true);
    }
    else {
      onSelect(method.name);
      setIsOpen(false);
      setShowOnlineMethods(false);
    }
  };

  const rotateIcon = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg']
  });

  return (
    <View style={dropdownStyles.container}>
      <TouchableOpacity onPress={toggleDropdown}
        style={dropdownStyles.header}
      >
        <Text style={dropdownStyles.headerText}>
          {value || 'Chọn phương thức thanh toán'}
        </Text>
        <Animated.View style={[
          dropdownStyles.iconContainer,
          { transform: [{ rotate: rotateIcon }] }
        ]}>
          <Ionicons name="chevron-down" size={20} color="#BCBABA" />
        </Animated.View>
      </TouchableOpacity>

      {isOpen && (
        <Animated.View
          style={[
            dropdownStyles.content,
            {
              maxHeight: animation.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 300]
              })
            }
          ]}
        >
          {!showOnlineMethods ? (
            // Hiển thị 2 phương thức thanh toán chính
            items.map((method) => (
              <TouchableOpacity
                key={method.id}
                style={[
                  styles.paymentOption,
                  value === method.name && styles.selectedOption
                ]}
                onPress={() => handleSelect(method)}
              >
                <View style={styles.optionLeft}>
                  <FontAwesomeIcon
                    icon={method.faIcon}
                    size={24}
                    color="#000000"
                    style={{marginRight: 10}}
                  />
                  <Text style={styles.paymentItemText}>{method.name}</Text>
                </View>
                {value === method.name && (
                  <View style={styles.checkIconContainer}>
                    <Ionicons name="checkmark" size={14} style={styles.checkIcon} />
                  </View>
                )}
              </TouchableOpacity>
            ))
          ) : (
            // Hiển thị các phương thức thanh toán online
            <>
              <TouchableOpacity
                style={[styles.paymentOption, { backgroundColor: '#f8f8f8' }]}
                onPress={() => setShowOnlineMethods(false)}
              >
                <View style={styles.optionLeft}>
                  <FontAwesome5 
                    name="chevron-left" 
                    size={20} 
                    color="#000000"
                    style={{ marginRight: 10 }}
                  />
                  <Text style={[styles.paymentItemText, { marginLeft: 10 }]}>
                    Quay lại
                  </Text>
                </View>
              </TouchableOpacity>
              {items[1].children?.map((method) => (
                <TouchableOpacity
                  key={method.id}
                  style={[
                    styles.paymentOption,
                    value === method.name && styles.selectedOption
                  ]}
                  onPress={() => handleSelect(method)}
                >
                  <View style={styles.optionLeft}>
                    {method.icon && (
                      <View style={styles.paymentIconContainer}>
                        <Image
                          source={method.icon}
                          style={styles.paymentIcon}
                        />
                      </View>
                    )}
                    <Text style={styles.paymentItemText}>{method.name}</Text>
                  </View>
                  {value === method.name && (
                    <View style={styles.checkIconContainer}>
                      <Ionicons name="checkmark" size={14} style={styles.checkIcon} />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </>
          )}
        </Animated.View>
      )}
    </View>
  );
};
// Thêm tiện ích tính giá
const calculateDiscountedPrice = (giaGoc: number, phanTramGiamGia: number) => {
  const giamGia = giaGoc * (phanTramGiamGia / 100);
  return giaGoc - giamGia;
};

// In your Payment component
export default function Payment() {
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState('Thanh toán khi nhận hàng');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState('Không có');
  const [discountAmount, setDiscountAmount] = useState(0);
  // Update vouchers state
  const [vouchers] = useState<Voucher[]>([
    {
      label: 'Giảm 10%',
      value: 'voucher1',
      discountPercentage: 10
    },
    {
      label: 'Giảm 20%',
      value: 'voucher2',
      discountPercentage: 20
    },
    {
      label: 'Giảm 30%',
      value: 'voucher3',
      discountPercentage: 30
    }
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
    const newPrice = calculateDiscountedPrice(totalPrice, voucher.discountPercentage);
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
    const unsubscribe = navigation.addListener('focus', () => {
      loadSelectedAddress();
    });

    return unsubscribe;
  }, [navigation]);

  const loadSelectedAddress = async () => {
    try {
      const savedAddress = await AsyncStorage.getItem('selectedAddress');
      if (savedAddress) {
        setSelectedAddress(JSON.parse(savedAddress));
      }
    } catch (error) {
      console.error('Lỗi khi lấy địa chỉ:', error);
    }
  };

  // Update the main render section
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Button
          iconSource={require('@/assets/images/home/arrow_ios.png')}
          onPress={() => router.back()}
          iconStyle={{ tintColor: 'black' , backgroundColor: 'white'}}
        />
        <Text style={{ flex: 1, textAlign: 'center', fontSize: 18, fontWeight: 'bold' }}>
          Thanh toán
        </Text>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.productListContainer, { backgroundColor: '#FFFFFF' }]}
      >
        <View style={styles.customerInfoSection}>
          <Text style={styles.sectionTitle}>Thông tin khách hàng</Text>
          <Link href="/address" asChild>
            <TouchableOpacity activeOpacity={0.7}>
              <View style={styles.customerCard}>
                <View style={styles.customerInfoContent}>
                  {selectedAddress ? (
                    <>
                      <Text style={styles.customerName}>
                        {selectedAddress.fullName}
                      </Text>
                      <Text style={styles.customerPhone}>
                        {selectedAddress.phoneNumber}
                      </Text>
                      <Text style={styles.customerAddress} numberOfLines={2}>
                        {selectedAddress.fullAddress}
                      </Text>
                    </>
                  ) : (
                    <View style={{padding: 8}}>
                      <Text style={styles.placeholderText}>
                        Vui lòng chọn địa chỉ giao hàng
                      </Text>
                    </View>
                  )}
                </View>
                
                <Ionicons 
                  name="chevron-forward" 
                  size={24} 
                  color="#666666"
                  style={{marginRight: 8}}
                />
              </View>
            </TouchableOpacity>
          </Link>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Voucher</Text>
          <Card>
            <VoucherDropdown
              value={selectedVoucher}
              items={vouchers}
              onSelect={handleVoucherSelect}
            />
          </Card>
          <View style={styles.borderInset} />
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hình thức thanh toán</Text>
          <Card>
            <PaymentPicker
              value={selectedPayment}
              items={paymentMethods}
              onSelect={handlePaymentSelect}
            />
          </Card>
          <View style={styles.borderInset} />
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
                <Text style={styles.modalTitle}>Chọn phương thức thanh toán</Text>
              </View>
              <View
                style={[styles.productDivider, { height: 1, backgroundColor: '#E0E0E0' }]}
              />
              {paymentMethods.map((method) => (
                <TouchableOpacity
                  key={method.id}
                  style={styles.paymentOption}
                  onPress={() => handlePaymentSelect(method.name)}
                >
                  <View style={styles.optionLeft}>
                    <View style={styles.paymentIconContainer}>
                      <Image
                        source={method.icon}
                        style={styles.paymentIcon}
                      />
                    </View>
                  </View>
                  {selectedPayment === method.name && (
                    <View style={styles.checkIconContainer}>
                      <Ionicons name="checkmark" size={14} style={styles.checkIcon} />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
              <Button
                label="Tiếp tục"
                backgroundColor={Colors.primary}
                padding-20
                borderRadius={10}
                style={{ width: 338, height: 47, alignSelf: 'center', marginVertical: 10 }}
                onPress={() => setModalVisible(false)}
              />
            </View>
          </TouchableOpacity>
        </Modal>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sản phẩm</Text>
          {products.map((product: Product) => (
            <Card
              key={product.id}
              style={styles.productCard}
              enableShadow={false}
              backgroundColor="transparent"
            >
              <View style={styles.cardRow}>
                <Card.Image
                  source={product.image}
                  style={styles.productImage}
                />
                <View style={styles.productInfo}>
                  <View style={{ marginBottom: 8 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 15 }}>{product.name}</Text>
                  </View>
                  <View style={{ marginBottom: 8 }}>
                    <Text style={{ fontSize: 16 }}>{product.price}</Text>
                  </View>
                  <View style={styles.productRow}>
                    <Text style={{ fontSize: 12 }}>Số lượng: {product.quantity}</Text>
                    <Text style={[styles.categoryText, { fontSize: 12 }]}>Dưỡng ẩm</Text>
                  </View>
                </View>
              </View>
              <View style={styles.productDivider} />
            </Card>
          ))}
        </View>
        <View style={styles.totalSection}>
          <View style={styles.row}>
            <Text style={{ fontWeight: 'bold' }}>Tạm tính</Text>
            <Text style={{ fontWeight: 'bold' }}>
              {totalPrice.toLocaleString('vi-VN')} VNĐ
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={{ fontWeight: 'bold' }}>Voucher</Text>
            <Text>{selectedVoucher}</Text>
          </View>
          <View style={[styles.row, { marginTop: 8 }]}>
            <Text style={{ fontWeight: 'bold' }}>Tổng thanh toán</Text>
            <View>
              {discountedPrice !== totalPrice && (
                <Text style={{
                  textDecorationLine: 'line-through',
                  color: Colors.grey30,
                  fontSize: 12
                }}>
                  {totalPrice.toLocaleString('vi-VN')} VNĐ
                </Text>
              )}
              <Text style={{ fontWeight: 'bold', color: Colors.red30 }}>
                {discountedPrice.toLocaleString('vi-VN')} VNĐ
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
