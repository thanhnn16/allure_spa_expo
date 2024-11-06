import { Audio } from "expo-av";
import { useEffect, useRef, useState, useCallback } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import Animated, { LinearTransition } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, Image, Text, View } from "react-native-ui-lib";
import { useDispatch, useSelector } from "react-redux";

import KeyboardIcon from "@/assets/icons/keyboard.svg";
import MicIcon from "@/assets/icons/mic.svg";
import StopIcon from "@/assets/icons/stop_fill.svg";
import AppBar from "@/components/app-bar/AppBar";
import SelectImagesBar from "@/components/images/SelectImagesBar";
import MessageBubble from "@/components/message/MessageBubble";
import MessageTextInput from "@/components/message/MessageTextInput";
import i18n from "@/languages/i18n";
import { AppDispatch, RootState } from "@/redux/store";
import {
  sendTextMessage,
  sendImageMessage,
  fetchAiConfigs,
} from "@/redux/features/ai/aiSlice";
import { convertImageToBase64 } from "@/utils/imageUtils";
import { AiConfig } from "@/types/ai-config";

const AIChatScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { messages, isLoading, isThinking, error, configs } = useSelector(
    (state: RootState) => state.ai
  );
  const [message, setMessage] = useState("");
  const [messageStatus, setMessageStatus] = useState("Đã gửi");
  const scrollRef = useRef<FlatList>(null);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording>();
  const [recordingUri, setRecordingUri] = useState<string | undefined>();
  const [waveCount, setWaveCount] = useState<number[]>([]);
  const [permissionResponse, requestPermission] = Audio.usePermissions();

  useEffect(() => {
    dispatch(fetchAiConfigs())
      .unwrap()
      .catch((error: any) => {
        console.error("Error fetching configs:", error);
      });
  }, [dispatch]);

  const handleSend = async () => {
    if (!message.trim() && selectedImages.length === 0) return;

    try {
      setMessageStatus("Đang gửi");

      if (!configs || configs.length === 0) {
        throw new Error("Chưa tải được cấu hình AI");
      }

      const generalConfig = configs.find(
        (c: AiConfig) => c.type === "general" && c.is_active
      );
      const visionConfig = configs.find(
        (c: AiConfig) => c.type === "vision_config" && c.is_active
      );

      if (!generalConfig?.api_key && !visionConfig?.api_key) {
        throw new Error("Thiếu cấu hình API key");
      }

      if (selectedImages.length > 0) {
        // Handle image message
        try {
          const imageData = await Promise.all(
            selectedImages.map(async (uri) => {
              const base64 = await convertImageToBase64(uri);
              return {
                data: base64,
                mimeType: "image/jpeg",
              };
            })
          );

          await dispatch(
            sendImageMessage({
              text: message,
              images: imageData,
            })
          ).unwrap();
        } catch (error: any) {
          throw new Error(`Lỗi xử lý hình ảnh: ${error.message}`);
        }
      } else {
        // Handle text message
        await dispatch(
          sendTextMessage({
            text: message,
          })
        ).unwrap();
      }

      setMessage("");
      setSelectedImages([]);
      setMessageStatus("Đã gửi");
    } catch (err: any) {
      console.error("Failed to send message:", err);
      setMessageStatus(`Lỗi: ${err.message}`);
    }
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
        data={messages}
        renderItem={({ item, index }) => (
          <MessageBubble
            key={`message-${item.id || index}`}
            message={{
              id: item.id || `msg-${index}`,
              message: item.parts[0].text || "",
              sender_id: item.role === "user" ? "user" : "ai",
              created_at: new Date().toISOString(),
              attachments: item.parts
                .filter((p: any) => p.image)
                .map((p: any) => p.image.data),
            }}
            isOwn={item.role === "user"}
            isThinking={
              item.role === "model" &&
              isThinking &&
              index === messages.length - 1
            }
          />
        )}
        ref={scrollRef}
        onContentSizeChange={() =>
          scrollRef.current?.scrollToEnd({ animated: true })
        }
        keyExtractor={(item, index) => item.id || `msg-${index}`}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        ListFooterComponent={handleRead}
        refreshing={refreshing}
        onRefresh={onRefresh}
        onEndReached={() => {
          // Load more messages if needed
        }}
        onEndReachedThreshold={0.5}
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

  useEffect(() => {
    if (error) {
      setMessageStatus("Lỗi: " + error);
    }
  }, [error]);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    dispatch(fetchAiConfigs()).finally(() => setRefreshing(false));
  }, []);

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
