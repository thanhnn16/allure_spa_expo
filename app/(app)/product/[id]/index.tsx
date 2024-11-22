import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Dimensions, Pressable, ScrollView } from "react-native";
import {
  Text,
  AnimatedImage,
  Image,
  TouchableOpacity,
  View,
  Colors,
} from "react-native-ui-lib";
import ImageView from "react-native-image-viewing";
import { SkeletonView } from "react-native-ui-lib";
import { Share } from "react-native";
import {
  Carousel,
  PageControlPosition,
} from "react-native-ui-lib/src/components/carousel";
import TagIcon from "@/assets/icons/tag.svg";
import LinkIcon from "@/assets/icons/link.svg";
import SunIcon from "@/assets/icons/sun.svg";
import AppBar from "@/components/app-bar/AppBar";
import i18n from "@/languages/i18n";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { getProductThunk } from "@/redux/features/products/productThunk";
import ProductDescription from "@/components/product/ProductDescription";
import ProductBottomComponent from "@/components/product/ProductBottomComponent";
import ProductQuantity from "@/components/product/ProductQuantity";
import AppDialog from "@/components/dialog/AppDialog";
import { useAuth } from "@/hooks/useAuth";
import RatingStar from "@/components/rating/RatingStar";
import formatCurrency from "@/utils/price/formatCurrency";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
  withTiming,
  ReduceMotion,
} from "react-native-reanimated";
import { toggleFavoriteThunk } from "@/redux/features/favorite/favoritesThunk";
import { Media } from "@/types/media.type";

import { Ionicons } from "@expo/vector-icons";
import { clearProduct } from "@/redux/features/products/productSlice";

