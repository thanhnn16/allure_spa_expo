import { router } from "expo-router";
import { SafeAreaView } from "react-native";
import { View, Text, Colors, Button, Image } from "react-native-ui-lib";

const Transaction = () => {

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }}>
      <View gap-20 flex centerV centerH>
        <Image width={200} height={200} source={require("@/assets/images/268268.png")}/>
        <Text h2_bold>Đã xác nhận đơn hàng</Text>
        <Text h3>Cảm ơn ha</Text>
      </View>
      <View gap-10 bottom paddingH-20 marginB-10>
        <Button
          label={"Xem chi tiết đơn hàng"}
          labelStyle={{ fontFamily: "SFProText-Bold", fontSize: 16 }}
          backgroundColor={Colors.secondary}
          borderRadius={10}
          onPress={() => router.push("/(app)/transaction/detail")}
        />
        <Button
          label={"Về màn hình chính"}
          labelStyle={{ fontFamily: "SFProText-Bold", fontSize: 16 }}
          backgroundColor={Colors.primary}
          borderRadius={10}
          onPress={() => router.dismissAll()}
        />
      </View>
    </SafeAreaView>
  );
};

export default Transaction;
