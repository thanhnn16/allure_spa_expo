import { Dimensions, StyleSheet } from "react-native";
import { View, Text, SkeletonView, ExpandableSection, Image } from "react-native-ui-lib";
import React, { useState } from "react";
import { Product } from "@/types/product.type";
import i18n from "@/languages/i18n";

import ArrowDownIcon from "@/assets/icons/arrow-down.svg";

interface ProductDescriptionProps {
  product: Product | null;
  isLoading?: boolean;
}

const windowWidth = Dimensions.get("window").width;

const ProductDescription: React.FC<ProductDescriptionProps> = ({ product, isLoading = false }) => {
  const [ingredientExpanded, setIngredientExpanded] = useState(false);
  if (isLoading) {
    return (
      <View marginT-10>
        <SkeletonView height={20} width={windowWidth * 0.8} marginB-10 />
        <SkeletonView height={20} width={windowWidth * 0.9} marginB-10 />
        <SkeletonView height={20} width={windowWidth * 0.85} marginB-10 />
        <SkeletonView height={20} width={windowWidth * 0.75} marginB-10 />
        <SkeletonView height={20} width={windowWidth * 0.8} marginB-10 />
        <SkeletonView height={20} width={windowWidth * 0.9} marginB-10 />
        <SkeletonView height={20} width={windowWidth * 0.85} marginB-10 />
      </View>
    );
  }

  if (!product) return null;

  return (
    <View marginT-10>
      <View row>
        <Text h2>• </Text>
        <Text h3>
          <Text h3_bold>{i18n.t("productDetail.description.brand")}: </Text>
          {product?.brand_description}
        </Text>
      </View>
      <View row>
        <Text h2>• </Text>
        <Text h3>
          <Text h3_bold>{i18n.t("productDetail.description.usage")}: </Text>
          {product?.usage}
        </Text>
      </View>
      <View row>
        <Text h2>• </Text>
        <Text h3>
          <Text h3_bold>{i18n.t("productDetail.description.benefit")}: </Text>
          {product?.benefits}
        </Text>
      </View>

      <View row>
        <Text h2>• </Text>
        <Text h3>
          <Text h3_bold>
            {i18n.t("productDetail.description.directions")}:{" "}
          </Text>
          {product?.directions}
        </Text>
      </View>
      <View row>
        <Text h2>• </Text>
        <Text h3>
          <Text h3_bold>{i18n.t("productDetail.description.storage")}: </Text>
          {product?.storage_instructions}
        </Text>
      </View>
      <View row>
        <Text h2>• </Text>
        <Text h3>
          <Text h3_bold>
            {i18n.t("productDetail.description.product_notes")}:{" "}
          </Text>
          {product?.product_notes}
        </Text>
      </View>

      <ExpandableSection
        expanded={ingredientExpanded}
        sectionHeader={
          <View style={{ flexDirection: 'row', marginLeft: 13 }}>
            <Text h3_bold>{i18n.t("productDetail.description.ingredient")}{" "}</Text>
            <Image right source={ArrowDownIcon} size={10} />
          </View>
        }
        onPress={() => setIngredientExpanded(!ingredientExpanded)}

      >
        <View row>
          <Text h2>• </Text>
          <Text h3>
            <Text h3_medium>{product?.key_ingredients}, </Text>
            {product?.ingredients}
          </Text>
        </View>
      </ExpandableSection>
      
    </View>
  );
};

export default ProductDescription;

const styles = StyleSheet.create({});
