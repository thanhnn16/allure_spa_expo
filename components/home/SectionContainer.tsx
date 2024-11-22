import i18n from "@/languages/i18n";
import React from "react";
import { FlatList } from "react-native";
import { View, Text, TouchableOpacity } from "react-native-ui-lib";
import { ServiceResponeModel } from "@/types/service.type";

interface RenderSectionProps {
  title: string;
  data: ServiceResponeModel[] | any[];
  renderItem: (props: {
    item: ServiceResponeModel | any;
  }) => React.ReactElement;
  onPressMore: () => void;
}

const SectionContainer: React.FC<RenderSectionProps> = ({
  title,
  data,
  renderItem,
  onPressMore,
}) => {
  return (
    <View gap-10 marginV-10>
      <View row spread paddingH-24>
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
        keyExtractor={(item) => `${item.id}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 16, paddingLeft: 24, marginBottom: 8 }}
      />
    </View>
  );
};

export default SectionContainer;
