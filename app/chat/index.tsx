import { Href, router } from 'expo-router';
import { View, Text, TouchableOpacity, Image } from 'react-native-ui-lib';
import { StyleSheet, FlatList, SafeAreaView } from 'react-native';

import IconCskh from '@/assets/icons/cskh.svg'
import IconAi from '@/assets/icons/ai.svg'
import AppBar from '@/components/app_bar/app_bar';

const chatData = [
  { id: '0', title: 'CSKH', message: 'Bạn đã đặt hàng thành công cho đơn hàng: Làm sạch bằng lamellar..', time: '1h' },
  { id: '1', title: 'Chăm sóc AI', message: 'Bạn đã hủy lịch hẹn thành công cho dịch vụ: Kiểm tra và sửa chữa máy l..', time: '2h' },
];

const handleChatScreen = (id: string) => {
  if (id === '0') {
    return router.push('/chat/message_screen' as Href<string>)
  } else {
    return router.push('/chat/message_ai' as Href<string>)
  }
}

const ChatScreen = () => {
  const renderItem = ({ item }: { item: typeof chatData[0] }) => (
    <TouchableOpacity
      onPress={() => handleChatScreen(item.id)}
      style={styles.chatItem}>
      {item.id === '0' && <Image source={IconCskh} style={{ marginRight: 12 }}/>}
      {item.id === '1' && <Image source={IconCskh} style={{ marginRight: 12 }}/>}
      <View style={styles.messageContainer}>
        <Text h2_bold>{item.title}</Text>
        <Text h3>{item.message}</Text>
      </View>
      <Text h3>{item.time}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View flex bg-$backgroundDefault>
        <AppBar title="Chat" />
        <FlatList
          data={chatData}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        />
      </View>
    </SafeAreaView>
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
  messageContainer: {
    flex: 1,
    alignSelf: 'center',
  },
});

export default ChatScreen;