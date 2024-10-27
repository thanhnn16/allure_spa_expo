import React, { useState } from 'react';
import { StyleSheet, SafeAreaView, ViewStyle, ScrollView, FlatList } from 'react-native';
import { Button ,View, Text, TouchableOpacity, Image, Card, Colors, Modal} from 'react-native-ui-lib'
import { Link, router } from 'expo-router';
import Icon from 'react-native-vector-icons/FontAwesome';

interface Product {
    id: number;
    name: string;
    price: string;
    quantity: number;
    image: any;
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
    // Container styles
    containerMain: {
      position: 'relative',
      backgroundColor: '#F5F5F5',
      borderRadius: 10,
      paddingTop: 10,
      paddingBottom: 10,
      paddingLeft: 15,
      paddingRight: 5,
      margin: 10,
      marginTop: 20, // Thêm khoảng cách 20 từ header
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 5,
      width: 380,
      height: 140,
      alignSelf: 'center',
    },
    containerContent: {
      flex: 1,
    },
    containerText: {
      flex: 1,
    },
  
    // Header styles
    headerWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      marginBottom: 20, // Thêm khoảng cách 20 cho header
    },
    headerBackButton: {
      marginRight: 16,
    },
    headerBackIcon: {
      width: 24,
      height: 24,
    },
    headerTitle: {
      flex: 1,
      fontSize: 20,
      fontWeight: 'bold',
      marginLeft: 65,
    },
  
    // Text styles
    textTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#000',
    },
    textSubtitle: {
      fontSize: 10,
      color: '#666',
      marginTop: 5,
    },
  
    // Button styles
    btnRate: {
      backgroundColor: '#7A7D65',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 20,
      alignSelf: 'flex-end',
      marginTop: 10,
      zIndex: 1,
    },
    btnRateText: {
      color: '#fff',
      fontSize: 16,
    },
  
    // Image styles
    imgCoin: {
      width: 173,
      height: 88,
      position: 'absolute',
      bottom: 0,
      left: 10,
      resizeMode: 'contain',
    },
  
    // Thêm style mới cho phần thông tin khách hàng
    section: {
        backgroundColor: '#FFFFFF',
        padding: 10,
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 16,
        marginBottom: 10,
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
        borderRadius: 12, 
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
        paddingHorizontal: 12,
        borderRadius: 12,
    },
    icon: {
        fontSize: 20,
        color: 'gray',
        marginRight: 10,
    },
    modalContent: {
        width: '100%',
        height: 413,
        backgroundColor: '#FFFFFF',
        paddingTop: 20,
        paddingHorizontal: 20,
        alignItems: 'center',
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
    paymentIconContainer: {
        width: 90,
        height: 38,
        justifyContent: 'center',
    },
    paymentIcon: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain'
    },
    paymentOption: {
        width: 330,
        height: 65,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
        backgroundColor: '#fff',
        marginTop: 5,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    optionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
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
});
const modalOverlay: ViewStyle = {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
};

const updatedStyles = StyleSheet.create({
    ...styles,
    modalOverlay,
});

Object.assign(styles, updatedStyles);

const modalDivider: ViewStyle = {
    width: '100%',
    height: 1,
    backgroundColor: '#E0E0E0',
    marginBottom: 25,
};

const updatedStylesWithDivider = StyleSheet.create({
    ...updatedStyles,
    modalDivider,
});

Object.assign(styles, updatedStylesWithDivider);

enum OrderStatus {
    DELIVERED = 'Đã nhận hàng',
    DELIVERING = 'Đang giao',
    DELAYED = 'Khách hẹn giao lại sau'
}

