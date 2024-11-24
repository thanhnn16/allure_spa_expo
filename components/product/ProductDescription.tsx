import { Dimensions } from "react-native";
import { View, SkeletonView } from "react-native-ui-lib";
import React from "react";
import { Product } from "@/types/product.type";
import { useLanguage } from "@/hooks/useLanguage";


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
  const { t } = useLanguage();

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
        headerText={t("productDetail.description.brand")}
        childrenText={
          product?.brand_description || t("productDetail.no_info")
        }
      />

      <ProductDescriptionColapable
        headerText={t("productDetail.description.usage")}
        childrenText={product?.usage || t("productDetail.no_info")}
      />

      <ProductDescriptionColapable
        headerText={t("productDetail.description.benefit")}
        childrenText={product?.benefits || t("productDetail.no_info")}
      />

      <ProductDescriptionColapable
        headerText={t("productDetail.description.directions")}
        childrenText={product?.directions || t("productDetail.no_info")}
      />

      <ProductDescriptionColapable
        headerText={t("productDetail.description.storage")}
        childrenText={
          product?.storage_instructions || t("productDetail.no_info")
        }
      />

      <ProductDescriptionColapable
        headerText={t("productDetail.description.product_notes")}
        childrenText={product?.product_notes || t("productDetail.no_info")}
      />

      <ProductDescriptionColapable
        headerText={t("productDetail.description.ingredient")}
        childrenText={product?.ingredients || t("productDetail.no_info")}
        keyText={product?.key_ingredients || ""}
      />
    </View>
  );
};

export default ProductDescription;
