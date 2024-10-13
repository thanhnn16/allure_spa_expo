import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  GridList,
} from "react-native-ui-lib";
import { router } from "expo-router";
import colors from "@/constants/Colors";
import BackButton from "@/assets/icons/back.svg";
import { Href, Link } from "expo-router";
import PagerView from "react-native-pager-view";
import { Myphamdata } from "./myphamdata";
import { Spadata } from "./spadata";
import RewardItemProps from "./rewardItem";

interface RewardProps {}

const Reward: React.FC<RewardProps> = () => {
  const [selectedPage, setSelectedPage] = React.useState(0);
  return (
    <View flex marginH-20 marginT-40>
      <View row centerV>
        <TouchableOpacity
          onPress={() => {
            router.back();
            console.log("Back");
          }}
        >
          <Image width={30} height={30} source={BackButton} />
        </TouchableOpacity>
        <View flex center>
          <Text text60 bold style={{ color: "#717658" }}>
            Đổi quà
          </Text>
        </View>
        <View row centerV gap-2>
          <Image
            width={16}
            height={16}
            source={require("@/assets/images/allureCoin.png")}
          />
          <Text text70 orange1>
            1234
          </Text>
        </View>
      </View>
      <View row marginT-20 style={{}}>
        <TouchableOpacity
          onPress={() => setSelectedPage(0)}
          style={{
            flex: 1,
            borderRadius: 10,
            padding: 10,
            marginRight: 10,
          }}
        >
          <Text
            style={{
              color: selectedPage === 0 ? "#717658" : colors.black,
              textAlign: "center",
            }}
          >
            Mỹ phẩm
          </Text>
          <View
            style={{
              height: 3,
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
              backgroundColor: selectedPage === 0 ? "#717658" : "transparent",
              width: "50%",
              alignSelf: "center",
              marginTop: 10,
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setSelectedPage(1)}
          style={{
            flex: 1,
            borderRadius: 10,
            padding: 10,
          }}
        >
          <Text
            style={{
              color: selectedPage === 0 ? "#717658" : colors.black,
              textAlign: "center",
            }}
          >
            Spa
          </Text>
          <View
            style={{
              height: 3,
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
              backgroundColor: selectedPage === 1 ? "#717658" : "transparent",
              width: "50%",
              alignSelf: "center",
              marginTop: 10,
            }}
          />
        </TouchableOpacity>
      </View>
      <PagerView
        style={{ flex: 1, marginTop: 20 }}
        initialPage={0}
        onPageSelected={(e) => {
          setSelectedPage(e.nativeEvent.position);
        }}
      >
        <View key="1">
          <GridList
            data={Myphamdata}
            renderItem={({ item }) => (
              <View style={{ flex: 1, padding: 5  }}>
                <RewardItemProps item={item} />
              </View>
            )}
            numColumns={2}
          ></GridList>
        </View>
        <View key="2">
          <GridList
            data={Spadata}
            renderItem={({ item }) => <RewardItemProps item={item} />}
            columnWrapperStyle={{ justifyContent: "space-between" }}
            showsVerticalScrollIndicator={false}
            numColumns={2}
          ></GridList>
        </View>
      </PagerView>
    </View>
  );
};
export default Reward;
