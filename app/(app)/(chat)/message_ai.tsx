import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  FlatList,
  TextInput,
  TouchableWithoutFeedback,
  Platform,
  Keyboard,
  KeyboardAvoidingView,
  Alert,
  ActivityIndicator,
} from "react-native";
import {
  Image,
  View,
  Text,
  TouchableOpacity,
  Button,
  Colors,
} from "react-native-ui-lib";
import * as ImagePicker from "expo-image-picker";

import SunIcon from "@/assets/icons/sun.svg";
import { Href, router } from "expo-router";
import { BlurView } from "expo-blur";
import MessageBubble from "@/components/message/message_bubble";
import messagesData from "./data";
import MessageTextInput from "@/components/message/message_textinput";
import AppBar from "@/components/app-bar/AppBar";
import SelectImagesBar from "@/components/images/SelectImagesBar";
import i18n from "@/languages/i18n";
import { SafeAreaView } from "react-native-safe-area-context";
const MessageAI = () => {
  const [message, setMessage] = useState("");
  const [messageStatus, setMessageStatus] = useState("Đã gửi");
  const scrollRef = useRef<FlatList>(null);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  const handleSend = () => {
    if (message.trim() === "") return;
    const newMessage = {
      id: (messagesData.length + 1).toString(),
      text: message,
      sender: "user",
      time: new Date().toLocaleTimeString().split(":").slice(0, 2).join(":"),
    };
    messagesData.push(newMessage);
    setMessageStatus("Đang gửi");
    setMessage("");
    scrollRef.current?.scrollToEnd({ animated: true });

    setTimeout(() => {
      setMessageStatus("Đã gửi");
    }, 4000);

    setTimeout(() => {
      setMessageStatus("Đã đọc");
    }, 6000);
  };

  const handleRead = () => {
    return (
      <View style={styles.statusContainer}>
        <Text>{messageStatus}</Text>
        {messageStatus === "Đã đọc"}
        {messageStatus === "Đang gửi" && (
          <ActivityIndicator
            size="small"
            color={Colors.primary}
            style={{ marginLeft: 5 }}
          />
        )}
      </View>
    );
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        scrollRef.current?.scrollToEnd({ animated: true });
      }
    );

    return () => {
      keyboardDidShowListener.remove();
    };
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1, backgroundColor: "#ffffff" }}
        >
          <AppBar back title={i18n.t("chat.chat_with_ai")} />

          <FlatList
            data={messagesData}
            renderItem={({ item }) => <MessageBubble item={item} />}
            ref={scrollRef}
            onContentSizeChange={() =>
              scrollRef.current?.scrollToEnd({ animated: true })
            }
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16 }}
            ListFooterComponent={handleRead}
          />

          {selectedImages.length > 0 && (
            <SelectImagesBar
              selectedImages={selectedImages}
              setSelectedImages={setSelectedImages}
            />
          )}

          <MessageTextInput
            placeholder={
              i18n.t("chat.chat_with") +
              " " +
              i18n.t("chat.chat_with_ai") +
              ".."
            }
            message={message}
            setMessage={setMessage}
            handleSend={handleSend}
            isCamera={true}
            isAI={true}
            selectedImages={selectedImages}
            setSelectedImages={setSelectedImages}
          />
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 16,
  },

  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingHorizontal: 10,
  },
});

export default MessageAI;
