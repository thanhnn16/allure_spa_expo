import { useState } from "react";
import { Dimensions, Pressable, StyleSheet } from "react-native";
import {
  View,
  Text,
  ExpandableSection,
  Image,
  TouchableOpacity,
  Colors,
} from "react-native-ui-lib";

import ArrowDownIcon from "@/assets/icons/arrow_down_sm.svg";
import ArrowUpIcon from "@/assets/icons/arrow_up_sm.svg";
import { Ionicons } from "@expo/vector-icons";

interface ProductDescriptionColapableProps {
  headerText: string;
  childrenText: string;
  keyText?: string;
}

const ProductDescriptionColapable = ({
  headerText,
  childrenText,
  keyText,
}: ProductDescriptionColapableProps) => {
  const [expanded, setExpanded] = useState(false);

  const handleArrowIcon = () => {
    return expanded ? (
      <Ionicons name="chevron-up" size={20} color={Colors.primary} />
    ) : (
      <Ionicons name="chevron-down" size={20} color={Colors.primary} />
    );
  };

  return (
    <View marginV-5>
      <ExpandableSection
        expanded={expanded}
        minHeight={55}
        onPress={() => setExpanded(!expanded)}
      >
        {childrenText.length > 80 ? (
          <TouchableOpacity onPress={() => setExpanded(!expanded)}>
            <View row centerV gap-5>
              <Text h3_bold>{headerText}</Text>
              {handleArrowIcon()}
            </View>
          </TouchableOpacity>
        ) : (
          <View row centerV gap-5>
            <Text h3_bold>{headerText}</Text>
          </View>
        )}
        <View row>
          <TouchableOpacity onPress={() => setExpanded(!expanded)}>
            <View row>
              <Text h3>• </Text>
              {expanded ? (
                <Text h3>
                  {keyText ? <Text h3_bold>{keyText}, </Text> : null}
                  {childrenText}
                </Text>
              ) : (
                <Text h3 numberOfLines={2} ellipsizeMode="tail">
                  {keyText ? <Text h3_bold>{keyText}, </Text> : null}
                  {childrenText}
                </Text>
              )}
            </View>
          </TouchableOpacity>
        </View>
      </ExpandableSection>
    </View>
  );
};

export default ProductDescriptionColapable;
