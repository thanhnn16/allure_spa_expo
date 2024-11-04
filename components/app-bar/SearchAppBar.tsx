import { Pressable, StyleSheet } from "react-native";
import { Text, View, Image } from "react-native-ui-lib";
import React from "react";

import BackIcon from "@/assets/icons/arrow_left.svg";
import MenuIcon from "@/assets/icons/menu.svg";
import { router } from "expo-router";

const SearchAppBar = () => {
  return (
    <View
      centerV
      row
      width={"100%"}
      height={60}
      style={{ flexDirection: "row", justifyContent: "space-between" }}
    >
      <Pressable onPress={() => router.back()}>
        <View row gap-10 centerV>
          <Image source={BackIcon} />
          <Text h1_bold primary>
            Search
          </Text>
        </View>
      </Pressable>
    </View>
  );
};

export default SearchAppBar;

const styles = StyleSheet.create({});
