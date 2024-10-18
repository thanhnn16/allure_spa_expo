import { StyleSheet } from 'react-native'
import { AnimatedImage, Carousel, PageControlPosition, View } from 'react-native-ui-lib'

const RenderCarousel = (banner: any): JSX.Element => {

    return (
        <View style={styles.carouselContainer}>
            <Carousel
                loop
                autoplay
                autoplayInterval={3000}
                pageControlPosition={PageControlPosition.UNDER}
                containerStyle={styles.carousel}
            >
                {banner.map((item: any, index: number) => (
                    <View key={index} style={styles.slideContainer}>
                        <AnimatedImage
                            source={item}
                            style={styles.image}
                            animationDuration={1000}
                        />
                    </View>
                ))}
            </Carousel>
        </View>
    )
}

export default RenderCarousel

const styles = StyleSheet.create({
    carouselContainer: {
      borderRadius: 12,
      overflow: 'hidden',
      height: 160,
      marginTop: 10,
    },
    carousel: {
      height: 200,
    },
    slideContainer: {
      borderRadius: 12,
      overflow: 'hidden',
      height: 160,
    },
    image: {
      height: '100%',
      width: '100%',
      resizeMode: 'stretch',
    },
    touchableOverlay: {
      ...StyleSheet.absoluteFillObject,
    },
  });