export default function DetailsScreen() {
  const { id } = useLocalSearchParams();
  const [index, setIndex] = useState(0);
  const [imageViewIndex, setImageViewIndex] = useState(0);
  const [visible, setIsVisible] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { isGuest } = useAuth();
  const [buyProductDialog, setBuyProductDialog] = useState(false);
  const [favoriteDialog, setFavoriteDialog] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const user_id = useSelector((state: RootState) => state.auth.user?.id);

  const status = useSelector((state: RootState) => state.favorite.status);

  const { product, isLoading, media } = useSelector(
    (state: RootState) => state.product
  );
  const windowWidth = Dimensions.get("window").width;

  const [isFavorite, setIsFavorite] = useState(product?.is_favorite);

  useEffect(() => {
    dispatch(getProductThunk({ product_id: Number(id), user_id }));
    return () => {
      dispatch(clearProduct());
    };
  }, [id]);

  useEffect(() => {
    setIsFavorite(product?.is_favorite);
  }, [product]);

  const handleOpenImage = (index: number) => {
    setImageViewIndex(index);
    setIsVisible(true);
  };

  const favoriteScale = useSharedValue(1);

  const favoriteAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: favoriteScale.value }],
    };
  });

  const handleFavorite = async () => {
    if (isGuest) {
      setFavoriteDialog(true);
      return;
    }
    try {
      setIsFavorite((prev: boolean) => !prev);

      favoriteScale.value = withSequence(
        withSpring(1.3, { damping: 2, stiffness: 80 }),
        withSpring(1, { damping: 2, stiffness: 80 })
      );

      const result = await dispatch(
        toggleFavoriteThunk({
          type: "product",
          itemId: product?.id,
        })
      ).unwrap();

      setIsFavorite(result.status === "added");
    } catch (error) {
      setIsFavorite((prev: boolean) => !prev);
      console.error("Error toggling favorite:", error);
      Alert.alert(
        i18n.t("common.error"),
        i18n.t("common.something_went_wrong")
      );
    }
  };

  const renderHeartIcon = () => {
    return (
      <Animated.View
        style={[
          favoriteAnimatedStyle,
          { transform: [{ scale: favoriteScale }] },
        ]}
      >
        <Pressable
          onPressIn={() => {
            favoriteScale.value = withSpring(0.8);
          }}
          onPressOut={() => {
            favoriteScale.value = withSpring(1);
          }}
          onPress={handleFavorite}
        >
          {isFavorite ? (
            <Ionicons name="heart" size={24} color={Colors.primary} />
          ) : (
            <Ionicons name="heart-outline" size={24} color={Colors.primary} />
          )}
        </Pressable>
      </Animated.View>
    );
  };

  const handleShare = async () => {
    if (!product) return;
    try {
      await Share.share({
        message: `allurespa://product/${product.id}`,
      });
    } catch (error) {
      console.error("Error sharing the link:", error);
    }
  };

  const ImageViewFooterComponent = () => {
    return (
      <View marginB-20 padding-20>
        <Text h2 white>{`${imageViewIndex + 1} / ${media.length}`}</Text>
      </View>
    );
  };

  const createBulletPoints = (line: string[]) => {
    return line.map((index) => (
      <View key={index} row>
        <Text h3>• </Text>
        <Text h3>{line}</Text>
      </View>
    ));
  };

  const handleGuestPurchase = () => {
    if (isGuest) {
      setBuyProductDialog(true);
    }
  };

  const handleLoginConfirm = () => {
    setBuyProductDialog(false);
    router.replace("/(auth)");
  };

  const [showAnimatedImage, setShowAnimatedImage] = useState(false);
  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);
  const scale = useSharedValue(2);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: translateY.value },
        { translateX: translateX.value },
      ],
      opacity: opacity.value,
    };
  });

  const handlePressAnimOpacity = () => {
    "worklet";
    runOnJS(setShowAnimatedImage)(true);
    translateY.value = withTiming(
      -Dimensions.get("window").height * 0.1,
      {
        duration: 650,
        easing: Easing.exp,
        reduceMotion: ReduceMotion.System,
      },
      () => {
        runOnJS(setShowAnimatedImage)(false);
      }
    );
    scale.value = withTiming(0.01, {
      duration: 300,
      easing: Easing.exp,
      reduceMotion: ReduceMotion.System,
    });
    opacity.value = withTiming(
      0,
      {
        duration: 1000,
        easing: Easing.exp,
        reduceMotion: ReduceMotion.System,
      },
      () => {
        runOnJS(setShowAnimatedImage)(false);
        translateY.value = 0;
        translateX.value = 0;
        scale.value = 2;
        opacity.value = 1;
      }
    );
  };

  return (
    <View flex bg-$white>
      <AppBar back rightComponent title={i18n.t("productDetail.title")} />
      <View flex>
        <ScrollView showsVerticalScrollIndicator={false}>
          {isLoading ? (
            <SkeletonView
              height={200}
              width={windowWidth * 0.9}
              style={{
                borderRadius: 20,
                alignSelf: "center",
                marginTop: 10,
              }}
            />
          ) : (
            <View
              width={windowWidth * 0.9}
              style={{
                alignSelf: "center",
                overflow: "hidden",
              }}
              height={200}
              br50
              marginT-10
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
                {media.map((item: Media, index: number) => (
                  <Pressable onPress={() => handleOpenImage(index)} key={index}>
                    <AnimatedImage
                      animationDuration={1000}
                      source={{ uri: item.full_url }}
                      aspectRatio={16 / 9}
                      cover
                      key={index}
                    />
                  </Pressable>
                ))}
              </Carousel>
            </View>
          )}
          <ImageView
            images={media.map((item: Media) => ({ uri: item.full_url })) ?? []}
            imageIndex={imageViewIndex}
            visible={visible}
            onRequestClose={() => setIsVisible(false)}
            onImageIndexChange={(index) => setImageViewIndex(index)}
            swipeToCloseEnabled={true}
            doubleTapToZoomEnabled={true}
            FooterComponent={ImageViewFooterComponent}
          />
          {isLoading ? (
            <View padding-20 gap-10>
              <SkeletonView height={24} width={windowWidth * 0.7} />
              <SkeletonView height={20} width={windowWidth * 0.4} marginT-10 />
              <SkeletonView height={20} width={windowWidth * 0.6} marginT-10 />
            </View>
          ) : (
            <View padding-20 gap-10>
              <Text h2_bold marginB-10>
                {product?.name}
              </Text>
              <View row marginB-10>
                <Image source={TagIcon} size={24} />
                <Text h2_medium secondary marginL-5>
                  {formatCurrency({ price: Number(product?.price) })}
                </Text>

                <View flex centerV row gap-15 right>
                  <TouchableOpacity onPress={handleShare}>
                    <Image source={LinkIcon} size={24} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleFavorite}>
                    {renderHeartIcon()}
                  </TouchableOpacity>
                </View>
              </View>

              <View row centerV>
                <View row gap-5>
                  <RatingStar
                    rating={product?.rating_summary.average_rating ?? 0}
                  />
                  <Text h3_medium>
                    {product?.rating_summary.average_rating}
                  </Text>
                </View>
                <View flex row right>
                  <Text h3_medium>
                    {product?.quantity} {i18n.t("productDetail.available")}
                  </Text>
                </View>
              </View>

              <View row paddingR-20>
                <View>
                  <Image source={SunIcon} size={24} />
                </View>
                <View>
                  {product?.benefits
                    ? createBulletPoints(product.benefits.split("\n"))
                    : createBulletPoints([i18n.t("productDetail.no_info")])}
                  {product?.benefits
                    ? createBulletPoints(product?.product_notes?.split("\n"))
                    : createBulletPoints([i18n.t("productDetail.no_info")])}
                </View>
              </View>
            </View>
          )}

          <ProductQuantity
            isLoading={isLoading}
            quantity={quantity}
            setQuantity={setQuantity}
            maxQuantity={product?.quantity}
          />

          <View marginT-10 paddingH-20>
            {isLoading ? (
              <SkeletonView height={20} width={windowWidth * 0.45} marginB-10 />
            ) : (
              <Text h2_medium>
                {i18n.t("productDetail.product_description")}
              </Text>
            )}
            <ProductDescription product={product} isLoading={isLoading} />
          </View>
        </ScrollView>
        {showAnimatedImage && (
          <View
            backgroundColor={Colors.transparent}
            style={{
              position: "absolute",
              right: 20,
              top: 50,
            }}
          >
            <Animated.Image
              source={{ uri: media[index].full_url }}
              style={[
                { width: 60, height: 45, alignSelf: "flex-end" },
                animatedStyle,
              ]}
            />
          </View>
        )}
        <ProductBottomComponent
          isLoading={isLoading}
          product={product}
          onPurchase={isGuest ? handleGuestPurchase : undefined}
          quantity={quantity}
          onAddToCart={() => {
            handlePressAnimOpacity();
          }}
        />

        <AppDialog
          visible={buyProductDialog}
          title={i18n.t("auth.login.login_required")}
          description={i18n.t("auth.login.login_buy_product")}
          closeButtonLabel={i18n.t("common.cancel")}
          confirmButtonLabel={i18n.t("auth.login.login_now")}
          severity="info"
          onClose={() => setBuyProductDialog(false)}
          onConfirm={handleLoginConfirm}
        />
        <AppDialog
          visible={favoriteDialog}
          title={i18n.t("auth.login.login_required")}
          description={i18n.t("auth.login.login_favorite")}
          closeButtonLabel={i18n.t("common.cancel")}
          confirmButtonLabel={i18n.t("auth.login.login_now")}
          severity="info"
          onClose={() => setFavoriteDialog(false)}
          onConfirm={handleLoginConfirm}
        />
      </View>
    </View>
  );
}
