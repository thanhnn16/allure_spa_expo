import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { fetchBanners } from '@/redux/features/banner/bannerThunk';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AnimatedImage, Carousel, PageControlPosition } from 'react-native-ui-lib';
import { router } from 'expo-router';

const CarouselBanner: React.FC = () => {
    const dispatch = useDispatch();
    const { banners } = useSelector((state: RootState) => state.banners);

    useEffect(() => {
        dispatch(fetchBanners());
    }, [dispatch]);

    const handleOpenWebView = (url: string | null) => {
        if (url) {
            router.push({
                pathname: '/(app)/webview',
                params: { url },
            });
        }
    };


    return (
        <View style={styles.carouselContainer}>
            <Carousel
                loop
                autoplay
                autoplayInterval={3000}
                pageControlPosition={PageControlPosition.UNDER}
                containerStyle={styles.carousel}
            >
                {banners.map((item: any, index: number) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.slideContainer}
                        onPress={() => handleOpenWebView(item.link_url)}
                    >
                        <AnimatedImage
                            source={{ uri: item.full_image_url }}
                            style={styles.image}
                            animationDuration={1000}
                            resizeMode="cover"
                        />
                    </TouchableOpacity>
                ))}
            </Carousel>
        </View>
    );
};

export default CarouselBanner;

const styles = StyleSheet.create({
    carouselContainer: {
        borderRadius: 12,
        overflow: 'hidden',
        height: 160,
        marginTop: 10,
        marginHorizontal: 20,
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
});
