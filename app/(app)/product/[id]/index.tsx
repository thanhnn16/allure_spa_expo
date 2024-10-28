import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Pressable, ScrollView } from "react-native";
import {
  Text,
  AnimatedImage,
  Image,
  TouchableOpacity,
  View,
} from "react-native-ui-lib";
import ImageView from "react-native-image-viewing";

import {
  Carousel,
  PageControlPosition,
} from "react-native-ui-lib/src/components/carousel";
import HeartIcon from "@/assets/icons/heart.svg";
import HeartFullIcon from "@/assets/icons/heart_full.svg";
import TagIcon from "@/assets/icons/tag.svg";
import LinkIcon from "@/assets/icons/link.svg";
import StarIcon from "@/assets/icons/star.svg";

import SunIcon from "@/assets/icons/sun.svg";
import AppBar from "@/components/app-bar/AppBar";
import i18n from "@/languages/i18n";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { getProductThunk } from "@/redux/features/products/productThunk";
import { unwrapResult } from "@reduxjs/toolkit";
import { Product } from "@/types/product.type";
import ProductDescription from "@/components/product/ProductDescription";
import ProductBottomComponent from "@/components/product/ProductBottomComponent";
import ProductQuantity from "@/components/product/ProductQuantity";

export default function DetailsScreen() {
  const { id } = useLocalSearchParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [images, setImages] = useState<{ uri: string }[]>([]);
  const [index, setIndex] = useState(0);
  const [imageViewIndex, setImageViewIndex] = useState(0);
  const [visible, setIsVisible] = useState(false);
  const [isFavorite, setFavorite] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const getProduct = async (id: string) => {
    try {
      const resultAction = await dispatch(getProductThunk({ id }));
      const result = unwrapResult(resultAction);
      if (result && result.success) {
        console.log("Product detail:", result.data);
        setProduct(result.data);
      }
    } catch (error: any) {
      Alert.alert(
        i18n.t('auth.login.error'),
        error.message || i18n.t('auth.login.unknown_error'),
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    }
  };
  useEffect(() => {
    if (typeof id === 'string') {
      getProduct(id);
    } else if (Array.isArray(id) && id.length > 0) {
      getProduct(id[0]);
    }
  }, [id]);

  const handleOpenImage = (index: number) => {
    setImageViewIndex(index);
    setIsVisible(true);
  };

  const handleFavorite = () => {
    setFavorite(!isFavorite);
  };

  const ImageViewFooterComponent = () => {
    return (
      <View marginB-20 padding-20>
        <Text h2 white>{`${imageViewIndex + 1} / ${images.length}`}</Text>
      </View>
    );
  };

  const createBulletPoints = (lines: string[]) => {
    return lines.map((line, index) => (
      <View key={index} row>
        <Text h2>• </Text>
        <Text h3>{line}</Text>
      </View>
    ));
  };

  const shortText = [
    product?.benefits,
    product?.product_notes,
  ];
  const filteredShortText = shortText.filter((text): text is string => text !== undefined);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View flex bg-$white>
        <AppBar back title="Chi tiết sản phẩm" />
        <View flex>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View
              style={{
                width: "90%",
                height: 200,
                borderRadius: 20,
                overflow: "hidden",
                marginTop: 10,
                alignSelf: "center",
              }}
            >
              <Carousel
                onChangePage={(index: number) => setIndex(index)}
                pageControlPosition={PageControlPosition.OVER}
                pageControlProps={{
                  size: 10,
                  color: "#ffffff",
                  inactiveColor: "#c4c4c4",
                }}
              >
                {images.map((item, index) => (
                  <Pressable onPress={() => handleOpenImage(index)} key={index}>
                    <AnimatedImage
                      animationDuration={1000}
                      source={{ uri: product?.media[index].full_url }}
                      aspectRatio={16 / 9}
                      cover
                      key={index}
                    />
                  </Pressable>
                ))}
              </Carousel>
            </View>
            <ImageView
              images={images}
              imageIndex={0}
              visible={visible}
              onRequestClose={() => setIsVisible(false)}
              onImageIndexChange={(index) => setImageViewIndex(index)}
              key={index}
              swipeToCloseEnabled={true}
              doubleTapToZoomEnabled={true}
              FooterComponent={ImageViewFooterComponent}
            />
            <View padding-20 gap-10>
              <Text h2_bold marginB-10>
                {product?.name}
              </Text>
              <View row marginB-10>
                <Image source={TagIcon} size={24} />
                <Text h2_medium secondary marginL-5>
                  {product?.price ? Number(product.price).toLocaleString("vi-VN") : "0"} VNĐ
                </Text>

                <View flex centerV row gap-15 right>
                  <TouchableOpacity onPress={() => console.log("se cho anh i")}>
                    <Image source={LinkIcon} size={24} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleFavorite()}>
                    {isFavorite ? (
                      <Image source={HeartFullIcon} size={24} />
                    ) : (
                      <Image source={HeartIcon} size={24} />
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              <View row>
                <View row centerV gap-5>
                  <Image source={StarIcon} size={24} />
                  <Text h3_medium>5.0</Text>
                </View>
                <View flex row right>
                  <Text h3_medium> +99 {i18n.t("productDetail.purchases")}</Text>
                </View>
              </View>

              <View row paddingR-20>
                <View>
                  <Image source={SunIcon} size={24} />
                </View>
                <View>{createBulletPoints(filteredShortText)}</View>
              </View>
            </View>

            {/* <ProductQuantity/> */}

            <View marginT-10 marginH-20 paddingR-10>
              <Text h2_medium>
                {i18n.t("productDetail.product_description")}
              </Text>
              <ProductDescription product={product} />
            </View>
          </ScrollView>

          <ProductBottomComponent />
        </View>

      </View>
    </SafeAreaView>
  );
}
