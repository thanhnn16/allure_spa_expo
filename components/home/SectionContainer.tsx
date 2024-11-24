import { useLanguage } from "@/hooks/useLanguage";

import React from "react";
import { FlatList, ActivityIndicator } from "react-native";
import { View, Text, TouchableOpacity } from "react-native-ui-lib";
import { ServiceResponeModel } from "@/types/service.type";

interface RenderSectionProps {
  title: string;
  data: ServiceResponeModel[] | any[];
  renderItem: (props: {
    item: ServiceResponeModel | any;
  }) => React.ReactElement;
  onPressMore: () => void;
  onEndReached?: () => void;
  isLoadingMore?: boolean;
}

const SectionContainer: React.FC<RenderSectionProps> = ({
  title,
  data,
  renderItem,
  onPressMore,
  onEndReached,
  isLoadingMore,
}) => {
  const { t } = useLanguage();

  return (
    <View gap-10 marginV-10>
      <View row spread paddingH-24>
        <Text text60BO>{title}</Text>
        <TouchableOpacity onPress={onPressMore}>
          <Text underline style={{ color: "#717658" }}>
            {t("home.see_more")}
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
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        ListFooterComponent={isLoadingMore ? (
          <View center paddingH-16>
            <ActivityIndicator />
          </View>
        ) : null}
      />
    </View>
  );
};

export default SectionContainer;
