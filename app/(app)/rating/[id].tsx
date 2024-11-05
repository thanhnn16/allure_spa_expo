import { useLocalSearchParams } from "expo-router";
import { View, Text } from "react-native-ui-lib";
import RatingBar from "@/components/rating/RatingBar";
import RatingItem from "./RatingItem";
import { FlatList, SafeAreaView } from "react-native";
import { data } from "./data";
import AppBar from "@/components/app-bar/AppBar";
import i18n from "@/languages/i18n";

import RatingStar from "@/components/rating/RatingStar";

const RatingPage = () => {
  const { id } = useLocalSearchParams();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View bg-$backgroundDefault flex>
        <AppBar back title="Đánh giá" />
        <View padding-20 row centerV>
          <View>
            <Text h2_bold>4.9/5</Text>
            <View height={2}></View>
            <Text h3_medium>
              {i18n.t("rating.base_on")} 69 {i18n.t("rating.reviews")}
            </Text>
            <View height={10}></View>
            <View left>
              <RatingStar rating={4.5} />
            </View>
          </View>

          <View flex right>
            <RatingBar star={1} percent={90} />
            <RatingBar star={2} percent={80} />
            <RatingBar star={3} percent={70} />
            <RatingBar star={4} percent={60} />
            <RatingBar star={5} percent={50} />
          </View>
        </View>

        <View style={{ flex: 1 }}>
          <FlatList
            data={data}
            renderItem={({ item }) => <RatingItem item={item} />}
            contentContainerStyle={{ gap: 10 }}
            ListFooterComponent={<View height={90} />}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default RatingPage;
