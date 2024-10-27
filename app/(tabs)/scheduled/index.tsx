import { Text, View, ScrollView, TouchableOpacity, Image, FlatList, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';

const ScheduledPage = () => {
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const [flatListItems, setFlatListItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const items = [
    { id: 1, name: 'Tất cả' },
    { id: 2, name: 'Sắp tới' },
    { id: 3, name: 'Đã hoàn thành' },
    { id: 4, name: 'Bị hoãn' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/appointments');
        setFlatListItems(response.data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const renderItem = (item: { id: number; name: string }, index: number) => {
    const isSelected = item.id === selectedItem;
    return (
        <TouchableOpacity key={item.id} onPress={() => setSelectedItem(item.id)}>
          <View style={[ isSelected ? selectedItemStyle : unselectedItem]}>
            <Text style={[ isSelected ? selectedItemText : unselectedItemText]}>
              {item.name}
            </Text>
          </View>
        </TouchableOpacity>
    );
  };

  const renderFlatListItem = ({ item }: { item: { id: number; start_time: string; end_time: string; status: string; note: string } }) => {
    const statusStyle = item.status === 'Đã tiến hành' ? completedStatus : pendingStatus;
    return (
        <View>
          <Text style={[bannerText, blackText]}>ID: {item.id}</Text>
          <Text style={[bannerText, blackText]}>Start Time: {item.start_time}</Text>
          <Text style={[bannerText, blackText]}>End Time: {item.end_time}</Text>
          <Text style={[bannerText, blackText]}>Status: {item.status}</Text>
          <Text style={[bannerText, blackText]}>Note: {item.note}</Text>
        </View>
    );
  };

  // @ts-ignore
  return (
      <SafeAreaView style={container}>
        <View>
          <Text style={text}>Lịch đã đặt</Text>
        </View>
        <ScrollView horizontal style={scrollView} showsHorizontalScrollIndicator={false}>
          {items.map((item, index) => renderItem(item, index))}
        </ScrollView>

        <View>
          {loading ? (
              <ActivityIndicator size="large" color="#0000ff" />
          ) : (
              <FlatList
                  data={flatListItems}
                  renderItem={renderFlatListItem}
                  keyExtractor={(item) => item.id.toString()}
              />
          )}
        </View>
      </SafeAreaView>
  );
};

export default ScheduledPage;

const container = {
  flex: 1,
  padding: 20,
  backgroundColor: '#fff',
};

const text = {
  color: '#717658',
  fontSize: 24,
  fontFamily: 'Inter-Bold',
};

const bannerContainer = {
  alignItems: 'flex-start',
  marginBottom: 20,
  padding: 20,
};

const bannerText = {
  fontWeight: 'bold',
  fontSize: 16,
  color: '#717658',
  marginTop: 5,
};

const blackText = {
  color: 'black',
};

const scrollView = {
  marginTop: 10,
};

const itemContainer = {
  height: 40,
  paddingHorizontal: 15,
  paddingVertical: 5,
  borderRadius: 10,
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: 10,
  borderWidth: 1,
};

const selectedItemStyle = {
  backgroundColor: '#717658',
  borderColor: '#717658',
};

const unselectedItem = {
  backgroundColor: '#FFFFFF',
  borderColor: '#717658',
};

const itemText = {
  fontSize: 15,
  fontWeight: 'bold',
};

const selectedItemText = {
  color: '#FFFFFF',
};

const unselectedItemText = {
  color: '#717658',
};

const flatListContainer = {
  position: 'absolute',
  top: 180, // Adjust this value as needed
  left: 0,
  right: 0,
  bottom: 0,
};

const completedStatus = {
  color: '#77891F',
};

const pendingStatus = {
  color: '#6B7079',
};
