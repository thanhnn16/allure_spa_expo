import { useLanguage } from "@/hooks/useLanguage";
import { toggleFavoriteThunk } from "@/redux/features/favorite/favoritesThunk";
import { AppDispatch, RootState } from "@/redux/store";
import {
  MediaResponeModelParams,
} from "@/types/service.type";
import { Ionicons } from "@expo/vector-icons";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Alert, Dimensions, Pressable, ScrollView, Share } from "react-native";
import {
  AnimatedImage,
  Colors,
  Dialog,
  Image,
  PageControlPosition,
  PanningProvider,
  SkeletonView,
  Text,
  TouchableOpacity,
  View
} from "react-native-ui-lib";
import { useDispatch, useSelector } from "react-redux";

import AppBar from "@/components/app-bar/AppBar";
import AppDialog from "@/components/dialog/AppDialog";
import RatingStar from "@/components/rating/RatingStar";
import ServiceBottomComponent from "@/components/service/ServiceBottomComponent";
import { useAuth } from "@/hooks/useAuth";
import formatCurrency from "@/utils/price/formatCurrency";
import ImageView from "react-native-image-viewing";

// Icons
import LinkIcon from "@/assets/icons/link.svg";
import MapMarkerIcon from "@/assets/icons/map_marker.svg";
import PhoneCallIcon from "@/assets/icons/phone.svg";
import SunIcon from "@/assets/icons/sun.svg";
import TagIcon from "@/assets/icons/tag.svg";
import BlinkingIconText from "@/components/BlinkingIconText";
import ServiceBookingDialog from "@/components/dialog/ServiceBookingDialog";
import { setTempOrder } from "@/redux/features/order/orderSlice";
import { getServiceDetailThunk } from "@/redux/features/service/getServiceDetailThunk";
import { CheckoutOrderItem } from "@/types/order.type";
import { Carousel } from "react-native-ui-lib/src/components/carousel";
import { Media } from "@/types/media.type";

// Thêm import Animated
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

