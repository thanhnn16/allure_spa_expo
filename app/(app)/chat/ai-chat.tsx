import { Audio } from "expo-av";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import Animated, { LinearTransition } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, Image, Text, View, Keyboard } from "react-native-ui-lib";
import { useDispatch, useSelector } from "react-redux";

import KeyboardIcon from "@/assets/icons/keyboard.svg";
import MicIcon from "@/assets/icons/mic.svg";
import StopIcon from "@/assets/icons/stop_fill.svg";
import AppBar from "@/components/app-bar/AppBar";
import SelectImagesBar from "@/components/images/SelectImagesBar";
import MessageBubble from "@/components/message/MessageBubble";
import MessageTextInput from "@/components/message/MessageTextInput";
import i18n from "@/languages/i18n";
import {
  fetchAiConfigs,
  sendImageMessage,
  sendTextMessage,
} from "@/redux/features/ai/aiSlice";
import { AppDispatch, RootState } from "@/redux/store";
import {
  convertImageToBase64,
  isValidImageFormat,
} from "@/utils/helpers/imageHelper";
import { useAuth } from "@/hooks/useAuth";

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


  const hasValidContent = (msg: any) => {
    return (
      !msg.isSystemMessage &&
      (
        msg.parts?.[0]?.text?.trim() !== '' ||
        msg.parts?.some((part: any) => part.image)
      )
    );
  };

  const hasMessages = messages.filter(hasValidContent).length > 0;

  const { user } = useAuth();

  useEffect(() => {
    dispatch(fetchAiConfigs())
      .unwrap()
      .catch((error: any) => {
        console.error("Error fetching configs:", error);
      });
  }, [dispatch]);

  useEffect(() => {
    const sendInitialContext = async () => {
      try {
        if (!configs || configs.length === 0) return;

        const userContext = {
          user_id: user?.id || "guest",
          name: user?.full_name || "Khách",
          timestamp: new Date().toISOString(),
          is_guest: !user?.id,
        };

        await dispatch(
          sendTextMessage({
            text: JSON.stringify(userContext),
            isSystemMessage: true,
          })
        ).unwrap();
      } catch (error) {
        console.error("Failed to send user context:", error);
      }
    };

    sendInitialContext();
  }, [configs]);

  const handleSend = async () => {
    if (!message.trim() && selectedImages.length === 0) return;

    const currentMessage = message;
    setMessage("");
    setSelectedImages([]);

    try {
      setMessageStatus("Đang gửi");

      if (!configs || configs.length === 0) {
        throw new Error("Chưa tải được cấu hình AI");
      }

      if (selectedImages.length > 0) {
        try {
          const imageData = [];
          for (const uri of selectedImages) {
            const processedImage = await convertImageToBase64(uri);
            imageData.push({
              data: processedImage.base64,
              mimeType: "image/jpeg",
            });
          }

          await dispatch(
            sendImageMessage({
              text: currentMessage,
              images: imageData,
            })
          ).unwrap();
        } catch (error: any) {
          throw new Error(`Lỗi xử lý hình ảnh: ${error.message}`);
        }
      } else {
        await dispatch(
          sendTextMessage({
            text: currentMessage,
          })
        ).unwrap();
      }

      setMessageStatus("Đã gửi");
    } catch (err: any) {
      console.error("Failed to send message:", err);
      setMessageStatus(`Lỗi: ${err.message}`);
    }
  };

  const handleRead = () => {
    if (!hasMessages) return null;

    return (
      <View row centerV right paddingH-10>
        <Text>{messageStatus}</Text>
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
        data={messages.filter(hasValidContent)}
        renderItem={({ item, index }) => {
          const messageText = item.parts?.[0]?.text || "";
          const hasImages = item.parts?.some((p: any) => p.image);

          if (!messageText.trim() && !hasImages) return null;

          return (
            <MessageBubble
              key={`message-${item.id || index}`}
              message={{
                id: item.id || `msg-${index}`,
                message: messageText,
                sender_id: item.role === "user" ? "user" : "ai",
                created_at: new Date().toISOString(),
                attachments: item.parts
                  ?.filter((p: any) => p.image)
                  ?.map((p: any) => p.image.data) || [],
              }}
              isOwn={item.role === "user"}
              isThinking={
                item.role === "model" &&
                isThinking &&
                index === messages.length - 1
              }
            />
          );
        }}
        ref={scrollRef}
        onContentSizeChange={() => {
          requestAnimationFrame(() => {
            scrollRef.current?.scrollToEnd({ animated: true });
          });
        }}
        keyExtractor={(item, index) => item.id || `msg-${index}`}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 16,
        }}
        ListFooterComponent={handleRead}
        refreshing={refreshing}
        onRefresh={onRefresh}
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
    <View flex center>
      <View
        width={200}
        height={200}
        br100
        backgroundColor="ghostwhite"
        marginB-20
      />
      <Text text70 grey30 marginB-30>
        {recording ? "Đang ghi âm..." : "Nhấn để bắt đầu ghi âm"}
      </Text>

      <View row spread paddingH-20 width="100%" centerV>
        <TouchableOpacity
          onPress={() => setIsVoiceMode(false)}
        >
          <View
            width={60}
            height={60}
            br30
            backgroundColor="ghostwhite"
            center
          >
            <KeyboardIcon />
          </View>
        </TouchableOpacity>

        <View
          row
          centerV
          style={{ gap: 5 }}
          width={Dimensions.get("screen").width / 2}
          paddingH-20
          backgroundColor="ghostwhite"
          height={50}
          br20
        >
          {waveCount.map((waveHeight, index) => (
            <Animated.View
              layout={LinearTransition}
              key={index.toString()}
              style={{
                width: 4,
                height: waveHeight,
                backgroundColor: 'black',
                borderRadius: 10,
              }}
            />
          ))}
        </View>

        <TouchableOpacity
          onPress={() => (recording ? stopRecording() : startRecording())}
        >
          <View
            width={60}
            height={60}
            br30
            backgroundColor="ghostwhite"
            center
          >
            {recording ? <StopIcon /> : <MicIcon />}
          </View>
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

  const KeyboardTrackingView = Keyboard.KeyboardTrackingView;

  return (
    <KeyboardTrackingView
      style={{ flex: 1, backgroundColor: Colors.white }}
      trackInteractive
      useSafeArea
    >
      <AppBar back title={i18n.t("chat.chat_with_ai")} />
      {isVoiceMode ? renderVoiceUI() : renderChatUI()}
    </KeyboardTrackingView>
  );
};

export default AIChatScreen;
