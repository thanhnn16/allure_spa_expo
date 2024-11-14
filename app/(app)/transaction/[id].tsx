import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
  ViewStyle,
  ScrollView,
  FlatList,
  TextInput,
  Alert,
} from "react-native";
import {
  Button,
  View,
  Text,
  TouchableOpacity,
  Image,
  Card,
  Colors,
  Modal,
  Wizard,
  Timeline,
} from "react-native-ui-lib";
import { Link, router, useLocalSearchParams } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import i18n from "@/languages/i18n";
import { Rating } from "react-native-ratings";
import SelectImagesBar from "@/components/images/SelectImagesBar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { createRatingProductThunk } from "@/redux/features/rating/createRatingThunk";
import AppBar from "@/components/app-bar/AppBar";
import PaymentAddress from "@/components/payment/PaymentAddress";
import TimelineList from "@/components/payment/TimelineList";
import PaymentProductItem from "@/components/payment/PaymentProductItem";
import PaymentPicker from "@/components/payment/PaymentPicker";
import { paymentMethods } from "../check-out";
import { getOrderThunk } from "@/redux/features/order/getOrderThunk";
import { Orders } from "@/types/order.type";
import OrderProductItem from "@/components/order/OrderProductItem";
import { unwrapResult } from "@reduxjs/toolkit";
import { set } from "lodash";

const styles = StyleSheet.create({
  // Container styles
  ratingContainer: {
    position: "relative",
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 15,
    paddingRight: 5,
    margin: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 13,
    elevation: 5,
    width: 380,
    height: 140,
    alignSelf: "center",
  },

  // Text styles
  textTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  textSubtitle: {
    fontSize: 10,
    color: "#666",
    marginTop: 5,
  },

  // Button styles
  btnRate: {
    backgroundColor: "#7A7D65",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignSelf: "flex-end",
    marginTop: 10,
    zIndex: 1,
  },
  btnRateText: {
    color: "#fff",
    fontSize: 16,
  },

  // Image styles
  imgCoin: {
    width: 173,
    height: 88,
    position: "absolute",
    bottom: 0,
    left: 10,
    resizeMode: "contain",
  },
  bottomSheet: {
    // flex: 1,
  },
  bottomSheetView: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 20,
  },

  inputContainer: {
    width: "100%",
    height: 150,
    borderWidth: 1,
    borderColor: "#D9D9D9",
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
  },
  closeIcon: {
    position: "absolute",
    top: -10,
    right: -10,
    zIndex: 1000,
  },
});

