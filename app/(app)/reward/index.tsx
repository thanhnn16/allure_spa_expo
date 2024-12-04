import React from "react";
import { View, Text, Carousel, PageControlPosition, AnimatedImage, Image, Colors } from "react-native-ui-lib";
import { ScrollView, StyleSheet } from "react-native";
import { useLanguage } from "@/hooks/useLanguage";


import PagerView from "react-native-pager-view";
import AppBar from "@/components/app-bar/AppBar";
import { Dimensions, Pressable } from "react-native";
import { Href, router } from "expo-router";
import { FlatList, GestureHandlerRootView } from "react-native-gesture-handler";
import { Feather, Ionicons } from "@expo/vector-icons";
import AppButton from "@/components/buttons/AppButton";

interface RewardProps { }

interface RewardDataProps {
  id: number;
  code: string;
  value: number;
  min_order_value: number;
  max_discount_amount: number;
  point: number;
}

export const RewardData: RewardDataProps[] = [
  {
    id: 1,
    code: "DISCOUNT10",
    value: 10,
    min_order_value: 50,
    max_discount_amount: 10,
    point: 100,
  },
  {
    id: 2,
    code: "FREESHIP",
    value: 100,
    min_order_value: 30,
    max_discount_amount: 0,
    point: 50,
  },
  {
    id: 3,
    code: "SAVE20",
    value: 20,
    min_order_value: 100,
    max_discount_amount: 20,
    point: 200,
  },
];
const Reward: React.FC<RewardProps> = () => {
  const { t } = useLanguage();
  // const [selectedPage, setSelectedPage] = React.useState(0);
  // const pagerRef = React.useRef<PagerView>(null);
  // const handlePageChange = (page: number) => {
  //   setSelectedPage(page);
  //   if (pagerRef.current) {
  //     pagerRef.current.setPageWithoutAnimation(page);
  //   }
  // };

  const handleOpenImage = (index: number) => {
    console.log(index);
    router.push(`/reward/${index}`);
  }
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View flex bg-white>
        <AppBar back title={t("reward.title")} />
        <ScrollView style={{ flex: 1, paddingHorizontal: 16 }}>

          {RewardData.map((item: RewardDataProps, index: number) => (
            <View
              style={styles.section}
              key={index}
            >
              <Pressable onPress={() => handleOpenImage(item.id)} key={index}>
                <View centerV row spread>
                  <View row gap-8>
                    <View
                      style={{
                        width: 56,
                        height: 56,
                        borderRadius: 12,
                        backgroundColor: Colors.primary_blur,
                        borderWidth: 1,
                        borderColor: Colors.primary_light,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Feather
                        name={'credit-card' as any}
                        size={24}
                        color={Colors.primary}
                      />
                    </View>
                    <View>
                      <Text h3_bold>{item.code}</Text>
                      <Text h3>Giảm: {item.value}</Text>
                      <View row gap-4 centerV>
                        <Image
                          width={16}
                          height={16}
                          marginB-2
                          source={require("@/assets/images/allureCoin.png")}
                        />
                        <Text color={Colors.primary} h3_bold>
                          100
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View width={100}>
                    <AppButton
                      type="primary"
                      title="Đổi"
                      onPress={() => { }}
                    />
                  </View>
                </View>
              </Pressable>
            </View>
          ))}

        </ScrollView>
      </View >
    </GestureHandlerRootView >
  );
};
export default Reward;

const styles = StyleSheet.create({
  section: {
    padding: 8,
    backgroundColor: Colors.white,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: Colors.grey40,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    borderColor: Colors.primary_light,
    borderWidth: 1,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  }
})