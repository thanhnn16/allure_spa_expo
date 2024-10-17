import { SafeAreaView, StyleSheet, FlatList, Image, ScrollView } from 'react-native'
import React, { useState, useEffect } from 'react'
import Animated from 'react-native-reanimated'
import { View, Text, TouchableOpacity } from 'react-native-ui-lib';
import { Href, router } from "expo-router";

import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import AppSearch from '@/components/inputs/AppSearch' // Import AppSearch component
import { AppStyles } from '@/constants/AppStyles';

const items = [
  { id: 1, name: 'Tất cả' },
  { id: 2, name: 'Sữa rửa mặt' },
  { id: 3, name: 'Tẩy trang' },
  { id: 4, name: 'Làm trắng da' },
];

const allProducts = [
  { id: 1, name: 'Bản sao làm sạch Lipocollage Lamellar', price: '1.560.000đ', image: require('@/assets/images/home/product1.png'), category: 1 },
  { id: 2, name: 'Bản sao làm sạch Lipocollage Lamellar', price: '1.560.000đ', image: require('@/assets/images/sp2.png'), category: 2 },
  { id: 3, name: 'Bản sao làm sạch Lipocollage Lamellar', price: '1.560.000đ', image: require('@/assets/images/sp3.png'), category: 3 },
  { id: 4, name: 'Bản sao làm sạch Lipocollage Lamellar', price: '1.560.000đ', image: require('@/assets/images/sp4.png'), category: 4 },
  { id: 5, name: 'Bản sao làm sạch Lipocollage Lamellar', price: '1.560.000đ', image: require('@/assets/images/sp5.png'), category: 1 },
  { id: 6, name: 'Bản sao làm sạch Lipocollage Lamellar', price: '1.560.000đ', image: require('@/assets/images/sp6.png'), category: 2 },
  { id: 7, name: 'Bản sao làm sạch Lipocollage Lamellar', price: '1.560.000đ', image: require('@/assets/images/sp2.png'), category: 3 },
  { id: 8, name: 'Bản sao làm sạch Lipocollage Lamellar', price: '1.560.000đ', image: require('@/assets/images/sp6.png'), category: 4 },
];

const StorePage = () => {
  const [selectedItem, setSelectedItem] = useState<number>(1);
  const [products, setProducts] = useState(allProducts);

  useEffect(() => {
    if (selectedItem === 1) {
      setProducts(allProducts);
    } else {
      setProducts(allProducts.filter(product => product.category === selectedItem));
    }
  }, [selectedItem]);

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

  const renderProductItem = ({ item }: { item: { id: number; name: string; price: string; image: any } }) => {
    return (
      <TouchableOpacity onPress={() => {
        router.push('product/detail', { id: item.id })
      }} style={[styles.itemWrapper, AppStyles.shadowItem]}>
        <Image source={item.image} style={styles.productImage} />
        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={2} ellipsizeMode="tail">{item.name}</Text>
          <View style={styles.productRating}>
            <Image source={require('@/assets/images/home/icons/yellowStar.png')} style={styles.starIcon} />
            <Text style={styles.ratingText}>5.0</Text>
            <Text style={styles.soldText}> | 475 Đã bán</Text>
          </View>
          <Text style={styles.productPrice}>{item.price + ' VNĐ'}</Text>
        </View>
      </TouchableOpacity>
    )
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headers}>
        <Animated.View>
          <Text text50BO color='#717658' style={styles.title}>Cửa hàng</Text>
          <AppSearch />
        </Animated.View>
      </View>
      <View style={styles.headers}>
        <ScrollView horizontal style={styles.scrollView} showsHorizontalScrollIndicator={false}>
          {items && items.length > 0 ? items.map((item, index) => renderItem(item, index)) : null}
        </ScrollView>
      </View>
      <FlatList
        data={products}
        renderItem={renderProductItem}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.list}
        style={styles.flatList} // Added style for FlatList
      />
    </SafeAreaView>
  )
}
export default StorePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headers: {
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
  },
  scrollView: {
    marginTop: -30,
  },
  list: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  flatList: {
    marginTop: -10, // Move items up
  },
  itemWrapper: {
    width: 148,
    height: 284,
    backgroundColor: '#FFC0CB', 
    margin: 15, // Adjusted margin for better spacing
    borderRadius: 8,
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
  },
  itemText: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  selectedItem: {
    backgroundColor: '#717658',
    borderColor: '#717658',
  },
  selectedItemText: {
    color: '#FFFFFF',
  },
  unselectedItem: {
    backgroundColor: '#FFFFFF',
    borderColor: '#717658',
  },
  unselectedItemText: {
    color: '#717658',
  },
  productImage: {
    width: '100%', // Full width
    height: 180,
  },
  productInfo: {
    paddingHorizontal: 2,
    marginTop: 5,
  },
  productName: {
    fontSize: 13,
    fontWeight: 'bold',
    paddingHorizontal: 5, // Add horizontal padding
    paddingBottom: 5, // Add bottom padding
  },
  productRating: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5, // Add horizontal padding
    paddingBottom: 5, // Add bottom padding
  },
  starIcon: {
    width: 15,
    height: 15,
  },
  ratingText: {
    color: '#8C8585',
    fontSize: 10, // Set font size to 10
  },
  soldText: {
    color: '#8C8585',
    fontSize: 10, // Set font size to 10
  },
  productPrice: {
    marginTop: 10,
    color: '#A85A29',
    fontSize: 13,
    fontWeight: 'bold',
    paddingHorizontal: 5, 
    paddingBottom: 5, 
  },
})