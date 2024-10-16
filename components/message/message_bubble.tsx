import { StyleSheet } from 'react-native'
import { Colors, Text, View } from 'react-native-ui-lib'

interface MessageBubbleProps {
    id: string;
    text: string;
    sender: string;
    time: string;
}

const MessageBubble = ({ item }: { item: MessageBubbleProps }) => {
    const currentTime = new Date();
    const messageTime = new Date(item.time);

    // Check if the message time is within 1 hour from now
    const isRecent = (currentTime.getTime() - messageTime.getTime()) <= 3600000;

    return (
        <View>
            {isRecent && (
                <Text h3 style={styles.timeText}>
                    {messageTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} {/* Display time */}
                </Text>
            )}
            <View
                style={[
                    styles.messageContainer,
                    item.sender === 'user' ? styles.userMessage : styles.supportMessage,
                    { alignSelf: item.sender === 'user' ? 'flex-end' : 'flex-start' }
                ]}
            >

                <Text
                    h2
                    style={
                        item.sender === 'user' ? styles.userMessageText : styles.supportMessageText
                    }
                >
                    {item.text}
                </Text>
            </View>
        </View>
    )
}

export default MessageBubble

const styles = StyleSheet.create({
    messageContainer: {
        marginVertical: 4,
        padding: 10,
        borderRadius: 10,
        maxWidth: '80%',
    },
    userMessage: {
        backgroundColor: Colors.primary,
        alignSelf: 'flex-end',
    },
    supportMessage: {
        backgroundColor: '#f1f1f1',
        alignSelf: 'flex-start',
    },
    userMessageText: {
        color: Colors.white,
    },
    supportMessageText: {
        color: Colors.black,
    },
    timeText: {
        color: Colors.gray,
        marginBottom: 4,
        marginHorizontal: 10,
        textAlign: 'center'
    },
})
