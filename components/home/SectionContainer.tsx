import i18n from "@/languages/i18n";
import React from "react";
import { FlatList } from "react-native";
import { View, Text, TouchableOpacity } from "react-native-ui-lib";

interface RenderSectionProps {
  title: string;
  data: any;
  renderItem: any;
  onPressMore: any;
}

const RenderSection: React.FC<RenderSectionProps> = ({
  title,
  data,
  renderItem,
  onPressMore,
}) => {
  return (
    <View gap-10 marginV-10>
      <View row spread marginH-20>
        <Text text60BO>{title}</Text>
        <TouchableOpacity onPress={onPressMore}>
          <Text underline style={{ color: "#717658" }}>
            {i18n.t("home.see_more")}
          </Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 10 }}
      />
    </View>
  );
};

export default RenderSection;
