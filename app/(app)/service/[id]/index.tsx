import React, { useEffect, useMemo, useState, useRef } from "react";
import { Animated, Pressable, ScrollView, Dimensions, Share } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
    AnimatedImage,
    Carousel,
    PageControlPosition,
    View,
    Text,
    Image,
    TouchableOpacity,
    ActionSheet,
    SkeletonView,
} from "react-native-ui-lib";
import AntDesign from "@expo/vector-icons/AntDesign";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import { Feather } from "@expo/vector-icons";
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { toggleFavoriteThunk } from '@/redux/features/favorite/favoritesThunk';
import { router, useLocalSearchParams, Href } from "expo-router";
import { MediaResponeModelParams, ServiceDetailResponeModel, ServiceDetailResponeParams } from "@/types/service.type";
import AxiosInstance from "@/utils/services/helper/axiosInstance";
import i18n from "@/languages/i18n";
import AppBar from "@/components/app-bar/AppBar";
import ImageView from "react-native-image-viewing";
import AppButton from "@/components/buttons/AppButton";
import ServiceBottomComponent from "@/components/service/ServiceBottomComponent";
import RatingStar from "@/components/rating/RatingStar";
import AppDialog from "@/components/dialog/AppDialog";
import { useAuth } from "@/hooks/useAuth";
import formatCurrency from "@/utils/price/formatCurrency";

// Icons
import CommentIcon from "@/assets/icons/comment.svg";
import SunIcon from "@/assets/icons/sun.svg"; 
import TicketIcon from "@/assets/icons/ticket.svg";
import HeartIcon from "@/assets/icons/heart.svg";
import MapMarkerIcon from "@/assets/icons/map_marker.svg";
import HeartFullIcon from "@/assets/icons/heart_full.svg";
import TagIcon from "@/assets/icons/tag.svg";
import LinkIcon from "@/assets/icons/link.svg";
import PhoneCallIcon from "@/assets/icons/phone.svg";

// Main component
const ServiceDetailPage = () => {
    // Hooks and state
    const { id } = useLocalSearchParams();
    const dispatch = useDispatch<AppDispatch>();
    const favorites = useSelector((state: RootState) => state.favorite.favorites);
    const { status } = useSelector((state: RootState) => state.favorite);
    const { isGuest } = useAuth();
    
    // UI state
    const [service, setService] = useState<ServiceDetailResponeModel>();
    const [visible, setIsVisible] = useState<boolean>(false);
    const [showActionSheet, setShowActionSheet] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [imageViewIndex, setImageViewIndex] = useState<number>(0);
    const [index, setIndex] = useState<number>(0);
    const [price, setPrice] = useState<number>();
    const [combo, setCombo] = useState<number>(0);
    const [comboName, setComboName] = useState<string>("");
    const [media, setMedia] = useState<MediaResponeModelParams[]>([]);
    const [buyProductDialog, setBuyProductDialog] = useState(false);
    const [favoriteDialog, setFavoriteDialog] = useState(false);

    // Animation
    const scaleValue = useRef(new Animated.Value(1)).current;
    
    // Window dimensions
    const windowWidth = Dimensions.get("window").width;

    // Fetch service details on mount
    useEffect(() => {
        const getServiceDetail = async () => {
            const res: ServiceDetailResponeParams = (
                await AxiosInstance().get(`services/${id}`)
            ).data;

            if (res.status_code === 200 && res.data) {
                setService(res.data);
                setPrice(res.data.single_price);
                setMedia(res.data.media);
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

    // Check if service is favorited
    const isFavorite = favorites.some((fav: { item_id: number | undefined; type: string; }) => 
        fav.item_id === service?.id && fav.type === 'service'
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

        if (service) {
            await dispatch(toggleFavoriteThunk({
                type: 'service',
                itemId: service.id,
            }));
            // Animate heart icon
            Animated.sequence([
                Animated.timing(scaleValue, {
                    toValue: 1.5,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(scaleValue, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start();
        }
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
        router.push({
            pathname: `/(app)/booking`,
            params: {
                service_id: service?.id,
                service_name: service?.service_name,
                combo_id: combo
            }
        });
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
                setComboName(i18n.t("package.commbo5"));
                break;
            case 2:
                setPrice(service?.combo_10_price);
                setComboName(i18n.t("package.combo10"));
                break;
            default:
                setPrice(service?.single_price);
                setComboName(i18n.t("package.single"));
                break;
        }
    }, [combo]);

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

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View flex bg-$white>
                <AppBar back title={i18n.t("service.service_details")} />
                {isLoading ? renderSkeletonView() : service && (
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
                                    </Carousel>
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
                                                <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
                                                    {isFavorite ? (
                                                        <Image source={HeartFullIcon} size={24} />
                                                    ) : (
                                                        <Image source={HeartIcon} size={24} />
                                                    )}
                                                </Animated.View>
                                            </TouchableOpacity>
                                        </View>
                                    </View>

                                    <View row centerV>
                                        <View row gap-5>
                                            <RatingStar rating={4.5} />
                                            <Text h3_medium>4.5</Text>
                                        </View>
                                        <View flex row right>
                                            <Text h3_medium>
                                                +99 {i18n.t("productDetail.purchases")}
                                            </Text>
                                        </View>
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
                                            <Text h3>Tầng 1 Shophouse P1- SH02 Vinhome Central Park, 720A Điện Biên Phủ, Phường 22, Quận Bình Thạnh, HCM</Text>
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

                                {/* Package Selection */}
                                <View padding-20 gap-20>
                                    <Text h2_bold>{i18n.t("service.treatment")}</Text>

                                    <TouchableOpacity onPress={() => setShowActionSheet(true)}>
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

                                {/* Package Selection Sheet */}
                                <ActionSheet
                                    title={i18n.t("package.select_combo")}
                                    cancelButtonIndex={4}
                                    showCancelButton={true}
                                    destructiveButtonIndex={0}
                                    visible={showActionSheet}
                                    containerStyle={{ padding: 10, gap: 10 }}
                                    onDismiss={() => setShowActionSheet(false)}
                                    useNativeIOS
                                    options={[
                                        {
                                            label: i18n.t("package.single"),
                                            onPress: () => setCombo(0),
                                        },
                                        {
                                            label: i18n.t("package.combo5"),
                                            onPress: () => setCombo(1),
                                        },
                                        {
                                            label: i18n.t("package.combo10"),
                                            onPress: () => setCombo(2),
                                        },
                                    ]}
                                />
                            </ScrollView>
                        </View>

                        {/* Bottom Actions */}
                        <ServiceBottomComponent
                            isLoading={isLoading}
                            onPurchase={isGuest ? handleGuestPurchase : handleBooking}
                        />

                        {/* Dialogs */}
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
                )}
            </View>
        </SafeAreaView>
    );
};

export default ServiceDetailPage;
