import React, { useCallback, useRef, useState } from 'react'
import { router, useLocalSearchParams } from 'expo-router';
import { View, Text, Image, Button, Colors } from 'react-native-ui-lib';
import { Rating } from 'react-native-ratings';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { Dimensions, TouchableOpacity } from 'react-native'; // Add this import


import StarIcon from '@/assets/icons/star.svg';
import RatingBar from '@/components/rating/RatingBar';
import RatingItem from './RatingItem';
import { FlatList, SafeAreaView, StyleSheet, TextInput } from 'react-native';
import { data } from './data';
import { AppStyles } from '@/constants/AppStyles';
import { BlurView } from 'expo-blur';
import AppBar from '@/components/app-bar/AppBar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';


import i18n from '@/languages/i18n';
import SelectImagesBar from '@/components/images/SelectImagesBar';

const RatingPage = () => {
  const { id } = useLocalSearchParams();
  const [isBuy, setIsBuy] = useState(true);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  // ref
  const bottomSheetRef = useRef<BottomSheet>(null);

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  const handleOpenBottomSheet = () => {
    bottomSheetRef.current?.expand();
  };

  return (
    <GestureHandlerRootView>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }}>
        <View bg-$backgroundDefault flex>
          <AppBar title='' />
          <View padding-20 row centerV>
            <View>
              <Text h0_bold>4.9/5</Text>
              <View height={2}></View>
              <Text h3_medium>{i18n.t('rating.base_on')} 69 {i18n.t('rating.reviews')}</Text>
              <View height={10}></View>
              <View left>
                <Rating
                  ratingCount={5}
                  imageSize={16}
                  ratingBackgroundColor='#E0E0E0'
                  ratingColor='#FFC700'
                  ratingTextColor='#000'

                />
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
              ListFooterComponent={
                <View height={90} />
              }
            />
          </View>

          {isBuy && (
            <BlurView
              style={{
                flex: 1,
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: 60,
              }}
              intensity={200}
            >
              <Button
                label={i18n.t('rating.add_review').toString()}
                labelStyle={{ fontFamily: 'SFProText-Bold', fontSize: 16 }}
                backgroundColor={Colors.primary}
                padding-20
                borderRadius={10}
                style={{ width: 240, height: 40, alignSelf: 'center', marginVertical: 10 }}
                onPress={handleOpenBottomSheet}
              />
            </BlurView>
          )}

          <BottomSheet
            ref={bottomSheetRef}
            onChange={handleSheetChanges}
            snapPoints={['60%']}
            index={-1}
            enablePanDownToClose={true}
            enableHandlePanningGesture={true}
            enableOverDrag={true}
            keyboardBehavior='extend'
            keyboardBlurBehavior='restore'
            backgroundStyle={{ backgroundColor: 'white' }}
            handleStyle={{
              backgroundColor: 'white',
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
            }}
            handleIndicatorStyle={{
              backgroundColor: '#D9D9D9',
              width: 60,
              height: 7,
              borderRadius: 30,
              marginTop: 3,
            }}
            style={styles.bottomSheet}
          >
            <BottomSheetView style={styles.bottomSheetView}>
              <View center>
                <Text h1>{i18n.t('rating.how_do_you_feel')}</Text>
                <Rating
                  ratingCount={5}
                  imageSize={45}
                  ratingBackgroundColor='#E0E0E0'
                  ratingColor='#FFC700'
                  ratingTextColor='#000'
                />
              </View>

              <View flex left>
                <Text>{i18n.t('rating.feel_about_product')}</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    placeholder={i18n.t('rating.type_content')}
                    style={{ height: 150, textAlignVertical: 'top' }}
                  />
                </View>
                <Text>{i18n.t('rating.images')}</Text>

                <SelectImagesBar
                  selectedImages={selectedImages}
                  setSelectedImages={setSelectedImages}
                  isRating={true}
                />
              </View>

              <View flex width={'100%'} bottom paddingV-20>
                <Button
                  label={i18n.t('rating.send_review').toString()}
                  labelStyle={{ fontFamily: 'SFProText-Bold', fontSize: 16 }}
                  backgroundColor={Colors.primary}

                  borderRadius={10}
                />
              </View>
            </BottomSheetView>
          </BottomSheet>
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  bottomSheet: {
    // flex: 1,
  },
  bottomSheetView: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 20
  },
  
  inputContainer: {
    width: '100%',
    height: 150,
    borderWidth: 1,
    borderColor: '#D9D9D9',
    borderRadius: 10,
    padding: 10,
    marginTop: 10
  },
  closeIcon: {
    position: 'absolute',
    top: -10,
    right: -10,
    zIndex: 1000,
  }
});

export default RatingPage
