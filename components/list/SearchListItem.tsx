import React from "react";
import { StyleSheet } from "react-native";
import { View, Text, Image, TouchableOpacity } from "react-native-ui-lib";
import { Product } from "@/types/product.type";
import { ServiceResponeModel } from "@/types/service.type";
import { router } from "expo-router";
import { useDispatch } from "react-redux";
import { setCurrentSearchText } from "@/redux/features/search/searchSlice";

interface SearchListItemProps {
  item: Product | ServiceResponeModel | string;
  type: "product" | "service";
}

const SearchListItem = ({ item, type }: SearchListItemProps) => {
  const dispatch = useDispatch();

  const getTitle = () => {
    return type === "product"
      ? (item as Product).name
      : (item as ServiceResponeModel).service_name;
  };

  const getPrice = () => {
    return type === "product"
      ? (item as Product).price
      : (item as ServiceResponeModel).single_price;
  };

  const getImage = () => {
    return type === "product"
      ? (item as Product).media?.[0]?.full_url
      : (item as ServiceResponeModel).media?.[0]?.full_url;
  };

  const handlePress = () => {
    if (typeof item === "string") {
      dispatch(setCurrentSearchText(item));
    } else {
      if (type === "product") {
        router.push(`/product/${item.id}`);
      } else {
        router.push(`/service/${item.id}`);
      }
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <Image
        source={{ uri: getImage() }}
        style={styles.image}
        defaultSource={require("@/assets/images/home/product1.png")}
      />
      <View flex>
        <Text h3 numberOfLines={1}>
          {getTitle()}
        </Text>
        <Text body_regular marginT-4>
          {Number(getPrice()).toLocaleString("vi-VN")}đ
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 12,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    marginBottom: 8,
    alignItems: "center",
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
});

export default SearchListItem;
