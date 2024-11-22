import {
  View,
  Text,
  TouchableOpacity,
  Button,
  Image,
  SkeletonView,
  Incubator,
  Colors,
  Dialog,
} from "react-native-ui-lib";
import { Link, router } from "expo-router";
import i18n from "@/languages/i18n";
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
import { setOrderProducts } from "@/redux/features/order/orderSlice";

interface ServiceBottomComponentProps {
  isLoading: boolean;
  // product: Product | null;
  onPurchase?: () => void;
  // quantity: number;
  service: ServiceResponeModel | ServiceDetailResponeModel;
}

const ServiceBottomComponent: React.FC<ServiceBottomComponentProps> = ({
  isLoading = false,
  onPurchase,
  service,
}) => {
  const [isToastVisible, setToastIsVisible] = useState(false);
  const windowWidth = Dimensions.get("window").width;
  const dispatch = useDispatch();

  const handlePurchase = () => {
    if (onPurchase) {
      onPurchase();
    } else {
      const serviceData = {
        id: service?.id,
        name: service?.service_name,
        price: service?.single_price
          ? parseFloat(service.single_price.toString())
          : 0,
        priceValue: service?.single_price
          ? parseFloat(service.single_price.toString())
          : 0,
        quantity: 1,
        image: service?.media?.[0]?.full_url,
        type: "service",
        service_type: "single",
      };

      dispatch(
        setOrderProducts({
          items: [
            {
              item_id: service?.id,
              item_type: "service",
              quantity: 1,
              price: parseFloat(service?.single_price?.toString() || "0"),
              service_type: "single",
              service: {
                id: service?.id,
                service_name: service?.service_name,
                media: service?.media || [],
                price: parseFloat(service?.single_price?.toString() || "0"),
              },
            },
          ],
          totalAmount: serviceData.priceValue,
          fromCart: false,
        })
      );

      router.push("/check-out");
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
          <Text h3_medium>{i18n.t("service.contact")}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: `/(app)/rating/${service?.id}`,
              params: { type: "service" },
            })
          }
        >
          <View center marginB-4>
            <Image source={CommentIcon} size={24} />
          </View>
          <Text h3_medium>{i18n.t("productDetail.reviews")}</Text>
        </TouchableOpacity>
      </View>
      <View flex right>
        <Button
          label={i18n.t("service.serviceDetail.book_now").toString()}
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
