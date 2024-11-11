import { SafeAreaView, StyleSheet } from 'react-native';
import { View, Image, Text, Colors } from 'react-native-ui-lib';
import { AnimatedImage } from 'react-native-ui-lib';
import VideoPlayer from 'expo-video-player';
import PagerView from 'react-native-pager-view';
import { ResizeMode, Video } from 'expo-av';

import StarIcon from '@/assets/icons/star.svg';
import { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { data as ratingData } from '@/app/(app)/rating/data'; // Import the data correctly

interface RatingItemProps {
  id: number;
  rating: number;
  comment: string;
  date: string;
  video: string;
  images: string[];
  user: {
    id: number;
    name: string;
    avatar: string;
  };
};

const PagerViewPage = () => {
  // const [item, setItem] = useState<RatingItemProps>();
  // const { id } = useLocalSearchParams(); // Extract id from local search parameters

  // useEffect(() => {
  //   const getItemId = ratingData.find((item: RatingItemProps) => item.id === Number(id));
  //   setItem(getItemId); // Ensure item is set to null if not found

  // }, [id]);

  const item: RatingItemProps = {
    id: 0,
    rating: 5,
    comment: 'Tôi rất hài lòng với sản phẩm này',
    date: '2024-01-01',
    video: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    images: ['https://via.placeholder.com/151', 'https://via.placeholder.com/152', 'https://via.placeholder.com/153'],
    user: {
      id: 1,
      name: 'Nguyễn Văn A',
      avatar: 'https://via.placeholder.com/156'
    }
  }

  // const parsedImages = item.images ? JSON.parse(item.images as string) : [];

  const renderItem = (item: RatingItemProps) => {
    if (!item) return null; // Check if item is defined
    return (
      <View style={styles.page}>
        <AnimatedImage
          animationDuration={300}
          source={{ uri: item.images[0] }}
          aspectRatio={16 / 9}
          cover
        />
      </View>
    );
  };
  return (
    <View flex>
      <PagerView style={styles.container}>
        {item && item.video && (
          // <VideoPlayer
          //   videoProps={{
          //     shouldPlay: true,
          //     resizeMode: ResizeMode.CONTAIN,
          //     source: {
          //       uri: item.video,
          //     },
          //   }}
          // />
          <Video
            source={{ uri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' }}
            rate={1.0}
            volume={1.0}
            isMuted={false}
            shouldPlay
            style={{ width: 300, height: 300 }}
          />
        )}

        {item.images.map((image, index) => (
          renderItem({ ...item, images: [image] })
        ))}
      </PagerView>

      {item && (
        <View style={styles.bottomContainer}>
          <View row centerV>
            <View row gap-10 centerV>
              <Image width={35} height={35} borderRadius={20} source={{ uri: item.user.avatar }} />
              <Text h3_bold white>{item.user.name}</Text>
            </View>
            <View row gap-5 flex right>
              <Image source={StarIcon} backgroundColor={Colors.black} size={13} />
              <Text h3_bold white>{item.rating.toString()}</Text>
            </View>
          </View>

          <View marginV-10>
            <Text h3 white>{item.comment}</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#D9D9D9',
  }
});

export default PagerViewPage;
