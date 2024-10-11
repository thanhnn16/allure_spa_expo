<<<<<<< HEAD
// import { StyleSheet, Text, View } from 'react-native'
// import React from 'react'

// const ProfilePage = () => {
//   return (
//     <View>
//       <Text>index</Text>
//     </View>
//   )
// }

// export default ProfilePage;

// const styles = StyleSheet.create({})
=======
import ArrowRight from "@/assets/icons/arrow.svg";
import { View, Text, Card, Image, TouchableOpacity } from "react-native-ui-lib";
import { Href, Link } from "expo-router";
import colors from "@/constants/Colors";

interface ProfilePageProps { }

const ProfilePage = () => {
  return (
    <View flex useSafeArea backgroundColor={colors.background}>
      <View paddingH-16>
        <Card
          row
          elevation={5}
          centerV
          gap-15
          spread
          paddingV-16
          borderRadius={16}
          backgroundColor={colors.secondary}
          paddingH-12
        >
          <View row gap-10 centerV>
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
              br20
              paddingH-8
              paddingV-2
            >
              <Image
                width={24}
                height={24}
                source={require("@/assets/images/gift.png")}
              />
            </TouchableOpacity>
          </View>
        </Card>
        <Card width={"100%"} marginV-16 paddingV-8 paddingH-12 borderRadius={16}>
          {[
            {
              title: "Tài khoản của tôi",
              description: "Chỉnh sửa thông tin cá nhân",
              icon: require("@/assets/images/people.png"),
              href: "(tabs)/profile/detail/"
            },
            {
              title: "Chính sách mua hàng, đổi trả",
              description: "Chính sách áp dụng cho Allure Spa",
              icon: require("@/assets/images/chamhoi.png"),
              href: "/(authen)/index"
            },
            {
              title: "Địa chỉ đặt hàng",
              description: "Danh sách địa chỉ",
              icon: require("@/assets/images/location.png"),
              href: "(tabs)/profile/address/"
            },
            {
              title: "Đăng xuất",
              description: "",
              icon: require("@/assets/images/logout.png"),
              href: "/(authen)/index"
            },
          ].map((item, index) => (
            <Link href={item.href as Href<string>} key={index} asChild>
              <TouchableOpacity>
                <View row paddingV-10 gap-20 center>
                  <TouchableOpacity
                  >
                    <View width={40} height={40} backgroundColor={colors.secondary} br100 center>
                      <Image source={item.icon} width={20} height={20} />
                    </View>
                  </TouchableOpacity>
                  <View flex gap-5>
                    <Text text80BO>{item.title}</Text>
                    {item.description ? <Text gray>{item.description}</Text> : null}
                  </View>
                  <Image source={ArrowRight} />
                </View>
              </TouchableOpacity>
            </Link>
          ))}
        </Card>
        <Text text80BO gray text80M>
          More
        </Text>
        <Card width={"100%"} marginV-16 paddingV-8 paddingH-12 borderRadius={16}>
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
              <View row paddingV-10 gap-20 centerV>
                <TouchableOpacity
                >
                  <View width={40} height={40} backgroundColor={colors.secondary} br100 center>
                    <Image source={item.icon} width={24} height={24} />
                  </View>
                </TouchableOpacity>
                <View flex gap-5>
                  <Text text80BO>{item.title}</Text>
                </View>
                <Image source={ArrowRight} />
              </View>
            </TouchableOpacity>
          ))}
        </Card>
      </View>
    </View>
  );
};

export default ProfilePage;
>>>>>>> f4644e7808094eb434dd0ea1427ec83affa0dd96
