import {
  View,
  Text,
  Colors,
  RadioGroup,
  RadioButton,
  Typography,
} from "react-native-ui-lib";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { getOrderByIdThunk } from "@/redux/features/order/getOrderByIdThunk";
import AppBar from "@/components/app-bar/AppBar";
import { ScrollView, StyleSheet, TextInput } from "react-native";
import OrderStatusBadge from "@/components/order/OrderStatusBadge";
import OrderItemCard from "@/components/order/OrderItemCard";
import OrderActionButtons from "@/components/order/OrderActionButtons";
import OrderSkeleton from "@/components/order/OrderSkeleton";
import i18n from "@/languages/i18n";
import formatCurrency from "@/utils/price/formatCurrency";
import { OrderItem } from "@/types/order.type";
import { useLocalSearchParams } from "expo-router";
import TransactionHeader from "@/components/payment/TransactionHeader";
import { PaymentMethod } from "../../check-out";
import AppDialog from "@/components/dialog/AppDialog";
import AppButton from "@/components/buttons/AppButton";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { createRatingProductThunk } from "@/redux/features/rating/createRatingThunk";
import SelectImagesBar from "@/components/images/SelectImagesBar";
import OrderSelectRateItem from "@/components/order/OrderSelectRateItem";
import { Rating } from "@kolking/react-native-rating";
import { changeOrderStatusByIdThunk } from "@/redux/features/order/changeOrderStatusThunk";
import {
  convertImageToBase64,
  processImageForUpload,
} from "@/utils/helpers/imageHelper";

const paymentMethods: PaymentMethod[] = [
  {
    id: 1,
    name: i18n.t("checkout.cash"),
    iconName: "cash-outline",
  },
  {
    id: 2,
    name: i18n.t("checkout.credit_card"),
    iconName: "card-outline",
  },
  {
    id: 3,
    name: i18n.t("checkout.bank_transfer"),
    iconName: "card-outline",
  },
];

