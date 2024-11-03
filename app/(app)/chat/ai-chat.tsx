import React, { useEffect, useRef, useState } from "react";
import { Audio } from "expo-av";
import {
  StyleSheet,
  FlatList,
  TouchableWithoutFeedback,
  Platform,
  Keyboard,
  KeyboardAvoidingView,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Image, View, Text, Colors } from "react-native-ui-lib";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { LinearTransition } from "react-native-reanimated";

import MessageBubble from "@/components/message/MessageBubble";
import messagesData from "../../../data/chat/ChatDefaultData";
import MessageTextInput from "@/components/message/MessageTextInput";
import AppBar from "@/components/app-bar/AppBar";
import SelectImagesBar from "@/components/images/SelectImagesBar";
import i18n from "@/languages/i18n";
import MicIcon from "@/assets/icons/mic.svg";
import KeyboardIcon from "@/assets/icons/keyboard.svg";
import StopIcon from "@/assets/icons/stop_fill.svg";

const AIChatScreen = () => {
  const [message, setMessage] = useState("");
  const [messageStatus, setMessageStatus] = useState("Đã gửi");
  const scrollRef = useRef<FlatList>(null);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording>();
  const [recordingUri, setRecordingUri] = useState<string | undefined>();
  const [waveCount, setWaveCount] = useState<number[]>([]);
  const [permissionResponse, requestPermission] = Audio.usePermissions();

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

  async function startRecording() {
    try {
      if (!permissionResponse || permissionResponse.status !== "granted") {
        console.log("Requesting permission..");
        await requestPermission();
      }
      setRecordingUri(undefined);
      setWaveCount(() => []);
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      console.log("Starting recording..");
      const { recording: audioRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY,
        (status) => {
          let loudness =
            status.metering !== undefined && !isNaN(status.metering + 160)
              ? Math.max(status.metering + 160, 10)
              : 10;
          setWaveCount((waves) => [loudness, ...waves]);
        }
      );

      setRecording(() => audioRecording);

      console.log("Recording Started");
    } catch (err) {
      console.log("Failed to start recording");
    }
  }

  async function stopRecording() {
    console.log("Stopping recording..");

    setRecording(() => undefined);

    if (recording) {
      await recording.stopAndUnloadAsync();
    }

    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: true,
    });
    const uri: string | undefined = recording
      ? recording.getURI() || undefined
      : undefined;
    console.log("Recording Saved", uri);
    setRecordingUri(uri);
  }

  const renderChatUI = () => (
    <>
      <FlatList
        data={messagesData}
        renderItem={({ item }) => (
          <MessageBubble message={item} isOwn={false} />
        )}
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
          i18n.t("chat.chat_with") + " " + i18n.t("chat.chat_with_ai") + ".."
        }
        message={message}
        setMessage={setMessage}
        handleSend={handleSend}
        isCamera={true}
        isAI={true}
        selectedImages={selectedImages}
        setSelectedImages={setSelectedImages}
        onVoicePress={() => setIsVoiceMode(true)}
      />
    </>
  );

  const renderVoiceUI = () => (
    <View style={styles.voiceContainer}>
      <View style={styles.circle} />
      <Text style={styles.startText}>
        {recording ? "Nói đã chưa?" : "Nhấn núi r nói i"}
      </Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setIsVoiceMode(false)}
        >
          <Image source={KeyboardIcon} />
        </TouchableOpacity>

        <View style={styles.waveContainer}>
          {waveCount.map((waveHeight, index) => (
            <Animated.View
              layout={LinearTransition}
              key={index.toString()}
              style={[styles.wave, { height: waveHeight }]}
            />
          ))}
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => (recording ? stopRecording() : startRecording())}
        >
          <Image source={recording ? StopIcon : MicIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1, backgroundColor: "#ffffff" }}
        >
          <AppBar back title={i18n.t("chat.chat_with_ai")} />
          {isVoiceMode ? renderVoiceUI() : renderChatUI()}
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

  voiceContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  circle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "ghostwhite",
    borderWidth: 2,
    borderColor: "gainsboro",
    marginBottom: 20,
  },
  startText: {
    fontSize: 18,
    marginBottom: 30,
    color: "gray",
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 20,
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "ghostwhite",
    borderWidth: 2,
    borderColor: "gainsboro",
    justifyContent: "center",
    alignItems: "center",
  },
  waveContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    width: Dimensions.get("screen").width / 2,
    paddingHorizontal: 20,
    backgroundColor: "ghostwhite",
    borderWidth: 2,
    borderColor: "gainsboro",
    height: 50,
    overflow: "hidden",
    borderRadius: 20,
  },
  wave: {
    width: 4,
    backgroundColor: "black",
    borderRadius: 10,
  },
});

export default AIChatScreen;
