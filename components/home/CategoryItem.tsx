import React from "react";
import { FlatList } from "react-native";
import { TouchableOpacity, Image, View, Text } from "react-native-ui-lib";
import { router } from "expo-router";

interface CategoryItem {
  id: string;
  name: string;
  icon: any;
  url?: string;
}

interface RenderCategoryProps {
  cateData: CategoryItem[];
}

const RenderCategory: React.FC<RenderCategoryProps> = ({ cateData }) => {
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
          <Image source={item.icon} width={32} height={32} />
        </View>
        <Text marginT-5>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View width={"100%"} marginV-12>
      <FlatList
        data={cateData}
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
