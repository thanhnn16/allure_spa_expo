import React, { useState } from 'react';
import { StyleSheet, FlatList, TextInput } from 'react-native';
import { Image, View, Text, TouchableOpacity, Button, Colors } from 'react-native-ui-lib';

import MicIcon from '@/assets/icons/mic.svg'
import CameraIcon from '@/assets/icons/camera.svg'
import { Href, router } from 'expo-router';

const messagesData = [
  { id: '1', text: 'hehe', sender: 'user', time: '' },
  { id: '2', text: 'bên mình uy tín quá a', sender: 'user', time: '' },
  { id: '3', text: 'cảm ơn đã ủng hộ bên mình nhé', sender: 'support', time: '' },
  { id: '4', text: 'mình thấy dịch vụ rất oke', sender: 'user', time: '' },
  { id: '5', text: 'sắp tới mình sẽ ủng hộ tiếp', sender: 'user', time: '19:30' },
  { id: '6', text: 'ad ơi', sender: 'user', time: '' },
];

const ChatCSKH = () => {
  const [message, setMessage] = useState('');

  const renderItem = ({ item }: { item: typeof messagesData[0] }) => (
    <View style={[styles.messageContainer, item.sender === 'user' ? styles.userMessage : styles.supportMessage]}>
      <Text h2 style={item.sender === 'user' ? styles.userMessageText : styles.supportMessageText}>{item.text}</Text>
      {item.time ? <Text h3 style={item.sender === 'user' ? styles.userMessageText : styles.supportMessageText}>{item.time}</Text> : null}
    </View>
  );

  const handleSend = () => {
    if (message.trim()) {
      setMessage('');
    }
  };

  const handleAI = () => {
    router.push('/chat/ai_screen' as Href<string>)
  }

  return (
    <View flex bg-$backgroundDefault padding-16>
      <Text h0_bold>CSKH</Text>
      <FlatList
        data={messagesData}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messagesList}
      />
      <View row>

        <View width={40} height={40} centerV marginT-5>
          <Image source={CameraIcon} />
        </View>

        <View row flex style={styles.inputContainer}>
          <TextInput
            placeholder="Nhắn cho CSKH..."
            value={message}
            onChangeText={setMessage}
            onSubmitEditing={handleSend}
            style={styles.input}
          />
          <View flex right centerV>
            <TouchableOpacity onPress={handleAI}>
              <Image source={MicIcon} />
            </TouchableOpacity>
          </View>
        </View>

        <Button
          size={Button.sizes.small}
          label="Gửi"
          backgroundColor={Colors.primary}
          onPress={handleSend}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  messagesList: {
    paddingBottom: 16,
  },
  messageContainer: {
    marginVertical: 4,
    padding: 10,
    borderRadius: 10,
    maxWidth: '80%',
  },
  userMessage: {
    backgroundColor: Colors.primary,
    alignSelf: 'flex-end',
  },
  supportMessage: {
    backgroundColor: '#f1f1f1',
    alignSelf: 'flex-start',
  },
  userMessageText: {
    color: Colors.white,
  },
  supportMessageText: {
    color: Colors.black,
  },
  inputContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingVertical: 5,
    paddingStart: 10,
    marginRight: 10,
  },
  input: {
    width: '85%',
  },
});

export default ChatCSKH;
