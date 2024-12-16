import { useLanguage } from "@/hooks/useLanguage";
import { useDialog } from "@/hooks/useDialog";

import { Alert, Dimensions, TextInput } from "react-native";
import {
  View,
  Text,
  TouchableOpacity,
  SkeletonView,
  Colors,
} from "react-native-ui-lib";
import { useState, useEffect } from "react";
import AppDialog from "../dialog/AppDialog";

const windowWidth = Dimensions.get("window").width;

interface ProductQuantityProps {
  isLoading?: boolean;
  quantity: number;
  maxQuantity?: number;
  setQuantity: (quantity: number) => void;
  setTotalPrice?: (price: number) => void;
  onQuantityPress?: () => void;
}

const ProductQuantity: React.FC<ProductQuantityProps> = ({
  isLoading = false,
  quantity,
  setQuantity,
  maxQuantity = 0,
  setTotalPrice,
  onQuantityPress
}) => {
  const { t } = useLanguage();
  const { showDialog, dialogConfig, hideDialog } = useDialog();
  const [showQuantityDialog, setShowQuantityDialog] = useState(false);
  const [tempQuantity, setTempQuantity] = useState<string>('');

  const handleQuantityPress = () => {
    if (onQuantityPress) {
      onQuantityPress();
    } else {
      setShowQuantityDialog(true);
      setTempQuantity(quantity.toString());
    }
  };

  const handleQuantityConfirm = () => {
    const newQuantity = parseInt(tempQuantity, 10);

    if (isNaN(newQuantity) || newQuantity < 1) {
      showDialog(
        t("common.error"),
        t("productDetail.invalid_quantity"),
        "error"
      );
      return;
    }

    // Nếu số lượng vượt quá maxQuantity, đặt là maxQuantity
    const finalQuantity = Math.min(newQuantity, maxQuantity || 0);

    setQuantity(finalQuantity);
    setShowQuantityDialog(false);
    setTempQuantity('');
  };

  const handleTextChange = (text: string) => {
    // Chỉ cho phép nhập số
    const numericText = text.replace(/[^0-9]/g, '');
    setTempQuantity(numericText);
  };

  if (isLoading) {
    return (
      <View marginV-10 marginH-20>
        <SkeletonView height={40} width={windowWidth * 0.8} />
      </View>
    );
  }

  return (
    <View
      row
      marginV-10
      marginH-20
      style={{
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Text h2_medium>{t("productDetail.quantity")}</Text>
      <View
        row
        gap-10
        centerV
        style={{
          borderWidth: 1,
          borderColor: "#E0E0E0",
          borderRadius: 10,
        }}
      >
        <TouchableOpacity
          style={{
            padding: 10,
            opacity: quantity <= 1 ? 0.5 : 1
          }}
          disabled={quantity <= 1}
          onPress={() => {
            const newQuantity = Math.max(1, quantity - 1);
            setQuantity(newQuantity);
            setTotalPrice && setTotalPrice(newQuantity * 1000000);
          }}
        >
          <Text h2>-</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleQuantityPress}
          style={{ padding: 10 }}
        >
          <Text>{quantity}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            padding: 10,
            opacity: maxQuantity <= 0 || quantity >= maxQuantity ? 0.5 : 1
          }}
          disabled={maxQuantity <= 0 || quantity >= maxQuantity}
          onPress={() => {
            const newQuantity = Math.min(maxQuantity, quantity + 1);
            setQuantity(newQuantity);
            setTotalPrice && setTotalPrice(newQuantity * 1000000);
          }}
        >
          <Text h2>+</Text>
        </TouchableOpacity>
      </View>

      <AppDialog
        visible={showQuantityDialog}
        title={t("productDetail.enter_quantity")}
        closeButtonLabel={t("common.cancel")}
        confirmButtonLabel={t("common.confirm")}
        severity="info"
        onClose={() => {
          setShowQuantityDialog(false);
          setTempQuantity('');
        }}
        onConfirm={handleQuantityConfirm}
        children={
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: Colors.border,
              borderRadius: 8,
              padding: 10,
              marginTop: 10,
            }}
            keyboardType="numeric"
            value={tempQuantity}
            onChangeText={handleTextChange}
            placeholder={t("productDetail.enter_quantity")}
            maxLength={3}
            autoFocus={true}
          />
        }
      />

      <AppDialog
        visible={dialogConfig.visible}
        title={dialogConfig.title}
        description={dialogConfig.description}
        closeButtonLabel={t("close")}
        severity={dialogConfig.severity}
        onClose={() => {
          hideDialog();
        }}
        confirmButton={false}
      />
    </View>
  );
};

export default ProductQuantity;