export default function Success() {
    const [isModalVisible, setModalVisible] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState('Thanh toán khi nhận hàng');
    // Thêm state cho trạng thái đơn hàng
    const [orderStatus, setOrderStatus] = useState<OrderStatus>(OrderStatus.DELIVERING);
    const [isStatusModalVisible, setStatusModalVisible] = useState(false);

    const paymentMethods = [
        { id: 2, name: 'VISA / MasterCard', icon: require('@/assets/images/visa.png') },
        { id: 3, name: 'ZaloPay', icon: require('@/assets/images/zalopay.png') },
        { id: 4, name: 'Apple Pay', icon: require('@/assets/images/apple.png') }
    ];

    const handlePaymentSelect = (payment: string) => {
        setSelectedPayment(payment);
        setModalVisible(false);
    };

    const handleStatusSelect = (status: OrderStatus) => {
        setOrderStatus(status);
        setStatusModalVisible(false);
    };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <View style={styles.headerWrapper}>
        <Button
          iconSource={require('@/assets/images/home/arrow_ios.png')}
          onPress={() => router.back()}
          link
          style={styles.headerBackButton}
          iconStyle={{ tintColor: 'black' }}
        />
        <Text style={styles.headerTitle}>Chi tiết giao dịch</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Container chính */}
        <View style={styles.containerMain}>
          <View style={styles.containerContent}>
            <View style={styles.containerText}>
              <Text style={styles.textTitle}>Đánh giá sản phẩm</Text>
              <Text style={styles.textSubtitle}>Đánh giá sản phẩm này để nhận thêm coin</Text>
            </View>
            <TouchableOpacity style={styles.btnRate}>
              <Text style={styles.btnRateText}>Đánh giá ngay</Text>
            </TouchableOpacity>
          </View>
          <Image
            source={require('@/assets/images/coin.png')}
            style={styles.imgCoin}
          />
        </View>

        <View style={styles.sectionNoBorder}>
          <Text style={styles.sectionTitle}>Thông tin khách hàng</Text>
          <Card containerStyle={{ backgroundColor: '#f8f8f8', borderRadius: 8 }}>
            <TouchableOpacity
              onPress={() => console.log('Cập nhật sau')}
              style={styles.customerInfoCard}
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
          <Text style={styles.sectionTitle}>Trạng thái</Text>
          <Card borderRadius={8}>
            <TouchableOpacity 
              style={[styles.textFieldContainer, { backgroundColor: '#f8f8f8' }]}
              onPress={() => setStatusModalVisible(true)}
            >
              <View style={styles.paymentSelector}>
                <Text style={styles.placeholderStyle}>{orderStatus}</Text>
                <Icon name="angle-down" size={20} color="#BCBABA" style={styles.icon} />
              </View>
            </TouchableOpacity>
          </Card>
          <View style={styles.borderInset} />
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hình thức thanh toán</Text>
          <Card borderRadius={8}>
            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              style={[styles.textFieldContainer, { backgroundColor: '#f8f8f8' }]}
            >
              <View style={styles.paymentSelector}>
                <Text style={styles.placeholderStyle}>{selectedPayment}</Text>
                <Icon name="angle-down" size={20} color="#BCBABA" style={styles.icon} />
              </View>
            </TouchableOpacity>
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
            style={styles.modalOverlay}
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
                      <Icon name="check" size={14} style={styles.checkIcon} />
                    </View>
                  )}
                </TouchableOpacity>
              ))}

              <Button
                label="Tiếp tục"
                labelStyle={{ fontFamily: 'SFProText-Bold', fontSize: 16 }}
                backgroundColor={Colors.primary}
                padding-20
                borderRadius={10}
                style={{ width: 338, height: 47, alignSelf: 'center', marginVertical: 10 }}
                onPress={() => setModalVisible(false)}
              />
            </View>
          </TouchableOpacity>
        </Modal>

        <Modal
          visible={isStatusModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setStatusModalVisible(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setStatusModalVisible(false)}
          >
            <View style={styles.modalContent}>
              <View style={styles.modalTitleContainer}>
                <Text style={styles.modalTitle}>Chọn trạng thái đơn hàng</Text>
              </View>
              <View style={styles.productDivider} />
              {Object.values(OrderStatus).map((status) => (
                <TouchableOpacity
                  key={status}
                  style={styles.paymentOption}
                  onPress={() => handleStatusSelect(status)}
                >
                  <Text style={styles.placeholderStyle}>{status}</Text>
                  {orderStatus === status && (
                    <View style={styles.checkIconContainer}>
                      <Icon name="check" size={14} style={styles.checkIcon} />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        </Modal>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sản phẩm</Text>
          <FlatList
            data={products}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <Card
                style={[styles.productCard, { backgroundColor: '#FFFFFF' }]}
                enableShadow={false}
              >
                <View style={styles.cardRow}>
                  <Card.Image
                    source={item.image}
                    style={styles.productImage}
                  />
                  <View style={styles.productInfo}>
                    <View style={{ marginBottom: 8 }}>
                      <Text style={{ fontWeight: 'bold', fontSize: 15 }}>{item.name}</Text>
                    </View>

                    <View style={{ marginBottom: 8 }}>
                      <Text style={{ fontSize: 16 }}>{item.price}</Text>
                    </View>

                    <View style={styles.productRow}>
                      <Text style={{ fontSize: 12 }}>Số lượng: {item.quantity}</Text>
                      <Text style={[styles.categoryText, { fontSize: 12 }]}>Dưỡng ẩm</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.productDivider} />
              </Card>
            )}
          />
        </View>
        <View style={styles.totalSection}>
          <View style={styles.row}>
            <Text style={{ fontWeight: 'bold' }}>Voucher</Text>
            <Text>Không có</Text>
          </View>
          <View style={[styles.row, { marginTop: 8 }]}>
            <Text style={{ fontWeight: 'bold' }}>Tổng cộng</Text>
            <Text style={{ fontWeight: 'bold', color: Colors.red30 }}>2.385.000 VNĐ</Text>
          </View>
          <View style={[styles.row, { marginTop: 8 }]}>
            <Text style={{ fontWeight: 'bold' }}>Ngày thanh toán</Text>
            <Text>15/03/2024</Text>
          </View>
          <View style={[styles.row, { marginTop: 8 }]}>
            <Text style={{ fontWeight: 'bold' }}>Ngày nhận hàng</Text>
            <Text>20/03/2024</Text>
          </View>
          <View style={[styles.row, { marginTop: 8 }]}>
            <Text style={{ fontWeight: 'bold' }}>Trạng thái</Text>
            <Text style={{ color: Colors.green30 }}>Giao hàng thành công</Text>
          </View>

        </View>
      
      <Link href="/Transaction" asChild>
        <Button
          label='Mua lại'
          labelStyle={{ fontFamily: 'SFProText-Bold', fontSize: 16 }}
          backgroundColor={Colors.primary}
          padding-20
          borderRadius={10}
          style={{ width: 338, height: 47, alignSelf: 'center', marginVertical: 10 }}
        />
      </Link>
      </ScrollView>
    </SafeAreaView>
  );
};
