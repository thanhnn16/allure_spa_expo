import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, FlatList, TextInput, TouchableWithoutFeedback, Platform, KeyboardAvoidingView, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import { Image, View, Text, TouchableOpacity, Button, Colors,Keyboard  } from 'react-native-ui-lib';



import SunIcon from '@/assets/icons/sun.svg';
import { Href, router } from 'expo-router';
import { BlurView } from 'expo-blur';
import MessageBubble from '@/components/message/message_bubble';
import messagesData from './data';
import MessageTextInput from '@/components/message/message_textinput';
import AppBar from '@/components/app_bar/app_bar';
import SelectImagesBar from '@/components/images/SelectImagesBar';
import i18n from '@/languages/i18n';
const MessageScreen = () => {
  const [message, setMessage] = useState('');
  const [messageStatus, setMessageStatus] = useState('Đã gửi');
  const scrollRef = useRef<FlatList>(null);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const KeyboardTrackingView = Keyboard.KeyboardTrackingView;


  const handleSend = () => {
    if (message.trim() === '') return;
    const newMessage = { id: (messagesData.length + 1).toString(), text: message, sender: 'user', time: new Date().toLocaleTimeString().split(':').slice(0, 2).join(':') };
    messagesData.push(newMessage);
    setMessageStatus('Đang gửi');
    setMessage('');
    scrollRef.current?.scrollToEnd({ animated: true });

    setTimeout(() => {
      setMessageStatus('Đã gửi');
    }, 4000);

    setTimeout(() => {
      setMessageStatus('Đã đọc');
    }, 6000);
  };

  const handleRead = () => {
    return (
      <View style={styles.statusContainer}>
        <Text>{messageStatus}</Text>
        {messageStatus === 'Đã đọc'}
        {messageStatus === 'Đang gửi' && <ActivityIndicator size="small" color={Colors.primary} style={{ marginLeft: 5 }} />}
      </View>
    );
  };

  // useEffect(() => {
  //   const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
  //     scrollRef.current?.scrollToEnd({ animated: true });
  //   });

  //   return () => {
  //     keyboardDidShowListener.remove();
  //   };
  // }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>

      <AppBar title={i18n.t('chat.customer_care')} />

      <FlatList
        data={messagesData}
        renderItem={({ item }) => <MessageBubble item={item} />}
        ref={scrollRef}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        ListFooterComponent={handleRead}
      />



      {selectedImages.length > 0 && (
        <SelectImagesBar
          selectedImages={selectedImages}
          setSelectedImages={setSelectedImages}
          isRating={false}
        />
      )}


      <KeyboardTrackingView
        useSafeArea
        addBottomView
      >
      <MessageTextInput
        placeholder={i18n.t('chat.chat_with') + ' ' + i18n.t('chat.customer_care') + ".."}
        message={message}
        setMessage={setMessage}
        handleSend={handleSend}
        isCamera={true}
        isAI={false}
        selectedImages={selectedImages}
        setSelectedImages={setSelectedImages}
      />
      </KeyboardTrackingView>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 16,
  },

  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 10,
  },
});

export default MessageScreen;
