import {
  View,
  Text,
  TouchableOpacity,
  Button,
  Image,
  SkeletonView,
  Incubator,
  Colors,
} from "react-native-ui-lib";
import { router } from "expo-router";
import { useLanguage } from "@/hooks/useLanguage";

import { Dimensions } from "react-native";
import { useState } from "react";
import { useDispatch } from "react-redux";

import PhoneCallIcon from "@/assets/icons/phone.svg";
import CommentIcon from "@/assets/icons/comment.svg";
import Linking from "expo-linking";
import {
  ServiceDetailResponeModel,
  ServiceResponeModel,
} from "@/types/service.type";
import { setTempOrder } from "@/redux/features/order/orderSlice";

type ServiceWithCombo =
  | ServiceResponeModel
  | (ServiceDetailResponeModel & {
      combo?: number;
    });

interface ServiceBottomComponentProps {
  isLoading: boolean;
  onPurchase?: () => void;
  service: ServiceWithCombo;
}

const ServiceBottomComponent: React.FC<ServiceBottomComponentProps> = ({
  isLoading = false,
  onPurchase,
  service,
}) => {
  const { t } = useLanguage();

  const [isToastVisible, setToastIsVisible] = useState(false);
  const windowWidth = Dimensions.get("window").width;
  const dispatch = useDispatch();

  const handlePurchase = () => {
    console.log("handlePurchase called, service:", service);
    if (onPurchase) {
      onPurchase();
    } else {
      // Get price based on service_type
      let price = 0;
      let serviceType = "single";

      // Add type guard to check if combo exists
      if ("combo" in service) {
        console.log("Combo detected:", service.combo);
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
        console.log("No combo detected, using single price");
        price = service?.single_price || 0;
        serviceType = "single";
      }

      console.log("Selected price:", price, "Service type:", serviceType);

      const orderItem = {
        item_id: service?.id,
        item_type: "service",
        quantity: 1,
        price: price,
        service_type: serviceType,
        service: service,
        name: service?.service_name,
        image: service?.media?.[0]?.full_url,
      };

      console.log("Order item created:", orderItem);

      dispatch(
        setTempOrder({
          items: [orderItem],
          totalAmount: price,
        })
      );

      console.log("Temp order dispatched, redirecting to checkout");
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
        <TouchableOpacity onPress={() => Linking.openURL(`tel:113`)}>
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
      <Incubator.Toast
        visible={isToastVisible}
        position={"bottom"}
        autoDismiss={1500}
        onDismiss={() => setToastIsVisible(false)}
      >
        <View bg-$backgroundSuccessLight flex padding-10>
          <Text h3_medium>Thêm giỏ hàng thành công</Text>
        </View>
      </Incubator.Toast>
    </View>
  );
};

export default ServiceBottomComponent;
