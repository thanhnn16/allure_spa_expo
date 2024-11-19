import React, { useState, useEffect, useCallback, useRef } from "react";
import { View, TouchableOpacity, StyleSheet, Animated } from "react-native";
import { Colors, Image, Text } from "react-native-ui-lib";
import { Href, router } from "expo-router";
import MicIcon from "@/assets/icons/mic.svg";
import CloseCircleIcon from "@/assets/icons/close_circle.svg";
import Voice from "@react-native-voice/voice";
import * as Speech from "expo-speech";

const VoiceChatScreen = () => {
  const [recognizedText, setRecognizedText] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const buttonScale = useRef(new Animated.Value(1)).current;
  const circleScale = useRef(new Animated.Value(1)).current;
  const circleOpacity = useRef(new Animated.Value(0.5)).current;
  const silenceTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechPartialResults = onSpeechPartialResults;
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const onSpeechPartialResults = (e: any) => {
    const volume = calculateVolume(e.value[0]);
    animateCircle(volume, 1);
  };

  const onSpeechResults = async (e: any) => {
    const text = e.value[0];
    console.log("Recognized words:", text);
    setRecognizedText(text);
    resetSilenceTimeout();

    const response = await fetchAiResponse(text);
    setAiResponse(response);
    readAloud(response);
  };

  const onSpeechError = (e: any) => {
    stopListening();
  };

  const calculateVolume = (text: string) => {
    const length = text.length;
    return Math.min(1 + length / 10, 2);
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
      animateButton(1);
      animateCircle(1, 0.5);
    }
  };

  const startListening = async (language: string) => {
    if (isListening) {
      stopListening();
      return;
    }
    try {
      await Voice.start(language);
      setIsListening(true);
      setIsButtonDisabled(true);
      startSilenceTimeout();
      animateButton(1.2);
      animateCircle(1.5, 1);
    } catch (error) {
      console.error(error);
      setIsButtonDisabled(false);
    }
  };

  const handleMicPress = (language: string) => {
    startListening(language);
  };

  const resetSilenceTimeout = () => {
    if (silenceTimeout.current) {
      clearTimeout(silenceTimeout.current);
    }
    startSilenceTimeout();
  };

  const startSilenceTimeout = () => {
    silenceTimeout.current = setTimeout(stopListening, 2000);
  };

  const animateButton = (toValue: number) => {
    Animated.spring(buttonScale, {
      toValue,
      useNativeDriver: true,
    }).start();
  };

  const animateCircle = (toValue: number, opacityValue: number) => {
    Animated.parallel([
      Animated.spring(circleScale, {
        toValue,
        useNativeDriver: true,
      }),
      Animated.timing(circleOpacity, {
        toValue: opacityValue,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const fetchAiResponse = useCallback(async (text: string) => {
    // Simulating AI response
    return `AI response to: ${text}`;
  }, []);

  const readAloud = useCallback((text: string) => {
    Speech.speak(text);
  }, []);

  const handleBack = () => {
    router.replace("/(app)/chat/ai-chat" as Href<string>);
  };

  return (
    <View style={styles.container}>
      <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
        <TouchableOpacity
          onPress={() => handleMicPress("vi-VN")}
          disabled={isButtonDisabled}
          style={[
            styles.micButton,
            { backgroundColor: isListening ? "red" : "white" },
          ]}
        >
          <Image
            source={MicIcon}
            style={{ tintColor: isListening ? "white" : "black" }}
          />
        </TouchableOpacity>
      </Animated.View>

      <Animated.View
        style={[
          styles.circle,
          { transform: [{ scale: circleScale }], opacity: circleOpacity },
        ]}
      >
        <Text style={styles.circleText}>Voice Chat</Text>
      </Animated.View>

      <TouchableOpacity style={styles.iconRight} onPress={handleBack}>
        <CloseCircleIcon />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.white,
  },
  micButton: {
    borderRadius: 24,
    padding: 15,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  iconRight: {
    position: "absolute",
    bottom: 100,
    right: 20,
  },
  circle: {
    width: 120,
    height: 120,
    borderRadius: 120,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  circleText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default VoiceChatScreen;
