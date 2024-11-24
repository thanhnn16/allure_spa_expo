import {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  Colors,
  TextField,
  View,
  Image,
  Text,
  TouchableOpacity,
} from "react-native-ui-lib";
import AntDesign from "@expo/vector-icons/AntDesign";
import Voice, {
  SpeechStartEvent,
  SpeechResultsEvent,
  SpeechErrorEvent,
  SpeechEndEvent,
} from "@react-native-voice/voice";
import { useSelector, useDispatch } from "react-redux";

import SearchIcon from "@/assets/icons/search.svg";
import MicIcon from "@/assets/icons/mic.svg";
import { Pressable, StyleProp, ViewStyle, Platform } from "react-native";
import { Href, router } from "expo-router";
import { useLanguage } from "@/hooks/useLanguage";

import { RootState } from "@/redux/store";
import { setCurrentSearchText } from "@/redux/features/search/searchSlice";

import { Animated } from "react-native";
import { Audio } from "expo-av";

type AppSearchProps = {
  value?: string;
  onChangeText?: (text: string) => void;
  onClear?: () => void;
  isHome?: boolean;
  style?: StyleProp<ViewStyle>;
  onFocus?: () => void;
  defaultSearchText?: string;
};

export type AppSearchRef = {
  focus: () => void;
};

const AppSearch = forwardRef<AppSearchRef, AppSearchProps>((props, ref) => {
  const { t } = useLanguage();

  const dispatch = useDispatch();
  const currentSearchText = useSelector(
    (state: RootState) => state.search.currentSearchText
  );
  const [searchText, setSearchText] = useState(
    props.defaultSearchText || currentSearchText || props.value || ""
  );
  const [isListening, setIsListening] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [buttonScale] = useState(new Animated.Value(1));
  const silenceTimeout = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<any>(null);
  const [recognized, setRecognized] = useState("");
  const [pitch, setPitch] = useState("");
  const [error, setError] = useState("");
  const [end, setEnd] = useState("");
  const [started, setStarted] = useState("");
  const [partialResults, setPartialResults] = useState<string[]>([]);
  const [showVoiceButton, setShowVoiceButton] = useState(false);

  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current?.focus();
    },
  }));

  useEffect(() => {
    checkPermissions();
    setupVoiceListeners();
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const checkPermissions = async () => {
    try {
      // Kiểm tra quyền microphone sử dụng expo-av
      const { granted } = await Audio.getPermissionsAsync();

      if (!granted) {
        const { granted: newGranted } = await Audio.requestPermissionsAsync();
        if (!newGranted) {
          setShowVoiceButton(false);
          return;
        }
      }

      // Kiểm tra voice recognition service trên Android
      if (Platform.OS === "android") {
        const isVoiceAvailable = await Voice.isAvailable();
        if (!isVoiceAvailable) {
          setShowVoiceButton(false);
          return;
        }

        const services = await Voice.getSpeechRecognitionServices();
        if (!services?.includes("com.google.android.googlequicksearchbox")) {
          setShowVoiceButton(false);
          return;
        }
      }

      setShowVoiceButton(true);
    } catch (error) {
      console.error("Permission check error:", error);
      setShowVoiceButton(false);
    }
  };

  const setupVoiceListeners = () => {
    Voice.onSpeechStart = (e: SpeechStartEvent) => {
      console.log("onSpeechStart");
      setStarted("√");
      setIsListening(true);
      animateButton(1.2);
    };

    Voice.onSpeechEnd = (e: SpeechEndEvent) => {
      console.log("onSpeechEnd");
      setEnd("√");
      setIsListening(false);
      animateButton(1);
    };

    Voice.onSpeechResults = (e: SpeechResultsEvent) => {
      console.log("onSpeechResults");
      if (e.value && e.value[0]) {
        const recognizedText = e.value[0];
        setSearchText(recognizedText);
        dispatch(setCurrentSearchText(recognizedText));
        props.onChangeText?.(recognizedText);
      }
    };

    Voice.onSpeechError = (e: SpeechErrorEvent) => {
      console.log("onSpeechError");
      setError(JSON.stringify(e.error));
      setIsListening(false);
      animateButton(1);
    };
  };

  const startRecognizing = async () => {
    try {
      // Check availability first
      const isAvailable = await Voice.isAvailable();
      if (!isAvailable) {
        return;
      }

      // For Android, check Google Speech Recognition
      if (Platform.OS === "android") {
        const services = await Voice.getSpeechRecognitionServices();
        if (!services?.includes("com.google.android.googlequicksearchbox")) {
          return;
        }
      }

      await Voice.start("vi-VN");
      setIsListening(true);
    } catch (e) {
      console.error(e);
    }
  };

  const stopRecognizing = async () => {
    try {
      await Voice.stop();
      setIsListening(false);
    } catch (e) {
      console.error(e);
    }
  };

  const handleMicPress = async () => {
    if (isListening) {
      await stopRecognizing();
    } else {
      await startRecognizing();
    }
  };

  const handleClear = () => {
    setSearchText("");
    dispatch(setCurrentSearchText(""));
    props.onClear && props.onClear();
  };

  const animateButton = (toValue: number) => {
    Animated.spring(buttonScale, {
      toValue,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View
      width={"100%"}
      style={[
        props.style,
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
        {props.isHome ? (
          <Pressable
            style={{ flex: 1, flexDirection: "row", alignItems: "center" }}
            onPress={() => router.push("search" as Href<string>)}
          >
            <View flex marginL-10>
              <Text h3 gray>
                {t("home.placeholder_search")}
              </Text>
            </View>
          </Pressable>
        ) : (
          <View flex row centerV>
            <TextField
              ref={inputRef}
              value={searchText}
              onChangeText={(text) => {
                setSearchText(text);
                dispatch(setCurrentSearchText(text));
                props.onChangeText && props.onChangeText(text);
              }}
              onFocus={props.onFocus}
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
        {showVoiceButton && (
          <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
            <TouchableOpacity
              onPress={handleMicPress}
              disabled={isButtonDisabled}
              style={{
                backgroundColor: isListening ? "red" : "white",
                borderRadius: 24,
                padding: 5,
              }}
            >
              <Image
                source={MicIcon}
                style={{ tintColor: isListening ? "white" : "black" }}
              />
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>
    </View>
  );
});

export default AppSearch;
