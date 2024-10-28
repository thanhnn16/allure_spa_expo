import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Card,
  SortableList,
} from "react-native-ui-lib";
import i18n from "@/languages/i18n";
import { Href, Link } from "expo-router";
import colors from "@/constants/Colors";
import { useNavigation } from "expo-router";
import BackButton from "@/assets/icons/back.svg";
import { OrderChangeInfo } from "react-native-ui-lib/src/components/sortableList/types";

interface VoucherProps {}

const Voucher = (props: VoucherProps) => {
  const navigation = useNavigation();
  const [selected, setSelected] = useState("all");
  const data = [
    { id: "1", label: i18n.t("voucher.all"), value: "all" },
    { id: "2", label: i18n.t("voucher.birthday"), value: "birthday" },
    { id: "3", label: i18n.t("voucher.event"), value: "featured" },
    { id: "4", label: i18n.t("voucher.gift"), value: "gift" },
  ];
  return (
    <View flex marginH-20 marginT-40>
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
            {i18n.t("voucher.title")}
          </Text>
        </View>
        <Image
          width={30}
          height={30}
          source={require("@/assets/images/gift.png")}
        />
      </View>
      <View row marginT-20 paddingL-20>
        <SortableList
          horizontal
          data={data}
          flexMigration
          contentContainerStyle={{ backgroundColor: "transparent" }}
          renderItem={({ item }) => (
            <View style={{ backgroundColor: "transparent" }}>
              <TouchableOpacity
                key={item.value}
                onPress={() => setSelected(item.value)}
                style={{
                  padding: 10,
                  borderRadius: 10,
                  backgroundColor:
                    selected === item.value ? "#717658" : "#D5D6CD",
                  marginRight: 15,
                }}
              >
                <Text
                  style={{
                    color: selected === item.value ? "white" : "#717658",
                  }}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            </View>
          )}
          onOrderChange={function (
            data: { id: string; label: string; value: string }[],
            info: OrderChangeInfo
          ): void {
            throw new Error("Function not implemented.");
          }}
        />
      </View>
      <View center gap-15 space-evenly >
        <Image
          with={345}
          height={345}
          source={require("@/assets/images/giftbox.png")}
        />
        <Text text60 marginT-10>
          Nhiều ưu đãi sắp ra mắt
        </Text>
      </View>
    </View>
  );
};
export default Voucher;
