import React, { useState, useRef } from 'react';
import { SafeAreaView, StyleSheet, Image, ScrollView, Modal, View, Text, TouchableOpacity, Animated } from 'react-native';
import { Button, Card, Colors } from 'react-native-ui-lib';
import { Link, router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Picker, PickerProps } from '@react-native-picker/picker';

interface Product {
  id: number;
  name: string;
  price: string;
  quantity: number;
  image: any;
}


interface Voucher {
  label: string;
  value: string;
  discountPercentage: number;
}

const products: Product[] = [
  {
    id: 1,
    name: 'Lamellar Lipocollage',
    price: '1.170.000 VNĐ',
    quantity: 1,
    image: require('@/assets/images/sp2.png')
  },
  {
    id: 2,
    name: 'Lamellar Lipocollage',
    price: '1.170.000 VNĐ',
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
  },
  section: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    paddingHorizontal: 15,
    marginTop: -15,
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
  },
  customerInfo: {
    flex: 1,
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
  paymentOption: {
    width: '95%', // Increased from 330 to percentage
    height: 75, // Increased from 65
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20, // Increased from 16
    paddingVertical: 15, // Increased from 12
    borderRadius: 12,
    backgroundColor: '#fff',
    marginTop: 5,
    marginBottom: 12,
    alignSelf: 'center', // Center the payment option
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    borderColor: '#E0E0E0',
    borderRadius: 8,
  },
  dropDownItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    
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
  }
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
    transform: [{rotate: '0deg'}]
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
      <TouchableOpacity 
        onPress={toggleDropdown}
        style={dropdownStyles.header}
      >
        <Text style={dropdownStyles.headerText}>
          {value || 'Không có'}
        </Text>
        <Animated.View style={[
          dropdownStyles.iconContainer,
          {transform: [{rotate: rotateIcon}]}
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
                outputRange: [0, 200]
              })
            }
          ]}
        >
          {items.map((item) => (
            <TouchableOpacity
              key={item.value}
              style={[
                dropdownStyles.item,
                value === item.value && dropdownStyles.selectedItem
              ]}
              onPress={() => {
                onSelect(item);
                toggleDropdown();
              }}
            >
              <Text style={dropdownStyles.itemText}>{item.label}</Text>
              <Text style={dropdownStyles.discountText}>
                Giảm {item.discountPercentage}%
              </Text>
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
  icon: any;
}

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
      <TouchableOpacity 
        onPress={toggleDropdown}
        style={dropdownStyles.header}
      >
        <Text style={dropdownStyles.headerText}>
          {value || 'Chọn phương thức thanh toán'}
        </Text>
        <Animated.View style={[
          dropdownStyles.iconContainer,
          {transform: [{rotate: rotateIcon}]}
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
              key={item.id}
              style={[
                styles.paymentOption,
                value === item.name && styles.selectedOption
              ]}
              onPress={() => {
                onSelect(item.name);
                toggleDropdown();
              }}
            >
              <View style={styles.optionLeft}>
                <View style={styles.paymentIconContainer}>
                  <Image source={item.icon} style={styles.paymentIcon} />
                </View>
                <Text style={styles.paymentItemText}>{item.name}</Text>
              </View>
              {value === item.name && (
                <View style={styles.checkIconContainer}>
                  <Ionicons name="checkmark" size={14} style={styles.checkIcon} />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </Animated.View>
      )}
    </View>
  );
};

// Add price calculation utilities
const calculateDiscountedPrice = (originalPrice: number, discountPercentage: number) => {
  const discount = originalPrice * (discountPercentage / 100);
  return originalPrice - discount;
};

export default function Payment() {
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState('Thanh toán khi nhận hàng');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState('Không có');
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

  // Add total price state
  const [totalPrice, setTotalPrice] = useState(2385000); // Original price
  const [discountedPrice, setDiscountedPrice] = useState(totalPrice);

  const paymentMethods = [
    { id: 2, name: 'VISA / MasterCard', icon: require('@/assets/images/visa.png') },
    { id: 3, name: 'ZaloPay', icon: require('@/assets/images/zalopay.png') },
    { id: 4, name: 'Apple Pay', icon: require('@/assets/images/apple.png') }
  ];

  const handlePaymentSelect = (payment: string) => {
    setSelectedPayment(payment);
    setModalVisible(false);
  };

  // Update handleVoucherSelect
  const handleVoucherSelect = (voucher: Voucher) => {
    setSelectedVoucher(voucher.label);
    const newPrice = calculateDiscountedPrice(totalPrice, voucher.discountPercentage);
    setDiscountedPrice(newPrice);
    setDropdownOpen(false);
  };

  // Update the main render section
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Button
          iconSource={require('@/assets/images/home/arrow_ios.png')}
          onPress={() => router.back()}
          link
          iconStyle={{ tintColor: 'black' }}
        />
        <Text style={{ flex: 1, textAlign: 'center', fontSize: 18, fontWeight: 'bold' }}>
          Thanh toán
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.productListContainer, { backgroundColor: '#FFFFFF' }]}
      >
        <View style={styles.sectionNoBorder}>
          <Text style={styles.sectionTitle}>Thông tin khách hàng</Text>
          <Card>
            <TouchableOpacity
              onPress={() => console.log('Cập nhật sau')}
              style={[styles.customerInfoCard, { backgroundColor: '#f8f8f8' }]}
            >
              <View style={styles.customerInfo}>
                <Text style={{ fontSize: 14 }}>Lộc Nè Con</Text>
                <Text style={{ fontSize: 14 }}>+84 123 456 789</Text>
                <Text style={{ fontSize: 14 }}>123 acb, phường Tân Thới Hiệp, Quận 12, TP.HCM</Text>
              </View>
              <Image
                source={require('@/assets/images/home/arrow_ios.png')}
                style={styles.arrowIcon}
              />
            </TouchableOpacity>
          </Card>
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

        // Update total section display
        <View style={styles.totalSection}>
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
        <Button
          children={<Text style={{ fontFamily: 'SFProText-Bold', fontSize: 16 }}>Tiếp Tục</Text>}
          backgroundColor={Colors.primary}
          padding-20
          borderRadius={10}
          style={{ width: 338, height: 47, alignSelf: 'center', marginVertical: 10 }}
          onPress={() => router.push('/transaction')}
        />
        <Button
          children={<Text style={{ fontFamily: 'SFProText-Bold', fontSize: 16 }}>Detail Transaction</Text>}
          backgroundColor={Colors.primary}
          padding-20
          borderRadius={10}
          style={{ width: 338, height: 47, alignSelf: 'center', marginVertical: 10 }}
          onPress={() => router.push('/transaction/detail')}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
