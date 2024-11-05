import React, { useState, useRef, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Image, ScrollView, Modal, View, Text, TouchableOpacity, Animated, Pressable } from 'react-native';
import { Button, Card, Colors } from 'react-native-ui-lib';
import { Link, router, useLocalSearchParams } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Picker, PickerProps } from '@react-native-picker/picker';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { CartItem } from '@/redux/features/cart/cartSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CartEmptyIcon from "@/assets/icons/cart_empty.svg";

// Update the Product interface to include numeric price and image
interface Product extends CartItem {
  priceValue: number;
  image: string;
  imgUrl?: string;
}

// FormattedProduct interface with same structure as Product
interface FormattedProduct extends Product {
  priceValue: number;
  image: string;
}

interface Voucher {
  label: string;
  value: string;
  discountPercentage: number;
}

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
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    height: 'auto', // Reduced height
    // flexDirection: 'row',
    // alignItems: 'center',
    // justifyContent: 'space-between',
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
    width: 20, // Slightly smaller
    height: 20, // Slightly smaller
    transform: [{ rotate: '180deg' }],
    tintColor: '#000000',
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

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setIsOpen(!isOpen)}>
        <View style={styles.dropdownHeader}>
          <Text style={styles.placeholderStyle}>
            {value || 'Không có'}
          </Text>
          <Ionicons name="chevron-down" size={20} color="#BCBABA" />
        </View>
      </TouchableOpacity>

      {isOpen && (
        <View style={styles.dropDownContainer}>
          {items.map((item) => (
            <TouchableOpacity
              key={item.value}
              style={[
                styles.dropdownItem,
                value === item.value && styles.selectedItem
              ]}
              onPress={() => {
                onSelect(item);
                setIsOpen(false);
              }}
            >
              <Text style={styles.dropdownItemText}>{item.label}</Text>
              <Text style={styles.discountText}>
                Giảm {item.discountPercentage}%
              </Text>
            </TouchableOpacity>
          ))}
        </View>
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

// Add EmptyCart component
const EmptyCart = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Pressable
        onPress={() => router.back()}
        style={{ alignItems: 'center' }}
      >
        <CartEmptyIcon
          width={200}
          height={200}
        />
        <Text style={{ fontSize: 20, fontWeight: 'bold', marginTop: 20 }}>
          Giỏ hàng trống
        </Text>
        <View style={{ marginTop: 10 }}>
          <Text style={{ fontSize: 16 }}>Khám phá sản phẩm khác nhé</Text>
        </View>
      </Pressable>
    </View>
  );
};

// Add ProductList component
const ProductList = ({ products }: { products: Product[] }) => {
  return (
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
            <Image 
              source={
                typeof product.image === 'string' 
                  ? { uri: product.image }
                  : product.image
              }
              style={styles.productImage}
              resizeMode="cover"            />
            <View style={styles.productInfo}>
              <View style={{ marginBottom: 8 }}>
                <Text style={{ fontWeight: 'bold', fontSize: 15 }}>{product.name}</Text>
              </View>

              <View style={{ marginBottom: 8 }}>
                <Text style={{ fontSize: 16 }}>
                  {new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND'
                  }).format(parseFloat(product.price))}
                </Text>
              </View>

              <View style={styles.productRow}>
                <Text style={{ fontSize: 12 }}>Số lượng: {product.quantity}</Text>
                <Text style={[styles.categoryText, { fontSize: 12 }]}>
                  {String(product.category) || 'Dưỡng ẩm'}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.productDivider} />
        </Card>
      ))}
    </View>
  );
};

