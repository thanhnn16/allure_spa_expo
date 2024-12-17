import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Dimensions, Pressable, ScrollView, TextInput } from "react-native";
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
import { useLanguage } from "@/hooks/useLanguage";

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
import { setTempOrder } from "@/redux/features/order/orderSlice";
import { CheckoutOrderItem } from "@/types/order.type";
import HomeHeaderButton from "@/components/buttons/HomeHeaderButton";

export default function DetailsScreen() {
  const { t } = useLanguage();

  const { id } = useLocalSearchParams();
  const [index, setIndex] = useState(0);
  const [imageViewIndex, setImageViewIndex] = useState(0);
  const [visible, setIsVisible] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { isGuest } = useAuth();
  const [buyProductDialog, setBuyProductDialog] = useState(false);
  const [favoriteDialog, setFavoriteDialog] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);

  const user_id = useSelector((state: RootState) => state.user.user?.id);

  const product = useSelector((state: RootState) => state.product.product);

  const { isLoading, media } = useSelector((state: RootState) => state.product);
  const windowWidth = Dimensions.get("window").width;

  const [isFavorite, setIsFavorite] = useState(false);

  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        await Promise.all([
          dispatch(getProductThunk({ product_id: Number(id), user_id })),
        ]);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      } finally {
        setIsInitialLoading(false);
      }
    };

    fetchInitialData();
    return () => {
      dispatch(clearProduct());
    };
  }, [id]);

  useEffect(() => {
    if (product && product.price) {
      setTotalPrice(Number(product.price) * quantity);
    }
  }, [product, quantity]);

  useEffect(() => {
    if (product) {
      setIsFavorite(product?.is_favorite);
    }
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
      Alert.alert(t("common.error"), t("common.something_went_wrong"));
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
        url: `allurespa://product/${product.id}`,
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
    } else {
      handlePurchase();
    }
  };

  const handlePurchase = () => {
    if (!product || !product.price) return;

    const price = parseFloat(product.price.toString());

    const orderItem: CheckoutOrderItem = {
      item_id: product.id,
      item_type: "product",
      quantity: quantity,
      price: price,
      product: product,
    };

    dispatch(
      setTempOrder({
        items: [orderItem],
        totalAmount: price * quantity,
      })
    );

    router.push("/check-out?source=direct");
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

  if (isInitialLoading || isLoading) {
    return (
      <View flex bg-$white>
        <AppBar
          back
          rightComponent={
            <HomeHeaderButton
              onPress={() => router.push("/cart")}
              iconName="cart-outline"
              type="cart"
            />
          }
          title={t("productDetail.title")}
        />
        <View flex>
          <SkeletonView
            height={200}
            width={windowWidth * 0.9}
            style={{
              borderRadius: 20,
              alignSelf: "center",
              marginTop: 10,
            }}
          />
          <View padding-20 gap-10>
            <SkeletonView height={24} width={windowWidth * 0.7} />
            <SkeletonView height={20} width={windowWidth * 0.4} marginT-10 />
            <SkeletonView height={20} width={windowWidth * 0.6} marginT-10 />
          </View>
        </View>
      </View>
    );
  }

  return (
    <View flex bg-$white>
      <AppBar
        back
        rightComponent={
          <HomeHeaderButton
            onPress={() => router.push("/cart")}
            iconName="cart-outline"
            type="cart"
          />
        }
        title={t("productDetail.title")}
      />
      <View flex>
        <ScrollView showsVerticalScrollIndicator={false}>
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
              onChangePage={setIndex}
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
          <View padding-20 gap-10>
            <Text h2_bold marginB-10>
              {product?.name}
            </Text>
            <View row centerV marginB-10>
              <Image source={TagIcon} size={24} />
              <View row gap-4 centerV>
                {product?.price && (
                  <Text
                    h2_medium
                    secondary
                    marginL-5
                  >
                    {formatCurrency({ price: product.price })}
                  </Text>
                )}
                {quantity > 1 && product?.price && (
                  <Text h3 gray marginL-5>
                    {formatCurrency({ price: Number(totalPrice) })}
                  </Text>
                )}
              </View>

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
                <Text h3_medium>{product?.rating_summary.average_rating}</Text>
              </View>
              <View flex row right>
                <Text
                  h3_medium
                  style={product?.quantity <= 0 ? { color: Colors.error } : {}}
                >
                  {product?.quantity <= 0
                    ? t("productDetail.out_of_stock")
                    : `${product?.quantity} ${t("productDetail.available")}`}
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
                  : createBulletPoints([t("productDetail.no_info")])}
                {product?.benefits
                  ? createBulletPoints(product?.product_notes?.split("\n"))
                  : createBulletPoints([t("productDetail.no_info")])}
              </View>
            </View>
          </View>

          <ProductQuantity
            isLoading={isLoading}
            quantity={quantity}
            setQuantity={setQuantity}
            maxQuantity={product?.quantity}
            setTotalPrice={setTotalPrice}
          />

          <View marginT-10 paddingH-20>
            {isLoading ? (
              <SkeletonView height={20} width={windowWidth * 0.45} marginB-10 />
            ) : (
              <Text h2_medium>{t("productDetail.product_description")}</Text>
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
                { width: 60, height: 45, alignSelf: "flex-end", borderRadius: 8, overflow: "hidden" },
                animatedStyle,
              ]}
            />
          </View>
        )}
        <ProductBottomComponent
          isLoading={isLoading}
          product={product}
          onPurchase={isGuest ? handleGuestPurchase : handlePurchase}
          quantity={quantity}
          onAddToCart={() => {
            handlePressAnimOpacity();
          }}
          disabled={product?.quantity <= 0}
        />

        <AppDialog
          visible={buyProductDialog}
          title={t("auth.login.login_required")}
          description={t("auth.login.login_buy_product")}
          closeButtonLabel={t("common.cancel")}
          confirmButtonLabel={t("auth.login.login_now")}
          severity="info"
          onClose={() => setBuyProductDialog(false)}
          onConfirm={handleLoginConfirm}
        />
        <AppDialog
          visible={favoriteDialog}
          title={t("auth.login.login_required")}
          description={t("auth.login.login_favorite")}
          closeButtonLabel={t("common.cancel")}
          confirmButtonLabel={t("auth.login.login_now")}
          severity="info"
          onClose={() => setFavoriteDialog(false)}
          onConfirm={handleLoginConfirm}
        />
      </View>
    </View>
  );
}
