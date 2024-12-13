import { useLocalSearchParams } from "expo-router";
import { View, Text } from "react-native-ui-lib";
import RatingBar from "@/components/rating/RatingBar";
import RatingItem from "./RatingItem";
import { FlatList } from "react-native";
import AppBar from "@/components/app-bar/AppBar";
import { useLanguage } from "@/hooks/useLanguage";

import RatingStar from "@/components/rating/RatingStar";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { useEffect } from "react";
import { getAllRatingThunk } from "@/redux/features/rating/getAllRatingThunk";

const RatingPage: React.FC = () => {
  const { t } = useLanguage();

  const { id, type: typeParam } = useLocalSearchParams();

  const dispatch = useDispatch<AppDispatch>();
  const { ratings } = useSelector(
    (state: RootState) => state.rating
  );

  useEffect(() => {
    if (id) {
      dispatch(getAllRatingThunk({ id: id.toString(), type: typeParam }));
    }
  }, [dispatch, id, typeParam]);

  const averageRating =
    ratings?.length > 0
      ? ratings.reduce((acc: number, rating: any) => acc + rating.stars, 0) /
      ratings.length
      : 0;
  const totalRatings = ratings?.length || 0;

  const getPercentage = (star: number) => {
    return totalRatings > 0
      ? (ratings.filter((r: any) => r.stars === star).length / totalRatings) *
      100
      : 0;
  };

  const totalRatingsByStar = [5, 4, 3, 2, 1].map(star => ({
    star,
    total: ratings.filter((r: any) => r.stars === star).length,
  }));

  return (
    <View flex bg-$backgroundDefault>
      <AppBar back title="Đánh giá" />
      <View padding-20 row centerV>
        <View>
          <Text h2_bold>{averageRating.toFixed(1)}/5</Text>
          <View height={2}></View>
          <Text h3_medium>
            {t("rating.base_on")} {totalRatings} {t("rating.reviews")}
          </Text>
          <View height={10}></View>
          <View left>
            <RatingStar rating={averageRating} />
          </View>
        </View>

        <View flex right>
          {totalRatingsByStar.map(({ star, total }) => (
            <RatingBar key={star} star={star} total={total} />
          ))}
        </View>
      </View>

      <View style={{ flex: 1 }}>
        {ratings.length === 0 ? (
          <View flex center>
            <Text h3_medium>{t("rating.no_review")}</Text>
          </View>
        ) : (
          <FlatList
            data={ratings}
            renderItem={({ item }) => <RatingItem item={item} />}
            contentContainerStyle={{ gap: 10 }}
            ListFooterComponent={<View height={90} />}
          />
        )}
      </View>
    </View>
  );
};

export default RatingPage;
