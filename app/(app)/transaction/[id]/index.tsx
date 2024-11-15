import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
  ViewStyle,
  ScrollView,
  FlatList,
  TextInput,
  Alert,
  ActivityIndicator,
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
import { getOrderThunk } from "@/redux/features/order/getOrderThunk";
import { Orders } from "@/types/order.type";
import OrderProductItem from "@/components/order/OrderProductItem";
import { unwrapResult } from "@reduxjs/toolkit";
import { set } from "lodash";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { OrderItem } from "@/types/order.type";

interface PaymentAddressProps {
  shippingAddress: {
    full_name: string;
    phone: string;
    address: string;
    // thêm các field khác nếu cần
  };
}

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
  bottomActions: {
    borderTopWidth: 1,
    borderTopColor: Colors.grey60,
    backgroundColor: Colors.white,
  },
  buyAgainLabel: {
    fontFamily: "SFProText-Bold",
    fontSize: 16,
  },
});

const DetailTransaction = () => {
  const { id } = useLocalSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const { orders, isLoading } = useSelector((state: RootState) => state.order);

  useEffect(() => {
    dispatch(getOrderThunk({ id }));
  }, [dispatch, id]);

  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);
  const handleOpenBottomSheet = () => {
    bottomSheetRef.current?.expand();
  };

  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  const sendReview = async () => {
    try {
      // Implement your review logic here
      console.log("Sending review:", {
        rating,
        review,
        images: selectedImages,
      });
      bottomSheetRef.current?.close();
    } catch (error) {
      console.error("Error sending review:", error);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
        <AppBar back title={i18n.t("transaction_detail.title")} />
        <View flex center>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  const order = orders;
  if (!order) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
        <AppBar back title={i18n.t("transaction_detail.title")} />

        <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
          {/* Order Status Card */}
          <View
            style={{
              backgroundColor: Colors.primary,
              padding: 15,
              margin: 15,
              borderRadius: 10,
            }}
          >
            <Text white h2_bold marginB-10>
              {i18n.t("transaction_detail.order_id")}: #{order.id}
            </Text>
            <View row spread>
              <Text white h3>
                {i18n.t("transaction_detail.status")}
              </Text>
              <Text white h3_bold>
                {order.status?.toUpperCase()}
              </Text>
            </View>
          </View>

          {/* Timeline */}
          <TimelineList state={order.status} />

          {/* Shipping Address */}
          <View marginH-15>
            <PaymentAddress shippingAddress={order.shipping_address} />
          </View>

          {/* Payment Method */}
          <View marginH-15 marginT-15>
            <Text h2_bold marginB-10>
              {i18n.t("checkout.payment_method")}
            </Text>
            <Card padding-15>
              <View row centerV spread>
                <View row centerV>
                  <MaterialCommunityIcons
                    name="credit-card-outline"
                    size={30}
                    color={Colors.primary}
                    style={{ marginRight: 10 }}
                  />
                  <Text h3>{order.payment_method?.name}</Text>
                </View>
                <Text h3_bold primary>
                  {order.payment_method?.status}
                </Text>
              </View>
            </Card>
          </View>

          {/* Products */}
          <View marginH-15 marginT-15>
            <Text h2_bold marginB-10>
              {i18n.t("checkout.product")}
            </Text>
            {order.order_items?.map((item: OrderItem) => (
              <OrderProductItem key={item.id} order={item} />
            ))}
          </View>

          {/* Price Summary */}
          <Card margin-15 padding-15>
            <View gap-10>
              <View row spread>
                <Text h3>{i18n.t("checkout.subtotal")}</Text>
                <Text h3>{order.total_amount?.toLocaleString()} VNĐ</Text>
              </View>

              {order.voucher && (
                <View row spread>
                  <Text h3>{i18n.t("checkout.voucher")}</Text>
                  <Text h3 red>
                    -{order.discount_amount?.toLocaleString()} VNĐ
                  </Text>
                </View>
              )}

              <View row spread>
                <Text h3_bold>{i18n.t("checkout.total_payment")}</Text>
                <Text h2_bold primary>
                  {(
                    order.total_amount - (order.discount_amount || 0)
                  ).toLocaleString()}{" "}
                  VNĐ
                </Text>
              </View>
            </View>
          </Card>

          {/* Review Section */}
          {order.status === "completed" && (
            <View style={styles.ratingContainer}>
              <View>
                <Text style={styles.textTitle}>
                  {i18n.t("transaction_detail.review.title")}
                </Text>
                <Text style={styles.textSubtitle}>
                  {i18n.t("transaction_detail.review.content")}
                </Text>
                <TouchableOpacity
                  style={styles.btnRate}
                  onPress={handleOpenBottomSheet}
                >
                  <Text style={styles.btnRateText}>
                    {i18n.t("transaction_detail.review.button")}
                  </Text>
                </TouchableOpacity>
              </View>
              <Image
                source={require("@/assets/images/coin.png")}
                style={styles.imgCoin}
              />
            </View>
          )}
        </ScrollView>

        {/* Bottom Actions */}
        {order.status === "completed" && (
          <View padding-15 style={styles.bottomActions}>
            <Button
              label={i18n.t("transaction_detail.buy_again")}
              labelStyle={styles.buyAgainLabel}
              backgroundColor={Colors.primary}
              borderRadius={10}
              onPress={() => {}}
            />
          </View>
        )}

        {/* Rating Bottom Sheet */}
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
                onFinishRating={(value: number) => setRating(value)}
              />
            </View>

            <View flex left marginT-10>
              <Text>{i18n.t("rating.feel_about_product")}</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  placeholder={i18n.t("rating.type_content")}
                  style={{ height: 150, textAlignVertical: "top" }}
                  value={review}
                  onChangeText={setReview}
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
                label={i18n.t("rating.send_review")}
                labelStyle={{ fontFamily: "SFProText-Bold", fontSize: 16 }}
                backgroundColor={Colors.primary}
                borderRadius={10}
                onPress={sendReview}
              />
            </View>
          </BottomSheetView>
        </BottomSheet>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default DetailTransaction;
