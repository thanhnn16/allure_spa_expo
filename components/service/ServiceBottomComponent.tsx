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
import { useLanguage } from "@/hooks/useLanguage";

const { t } = useLanguage();
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
      const price = service?.single_price
        ? parseFloat(service.single_price.toString())
        : 0;

      const orderItem = {
        id: service?.id,
        name: service?.service_name,
        price: price,
        priceValue: price,
        quantity: 1,
        image: service?.media?.[0]?.full_url,
        type: "service",
        service_type: "single",
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
