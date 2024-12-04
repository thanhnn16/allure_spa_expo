import { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, Dimensions, Share } from "react-native";
import {
  AnimatedImage,
  View,
  Text,
  Image,
  TouchableOpacity,
  ActionSheet,
  SkeletonView,
  Colors,
  Dialog,
  PanningProvider,
} from "react-native-ui-lib";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { toggleFavoriteThunk } from "@/redux/features/favorite/favoritesThunk";
import { router, useLocalSearchParams } from "expo-router";
import {
  MediaResponeModelParams,
  ServiceDetailResponeModel,
  ServiceDetailResponeParams,
} from "@/types/service.type";
import AxiosInstance from "@/utils/services/helper/axiosInstance";
import { useLanguage } from "@/hooks/useLanguage";

import AppBar from "@/components/app-bar/AppBar";
import ImageView from "react-native-image-viewing";
import ServiceBottomComponent from "@/components/service/ServiceBottomComponent";
import RatingStar from "@/components/rating/RatingStar";
import AppDialog from "@/components/dialog/AppDialog";
import { useAuth } from "@/hooks/useAuth";
import formatCurrency from "@/utils/price/formatCurrency";

// Icons
import SunIcon from "@/assets/icons/sun.svg";
import MapMarkerIcon from "@/assets/icons/map_marker.svg";
import TagIcon from "@/assets/icons/tag.svg";
import LinkIcon from "@/assets/icons/link.svg";
import PhoneCallIcon from "@/assets/icons/phone.svg";
import BlinkingIconText from "@/components/BlinkingIconText";
import ServiceBookingDialog from "@/components/dialog/ServiceBookingDialog";
import { setTempOrder } from "@/redux/features/order/orderSlice";
import { CheckoutOrderItem } from "@/types/order.type";
const ServiceDetailPage = () => {
  const { t } = useLanguage();

  // Hooks and state
  const { id } = useLocalSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const favorites = useSelector((state: RootState) => state.favorite.favorites);
  const { status } = useSelector((state: RootState) => state.favorite);
  const { isGuest } = useAuth();

  // UI state
  const [service, setService] = useState<ServiceDetailResponeModel>();
  const [visible, setIsVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
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

  const [isFavoriteState, setIsFavoriteState] = useState<boolean | undefined>(
    service?.is_favorite
  );

  useEffect(() => {
    const getServiceDetail = async () => {
      const res: ServiceDetailResponeParams = (
        await AxiosInstance().get(`services/${id}`)
      ).data;

      if (res.status_code === 200 && res.data) {
        setService(res.data);
        setPrice(res.data.single_price);
        setMedia(res.data.media);
        setIsFavoriteState(res.data.is_favorite);
      }
      setIsLoading(false);
    };
    getServiceDetail();
  }, [id]);

  // Memoized values
  const images = useMemo(() => {
    if (!media || media.length === 0) return [];
    return media.map((item) => ({ uri: item.full_url }));
  }, [media]);

  const isFavorite = favorites.some(
    (fav: { item_id: number | undefined; type: string }) =>
      fav.item_id === service?.id && fav.type === "service"
  );

  // Handlers
  const handleOpenImage = (index: number) => {
    setImageViewIndex(index);
    setIsVisible(true);
  };

  const handleShare = async () => {
    if (!service) return;
    if (service.media && service.media.length > 0) {
      const media = service.media[0];
      if (media.full_url) {
        try {
          await Share.share({
            message: media.full_url,
          });
        } catch (error) {
          console.error("Error sharing:", error);
        }
      }
    }
  };

  const handleToggleFavorite = async () => {
    if (isGuest) {
      setFavoriteDialog(true);
      return;
    }
    setIsFavoriteState((prev) => !prev);
    await dispatch(
      toggleFavoriteThunk({
        type: "service",
        itemId: service?.id,
      })
    );
    setIsFavoriteState(status === "added");
  };

  const renderHeartIcon = () => {
    return isFavoriteState ? (
      <Ionicons name="heart" size={24} color={Colors.primary} />
    ) : (
      <Ionicons name="heart-outline" size={24} color={Colors.primary} />
    );
  };

  const handleLoginConfirm = () => {
    setBuyProductDialog(false);
    router.replace("/(auth)");
  };

  const handleGuestPurchase = () => {
    if (isGuest) {
      setBuyProductDialog(true);
    }
  };

  const handleBooking = () => {
    setBookingDialog(false);
    router.push({
      pathname: "/(app)/booking",
      params: {
        service_id: service?.id,
        service_name: service?.service_name,
        combo: combo,
      },
    });
  };

  const handlePayment = () => {
    setBookingDialog(false);

    if (!service) {
      console.error("Service data is missing");
      return;
    }

    const price =
      combo === 1
        ? service.combo_5_price
        : combo === 2
          ? service.combo_10_price
          : service.single_price;

    const orderItem: CheckoutOrderItem = {
      item_id: service.id,
      item_type: "service",
      quantity: 1,
      price: price,
      service_type: combo === 1 ? "combo_5" : combo === 2 ? "combo_10" : "single",
      service: service,
      name: service.service_name,
      image: service.media?.[0]?.full_url
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

  const renderItem = (item: { uri: string }, idx: number) => (
    <Pressable
      onPress={() => handleOpenImage(idx)}
      key={`carousel-item-${item.uri}-${idx}`}
    >
      <AnimatedImage
        animationDuration={1000}
        source={{ uri: item.uri }}
        aspectRatio={16 / 9}
        cover
      />
    </Pressable>
  );

  // Update price based on combo selection
  useMemo(() => {
    switch (combo) {
      case 1:
        setPrice(service?.combo_5_price);
        setComboName(t("package.combo5_discount"));
        break;
      case 2:
        setPrice(service?.combo_10_price);
        setComboName(t("package.combo10_discount"));
        break;
      default:
        setPrice(service?.single_price);
        setComboName(t("package.single_no_discount"));
        break;
    }
  }, [combo, service, t]);

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
              backgroundColor: Colors.primary + "10",
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
              backgroundColor: Colors.primary + "10",
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
              backgroundColor: Colors.primary + "10",
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

  return (
    <View flex bg-$white>
      <AppBar back title={t("service.service_details")} />
      {isLoading
        ? renderSkeletonView()
        : service && (
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
                  {/* <Carousel
                                    key={`carousel-${images.length}`}
                                    autoplay
                                    loop={images.length > 1}
                                    onChangePage={(index: number) => setIndex(index)}
                                    pageControlPosition={PageControlPosition.OVER}
                                    pageControlProps={{
                                        size: 10,
                                        color: "#ffffff",
                                        inactiveColor: "#c4c4c4",
                                    }}
                                >
                                    {images.map((item, idx) => renderItem(item, idx))}
                                </Carousel> */}
                  <Image
                    source={require("@/assets/images/logo/logo.png")}
                    style={{ width: "100%", height: 200 }}
                  />
                </View>

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
                    {service?.service_name}
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
                        rating={service?.rating_summary.average_rating ?? 0}
                      />
                      <Text h3_medium>
                        {service?.rating_summary.average_rating}
                      </Text>
                    </View>
                    <View flex row right>
                      <Text h3_medium>
                        {service?.rating_summary.total_ratings}{" "}
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
                      <Text h3>{service?.description}</Text>
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
              service={{ ...service, combo: selectedCombo }}
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
                singlePrice={service?.single_price}
                combo5Price={service?.combo_5_price}
                combo10Price={service?.combo_10_price}
            />
          </View>
        )}
    </View>
  );
};

export default ServiceDetailPage;
