import { useLocalSearchParams } from "expo-router";
import { View, Text } from "react-native-ui-lib";
import RatingBar from "@/components/rating/RatingBar";
import RatingItem from "./RatingItem";
import { FlatList, SafeAreaView } from "react-native";
import AppBar from "@/components/app-bar/AppBar";
import i18n from "@/languages/i18n";

import RatingStar from "@/components/rating/RatingStar";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { useEffect, useState } from "react";
import { getAllRatingProductThunk } from "@/redux/features/rating/getAllRatingProductThunk";


const RatingPage = () => {
  const { id } = useLocalSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<any[]>([]);

  const { ratings, isLoading: RatingLoading } = useSelector(
    (state: RootState) => state.rating
  );
  useEffect(() => {
    dispatch(getAllRatingProductThunk({ id: id }));
    console.log("Rating:", ratings);
  }, [dispatch]);

  return (
    <View flex bg-$backgroundDefault>
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
            data={ratings}
            renderItem={({ item }) => <RatingItem item={item} />}
            contentContainerStyle={{ gap: 10 }}
            ListFooterComponent={<View height={90} />}
          />
        </View>
    </View>
  );
};

export default RatingPage;
