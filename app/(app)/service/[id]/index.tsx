import AppBar from "@/components/app-bar/AppBar"
import { getServiceDetailThunk } from "@/redux/service/getServiceDetailThunk";
import { RootState } from "@/redux/store";
import { Link, router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView } from "react-native";
import { AnimatedImage, Carousel, PageControlPosition, View, Text, Image, TouchableOpacity, ActionSheet, TextField, Button } from "react-native-ui-lib"
import { useDispatch, useSelector } from "react-redux";
import Feather from '@expo/vector-icons/Feather';
import i18n from "@/languages/i18n";


import CommentIcon from "@/assets/icons/comment.svg";
import ShoppingCartIcon from "@/assets/icons/shopping-cart.svg";
import HeartIcon from "@/assets/icons/heart.svg";
import TicketIcon from "@/assets/icons/ticket.svg";
import SunIcon from "@/assets/icons/sun.svg";
import { ServiceDetailResponeModel } from "@/types/service.type";

const ServiceDetailPage = () => {
  const { id } = useLocalSearchParams();
  const dispatch = useDispatch();
  const selectService = useSelector((state: RootState) => state.service?.serviceDetail);
  const [service, setService] = useState<ServiceDetailResponeModel>(selectService?.data);
  const [images, setImages] = useState<{ uri: string }[]>([]);
  const [index, setIndex] = useState(0);
  const [imageViewIndex, setImageViewIndex] = useState(0);
  const [visible, setIsVisible] = useState(false);
  const [showActionSheet, setShowActionSheet] = useState<boolean>(false);

  console.log('Selected service', service);
  useEffect(() => {
    dispatch(getServiceDetailThunk(id))
  }, [id]);

  useEffect(() => {
    setImages([
      { uri: "https://picsum.photos/1600/900" },
      { uri: "https://picsum.photos/1920/1080" },
    ]);
  }, []);

  const handleOpenImage = (index: number) => {
    setImageViewIndex(index);
    setIsVisible(true);
  };

  return (
    <View useSafeArea flex bg-$white>
      <AppBar back title="Chi tiết dịch vụ" />
     {service && <View flex>
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
                {images?.map((item, index) => (
                  <Pressable onPress={() => handleOpenImage(index)} key={index}>
                    <AnimatedImage
                      animationDuration={1000}
                      source={{ uri: item.uri }}
                      aspectRatio={16 / 9}
                      cover
                      key={index}
                    />
                  </Pressable>
                ))}
              </Carousel>
            </View>

            {/* <ImageView
            images={images}
            imageIndex={0}
            visible={visible}
            onRequestClose={() => setIsVisible(false)}
            onImageIndexChange={(index) => setImageViewIndex(index)}
            key={index}
            swipeToCloseEnabled={true}
            doubleTapToZoomEnabled={true}
            FooterComponent={FooterComponent}
          /> */}

            <View padding-20 gap-10>
              <Text h1_bold marginB-10>
                {service?.service_name}
              </Text>
              <View row marginB-10>
                <Image source={TicketIcon} size={24} />
                <Text h1_medium secondary marginL-5>
                  {service?.single_price}
                </Text>
                <View flex right>
                  <TouchableOpacity onPress={() => console.log("mua ha")}>
                    <Image source={HeartIcon} size={24} />
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



            <ActionSheet
              title={'Chọn gói combo'}
              message={'Message goes here'}
              cancelButtonIndex={3}
              destructiveButtonIndex={0}
              visible={true}
              options={[
                { label: 'Gói đơn', onPress: () => { } },
                { label: 'Gói combo 5', onPress: () => { } },
                { label: 'Gói combo 10', onPress: () => { } },
                { label: 'Cancel', onPress: () => setShowActionSheet(false) },
              ]}
            />
            {/* <View marginT-10 paddingR-10>
            <Text h1_medium>
              {i18n.t("productDetail.product_description")}
            </Text>
            <View marginT-10>{createBulletPointsDescription(longText)}</View>
          </View> */}

          </ScrollView>
        </View>
        <View
          row
          centerV
          paddingH-24
          paddingT-15
          style={{
            borderTopStartRadius: 30,
            borderTopEndRadius: 30,
            borderTopWidth: 2,
            borderLeftWidth: 2,
            borderRightWidth: 2,
            borderColor: "#E0E0E0",
          }}
        >
          <View row gap-30>
            <TouchableOpacity center onPress={() => router.push("/cart")}>
              <View center marginB-4>
                <Feather name="phone-call" size={24} color="#AFAFAF" />
              </View>
              <Text h3_medium>Liên hệ</Text>
            </TouchableOpacity>
            <Link href="/rating/1" asChild>
              <TouchableOpacity center>
                <View center marginB-4>
                  <Image source={CommentIcon} size={24} />
                </View>
                <Text h3_medium>{i18n.t("productDetail.reviews")}</Text>
              </TouchableOpacity>
            </Link>
          </View>
          <View flex right>
            <Button
              label={i18n.t("productDetail.buy_now").toString()}
              backgroundColor="$primary"
              br40
              onPress={() => {
                router.push("/payment");
              }}
            />
          </View>
        </View>
      </View>}
    </View>
  )
}

export default ServiceDetailPage
