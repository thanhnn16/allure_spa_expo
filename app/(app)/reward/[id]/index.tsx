import { Dimensions, Pressable, StyleSheet } from 'react-native'
import { AnimatedImage, Carousel, Colors, PageControlPosition, Text, View } from 'react-native-ui-lib'
import React from 'react'
import { useLocalSearchParams } from 'expo-router';
import AppBar from '@/components/app-bar/AppBar';
import { Feather, Ionicons } from '@expo/vector-icons';
import AppButton from '@/components/buttons/AppButton';

interface MediaProps {
  id: number;
  url: string;
}

const media = [
  {
    id: 1,
    url: "https://picsum.photos/300/200",
  },
  {
    id: 2,
    url: "https://picsum.photos/300/200",
  },
  {
    id: 3,
    url: "https://picsum.photos/300/200",
  },
  {
    id: 4,
    url: "https://picsum.photos/300/200",
  },
]

const index = () => {
  const { id } = useLocalSearchParams();
  const [index, setIndex] = React.useState(0);
  const windowWidth = Dimensions.get("window").width;
  const handleOpenImage = (index: number) => {
    console.log(index);
  }
  return (
    <View flex bg-white>
      <AppBar back title="Reward Detail" />
      <View flex paddingH-16>
        <View
          width={windowWidth * 0.925}
          style={{
            alignSelf: "center",
            overflow: "hidden",
            borderRadius: 12,
          }}
          height={200}
          marginT-10
        >
          <Carousel
            onChangePage={setIndex}
            initialPage={index}
            pageControlPosition={PageControlPosition.OVER}
            pageControlProps={{
              size: 8,
              color: "#ffffff",
              inactiveColor: "#c4c4c4",
            }}
          >
            {media.map((item: MediaProps, index: number) => (
              <Pressable onPress={() => handleOpenImage(item.id)} key={index}>
                <AnimatedImage
                  animationDuration={1000}
                  source={{ uri: item.url }}
                  aspectRatio={16 / 9}
                  cover
                  key={index}
                />
                <View
                  absB-12 absL-12
                  style={{
                    zIndex: 1,
                  }}
                >
                  <Text h2_bold>Khuyến mãi {item.id}</Text>
                </View>
              </Pressable>
            ))}
          </Carousel>
        </View>

        <View marginT-12 style={styles.section}>
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
            <View row spread centerV gap-28>
              <View>
                <Text h3_bold>GIAM12</Text>
                <Text h3>Giảm: 12%</Text>
                <Text h4>Tối thiểu: 15.000đ ∙ Tối đa 100.000đ</Text>
              </View>

              <View>
                <Ionicons
                  name="bookmark-outline"
                  size={24}
                  color={Colors.primary}
                />
              </View>
            </View>
          </View>
        </View>

        <View width={150} br20 marginT-8 padding-5 backgroundColor={Colors.primary_light}>
          <Text h3_bold primary center>Đang diễn ra</Text>
        </View>

        {/* <View width={150} br20 marginT-8 padding-5 backgroundColor={Colors.secondary}>
          <Text h3_bold white center>Hết hạn</Text>
        </View> */}

        <Text h2_bold marginT-16>Sự kiện {id}</Text>

        <View row centerV gap-8>
          <Ionicons
            name="time-outline"
            size={24}
            color={Colors.primary}
          />
          <Text h3_bold>18/11/2024 - 21/11/2024</Text>
        </View>

        <Text h3 marginT-16>Mô tả sự kiện {id}</Text>
      </View>
    </View>
  )
}

export default index

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