import React, { useState } from "react";
import { View, Text, TouchableOpacity, Button, Image, SkeletonView, Incubator, Colors} from "react-native-ui-lib";
import { useDispatch } from "react-redux";
import { router } from "expo-router";
import { useLanguage } from "@/hooks/useLanguage";
import { useAuth } from "@/hooks/useAuth";
import PhoneCallIcon from "@/assets/icons/phone.svg";
import CommentIcon from "@/assets/icons/comment.svg";
import { setTempOrder } from "@/redux/features/order/orderSlice";
import { ServiceDetailResponeModel, ServiceResponeModel } from "@/types/service.type";
import AppDialog from "@/components/dialog/AppDialog";
import {Dimensions, Linking} from "react-native";

type ServiceWithCombo = ServiceResponeModel | (ServiceDetailResponeModel & { combo?: number });

interface ServiceBottomComponentProps {
  isLoading: boolean;
  onPurchase?: () => void;
  service: ServiceWithCombo;
}

const ServiceBottomComponent: React.FC<ServiceBottomComponentProps> = ({ isLoading = false, onPurchase, service }) => {
  const { t } = useLanguage();
  const { isGuest } = useAuth();
  const [buyProductDialog, setBuyProductDialog] = useState(false);
  const windowWidth = Dimensions.get("window").width;
  const dispatch = useDispatch();

  const handleLoginConfirm = () => {
    setBuyProductDialog(false);
    router.replace("/(auth)");
  };

  const handlePurchase = () => {
    if (isGuest) {
      setBuyProductDialog(true);
      return;
    }
    if (onPurchase) {
      onPurchase();
    } else {
      let price = 0;
      let serviceType = "single";

      if ("combo" in service) {
        if (service.combo === 1) {
          price = service?.combo_5_price || 0;
          serviceType = "combo_5";
        } else if (service.combo === 2) {
          price = service?.combo_10_price || 0;
          serviceType = "combo_10";
        } else {
          price = service?.single_price || 0;
          serviceType = "single";
        }
      } else {
        price = service?.single_price || 0;
        serviceType = "single";
      }

      const orderItem = {
        item_id: service?.id,
        item_type: "service",
        quantity: 1,
        price: price,
        service_type: serviceType,
        service: service,
        name: service?.service_name,
        image: service?.media?.[0]?.full_url
      };

      dispatch(
        setTempOrder({
          items: [orderItem],
          totalAmount: price,
        })
      );

      router.push("/check-out?source=direct");
    }
  };

  if (isLoading) {
    return (
        <View padding-24>
          <SkeletonView height={50} width={windowWidth * 0.85} />
        </View>
    );
  }

  return (
      <View
          row
          centerV
          padding-24
          style={{
            borderTopStartRadius: 30,
            borderTopEndRadius: 30,
            borderWidth: 2,
            borderColor: "#E0E0E0",
          }}
      >
        <View row gap-30>
          <TouchableOpacity onPress={() => Linking.openURL(`tel:0346542636`)}>
            <View center marginB-4>
              <Image source={PhoneCallIcon} size={24} />
            </View>
            <Text h3_medium>{t("service.contact")}</Text>
          </TouchableOpacity>
          <TouchableOpacity
              onPress={() => {
                if (service?.id) {
                  router.push({
                    pathname: "/rating/[id]",
                    params: { id: service.id, type: "service" },
                  });
                }
              }}
          >
            <View center marginB-4>
              <Image source={CommentIcon} size={24} />
            </View>
            <Text h3_medium>{t("productDetail.reviews")}</Text>
          </TouchableOpacity>
        </View>
        <View flex right>
          <Button
              label={t("service.serviceDetail.book_now").toString()}
              br40
              onPress={handlePurchase}
              backgroundColor={Colors.primary}
          />
        </View>
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
      </View>
  );
};

export default ServiceBottomComponent;
