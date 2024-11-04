import { Pressable, StyleSheet } from "react-native";
import { Text, View, Image } from "react-native-ui-lib";
import { BlurView } from "expo-blur";
import React from "react";

import BackIcon from "@/assets/icons/arrow_left.svg";
import { router } from "expo-router";

interface AppBarProps {
  back?: boolean;
  title: string;
  rightComponent?: React.ReactNode;
}

const AppBar = ({ title, rightComponent, back }: AppBarProps) => {
  return (
    <BlurView intensity={200}>
      <View paddingH-16 row centerV spread>
        {back ? (
          <Pressable onPress={router.back}>
            <View width={48} height={48} centerV>
              <Image source={BackIcon} />
            </View>
          </Pressable>
        ) : (
          <View width={48} height={48} />
        )}
        <Text h2_bold primary flex center>
          {title}
        </Text>
        {rightComponent ? (
          <View width={48} height={48} centerV>
            {rightComponent}
          </View>
        ) : (
          <View width={48} height={48} />
        )}
      </View>
    </BlurView>
  );
};

export default AppBar;
