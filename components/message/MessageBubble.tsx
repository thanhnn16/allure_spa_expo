import { StyleSheet, Image, ActivityIndicator, TextStyle } from "react-native";
import { View, Text, Colors } from "react-native-ui-lib";
import Markdown from "react-native-markdown-display";

interface MessageProps {
  id: string;
  message: string;
  sender_id: string;
  created_at: string;
  attachments?: string[];
  sending?: boolean;
}

interface MessageBubbleProps {
  message: MessageProps;
  isOwn: boolean;
  isThinking?: boolean;
}

const MessageBubble = ({ message, isOwn, isThinking }: MessageBubbleProps) => {
  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Kiểm tra và đảm bảo message là string
  const messageText = typeof message.message === 'string' ? message.message : '';

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
          {!isThinking && (
            <>
              {messageText && (
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
                  {messageText}
                </Markdown>
              )}

              {message.attachments?.map((attachment, index) => (
                <Image
                  key={index}
                  source={{ 
                    uri: attachment.startsWith('data:') 
                      ? attachment 
                      : `data:image/jpeg;base64,${attachment}`
                  }}
                  style={styles.attachmentImage}
                />
              ))}

              <Text
                style={[styles.time, isOwn ? styles.ownTime : styles.otherTime]}
              >
                {formatTime(message.created_at)}
              </Text>
            </>
          )}

          {isThinking && (
            <View style={styles.thinkingContainer}>
              <View style={styles.thinkingDot} />
              <View style={styles.thinkingDot} />
              <View style={styles.thinkingDot} />
            </View>
          )}
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
  thinkingContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    gap: 4,
  },
  thinkingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.grey40,
    opacity: 0.6,
    transform: [{ scale: 1 }],
  },
  attachmentImage: {
    width: 200,
    height: 200,
    borderRadius: 8,
    marginVertical: 4,
  },
});

export default MessageBubble;
