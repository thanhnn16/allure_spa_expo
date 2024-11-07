import AppBar from "@/components/app-bar/AppBar";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, Dimensions } from "react-native";
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
import Feather from "@expo/vector-icons/Feather";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import i18n from "@/languages/i18n";
import ImageView from "react-native-image-viewing";
import AntDesign from "@expo/vector-icons/AntDesign";

import CommentIcon from "@/assets/icons/comment.svg";
import TicketIcon from "@/assets/icons/ticket.svg";
import SunIcon from "@/assets/icons/sun.svg";
import {
  MediaResponeModelParams,
  ServiceDetailResponeModel,
  ServiceDetailResponeParams,
} from "@/types/service.type";
import AxiosInstance from "@/utils/services/helper/axiosInstance";
import AppButton from "@/components/buttons/AppButton";
import { SafeAreaView } from "react-native-safe-area-context";

const screenWidth = Dimensions.get("window").width;

const ServiceDetailPage = () => {
  const { id } = useLocalSearchParams();
  const [service, setService] = useState<ServiceDetailResponeModel>();
  const [visible, setIsVisible] = useState<boolean>(false);
  const [showActionSheet, setShowActionSheet] = useState<boolean>(false);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [imageViewIndex, setImageViewIndex] = useState<number>(0);
  const [index, setIndex] = useState<number>(0);
  const [price, setPrice] = useState<number>();
  const [combo, setCombo] = useState<number>(0);
  const [comboName, setComboName] = useState<string>("");
  const [media, setMedia] = useState<MediaResponeModelParams[]>([]);
  const windowWidth = Dimensions.get("window").width;

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

  const images = useMemo(() => {
    if (!media || media.length === 0) return [];
    return media.map((item) => ({ uri: item.full_url }));
  }, [media]);

  const handleOpenImage = (index: number) => {
    setImageViewIndex(index);
    setIsVisible(true);
  };
  const ImageViewFooterComponent = () => {
    return (
      <View marginB-20 padding-20>
        <Text h2 white>{`${imageViewIndex + 1} / ${images.length}`}</Text>
      </View>
    );
  };

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
  const renderItem = (item: { uri: string }, idx: number) => {
    return (
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
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View flex bg-$white>
        <AppBar back title={i18n.t("service.service_details")} />
        {isLoading
          ? renderSkeletonView()
          : service && (
              <View flex>
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
                      <Text h1_bold marginB-10>
                        {service?.service_name}
                      </Text>
                      <View row marginB-10>
                        <Image source={TicketIcon} size={24} />
                        <Text h1_medium secondary marginL-5>
                          {price?.toLocaleString("vi-VN")} VNĐ
                        </Text>
                        <View flex right>
                          <TouchableOpacity
                            onPress={() => {
                              alert("Chưa có api thêm vào favorite");
                              setIsFavorite(!isFavorite);
                            }}
                          >
                            {isFavorite ? (
                              <AntDesign name="heart" size={24} color="black" />
                            ) : (
                              <AntDesign
                                name="hearto"
                                size={24}
                                color="black"
                              />
                            )}
                          </TouchableOpacity>
                        </View>
                      </View>
                      <View row paddingR-20>
                        <View>
                          <Image source={SunIcon} size={24} />
                        </View>
                        <View>
                          <View key={index} row>
                            <Text h2> </Text>
                            <Text h3>{service?.description}</Text>
                          </View>
                        </View>
                      </View>
                    </View>

                    <View padding-20 gap-20>
                      <Text h2_bold>{i18n.t("service.treatment")}</Text>

                      <TouchableOpacity
                        onPress={() => setShowActionSheet(true)}
                      >
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
                          onPress: () => {
                            setCombo(0);
                          },
                        },
                        {
                          label: i18n.t("package.combo5"),

                          onPress: () => {
                            setCombo(1);
                          },
                        },
                        {
                          label: i18n.t("package.combo10"),
                          onPress: () => {
                            setCombo(2);
                          },
                        },
                      ]}
                    />
                  </ScrollView>
                </View>

                <View
                  row
                  center
                  paddingH-24
                  paddingT-15
                  gap-30
                  style={{
                    borderTopStartRadius: 30,
                    borderTopEndRadius: 30,
                    borderTopWidth: 2,
                    borderLeftWidth: 2,
                    borderRightWidth: 2,
                    borderColor: "#E0E0E0",
                    justifyContent: "space-between",
                  }}
                >
                  <View row gap-30>
                    <TouchableOpacity
                      center
                      onPress={() => alert(i18n.t("system.fud"))}
                    >
                      <View center marginB-4>
                        <Feather name="phone-call" size={24} color="#AFAFAF" />
                      </View>
                      <Text h3_medium>{i18n.t("service.contact")}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      center
                      onPress={() => router.push("/rating/1")}
                    >
                      <View center marginB-4>
                        <Image source={CommentIcon} size={24} />
                      </View>
                      <Text h3_medium>{i18n.t("productDetail.reviews")}</Text>
                    </TouchableOpacity>
                  </View>
                  <View flex>
                    <AppButton
                      title={i18n.t("service.book_now")}
                      type="primary"
                      onPress={() => {
                        handleBooking();
                      }}
                    />
                  </View>
                </View>
              </View>
            )}
      </View>
    </SafeAreaView>
  );
};

export default ServiceDetailPage;
