import React from "react";
import { View, Text, TouchableOpacity, Image, Card } from "react-native-ui-lib";
import { useNavigation } from "expo-router";
import BackButton from "@/assets/icons/back.svg";
import ArrowRight from "@/assets/icons/arrow.svg";
import ProfileEdit from "./profile_edit";


interface ProfileDetailProps {}

const ProfileDetail = (props: ProfileDetailProps) => {
  const navigation = useNavigation();
  return (
    <View flex marginH-20 marginT-20>
      <View row centerV>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
            console.log("Back");
          }}
        >
          <Image width={30} height={30} source={BackButton} />
        </TouchableOpacity>
        <View flex center>
          <Text text60 bold marginR-30 style={{ color: "#717658" }}>
            Hồ Sơ
          </Text>
        </View>
      </View>
      <View center marginT-30 gap-7>
        <Image
          width={76}
          height={76}
          borderRadius={50}
          style={{ borderColor: "#D5D6CD", borderWidth: 2 }}
          source={require("@/assets/images/avt.png")}
        />
        <Text text60>Nguyễn Văn Tèo</Text>
        <Text gray>+84 346 542 636</Text>
      </View>
      <Card width={"100%"} marginT-20>
        {[
          {
            title: "Chỉnh sửa hồ sơ",
            icon: require("@/assets/images/edit.png"),
            onPress: () => {
                navigation.navigate('ProfileEdit' as never);
              console.log("Chỉnh sửa hồ sơ"); 
            }
          },
          {
            title: "Đổi mật khẩu",
            icon: require("@/assets/images/key.png"),
            onPress: () => {
              console.log("đổi mật khẩu");
            },
          },
          {
            title: "Lịch sử đăng nhập",
            icon: require("@/assets/images/global.png"),
            onPress: () => {
              console.log("Lịch sử đăng nhập");
            },
          },
            {
                title: "Tải thông tin của bạn xuống",
                icon: require("@/assets/images/dowload.png"),
                onPress: () => {
                console.log("download");
                },
            },
            {
                title: "Xóa tài khoản",
                icon: require("@/assets/images/deleteacount.png"),
                onPress: () => {
                console.log("xóa tài khoản");
                },
            }
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

export default ProfileDetail;
