import React, { useMemo } from "react";
import { FlatList } from "react-native";
import { TouchableOpacity, Image, View, Text } from "react-native-ui-lib";
import { router } from "expo-router";
import { translate } from "@/languages/i18n";

interface CategoryItem {
  id: string;
  name: string;
  icon: any;
  url?: string;
}

const RenderCategory: React.FC = () => {
  // Move categories data into component and use useMemo to prevent unnecessary re-renders
  const categories = useMemo(
    () => [
      {
        id: "1",
        name: translate("home.introduce"),
        icon: require("@/assets/images/home/icons/Introduce.png"),
        url: "https://allurespa.com.vn/gioi-thieu/",
      },
      {
        id: "2",
        name: translate("home.voucher"),
        icon: require("@/assets/images/home/icons/Voucher.png"),
        url: "https://allurespa.com.vn/voucher/",
      },
      {
        id: "3",
        name: translate("home.service"),
        icon: require("@/assets/images/home/icons/Service.png"),
        url: "https://allurespa.com.vn/dich-vu/",
      },
      {
        id: "4",
        name: translate("home.product"),
        icon: require("@/assets/images/home/icons/Product.png"),
        url: "https://allurespa.com.vn/san-pham/",
      },
      {
        id: "5",
        name: translate("home.course"),
        icon: require("@/assets/images/home/icons/Course.png"),
        url: "https://allurespa.com.vn/khoa-hoc/",
      },
      {
        id: "6",
        name: translate("home.news"),
        icon: require("@/assets/images/home/icons/News.png"),
        url: "https://allurespa.com.vn/category/tin-tuc/",
      },
    ],
    []
  ); // Empty dependency array since translate is stable

  const handleOpenWebView = (url: string) => {
    router.push({
      pathname: "/webview",
      params: { url },
    });
  };

  const renderCateItem = ({ item }: { item: CategoryItem }) => {
    return (
      <TouchableOpacity
        center
        marginH-12
        onPress={() => {
          if (item.url) {
            handleOpenWebView(item.url);
          }
        }}
      >
        <View
          width={48}
          height={48}
          backgroundColor="#F3F4F6"
          center
          style={{ borderRadius: 30 }}
        >
          {item.icon && <Image source={item.icon} width={32} height={32} />}
        </View>
        <Text marginT-5>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View width={"100%"} marginV-12>
      <FlatList
        data={categories}
        renderItem={renderCateItem}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 12 }}
      />
    </View>
  );
};

export default RenderCategory;
