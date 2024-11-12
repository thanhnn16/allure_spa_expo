import React, { useState, useEffect, useRef } from "react";
import {
  Colors,
  TextField,
  View,
  Image,
  Text,
  TouchableOpacity,
} from "react-native-ui-lib";
import AntDesign from "@expo/vector-icons/AntDesign";
import Voice from "@react-native-voice/voice";
import Toast from "react-native-toast-message";

import SearchIcon from "@/assets/icons/search.svg";
import MicIcon from "@/assets/icons/mic.svg";
import { Pressable, StyleProp, ViewStyle } from "react-native";
import { Href, router } from "expo-router";
import i18n from "@/languages/i18n";

type AppSearchProps = {
  value?: string;
  onChangeText?: (text: string) => void;
  onClear?: () => void;
  isHome?: boolean;
  style?: StyleProp<ViewStyle>;
};

const AppSearch = ({
  value,
  onChangeText,
  onClear,
  isHome,
  style,
}: AppSearchProps) => {
  const [searchText, setSearchText] = useState(value || "");
  const [isListening, setIsListening] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const silenceTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechError = onSpeechError;
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const onSpeechResults = (e: any) => {
    const recognizedText = e.value[0];
    setSearchText(recognizedText); // Set recognized text in TextField
    onChangeText && onChangeText(recognizedText);

    resetSilenceTimeout(); // Reset silence timeout on new results

    Toast.show({
      type: "success",
      text1: "Recognized:",
      text2: recognizedText,
    });
  };

  const onSpeechError = (e: any) => {
    Toast.show({
      type: "error",
      text1: "Speech recognition error",
      text2: e.error.message || "Please try again.",
    });
    stopListening(); // Reset state on error
  };

  const stopListening = async () => {
    if (silenceTimeout.current) {
      clearTimeout(silenceTimeout.current);
    }
    try {
      await Voice.stop();
    } catch (error) {
      console.error(error);
    } finally {
      setIsListening(false);
      setIsButtonDisabled(false);
      Toast.show({
        type: "info",
        text1: "Stopped Listening",
      });
    }
  };

  const startListening = async (language: string) => {
    if (isListening) {
      stopListening(); // Manually stop if already listening
      return;
    }
    try {
      await Voice.start(language);
      setIsListening(true);
      setIsButtonDisabled(true);
      Toast.show({
        type: "info",
        text1: "Listening...",
      });
      startSilenceTimeout();
    } catch (error) {
      console.error(error);
      setIsButtonDisabled(false);
    }
  };

  const handleMicPress = (language: string) => {
    if (isListening) {
      stopListening();
    } else {
      startListening(language);
    }
  };

  const handleClear = () => {
    setSearchText("");
    onClear && onClear();
  };

  const resetSilenceTimeout = () => {
    if (silenceTimeout.current) {
      clearTimeout(silenceTimeout.current);
      startSilenceTimeout();
    }
  };

  const startSilenceTimeout = () => {
    silenceTimeout.current = setTimeout(() => {
      stopListening();
    }, 2000);
  };

  return (
    <View
      width={"100%"}
      style={[
        style,
        {
          borderRadius: 8,
          borderColor: "#C9C9C9",
          borderWidth: 1,
          overflow: "hidden",
        },
      ]}
    >
      <View
        style={{
          width: "100%",
          height: 48,
          paddingHorizontal: 10,
          alignSelf: "center",
          alignItems: "center",
          flexDirection: "row",
        }}
      >
        <Image source={SearchIcon} />
        {isHome ? (
          <Pressable
            style={{ flex: 1, flexDirection: "row", alignItems: "center" }}
            onPress={() => router.push("search" as Href<string>)}
          >
            <View flex marginL-10>
              <Text h3 gray>
                {i18n.t("home.placeholder_search")}
              </Text>
            </View>
          </Pressable>
        ) : (
          <View flex row centerV>
            <TextField
              value={searchText}
              onChangeText={(text) => {
                setSearchText(text);
                onChangeText && onChangeText(text);
              }}
              placeholder="Tìm kiếm mỹ phẩm, liệu trình ..."
              placeholderTextColor={Colors.gray}
              containerStyle={{
                flex: 1,
                marginStart: 10,
              }}
            />
            {searchText.length > 0 && (
              <TouchableOpacity onPress={handleClear} style={{ padding: 5 }}>
                <AntDesign name="close" size={20} color={Colors.gray} />
              </TouchableOpacity>
            )}
          </View>
        )}
        <TouchableOpacity
          onPress={() => handleMicPress("vi-VN")}
          disabled={isButtonDisabled}
        >
          <Image
            source={MicIcon}
            style={{ tintColor: isListening ? "red" : "black" }}
          />
          <Text style={{ color: isListening ? "red" : "gray", fontSize: 12 }}>
            {isListening ? "on" : "off"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AppSearch;
