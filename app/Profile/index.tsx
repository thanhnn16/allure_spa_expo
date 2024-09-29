import React from "react";
import ArrowRight from "@/assets/icons/arrow.svg";
import { View, Text, Card, Image, TouchableOpacity } from "react-native-ui-lib";

interface ProfilePageProps {}

const ProfilePage = () => {
  return (
    <View flex marginH-20 marginT-20>
      <Text text60BL marginB-10>
        Profile
      </Text>
      <Card
        width={"100%"}
        height={100}
        row
        elevation={5}
        centerV
        gap-15
        space-evenly
        borderRadius={20}
        backgroundColor={"#D5D6CD"}
        paddingH-20
      >
        <Image
          width={64}
          height={64}
          borderRadius={50}
          source={require("@/assets/images/avt.png")}
        />
        <View>
          <Text text60>Nguyễn Văn Tèo</Text>
          <Text>+84 346 542 636</Text>
        </View>

        <View gap-10>
          <View row gap-5>
            <Image
              width={20}
              height={20}
              source={require("@/assets/images/allureCoin.png")}
            />
            <Text white>1234</Text>
          </View>

          <TouchableOpacity
            center
            backgroundColor="#FFFFFF"
            style={{ borderRadius: 10, width: 48, height: 29, elevation: 5 }}
            onPress={() => {
              console.log("Gift");
            }}
          >
            <Image
              width={20}
              height={20}
              source={require("@/assets/images/gift.png")}
            />
          </TouchableOpacity>
        </View>
      </Card>
      <Card width={"100%"} marginT-20>
        {[
          {
            title: "Tài khoản của tôi",
            description: "Chỉnh sửa thông tin cá nhân",
            icon: require("@/assets/images/people.png"),
            onPress: () => {
              console.log("Tài khoản của tôi");
            },
          },
          {
            title: "Chính sách mua hàng, đổi trả",
            description: "Chính sách áp dụng cho Allure Spa",
            icon: require("@/assets/images/chamhoi.png"),
            onPress: () => {
              console.log("Chính sách mua hàng, đổi trả");
            },
          },
          {
            title: "Địa chỉ đặt hàng",
            description: "Danh sách địa chỉ",
            icon: require("@/assets/images/location.png"),
            onPress: () => {
              console.log("Địa chỉ đặt hàng");
            },
          },
          {
            title: "Đăng xuất",
            description: "",
            icon: require("@/assets/images/logout.png"),
            onPress: () => {
              console.log("Đăng xuất");
            },
          },
        ].map((item, index) => (
          <TouchableOpacity key={index} onPress={item.onPress}>
            <View row padding-10 gap-20 center>
              <TouchableOpacity
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 50,
                  backgroundColor: "#F7F7F7",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Image source={item.icon} width={24} height={24} />
              </TouchableOpacity>
              <View flex gap-5>
                <Text text70BL>{item.title}</Text>
                {item.description ? <Text gray>{item.description}</Text> : null}
              </View>
              <Image source={ArrowRight} />
            </View>
          </TouchableOpacity>
        ))}
      </Card>
      <Text text80BO gray style={{ letterSpacing: 1 }} marginT-10>
        More
      </Text>
      <Card width={"100%"} marginT-20>
        {[
          {
            title: "Trợ giúp & Hỗ trợ",
            icon: require("@/assets/images/ring.png"),
            onPress: () => {
              console.log("Trợ giúp & Hỗ trợ"); 
            }
          },
          {
            title: "Giới thiệu về ứng dụng",
            icon: require("@/assets/images/heart.png"),
            onPress: () => {
              console.log("Giới thiệu về ứng dụng");
            },
          },
          {
            title: "Cài đặt",
            icon: require("@/assets/images/setting.png"),
            onPress: () => {
              console.log("Cài đặt");
            },
          },
        ].map((item, index) => (
          <TouchableOpacity key={index} onPress={item.onPress}>
            <View  row padding-10 gap-20 center>
              <TouchableOpacity
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 50,
                  backgroundColor: "#F7F7F7",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Image source={item.icon} width={24} height={24} />
              </TouchableOpacity>
              <View flex gap-5>
                <Text text70BL>{item.title}</Text>
              </View>
              <Image source={ArrowRight} />
            </View>
          </TouchableOpacity>
        ))}
      </Card>
    </View>
  );
};

export default ProfilePage;
