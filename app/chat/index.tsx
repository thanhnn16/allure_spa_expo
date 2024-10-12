import { Href, router } from 'expo-router';
import { View, Text, TouchableOpacity, Image } from 'react-native-ui-lib';
import { StyleSheet, FlatList } from 'react-native';

const chatData = [
  { id: '1', title: 'CSKH', icon: require('@/assets/icons/cskh.svg'), message: 'Bạn đã đặt hàng thành công cho đơn hàng: Làm sạch bằng lamellar..', time: '1h' },
  { id: '2', title: 'Chăm sóc AI', icon: require('@/assets/icons/ai.svg'), message: 'Bạn đã hủy lịch hẹn thành công cho dịch vụ: Kiểm tra và sửa chữa máy l..', time: '2h' },
];

const ChatCskh = () => {
  return router.push('/chat/message_screen' as Href<string>)
}

const ChatScreen = () => {
  const renderItem = ({ item }: { item: typeof chatData[0] }) => (
    <TouchableOpacity
      onPress={ChatCskh}
      style={styles.chatItem}>
      <View style={styles.iconContainer}>
        <Image source={item.icon} />
      </View>
      <View style={styles.messageContainer}>
        <Text h2_bold>{item.title}</Text>
        <Text h3>{item.message}</Text>
      </View>
      <Text h3>{item.time}</Text>
    </TouchableOpacity>
  );

  return (
    <View flex bg-$backgroundDefault padding-16>
      <Text h0_bold>Chat</Text>
      <FlatList
        data={chatData}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  chatItem: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  iconContainer: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#e0f7fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  messageContainer: {
    flex: 1,
    alignSelf: 'center',
  },
});

export default ChatScreen;