import react from "react";
import { Redirect } from "expo-router";
import { useFonts } from "expo-font";

import {
  View,
  Text,
  Card,
  Image,
  TouchableOpacity,
  ScrollBar,
} from "react-native-ui-lib";
import { Href, Link } from "expo-router";
import colors from "@/constants/Colors";
import BackButton from "@/assets/icons/back.svg";
import { router, useNavigation } from "expo-router";

interface AboutAppProps {}

const AboutApp = () => {
  return (
    <View flex marginH-20 marginT-40 useSafeArea>
      <View row centerV>
        <TouchableOpacity
          onPress={() => {
            router.back();
          }}
        >
          <Image width={30} height={30} source={BackButton} />
        </TouchableOpacity>
        <View flex center>
          <Text
            text60BO
            marginR-30
            style={{ color: "#717658", letterSpacing: 0.75 }}
          >
            About App
          </Text>
        </View>
      </View>
      <View center marginT-40>
        <Image
          width={300}
          height={300}
          borderRadius={50}
          source={require("@/assets/images/logo/logo.png")}
        />
      </View>

      <View width={"100%"} height={"100%"}>
        <Text text80BL>
          Ứng dụng Allure Spa là giải pháp hoàn hảo dành cho những ai yêu thích
          làm đẹp và mong muốn khám phá các sản phẩm, dịch vụ spa chất lượng cao
          đến từ Nhật Bản. Được thiết kế dành riêng cho khách hàng của Allure
          Spa, ứng dụng này không chỉ mang đến trải nghiệm mua sắm tiện lợi mà
          còn giúp khách hàng dễ dàng tiếp cận với các liệu trình chăm sóc sắc
          đẹp đẳng cấp.
        </Text>
        <Text marginT-20 text70BL>
          Các thông tin cơ bản của ứng dụng Allure Spa:
        </Text>
        <Text marginT-20 text70BL>
          - Tên ứng dụng: Allure Spa
        </Text>
        <Text marginT-20 text70BL>
          - Phiên bản 1.0.0
        </Text>
        <Text marginT-20 text70BL>
          - Nhà phát triển: Ong lười
        </Text>
        <Text marginT-20 text70BL>
          - Ngày phát hành: 01/01/2022
        </Text>
      </View>
    </View>
  );
};

export default AboutApp;
