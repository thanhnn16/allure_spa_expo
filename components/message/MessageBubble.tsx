import React from "react";
import { StyleSheet, Image } from "react-native";
import { View, Text, Colors } from "react-native-ui-lib";

interface MessageBubbleProps {
  message: {
    message: string;
    created_at: string;
    attachments?: string[];
  };
  isOwn: boolean;
}

const MessageBubble = ({ message, isOwn }: MessageBubbleProps) => {
  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <View
      style={[
        styles.container,
        isOwn ? styles.ownContainer : styles.otherContainer,
      ]}
    >
      <View
        style={[styles.bubble, isOwn ? styles.ownBubble : styles.otherBubble]}
      >
        {message.message && (
          <Text
            style={[
              styles.message,
              isOwn ? styles.ownMessage : styles.otherMessage,
            ]}
          >
            {message.message}
          </Text>
        )}

        {message.attachments?.map((uri, index) => (
          <Image
            key={index}
            source={{ uri }}
            style={styles.image}
            resizeMode="cover"
          />
        ))}

        <Text style={[styles.time, isOwn ? styles.ownTime : styles.otherTime]}>
          {formatTime(message.created_at)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    maxWidth: "80%",
  },
  ownContainer: {
    alignSelf: "flex-end",
  },
  otherContainer: {
    alignSelf: "flex-start",
  },
  bubble: {
    padding: 12,
    borderRadius: 16,
  },
  ownBubble: {
    backgroundColor: Colors.primary,
  },
  otherBubble: {
    backgroundColor: Colors.grey60,
  },
  message: {
    fontSize: 16,
  },
  ownMessage: {
    color: Colors.white,
  },
  otherMessage: {
    color: Colors.black,
  },
  time: {
    fontSize: 12,
    marginTop: 4,
  },
  ownTime: {
    color: Colors.grey50,
  },
  otherTime: {
    color: Colors.grey40,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 8,
    marginVertical: 4,
  },
});

export default MessageBubble;
