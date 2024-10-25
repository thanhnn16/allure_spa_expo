import react from "react";
import { Redirect } from "expo-router";
import { useFonts } from "expo-font";

import { View, Text, Card, Image, TouchableOpacity, ScrollBar } from "react-native-ui-lib";
import { Href, Link } from "expo-router";
import colors from "@/constants/Colors";
import BackButton from "@/assets/icons/back.svg";
import { router, useNavigation } from "expo-router";

interface AboutAppProps {}

const AboutApp = () => {
  return (
    <View flex marginH-20 marginT-20 useSafeArea>
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
      <View center>
        <Image
          width={76}
          height={76}
          borderRadius={50}
          source={require("@/assets/images/logo.png")}
        />
      </View>
      <ScrollBar
        style={{ flex: 1, width: "100%" }}
        contentContainerStyle={{ padding: 20 }}
        scrollEnabled 
      >
      <View center marginT-10>
        <Text>
          Ứng dụng Allure Spa là giải pháp hoàn hảo dành cho những ai yêu thích
          làm đẹp và mong muốn khám phá các sản phẩm, dịch vụ spa chất lượng cao
          đến từ Nhật Bản. Được thiết kế dành riêng cho khách hàng của Allure
          Spa, ứng dụng này không chỉ mang đến trải nghiệm mua sắm tiện lợi mà
          còn giúp khách hàng dễ dàng tiếp cận với các liệu trình chăm sóc sắc
          đẹp đẳng cấp.
        </Text>
        <Text text60BL >Các thông tin cơ bản của ứng dụng Allure Spa:</Text>
        <Text text60BL >- Tên ứng dụng: Allure Spa</Text>
        <Text text60BL >- Phiên bản 1.0.0</Text>
        <Text text60BL>- Nhà phát triển: Ong lười</Text>
        <Text text60BL >- Ngày phát hành: 01/01/2022</Text>
      </View>
      </ScrollBar>
     
    </View>
  );
};

export default AboutApp;
