import { Dimensions, StyleSheet } from "react-native";
import { View, Text, SkeletonView, ExpandableSection, Image } from "react-native-ui-lib";
import React, { useState } from "react";
import { Product } from "@/types/product.type";
import i18n from "@/languages/i18n";

import ArrowDownIcon from "@/assets/icons/arrow-down.svg";
import ProductDescriptionColapable from "./ProductDescriptionColapable";

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

      <ProductDescriptionColapable
        headerText={i18n.t("productDetail.description.brand")}
        childrenText={product?.brand_description}
      />

      <ProductDescriptionColapable
        headerText={i18n.t("productDetail.description.usage")}
        childrenText={product?.usage}
      />

      <ProductDescriptionColapable
        headerText={i18n.t("productDetail.description.benefit")}
        childrenText={product?.benefits}
      />

      <ProductDescriptionColapable
        headerText={i18n.t("productDetail.description.directions")}
        childrenText={product?.directions}
      />

      <ProductDescriptionColapable
        headerText={i18n.t("productDetail.description.storage")}
        childrenText={product?.storage_instructions}
      />

      <ProductDescriptionColapable
        headerText={i18n.t("productDetail.description.product_notes")}
        childrenText={product?.product_notes}
      />

      <ProductDescriptionColapable
        headerText={i18n.t("productDetail.description.ingredient")}
        childrenText={product?.ingredients}
        keyText={product?.key_ingredients}
      />

    </View>
  );
};

export default ProductDescription;

const styles = StyleSheet.create({});