const OrderDetail = () => {
  const { id } = useLocalSearchParams();
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const selectBottomSheetRef = useRef<BottomSheet>(null);
  const cancelBottomSheetRef = useRef<BottomSheet>(null);
  const [rateDialog, setRateDialog] = useState(false);
  const [errorDialog, setErrorDialog] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [note, setNote] = useState("");
  const dispatch = useDispatch();
  const [currentValue, setCurrentValue] = useState<number | undefined>(
    undefined
  );
  const [cancelValue, setCancelValue] = useState<string>(
    "Chọn thêm sản phẩm khác/ Thay đổi voucher"
  );

  const { selectedOrder, isLoading, error } = useSelector(
    (state: RootState) => state.order
  );

  useEffect(() => {
    dispatch(getOrderByIdThunk({ id: id }));
  }, [id]);

  const handleChange = useCallback(
    (value: number) => setRating(value),
    [rating]
  );

  const handleOpenBottomSheet = () => {
    selectBottomSheetRef.current?.expand();
  };

  const handleRateBottomSheet = () => {
    selectBottomSheetRef.current?.close();
    bottomSheetRef.current?.expand();
  };

  const handleOpenCancelBottomSheet = () => {
    cancelBottomSheetRef.current?.expand();
  };

  const sendReview = async () => {
    try {
      // Validate required fields
      if (!rating || !currentValue) {
        throw new Error("Vui lòng chọn số sao và sản phẩm cần đánh giá");
      }

      // Create FormData object
      const formData = new FormData();
      formData.append("rating_type", "product");
      formData.append("item_id", currentValue.toString());
      formData.append("stars", rating.toString());
      formData.append("comment", comment);
      formData.append(
        "order_item_id",
        (
          selectedOrder.order_items.find(
            (item: OrderItem) => item.product?.id === currentValue
          )?.id || 0
        ).toString()
      );

      // Process and append images if they exist
      if (selectedImages.length > 0) {
        try {
          // Process each image before uploading
          await Promise.all(
            selectedImages.map(async (imageUri, index) => {
              const processedUri = await processImageForUpload(imageUri);

              formData.append("images[]", {
                uri: processedUri,
                name: `image_${index}.jpg`,
                type: "image/jpeg",
              } as any);
            })
          );
        } catch (error: any) {
          throw new Error(`Lỗi xử lý hình ảnh: ${error.message}`);
        }
      }

      // Send request with FormData
      await dispatch(createRatingProductThunk(formData)).unwrap();

      // Close bottom sheet and show success dialog
      bottomSheetRef.current?.close();
      setRateDialog(true);

      // Reset form
      setSelectedImages([]);
      setRating(0);
      setComment("");
    } catch (error: any) {
      console.error("Error creating rating:", error);
      bottomSheetRef.current?.close();
      setErrorDialog(true);
    }
  };

  const handleCancelOrder = async () => {
    try {
      if (cancelValue === "Bạn có lý do khác" && note === "") {
        throw new Error("Bạn cần nhập lý do hủy đơn hàng");
      }
      if (cancelValue !== "Bạn có lý do khác") {
        await dispatch(
          changeOrderStatusByIdThunk({
            id: selectedOrder.id,
            note: cancelValue,
          })
        );
        await dispatch(getOrderByIdThunk({ id: selectedOrder.id }));
      } else {
        await dispatch(
          changeOrderStatusByIdThunk({ id: selectedOrder.id, note: note })
        );
        await dispatch(getOrderByIdThunk({ id: selectedOrder.id }));
      }
      cancelBottomSheetRef.current?.close();
    } catch (error: any) {
      setErrorDialog(true);
    }
  };

  if (isLoading || !selectedOrder) {
    return <OrderSkeleton />;
  }

  const subTotal = selectedOrder.order_items.reduce(
    (acc: any, item: any) => acc + item.price * item.quantity,
    0
  );

  const getPaymentMethod = (id: number) => {
    const method = paymentMethods.find((method) => method.id === id);
    return method;
  };
  const method = getPaymentMethod(selectedOrder.payment_method_id);

  return (
    <GestureHandlerRootView>
      <View flex bg-white>
        <AppBar back title={i18n.t("orders.detail")} />

        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
        >
          {selectedOrder.status !== "cancelled" && (
            <TransactionHeader status={selectedOrder.status} />
          )}

          {!selectedOrder.is_rated && selectedOrder.status == "completed" && (
            <View style={styles.section}>
              <View row spread centerV>
                <Text h2_bold>{i18n.t("transaction_detail.you_have")}</Text>
              </View>
              <Text h3 marginV-8 color={Colors.grey30}>
                {i18n.t("transaction_detail.you_have")}{" "}
                {selectedOrder.order_items?.length}{" "}
                {i18n.t("transaction_detail.product_need_review")}
              </Text>
              <View flex>
                <AppButton
                  title={i18n.t("transaction_detail.review_now")}
                  type="outline"
                  onPress={() => handleOpenBottomSheet()}
                />
              </View>
            </View>
          )}

          {/* Order Status Section */}
          <View style={styles.section}>
            <View row spread centerV>
              <Text h2_bold>
                {i18n.t("orders.order_id")}: #{selectedOrder.id}
              </Text>
              {selectedOrder.status === "cancelled" && (
                <OrderStatusBadge status={selectedOrder.status} />
              )}
            </View>
            <Text h3 marginT-8 color={Colors.grey30}>
              {new Date(selectedOrder.created_at).toLocaleDateString()}
            </Text>

            <Text h3 marginT-8 color={Colors.grey30}>
              {method?.name}
            </Text>
          </View>

          {/* Order Items Section */}
          <View style={styles.section}>
            <Text h2_bold marginB-16>
              {i18n.t("orders.items")}
            </Text>
            {selectedOrder.order_items?.map((item: OrderItem) => (
              <OrderItemCard key={item.id} item={item} />
            ))}
          </View>

          {/* Payment Info Section */}
          <View style={styles.section}>
            <Text h2_bold marginB-16>
              {i18n.t("orders.payment_info")}
            </Text>

            <View row spread marginB-8>
              <Text h3>{i18n.t("orders.subtotal")}</Text>
              <Text h3>
                {formatCurrency({
                  price: Number(subTotal) || 0,
                })}
              </Text>
            </View>

            {Number(selectedOrder.discount_amount) > 0 && (
              <View row spread marginB-8>
                <Text h3>{i18n.t("orders.discount")}</Text>
                <Text h3 color={Colors.red30}>
                  -
                  {formatCurrency({
                    price: Number(selectedOrder.discount_amount) || 0,
                  })}
                </Text>
              </View>
            )}

            <View row spread marginT-8>
              <Text h2>{i18n.t("orders.total")}</Text>
              <Text h2_bold color={Colors.secondary}>
                {formatCurrency({
                  price:
                    Number(subTotal) -
                    (Number(selectedOrder.discount_amount) || 0),
                })}
              </Text>
            </View>
          </View>

          {/* Shipping Info Section */}
          {selectedOrder.shipping_address && (
            <View style={styles.section}>
              <Text text65L marginB-16>
                {i18n.t("orders.shipping_info")}
              </Text>
              <Text h3 marginB-8>
                {selectedOrder.user.full_name}
              </Text>
              <Text h3 marginB-8>
                {selectedOrder.user.phone_number}
              </Text>
              <Text h3>
                {selectedOrder.shipping_address.address},{" "}
                {selectedOrder.shipping_address.ward},
                {selectedOrder.shipping_address.district},{" "}
                {selectedOrder.shipping_address.province}
              </Text>
            </View>
          )}

          {/* Note Section */}
          {selectedOrder.note && (
            <View style={styles.section}>
              <Text h2_bold marginB-8>
                {i18n.t("orders.note")}
              </Text>
              <Text h3>{selectedOrder.note}</Text>
            </View>
          )}
        </ScrollView>

        {/* Action Buttons */}
        <OrderActionButtons
          order={selectedOrder}
          onCancel={() => handleOpenCancelBottomSheet()}
        />

        <BottomSheet
          ref={selectBottomSheetRef}
          index={-1}
          enablePanDownToClose={true}
          enableHandlePanningGesture={true}
          enableOverDrag={true}
          keyboardBehavior="extend"
          keyboardBlurBehavior="restore"
        >
          <BottomSheetView style={styles.bottomSheetView}>
            <View center gap-10 marginV-12>
              <Text h2_bold>Chọn sản phẩm cần đánh giá</Text>
            </View>

            {selectedOrder.order_items?.map((item: OrderItem) => (
              <RadioGroup
                key={item.id}
                initialValue={currentValue}
                onValueChange={(value: any) => {
                  setCurrentValue(item.product?.id);
                }}
              >
                <OrderSelectRateItem key={item.id} item={item} />
              </RadioGroup>
            ))}

            <View flex width={"100%"} bottom paddingV-20>
              <AppButton
                title={"Chọn sản phẩm"}
                type="primary"
                onPress={() => handleRateBottomSheet()}
              />
            </View>
          </BottomSheetView>
        </BottomSheet>

        <BottomSheet
          ref={cancelBottomSheetRef}
          index={-1}
          enablePanDownToClose={true}
          enableHandlePanningGesture={true}
          enableOverDrag={true}
          keyboardBehavior="extend"
          keyboardBlurBehavior="restore"
          snapPoints={["60%"]}
        >
          <BottomSheetView style={styles.bottomSheetView}>
            <View center gap-10 marginV-12>
              <Text h2_bold>{i18n.t("transaction_detail.cancel.title")}</Text>
            </View>

            <RadioGroup
              initialValue={cancelValue}
              onValueChange={(value: any) => {
                setCancelValue(value);
              }}
            >
              <View gap-12>
                <RadioButton
                  value={"Chọn thêm sản phẩm khác/ Thay đổi voucher"}
                  color={Colors.primary}
                  label={i18n.t(
                    "transaction_detail.cancel.change_order_voucher"
                  )}
                  labelStyle={Typography.h3}
                />
                <RadioButton
                  value={"Bạn cảm thấy công dụng sản phẩm chưa tốt"}
                  color={Colors.primary}
                  label={i18n.t("transaction_detail.cancel.product_not_good")}
                  labelStyle={Typography.h3}
                />
                <RadioButton
                  value={"Giá sản phẩm không hợp lý"}
                  color={Colors.primary}
                  label={i18n.t("transaction_detail.cancel.price_not_good")}
                  labelStyle={Typography.h3}
                />
                <RadioButton
                  value={"Bạn không muốn mua nữa"}
                  color={Colors.primary}
                  label={i18n.t("transaction_detail.cancel.no_need")}
                  labelStyle={Typography.h3}
                />
                <RadioButton
                  value={"Bạn có lý do khác"}
                  color={Colors.primary}
                  label={i18n.t("transaction_detail.cancel.other")}
                  labelStyle={Typography.h3}
                />
              </View>
            </RadioGroup>

            {cancelValue === "Bạn có lý do khác" && (
              <View style={styles.inputContainer}>
                <TextInput
                  value={note}
                  onChangeText={setNote}
                  placeholder={i18n.t("transaction_detail.cancel.title")}
                  style={{ height: 192, textAlignVertical: "top" }}
                />
              </View>
            )}

            <View flex width={"100%"} bottom paddingV-20>
              <AppButton
                title={i18n.t("transaction_detail.cancel_order")}
                type="primary"
                onPress={() => handleCancelOrder()}
              />
            </View>
          </BottomSheetView>
        </BottomSheet>

        <BottomSheet
          ref={bottomSheetRef}
          snapPoints={["60%"]}
          index={-1}
          enablePanDownToClose={true}
          enableHandlePanningGesture={true}
          enableOverDrag={true}
          keyboardBehavior="extend"
          keyboardBlurBehavior="restore"
          handleStyle={{
            backgroundColor: "white",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          }}
        >
          <BottomSheetView style={styles.bottomSheetView}>
            <View center gap-10 marginB-10>
              <Text h2_bold>{i18n.t("rating.how_do_you_feel")}</Text>
              <Rating
                size={40}
                rating={rating}
                onChange={handleChange}
                variant="stars"
              />
            </View>

            <View flex left marginT-10>
              <Text>{i18n.t("rating.feel_about_product")}</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  value={comment}
                  onChangeText={setComment}
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
              <AppButton
                title={i18n.t("rating.send_review")}
                type="primary"
                onPress={() => sendReview()}
              />
            </View>
          </BottomSheetView>
        </BottomSheet>

        <AppDialog
          severity="success"
          visible={rateDialog}
          title="Cảm ơn bạn"
          description="Đánh giá của bạn đã được gửi"
          closeButton={false}
          confirmButton
          confirmButtonLabel="Quay lại"
          onConfirm={() => setRateDialog(false)}
        />

        <AppDialog
          severity="error"
          visible={errorDialog}
          title="Có lỗi xảy ra"
          description="Hãy lại gửi đánh giá sau nhé"
          closeButton={false}
          confirmButton
          confirmButtonLabel="Quay lại"
          onConfirm={() => setErrorDialog(false)}
        />
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  section: {
    padding: 16,
    backgroundColor: Colors.white,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: Colors.grey40,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    borderColor: Colors.primary_light,
    borderWidth: 1,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bottomSheetView: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 20,
  },

  inputContainer: {
    width: "100%",
    height: 140,
    borderWidth: 1,
    borderColor: "#D9D9D9",
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
  },
});

export default OrderDetail;
