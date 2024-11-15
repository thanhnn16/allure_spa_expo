import { router } from "expo-router";
import React from "react";
import { Image } from "react-native";
import { Button, Text, View } from "react-native-ui-lib";

type NotNotificationProps = {
  showHeader?: boolean;
};

const EmptyNotification: React.FC<NotNotificationProps> = ({
  showHeader = true,
}) => {
  return (
    <View flex>
      {showHeader && (
        <View row centerV padding-16>
          <Button
            iconSource={() => (
              <Image
                source={require("@/assets/images/home/arrow_ios.png")}
                style={{ width: 24, height: 24 }}
              />
            )}
            onPress={() => router.back()}
            link
            marginR-16
          />
          <Text text70BO marginL-110>
            Thông báo
          </Text>
        </View>
      )}
      <View flex center>
        <Image
          source={require("@/assets/images/home/icons/notification.png")}
          style={{ width: 300, height: 300 }}
        />
      </View>
    </View>
  );
};

export default EmptyNotification;
