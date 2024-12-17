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
import { useState } from "react";
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
  const [tempQuantity, setTempQuantity] = useState('');

  const handleQuantityPress = () => {
    if (maxQuantity <= 0) return;
    
    if (onQuantityPress) {
      onQuantityPress();
    } else {
      setShowQuantityDialog(true);
    }
  };

  const handleQuantityConfirm = () => {
    const newQuantity = parseInt(tempQuantity);
    if (isNaN(newQuantity) || newQuantity < 1) {
      showDialog(
        t("common.error"),
        t("productDetail.invalid_quantity"),
        "error"
      );
      return;
    }

    if (newQuantity > maxQuantity) {
      showDialog(
        t("common.error"),
        t("productDetail.exceed_stock"),
        "error"
      );
      return;
    }

    setQuantity(newQuantity);
    setShowQuantityDialog(false);
    setTempQuantity('');
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
            opacity: quantity <= 1 || maxQuantity <= 0 ? 0.5 : 1
          }}
          disabled={quantity <= 1 || maxQuantity <= 0}
          onPress={() => {
            setQuantity(Math.max(1, quantity - 1));
            setTotalPrice && setTotalPrice(Math.max(1, quantity - 1) * 1000000);
          }}
        >
          <Text h2>-</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleQuantityPress}
          style={{ 
            padding: 10,
            opacity: maxQuantity <= 0 ? 0.5 : 1 
          }}
          disabled={maxQuantity <= 0}
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
            setQuantity(Math.min(maxQuantity, quantity + 1))
            setTotalPrice && setTotalPrice(Math.min(maxQuantity, quantity + 1) * 1000000);
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
            inputMode="numeric"
            value={tempQuantity}
            onChangeText={setTempQuantity}
            placeholder={t("productDetail.enter_quantity")}
            maxLength={2}
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
