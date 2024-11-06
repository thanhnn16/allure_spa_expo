import { StyleSheet, Image, ActivityIndicator, TextStyle } from "react-native";
import { View, Text, Colors } from "react-native-ui-lib";
import Markdown from "react-native-markdown-display";

interface MessageBubbleProps {
  message: {
    id: string;
    message: string;
    sender_id: string;
    created_at: string;
    attachments?: string[];
    sending?: boolean;
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
      <View style={[styles.bubbleWrapper]}>
        <View
          style={[styles.bubble, isOwn ? styles.ownBubble : styles.otherBubble]}
        >
          {message.message && (
            <Markdown
              style={{
                body: StyleSheet.compose(
                  styles.text,
                  isOwn ? styles.ownText : styles.otherText
                ) as TextStyle,
                paragraph: { marginVertical: 0 } as TextStyle,
                link: {
                  color: isOwn ? Colors.grey50 : Colors.primary,
                } as TextStyle,
                code_block: {
                  backgroundColor: isOwn
                    ? Colors.rgba(Colors.white, 0.1)
                    : Colors.grey70,
                  padding: 8,
                  borderRadius: 4,
                } as TextStyle,
                code_inline: {
                  backgroundColor: isOwn
                    ? Colors.rgba(Colors.white, 0.1)
                    : Colors.grey70,
                  padding: 4,
                  borderRadius: 2,
                } as TextStyle,
              }}
            >
              {message.message}
            </Markdown>
          )}

          {message.attachments?.map((uri, index) => (
            <Image
              key={index}
              source={{ uri }}
              style={styles.image}
              resizeMode="cover"
            />
          ))}

          <Text
            style={[styles.time, isOwn ? styles.ownTime : styles.otherTime]}
          >
            {formatTime(message.created_at)}
          </Text>
        </View>

        {message.sending && (
          <ActivityIndicator
            size="small"
            color={Colors.grey40}
            style={styles.loadingIndicator}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    maxWidth: "80%",
  },
  bubbleWrapper: {
    flexDirection: "row",
    alignItems: "center",
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
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: Colors.grey60,
    borderBottomLeftRadius: 4,
  },
  text: {
    fontSize: 16,
  },
  ownText: {
    color: Colors.white,
  },
  otherText: {
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
  loadingIndicator: {
    marginLeft: 8,
    marginRight: 8,
  },
});

export default MessageBubble;
