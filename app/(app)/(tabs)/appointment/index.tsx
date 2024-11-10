import { StyleSheet, ScrollView, TouchableOpacity, Image, FlatList } from 'react-native'
import { Text, View, } from 'react-native-ui-lib'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const ScheduledPage = () => {
  const [selectedItem, setSelectedItem] = useState<number | null>(null);

  const items = [
    { id: 1, name: 'Tất cả' },
    { id: 2, name: 'Sắp tới' },
    { id: 3, name: 'Đã hoàn thành' },
    { id: 4, name: 'Bị hoãn' },
  ];

  const flatListItems = [
    { id: 6, isBanner: true, name: 'Chăm sóc da mặt dành cho nam và nữ', price: '325,000VNĐ', times: 'Số lần: 2/5', time: '15:00, hôm nay', status: 'Chưa tiến hành' },
    { id: 7, isBanner: true, name: 'Chăm sóc da mặt dành cho nam và nữ', price: '325,000VNĐ', times: 'Số lần: 1/5', time: '15:00, ngày mai', status: 'Đã tiến hành' },
    { id: 9, isBanner: true, name: 'Chăm sóc da mặt dành cho nam và nữ', price: '325,000VNĐ', times: 'Số lần: 2/5', time: '15:00, hôm nay', status: 'Chưa tiến hành' },
    { id: 8, isBanner: true, name: 'Chăm sóc da mặt dành cho nam và nữ', price: '325,000VNĐ', times: 'Số lần: 1/5', time: '15:00, ngày mai', status: 'Đã tiến hành' },
  ];

  const renderItem = (item: { id: number; name: string }, index: number) => {
    const isSelected = item.id === selectedItem;
    return (
      <TouchableOpacity key={item.id} onPress={() => setSelectedItem(item.id)}>
        <View style={[styles.itemContainer, isSelected ? styles.selectedItem : styles.unselectedItem]}>
          <Text style={[styles.itemText, isSelected ? styles.selectedItemText : styles.unselectedItemText]}>
            {item.name}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderFlatListItem = ({ item }: { item: { id: number; isBanner?: boolean; name?: string; price?: string; times?: string; time?: string; status?: string } }) => {
    const statusStyle = item.status === 'Đã tiến hành' ? styles.completedStatus : styles.pendingStatus;
    return (
      <View style={styles.bannerContainer}>
        <Image source={require('@/assets/images/banner.png')} style={styles.banner} />
        <View marginT-10>
          <Text h2_bold>{item.name}</Text>
        </View>
        <View centerV style={styles.infoContainer}>
          <Image source={require('@/assets/images/home/icons/ticket.png')} style={styles.icon} />
          <View centerV style={styles.priceSpace}>
            <Text h3_semibold secondary>{item.price}</Text>
            <Text h3 gray>{item.status}</Text>
          </View>
        </View>
        <View centerV style={styles.infoContainer}>
          <Image source={require('@/assets/images/home/icons/note.png')} style={styles.icon} />
          <Text h3_semibold>{item.times}</Text>
        </View>
        <View centerV style={styles.infoContainer}>
          <Image source={require('@/assets/images/home/icons/clock.png')} style={styles.icon} />
          <View style={styles.priceSpace}>
            <Text h3_semibold>{item.time}</Text>
            <View centerV style={styles.infoContainer}>
              <Text h3_bold primary>Nhấn xem chi tiết</Text>
              <View style={styles.circleIcon}>
                <Text style={styles.circleIconText}>!</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View>
        <Text h1_bold primary>Lịch đã đặt</Text>
      </View>
      <ScrollView horizontal style={styles.scrollView} showsHorizontalScrollIndicator={false}>
        {items.map((item, index) => renderItem(item, index))}
      </ScrollView>
      <FlatList
        data={flatListItems}
        renderItem={renderFlatListItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  )
}

export default ScheduledPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  text: {
    color: '#717658',
    fontSize: 24,
    fontFamily: 'Inter-Bold'
  },
  bannerContainer: {
    alignItems: 'flex-start',
    marginBottom: 20,
    padding: 20,
  },
  banner: {
    width: 350,
    height: 159,
    borderRadius: 18,
    alignSelf: 'center',
  },
  bannerText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#717658',
    marginTop: 5,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  priceSpace: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  infoText: {
    fontSize: 14,
    color: '#717658',
    fontWeight: 'bold',
  },
  priceText: {
    color: 'red',
  },
  blackText: {
    color: 'black',
  },
  underlineText: {
    textDecorationLine: 'underline',
  },
  circleIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
  },
  circleIconText: {
    color: '#fff',
    fontSize: 12,
  },
  scrollView: {
    marginTop: 10,
    marginBottom: 5,
  },
  itemContainer: {
    height: 40,
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 1,
    marginBottom: 7
  },
  selectedItem: {
    backgroundColor: '#717658',
    borderColor: '#717658',
  },
  unselectedItem: {
    backgroundColor: '#FFFFFF',
    borderColor: '#717658',
  },
  itemText: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  selectedItemText: {
    color: '#FFFFFF',
  },
  unselectedItemText: {
    color: '#717658',
  },

  flatListItem: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  flatListItemText: {
    fontSize: 18,
  },
  completedStatus: {
    color: '#77891F',
  },
  pendingStatus: {
    color: '#6B7079',
  },
})