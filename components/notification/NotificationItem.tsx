import React from "react";
import { Image } from "react-native";
import {
  View,
  Text,
  TouchableOpacity,
  ListItem,
  Colors,
} from "react-native-ui-lib";

type NotificationType = "success" | "cancel" | "reschedule";

interface NotificationItemProps {
  id: string;
  type: NotificationType;
  title: string;
  content: string;
  time: string;
  isRead: boolean;
  onPress?: () => void;
}

const notificationTypeMap: Record<
  NotificationType,
  { backgroundColor: string; icon: any }
> = {
  success: {
    backgroundColor: Colors.green30,
    icon: require("@/assets/images/home/icons/calendartick.png"),
  },
  cancel: {
    backgroundColor: Colors.red30,
    icon: require("@/assets/images/home/icons/calendarremove.png"),
  },
  reschedule: {
    backgroundColor: Colors.gray30,
    icon: require("@/assets/images/home/icons/calendaredit.png"),
  },
};

const NotificationItem: React.FC<NotificationItemProps> = ({
  type,
  title,
  content,
  time,
  isRead,
  onPress,
}) => {
  const { backgroundColor, icon } = notificationTypeMap[type];

  return (
    <TouchableOpacity onPress={onPress}>
      <ListItem
        marginV-8
        paddingH-24
        paddingV-12
        style={{
          backgroundColor: isRead ? Colors.white : Colors.grey70,
        }}
      >
        <ListItem.Part left>
          <View width={48} height={48} br100 bg-white center>
            <Image source={icon} width={32} height={32} />
          </View>
        </ListItem.Part>
        <ListItem.Part
          middle
          column
          containerStyle={{ paddingLeft: 16, flexShrink: 1 }}
        >
          <View row spread centerV>
            <Text
              h3
              color={Colors.text}
              style={{ fontWeight: isRead ? "400" : "700" }}
            >
              {title}
            </Text>
            <Text h3 color={Colors.gray}>
              {time}
            </Text>
          </View>
          <Text h3 color={Colors.gray}>
            {content}
          </Text>
        </ListItem.Part>
      </ListItem>
    </TouchableOpacity>
  );
};

export default NotificationItem;
