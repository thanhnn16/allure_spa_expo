import { StyleSheet } from 'react-native';
import { View, Image, Text, Button, AnimatedImage } from 'react-native-ui-lib';
import { useEffect, useRef, useState } from 'react';
import VideoPlayer from 'expo-video-player'
import { useLocalSearchParams } from 'expo-router';
import PagerView from 'react-native-pager-view';
import { ResizeMode } from 'expo-av';

const PagerViewPage = () => {

  const { video, images } = useLocalSearchParams(); // Retrieve parameters
  console.log(video, images)
  const parsedImages = images ? JSON.parse(images as string) : [];
  
  return (
    <PagerView style={styles.container}>
      <VideoPlayer
        videoProps={{
          shouldPlay: true,
          resizeMode: ResizeMode.CONTAIN,
          source: {
            uri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          },
        }}
      />
      {parsedImages.map((images: string, index: number) => (
        <View flex width={'100%'} height={300} key={index} style={styles.page}>
          <AnimatedImage 
            animationDuration={300}
            source={{ uri: images }}
            aspectRatio={16/9}
            cover
            key={index}
          />
        </View>
      ))}
    </PagerView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  page: {
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default PagerViewPage