// In your Payment component
export default function Payment() {
  const params = useLocalSearchParams();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const [products, setProducts] = useState<Product[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [discountedPrice, setDiscountedPrice] = useState(0);
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

  // Initialize products and prices from cart data with proper image handling
  useEffect(() => {
    try {
      // Try to parse cart items from params first
      const paramsItems = params.cartItems ? JSON.parse(params.cartItems as string) : cartItems;
      
      const formattedProducts: Product[] = paramsItems.map((item: CartItem) => ({
        ...item,
        priceValue: parseFloat(item.price),
        // Ensure we get the image URL from either imgUrl or image property
        image: item.imgUrl || item.image || '',
      }));
      
      console.log('Formatted products:', formattedProducts); // Debug log
      setProducts(formattedProducts);
      
      const total = formattedProducts.reduce((sum, item) => 
        sum + (parseFloat(item.price) * item.quantity), 0
      );
      setTotalPrice(total);
      setDiscountedPrice(total);
    } catch (error) {
      console.error('Error processing cart items:', error);
      // Fallback to cart items from redux if params parsing fails
      const formattedProducts = cartItems.map((item: CartItem) => ({
        ...item,
        priceValue: parseFloat(item.price),
        image: item.imgUrl || item.image || '',
      }));
      setProducts(formattedProducts);
    }
  }, [params.cartItems, cartItems]);

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
            <Link href="/profile/address" asChild>
              <TouchableOpacity
                style={[
                  styles.customerInfoCard
                ]}
              >
                <View style={{
                  maxWidth: '65%',
                  padding: 12,
                  top: '10%',
                }}>
                  <Text style={{
                    fontSize: 14,
                    fontWeight: '500'
                  }}>Lộc Nè Con</Text>
                  <Text style={{
                    fontSize: 14,
                    marginBottom: 2, // Reduced from 4
                    color: '#666666'
                  }}>+84 123 456 789</Text>
                  <Text
                    style={{
                      fontSize: 14,
                      flexWrap: 'wrap',
                      color: '#666666',
                      lineHeight: 18 // Added for better text flow
                    }}
                    numberOfLines={2}
                  >
                    123 acb, phường Tân Thới Hiệp, Quận 12, TP.HCM
                  </Text>
                </View>

                {/* Right side - Arrow Icon */}
                <View style={{
                  justifyContent: 'center',
                  alignItems: 'flex-end',
                  top: 'auto',
                  bottom: '40%',
                }}>
                  <Image
                    source={require('@/assets/images/home/arrow_ios.png')}
                    style={{
                      width: 20, // Slightly smaller
                      height: 20, // Slightly smaller
                      transform: [{ rotate: '180deg' }],
                      tintColor: '#000000'
                    }}
                  />
                </View>
              </TouchableOpacity>
            </Link>

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
        
        {products.length === 0 ? <EmptyCart /> : <ProductList products={products} />}

        {/* Total section display */}
        <View style={styles.totalSection}>
          <View style={styles.row}>
            <Text style={{ fontWeight: 'bold' }}>Tạm tính</Text>
            <Text style={{ fontWeight: 'bold' }}>
              {new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND'
              }).format(totalPrice)}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={{ fontWeight: 'bold' }}>Voucher</Text>
            <Text>{selectedVoucher}</Text>
          </View>
          <View style={[styles.row, { marginTop: 8 }]}>
            <Text style={{ fontWeight: 'bold', marginTop: 10 }}>Tổng thanh toán</Text>
            <View>
              {discountedPrice !== totalPrice && (
                <Text style={{
                  textDecorationLine: 'line-through',
                  color: Colors.grey30,
                  fontSize: 12
                }}>
                </Text>
              )}
              <Text style={{ fontWeight: 'bold', color: Colors.red30 }}>
                {discountedPrice.toLocaleString('vi-VN')} VNĐ
              </Text>
            </View>
          </View>
        </View>

        <Button
          label="Tiếp Tục"
          labelStyle={{ fontFamily: 'SFProText-Bold', fontSize: 16 }}
          backgroundColor={Colors.primary}
          padding-20
          borderRadius={10}
          style={{ width: 338, height: 47, alignSelf: 'center', marginVertical: 10 }}
          onPress={() => router.push('/transaction')}
        />
        {/* <Button
          label="Detail Transaction"
          backgroundColor={Colors.primary}
          padding-20
          borderRadius={10}
          style={{ width: 338, height: 47, alignSelf: 'center', marginVertical: 10 }}
          onPress={() => router.push('/transaction/detail')}
        /> */}
      </ScrollView>
    </SafeAreaView>
  );
}

// Update calculateDiscountedPrice function to handle numbers
const calculateDiscountedPrice = (originalPrice: number, discountPercentage: number) => {
  const discount = originalPrice * (discountPercentage / 100);
  return originalPrice - discount;
};
