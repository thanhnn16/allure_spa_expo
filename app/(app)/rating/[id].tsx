import { useCallback, useRef, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { View, Text, Button, Colors } from "react-native-ui-lib";
import { Rating } from "react-native-ratings";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import RatingBar from "@/components/rating/RatingBar";
import RatingItem from "./RatingItem";
import { FlatList, SafeAreaView, StyleSheet, TextInput } from "react-native";
import { data } from "./data";
import AppBar from "@/components/app-bar/AppBar";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import i18n from "@/languages/i18n";
import SelectImagesBar from "@/components/images/SelectImagesBar";
import RatingStar from "@/components/rating/RatingStar";

const RatingPage = () => {
  const { id } = useLocalSearchParams();
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  // ref
  const bottomSheetRef = useRef<BottomSheet>(null);

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  const handleOpenBottomSheet = () => {
    bottomSheetRef.current?.expand();
  };

  return (
    <GestureHandlerRootView>
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

          <BottomSheet
            ref={bottomSheetRef}
            onChange={handleSheetChanges}
            snapPoints={["60%"]}
            index={-1}
            enablePanDownToClose={true}
            enableHandlePanningGesture={true}
            enableOverDrag={true}
            keyboardBehavior="extend"
            keyboardBlurBehavior="restore"
            backgroundStyle={{ backgroundColor: "white" }}
            handleStyle={{
              backgroundColor: "white",
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
            }}
            handleIndicatorStyle={{
              backgroundColor: "#D9D9D9",
              width: 60,
              height: 7,
              borderRadius: 30,
              marginTop: 3,
            }}
            style={styles.bottomSheet}
          >
            <BottomSheetView style={styles.bottomSheetView}>
              <View center>
                <Text h1>{i18n.t("rating.how_do_you_feel")}</Text>
                <Rating
                  ratingCount={5}
                  imageSize={45}
                  ratingBackgroundColor="#E0E0E0"
                  ratingColor="#FFC700"
                  ratingTextColor="#000"
                />
              </View>

              <View flex left>
                <Text>{i18n.t("rating.feel_about_product")}</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    placeholder={i18n.t("rating.type_content")}
                    style={{ height: 150, textAlignVertical: "top" }}
                  />
                </View>
                <Text>{i18n.t("rating.images")}</Text>

                <SelectImagesBar
                  selectedImages={selectedImages}
                  setSelectedImages={setSelectedImages}
                  isRating={true}
                />
              </View>

              <View flex width={"100%"} bottom paddingV-20>
                <Button
                  label={i18n.t("rating.send_review").toString()}
                  labelStyle={{ fontFamily: "SFProText-Bold", fontSize: 16 }}
                  backgroundColor={Colors.primary}
                  borderRadius={10}
                />
              </View>
            </BottomSheetView>
          </BottomSheet>
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  bottomSheet: {
    // flex: 1,
  },
  bottomSheetView: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 20,
  },

  inputContainer: {
    width: "100%",
    height: 150,
    borderWidth: 1,
    borderColor: "#D9D9D9",
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
  },
  closeIcon: {
    position: "absolute",
    top: -10,
    right: -10,
    zIndex: 1000,
  },
});

export default RatingPage;
