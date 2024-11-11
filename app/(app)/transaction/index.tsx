import { router } from "expo-router";
import { SafeAreaView } from "react-native";
import { View, Text, Colors, Button, Image } from "react-native-ui-lib";

import SuccessIcon from "@/assets/icons/star.svg";
import FailIcon from "@/assets/icons/star_half.svg";

const Transaction = () => {
  const isSuccess = true;

  const renderIcon = () => {
    if (isSuccess) {
      return SuccessIcon;
    }
    return FailIcon;
  };

  const renderButton = () => {
    if (isSuccess) {
      return (
        <Button
          label="Chi tiết đơn hàng"
          labelStyle={{ fontFamily: "SFProText-Bold", fontSize: 16 }}
          backgroundColor={Colors.primary}
          padding-20
          borderRadius={13}
          onPress={() => router.push("/(app)/transaction/detail")}
        />
      );
    }
    return (
      <Button
        label="Liên hệ hỗ trợ"
        labelStyle={{ fontFamily: "SFProText-Bold", fontSize: 16 }}
        backgroundColor={Colors.primary}
        padding-20
        borderRadius={13}
        onPress={() => router.dismissAll()}
      />
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }}>
      <View flex centerV centerH gap-10 paddingH-20>
        <Image
          source={renderIcon()}
          width={200}
          height={200}
        />
        {isSuccess ? (
          <Text h2_bold color={Colors.primary}>
            Thanh toán thành công
          </Text>
        ) : (
          <Text h2_bold>
            Thanh toán thất bại
          </Text>
        )}
        {isSuccess ? (
          <Text h3 center color={Colors.grey40}>
            Đơn hàng #123456 của bạn đã được xác nhận
          </Text>
        ) : (
          <Text h3 center color={Colors.grey40}>
            Đơn hàng #123456 của bạn đang gặp sự cố, liên hệ để biết thêm chi tiết
          </Text>
        )}
      </View>
      <View bottom gap-10 marginB-10 paddingH-20>
        {renderButton()}
        <Button
          label="Quay lại trang chủ"
          labelStyle={{ fontFamily: "SFProText-Bold", fontSize: 16 }}
          backgroundColor={Colors.primary}
          padding-20
          borderRadius={13}
          onPress={() => router.dismissAll()}
        />
      </View>
    </SafeAreaView>
  );
};

export default Transaction;
