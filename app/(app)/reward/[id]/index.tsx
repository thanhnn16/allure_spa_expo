import { Dimensions, Pressable, StyleSheet } from 'react-native'
import { AnimatedImage, Carousel, Colors, PageControlPosition, Text, View, Image } from 'react-native-ui-lib'
import React from 'react'
import { useLocalSearchParams } from 'expo-router';
import AppBar from '@/components/app-bar/AppBar';
import { Feather, Ionicons } from '@expo/vector-icons';
import AppButton from '@/components/buttons/AppButton';
import { useLanguage } from '@/hooks/useLanguage';

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
  const { t } = useLanguage();
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
              </Pressable>
            ))}
          </Carousel>
        </View>

        <Text h2_bold marginT-16>GIAM12</Text>
        <View row gap-4 centerV>
          <Image
            width={16}
            height={16}
            marginB-2
            source={require("@/assets/images/allureCoin.png")}
          />
          <Text color={Colors.primary} h3_bold>
            100
          </Text>
        </View>
        <Text h3 marginT-16>{t("exchange_reward.discount")}: 12%</Text>
        <Text h4>{t("exchange_reward.min")}: 15.000đ ∙ {t("exchange_reward.max")} 100.000đ</Text>
      </View>


      <View paddingH-16>
        <View marginT-12 style={styles.section}>
          <View row centerV spread>
            <View row centerV gap-8>
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
              <View>
                <Text h3_bold>GIAM12</Text>
                <View row gap-4 centerV>
                  <Image
                    width={16}
                    height={16}
                    marginB-2
                    source={require("@/assets/images/allureCoin.png")}
                  />
                  <Text color={Colors.primary} h3_bold>
                    100
                  </Text>
                </View>
              </View>
            </View>
            <View width={128}>
              <AppButton
                type="primary"
                title={t("exchange_reward.exchange")}
                onPress={() => { }}
              />
            </View>
          </View>
        </View>
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