const ServiceDetailPage = () => {
  const { t } = useLanguage();
  const { signOut } = useAuth();
  const { user } = useSelector((state: RootState) => state.user);

  // Hooks and state
  const { id } = useLocalSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const { isGuest } = useAuth();
  const { serviceDetail, isLoading } = useSelector((state: RootState) => state.service);

  // UI state
  const [visible, setIsVisible] = useState<boolean>(false);
  const [imageViewIndex, setImageViewIndex] = useState<number>(0);
  const [index, setIndex] = useState<number>(0);
  const [price, setPrice] = useState<number>();
  const [comboName, setComboName] = useState<string>("");
  const [media, setMedia] = useState<MediaResponeModelParams[]>([]);
  const [buyProductDialog, setBuyProductDialog] = useState(false);
  const [favoriteDialog, setFavoriteDialog] = useState(false);
  const [bookingDialog, setBookingDialog] = useState(false);

  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [combo, setCombo] = useState<number>(0);
  const [selectedCombo, setSelectedCombo] = useState<number>(0);

  // Window dimensions
  const windowWidth = Dimensions.get("window").width;

  const [isFavorite, setIsFavorite] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Thêm state và animated values cho animation
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

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        await dispatch(getServiceDetailThunk({
          id,
          userId: user?.id
        }));
      } catch (error) {
        console.error("Error fetching initial data:", error);
      } finally {
        setIsInitialLoading(false);
      }
    };

    fetchInitialData();
    return () => {
      // Cleanup if needed
    };
  }, [dispatch, id, user?.id]);

  useEffect(() => {
    if (serviceDetail) {
      setIsFavorite(serviceDetail?.is_favorite);
    }
  }, [serviceDetail]);

  useEffect(() => {
    if (serviceDetail?.media) {
      setMedia(serviceDetail.media);
    }
  }, [serviceDetail]);

  const images = useMemo(() => {
    if (!serviceDetail?.media || serviceDetail.media.length === 0) return [];
    return serviceDetail.media.map((item: Media) => ({ uri: item.full_url }));
  }, [serviceDetail?.media]);


  const handleShare = async () => {
    if (!serviceDetail) return;
    try {
      await Share.share({
        url: `allurespa://service/${serviceDetail.id}`,
      });
    } catch (error) {
      console.error("Error sharing the link:", error);
    }
  };

  const handleToggleFavorite = async () => {
    if (isGuest) {
      setFavoriteDialog(true);
      return;
    }

    try {
      setIsFavorite((prev) => !prev);

      const result = await dispatch(
        toggleFavoriteThunk({
          type: "service",
          itemId: serviceDetail?.id,
        })
      ).unwrap();

      setIsFavorite(result.status === "added");
    } catch (error) {
      setIsFavorite((prev) => !prev);
      console.error("Error toggling favorite:", error);
      Alert.alert(t("common.error"), t("common.something_went_wrong"));
    }
  };

  const renderHeartIcon = () => {
    return isFavorite ? (
      <Ionicons name="heart" size={24} color={Colors.primary} />
    ) : (
      <Ionicons name="heart-outline" size={24} color={Colors.primary} />
    );
  };

  const handleLoginConfirm = () => {
    setBuyProductDialog(false);
    signOut();
  };

  const handleBooking = () => {
    if (isGuest) {
      setBuyProductDialog(true);
      return;
    }

    setBookingDialog(false);
    router.push({
      pathname: "/(app)/booking",
      params: {
        service_id: serviceDetail?.id,
        service_name: serviceDetail?.service_name,
        combo: combo,
      },
    });
  };

  const handlePayment = () => {
    if (isGuest) {
      setBuyProductDialog(true);
      return;
    }

    setBookingDialog(false);

    if (!serviceDetail) {
      console.error("Service data is missing");
      return;
    }

    const price =
      combo === 1
        ? serviceDetail.combo_5_price
        : combo === 2
          ? serviceDetail.combo_10_price
          : serviceDetail.single_price;

    const orderItem: CheckoutOrderItem = {
      item_id: serviceDetail.id,
      item_type: "service",
      quantity: 1,
      price: price,
      service_type: combo === 1 ? "combo_5" : combo === 2 ? "combo_10" : "single",
      service: serviceDetail,
      name: serviceDetail.service_name,
      image: serviceDetail.media?.[0]?.full_url
    };

    dispatch(
      setTempOrder({
        items: [orderItem],
        totalAmount: price,
      })
    );

    router.push("/check-out?source=direct");
  };

  // Components
  const ImageViewFooterComponent = () => (
    <View marginB-20 padding-20>
      <Text h2 white>{`${imageViewIndex + 1} / ${images.length}`}</Text>
    </View>
  );


  // Update price based on combo selection
  useMemo(() => {
    switch (combo) {
      case 1:
        setPrice(serviceDetail?.combo_5_price);
        setComboName(t("package.combo5_discount"));
        break;
      case 2:
        setPrice(serviceDetail?.combo_10_price);
        setComboName(t("package.combo10_discount"));
        break;
      default:
        setPrice(serviceDetail?.single_price);
        setComboName(t("package.single_no_discount"));
        break;
    }
  }, [combo, serviceDetail, t]);

  // Loading skeleton
  const renderSkeletonView = () => {
    return (
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
        <View padding-20 gap-10 flex>
          <SkeletonView height={24} width={windowWidth * 0.7} />
          <SkeletonView height={20} width={windowWidth * 0.4} marginT-10 />
          <SkeletonView height={20} width={windowWidth * 0.6} marginT-10 />
          <SkeletonView
            height={30}
            width={windowWidth * 0.9}
            style={{
              alignSelf: "center",
              marginTop: 90,
            }}
          />
        </View>
        <SkeletonView
          height={50}
          width={windowWidth * 0.9}
          style={{
            alignSelf: "center",
            marginBottom: 10,
          }}
        />
      </View>
    );
  };



  const renderDialogContent = () => (
    <View padding-20 bg-white br30 gap-10>
      <Text text60BO marginB-10 color={Colors.primary}>
        {t("package.select_combo")}
      </Text>
      <TouchableOpacity
        br20
        centerV
        paddingH-20
        paddingV-15
        style={{
          backgroundColor: selectedCombo === 0 ? Colors.primary + "50" : Colors.primary + "10",
        }}
        onPress={() => {
          setCombo(0);
          setSelectedCombo(0);
          setShowDialog(false);
        }}
      >
        <Text h3>
          {t("package.single_no_discount")}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        br20
        centerV
        paddingH-20
        paddingV-15
        style={{
          backgroundColor: selectedCombo === 1 ? Colors.primary + "50" : Colors.primary + "10",
        }}
        onPress={() => {
          setCombo(1);
          setSelectedCombo(1);
          setShowDialog(false);
        }}
      >
        <Text h3>
          {t("package.combo5_discount")}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        br20
        centerV
        paddingH-20
        paddingV-15
        style={{
          backgroundColor: selectedCombo === 2 ? Colors.primary + "50" : Colors.primary + "10",
        }}
        onPress={() => {
          setCombo(2);
          setSelectedCombo(2);
          setShowDialog(false);
        }}
      >
        <Text h3>
          {t("package.combo10_discount")}
        </Text>
      </TouchableOpacity>
    </View>
  );

  // Thêm hàm xử lý animation
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

  const handleOpenImage = (index: number) => {
    setImageViewIndex(index);
    setIsVisible(true);
  };

  return (
    <View flex bg-$white>
      <AppBar back title={t("service.service_details")} />
      {(isInitialLoading || isLoading)
        ? renderSkeletonView()
        : serviceDetail && (
          <View flex>
            <View flex>
              <ScrollView showsVerticalScrollIndicator={false}>
                {/* Image Carousel */}
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
                    key={`carousel-${serviceDetail?.media?.length}`}
                    autoplay
                    loop={serviceDetail?.media?.length > 1}
                    onChangePage={(index: number) => setIndex(index)}
                    pageControlPosition={PageControlPosition.OVER}
                    pageControlProps={{
                      size: 10,
                      color: "#ffffff",
                      inactiveColor: "#c4c4c4",
                    }}
                  >
                    {serviceDetail?.media?.map((item: Media, index: number) => (
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

                {/* Thêm animated image */}
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
                      source={{ uri: serviceDetail?.media?.[index]?.full_url }}
                      style={[
                        { width: 60, height: 45, alignSelf: "flex-end", borderRadius: 8, overflow: "hidden" },
                        animatedStyle,
                      ]}
                    />
                  </View>
                )}

                {/* Image Viewer */}
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

                {/* Service Details */}
                <View padding-20 gap-10>
                  <Text h1_bold marginB-10>
                    {serviceDetail?.service_name}
                  </Text>

                  <View row marginB-10>
                    <Image source={TagIcon} size={24} />
                    <Text h1_medium secondary marginL-5>
                      {formatCurrency({ price: Number(price) })}
                    </Text>

                    <View flex centerV row gap-15 right>
                      <TouchableOpacity onPress={handleShare}>
                        <Image source={LinkIcon} size={24} />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={handleToggleFavorite}>
                        {renderHeartIcon()}
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View row centerV>
                    <View row gap-5>
                      <RatingStar
                        rating={serviceDetail?.rating_summary.average_rating ?? 0}
                      />
                      <Text h3_medium>
                        {serviceDetail?.rating_summary.average_rating}
                      </Text>
                    </View>
                    <View flex row right>
                      <Text h3_medium>
                        {serviceDetail?.rating_summary.total_ratings}{" "}
                        {t("productDetail.reviews")}
                      </Text>
                    </View>
                  </View>
                  {/* Package Selection */}
                  <View gap-20>
                    <Text h2_bold>{t("service.treatment")}</Text>

                    <TouchableOpacity onPress={() => setShowDialog(true)}>
                      <View
                        center
                        row
                        paddingH-20
                        height={50}
                        style={{
                          borderWidth: 1,
                          borderRadius: 10,
                          borderColor: "#E0E0E0",
                        }}
                      >
                        <Text flex h3>
                          {comboName}
                        </Text>
                        <SimpleLineIcons
                          name="arrow-down"
                          size={18}
                          color="#BCBABA"
                        />
                      </View>
                    </TouchableOpacity>
                  </View>

                  {/* Service Description */}
                  <View>
                    <BlinkingIconText />
                  </View>

                  {/* Service Info */}
                  <View row paddingR-20>
                    <View>
                      <Image source={SunIcon} width={18} height={18} />
                    </View>
                    <View row>
                      <Text h3>• </Text>
                      <Text h3>{serviceDetail?.description}</Text>
                    </View>
                  </View>

                  <View row paddingR-20>
                    <View>
                      <Image source={MapMarkerIcon} width={18} height={18} />
                    </View>
                    <View row>
                      <Text h3>• </Text>
                      <Text h3>
                        Tầng 1 Shophouse P1- SH02 Vinhome Central Park, 720A
                        Điện Biên Phủ, Phường 22, Quận Bình Thạnh, HCM
                      </Text>
                    </View>
                  </View>

                  <View row paddingR-20>
                    <View>
                      <Image source={PhoneCallIcon} width={18} height={18} />
                    </View>
                    <View row>
                      <Text h3>• </Text>
                      <Text h3>+84986910920 (Zalo) | +84889130222</Text>
                    </View>
                  </View>
                </View>

                {/* Package Selection Dialog */}
                <Dialog
                  visible={showDialog}
                  onDismiss={() => setShowDialog(false)}
                  panDirection={PanningProvider.Directions.DOWN}
                >
                  {renderDialogContent()}
                </Dialog>
              </ScrollView>
            </View>

            {/* Bottom Actions */}
            <ServiceBottomComponent
              isLoading={isLoading}
              onPurchase={() => setBookingDialog(true)}
              service={{ ...serviceDetail, combo: selectedCombo }}
            />

            {/* Dialogs */}
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

            <ServiceBookingDialog
              visible={bookingDialog}
              title={t("service.serviceDetail.book_now")}
              closeButtonLabel={t("common.cancel")}
              confirmButtonLabel={t("service.book_now")}
              secondaryConfirmButtonLabel={t("checkout.pay_online")}
              severity="info"
              onClose={() => {
                setBookingDialog(false);
              }}
              onConfirm={handleBooking}
              onConfrimSecondary={handlePayment}
              closeButton={true}
              confirmButton={true}
              secondaryConfirmButton={true}
              showActionSheet={showDialog}
              setShowActionSheet={setShowDialog}
              setCombo={(selectedCombo) => {
                setCombo(selectedCombo);
                setSelectedCombo(selectedCombo);
              }}
              selectedCombo={selectedCombo}
              singlePrice={serviceDetail?.single_price}
              combo5Price={serviceDetail?.combo_5_price}
              combo10Price={serviceDetail?.combo_10_price}
            />
          </View>
        )}
    </View>
  );
};

export default ServiceDetailPage;
