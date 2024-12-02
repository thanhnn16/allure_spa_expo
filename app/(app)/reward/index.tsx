import React from "react";
import { View, Text, Carousel, PageControlPosition, AnimatedImage, Image, Colors } from "react-native-ui-lib";
import { ScrollView, StyleSheet } from "react-native";
import { useLanguage } from "@/hooks/useLanguage";


import PagerView from "react-native-pager-view";
import AppBar from "@/components/app-bar/AppBar";
import { Dimensions, Pressable } from "react-native";
import { Href, router } from "expo-router";
import { FlatList, GestureHandlerRootView } from "react-native-gesture-handler";

interface RewardProps { }

interface EventProps {
  id: number;
  title: string;
  description: string;
  url: string;
}

const Event = [
  {
    id: 1,
    title: "Sự kiện 1",
    description: "Mô tả sự kiện 1",
    url: "https://picsum.photos/300/200",
  },
  {
    id: 2,
    title: "Sự kiện 2",
    description: "Mô tả sự kiện 2",
    url: "https://picsum.photos/300/200",
  },
  {
    id: 3,
    title: "Sự kiện 3",
    description: "Mô tả sự kiện 3",
    url: "https://picsum.photos/300/200",
  },
  {
    id: 4,
    title: "Sự kiện 4",
    description: "Mô tả sự kiện 4",
    url: "https://picsum.photos/300/200",
  },
]

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
          <Text h1_bold marginV-16>Sự kiện nổi bật</Text>

          <FlatList
            data={Event}
            renderItem={({ item }) => (
              <View
                marginR-16
                style={styles.section}
              >
                <Pressable onPress={() => handleOpenImage(item.id)}>
                  <View width={300} height={160}>
                    <Image
                      source={{ uri: item.url }}
                      cover
                      style={{ borderRadius: 12, overflow: "hidden" }}
                    />
                  </View>
                  <View paddingT-8>
                    <Text h2_bold>{item.title}</Text>
                    <Text>{item.description}</Text>
                  </View>
                </Pressable>
              </View>
            )}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
          />

          <Text h1_bold marginV-16>Tất cả sự kiện</Text>

          {Event.map((item: EventProps, index: number) => (
            <View
              paddingT-12
              style={styles.section}
            >
              <Pressable onPress={() => handleOpenImage(item.id)} key={index}>
                <View width={'100%'} height={160}>
                  <AnimatedImage
                    source={{ uri: item.url }}
                    cover
                    style={{ borderRadius: 12, overflow: "hidden" }}
                  />
                </View>
                <View paddingT-8>
                  <Text h2_bold>{item.title}</Text>
                  <Text>{item.description}</Text>
                </View>
              </Pressable>
            </View>
          ))}

        </ScrollView>
      </View>
    </GestureHandlerRootView>
  );
};
export default Reward;

const styles = StyleSheet.create({
  section: {
    padding: 16,
    backgroundColor: Colors.white,
    borderRadius: 8,
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