export default function Detail() {
  const { id } = useLocalSearchParams();
  const dispatch = useDispatch();

  const { orders, isLoading } = useSelector((
    state: RootState) => state.order
  );

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        await dispatch(getOrderThunk({ id }));
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, [dispatch]);

  console.log(orders);

  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);
  const handleOpenBottomSheet = () => {
    bottomSheetRef.current?.expand();
  };

  const sendReview = () => {
    dispatch(createRatingProductThunk({
      rating_type: "product",
      item_id: 0,
      stars: 5,
      comment: "string",
      media_id: 1
    }));
  }

  type DeliveryStatus = 'pending' | 'confirmed' | 'delivering' | 'completed' | 'canceled';
  const [activeDeliveryStatus, setactiveDeliveryStatus] = useState<DeliveryStatus>('completed');

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
        <AppBar back title={i18n.t("transaction_detail.title")} />

        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{
            flexGrow: 1,
            paddingBottom: 10,
            paddingHorizontal: 20
          }}
        >
          <View style={styles.ratingContainer}>
            <View>
              <View>
                <Text style={styles.textTitle}>{i18n.t("transaction_detail.review.title")}</Text>
                <Text style={styles.textSubtitle}>
                  {i18n.t("transaction_detail.review.content")}
                </Text>
              </View>
              <TouchableOpacity style={styles.btnRate} onPress={() => handleOpenBottomSheet()}>
                <Text style={styles.btnRateText}>{i18n.t("transaction_detail.review.button")}</Text>
              </TouchableOpacity>
            </View>
            <Image
              source={require("@/assets/images/coin.png")}
              style={styles.imgCoin}
            />
          </View>

          {/* <TimelineList
            state={detailOrder.}
          /> */}
          <PaymentAddress />
          <View marginV-10 gap-10>
            <Text h2_bold>{i18n.t("checkout.payment_method")}</Text>
            <PaymentPicker />
          </View>

          <View gap-10>
            <Text h2_bold>{i18n.t("checkout.product")}</Text>
            {/* {detailOrder.map((order: Orders) => (
              <OrderProductItem key={order.id} order={order} />
            ))} */}
          </View>

        </ScrollView>

        <View paddingH-20
          style={{
            borderTopWidth: 1,
            borderLeftWidth: 1,
            borderRightWidth: 1,
            borderTopColor: "#E0E0E0",
            borderLeftColor: "#E0E0E0",
            borderRightColor: "#E0E0E0",
            borderTopLeftRadius: 13,
            borderTopRightRadius: 13,
            backgroundColor: "#FFFFFF",
            paddingTop: 10,
          }}
        >

          <View gap-10 marginV-5>
            <View row spread>
              <Text h3_bold >{i18n.t("checkout.voucher")}</Text>
              <Text h3>50k</Text>
            </View>
            <View row spread>
              <Text h3_bold>{i18n.t("checkout.total_payment")}:</Text>
              <Text h3_bold secondary>
                123.456 VNĐ
              </Text>
            </View>
          </View>

          <Button
            label={i18n.t("transaction_detail.buy_again").toString()}
            labelStyle={{ fontFamily: "SFProText-Bold", fontSize: 16 }}
            backgroundColor={Colors.primary}
            padding-20
            borderRadius={10}
            style={{
              width: 338,
              height: 47,
              alignSelf: "center",
              marginVertical: 10,
            }}
          />
        </View>
        <BottomSheet
          ref={bottomSheetRef}
          onChange={handleSheetChanges}
          snapPoints={["60%"]}
          index={-1}
          enablePanDownToClose={true}
          enableHandlePanningGesture={true}
          enableOverDrag={true}
          keyboardBehavior="extend"
          keyboardBlurBehavior="restore"
          backgroundStyle={{ backgroundColor: "white" }}
          handleStyle={{
            backgroundColor: "white",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          }}
          handleIndicatorStyle={{
            backgroundColor: "#D9D9D9",
            width: 60,
            height: 7,
            borderRadius: 30,
            marginTop: 3,
          }}
          style={styles.bottomSheet}
        >
          <BottomSheetView style={styles.bottomSheetView}>
            <View center gap-10>
              <Text h2_bold>{i18n.t("rating.how_do_you_feel")}</Text>
              <Rating
                ratingCount={5}
                imageSize={45}
                ratingBackgroundColor="#E0E0E0"
                ratingColor="#FFC700"
                ratingTextColor="#000"
              />
            </View>

            <View flex left marginT-10>
              <Text>{i18n.t("rating.feel_about_product")}</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  placeholder={i18n.t("rating.type_content")}
                  style={{ height: 150, textAlignVertical: "top" }}
                />
              </View>
              <Text>{i18n.t("rating.images")}</Text>

              <SelectImagesBar
                selectedImages={selectedImages}
                setSelectedImages={setSelectedImages}
                isRating={true}
              />
            </View>

            <View flex width={"100%"} bottom paddingV-20>
              <Button
                label={i18n.t("rating.send_review").toString()}
                labelStyle={{ fontFamily: "SFProText-Bold", fontSize: 16 }}
                backgroundColor={Colors.primary}
                borderRadius={10}
                onPress={() => sendReview()}
              />
            </View>
          </BottomSheetView>
        </BottomSheet>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
