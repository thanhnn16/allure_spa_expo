import { useLocalSearchParams } from "expo-router";
import { View, Text } from "react-native-ui-lib";
import RatingBar from "@/components/rating/RatingBar";
import RatingItem from "./RatingItem";
import { FlatList } from "react-native";
import AppBar from "@/components/app-bar/AppBar";
import i18n from "@/languages/i18n";
import RatingStar from "@/components/rating/RatingStar";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { useEffect } from "react";
import { getAllRatingProductThunk } from "@/redux/features/rating/getAllRatingProductThunk";

interface RatingPageProps {
  type?: 'product' | 'service';
}

const RatingPage: React.FC<RatingPageProps> = ({ type = 'product' }) => {
  const { id, type: typeParam } = useLocalSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const { ratings, isLoading: RatingLoading } = useSelector(
    (state: RootState) => state.rating
  );

  useEffect(() => {
    if (id) {
      dispatch(getAllRatingProductThunk({ id: id.toString(), type: typeParam }));
    }
  }, [dispatch, id, type]);

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

  return (
    <View flex bg-$backgroundDefault>
      <AppBar back title="Đánh giá" />
      <View padding-20 row centerV>
        <View>
          <Text h2_bold>{averageRating.toFixed(1)}/5</Text>
          <View height={2}></View>
          <Text h3_medium>
            {i18n.t("rating.base_on")} {totalRatings} {i18n.t("rating.reviews")}
          </Text>
          <View height={10}></View>
          <View left>
            <RatingStar rating={averageRating} />
          </View>
        </View>

        <View flex right>
          <RatingBar star={5} percent={getPercentage(5)} />
          <RatingBar star={4} percent={getPercentage(4)} />
          <RatingBar star={3} percent={getPercentage(3)} />
          <RatingBar star={2} percent={getPercentage(2)} />
          <RatingBar star={1} percent={getPercentage(1)} />
        </View>
      </View>

      <View style={{ flex: 1 }}>
        {ratings.length === 0 ? (
          <View flex center>
            <Text h3_medium>{i18n.t("rating.no_reviews")}</Text>
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
