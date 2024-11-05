import { Dimensions, StyleSheet } from "react-native";
import { View, SkeletonView } from "react-native-ui-lib";
import React, { useState } from "react";
import { Product } from "@/types/product.type";
import i18n from "@/languages/i18n";

import ProductDescriptionColapable from "./ProductDescriptionColapable";

interface ProductDescriptionProps {
  product: Product | null;
  isLoading?: boolean;
}

const windowWidth = Dimensions.get("window").width;

const ProductDescription: React.FC<ProductDescriptionProps> = ({
  product,
  isLoading = false,
}) => {
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
        childrenText={product?.brand_description || "N/A"}
      />

      <ProductDescriptionColapable
        headerText={i18n.t("productDetail.description.usage")}
        childrenText={product?.usage || "N/A"}
      />

      <ProductDescriptionColapable
        headerText={i18n.t("productDetail.description.benefit")}
        childrenText={product?.benefits || "N/A"}
      />

      <ProductDescriptionColapable
        headerText={i18n.t("productDetail.description.directions")}
        childrenText={product?.directions || "N/A"}
      />

      <ProductDescriptionColapable
        headerText={i18n.t("productDetail.description.storage")}
        childrenText={product?.storage_instructions || "N/A"}
      />

      <ProductDescriptionColapable
        headerText={i18n.t("productDetail.description.product_notes")}
        childrenText={product?.product_notes || "N/A"}
      />

      <ProductDescriptionColapable
        headerText={i18n.t("productDetail.description.ingredient")}
        childrenText={product?.ingredients || "N/A"}
        keyText={product?.key_ingredients || "N/A"}
      />
    </View>
  );
};

export default ProductDescription;
