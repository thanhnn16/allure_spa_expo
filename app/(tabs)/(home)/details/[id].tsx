import TextSFProBold from '@/components/texts/TextSFProBold';
import TextSFProMedium from '@/components/texts/TextSFProMedium';
import TextSFProRegular from '@/components/texts/TextSFProRegular';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Button, Image } from 'react-native-ui-lib';
import { Carousel } from 'react-native-ui-lib/src/components/carousel';

export default function DetailsScreen() {
    const { id } = useLocalSearchParams();
    const [images, setImages] = useState<{ uri: string }[]>([]);
    const [quantity, setQuantity] = useState(1);
    useEffect(() => {
        setImages([
            { uri: 'https://picsum.photos/300/200' },
            { uri: 'https://picsum.photos/300/200' }
        ]);
    }, []);

    const createBulletPoints = (lines: string[]) => {
        return lines.map((line, index) => (
            <View key={index} style={{ flexDirection: 'row' }}>
                <TextSFProRegular style={styles.styleBulletPoint}>• </TextSFProRegular>
                <TextSFProRegular style={styles.highlightsText}>{line}</TextSFProRegular>
            </View>
        ));
    };

    const createBulletPointsDescription = (lines: string[]) => {
        return lines.map((line, index) => (
            <View key={index} style={{ flexDirection: 'row' }}>
                <TextSFProRegular style={styles.styleBulletPoint}>• </TextSFProRegular>
                <TextSFProRegular style={styles.descriptionText}>{line}</TextSFProRegular>
            </View>
        ));
    };

    const shortText = [
        '100% collagen tươi giúp phục hồi cấu trúc dạng lamellar và bổ sung collagen ngay tức thì.',
        'Công thức phục hồi mọi tổn thương và chức năng trong 7 ngày.',
        'Duy trì làn sóng da trẻ đẹp, căng mọng, không tuổi.',
        'Không có hoạt động tổng hợp hóa học.'
    ];

    const longText = [
        'Đây là một đoạn văn dài mô tả sản phẩm. Nó cung cấp thông tin chi tiết về các tính năng và lợi ích của sản phẩm này.',
        'Sản phẩm được làm từ chất liệu cao cấp, đảm bảo độ bền và tính năng sử dụng lâu dài.',
        'Thiết kế hiện đại và tinh tế, phù hợp với nhiều không gian khác nhau.',
        'Sản phẩm này cũng rất dễ sử dụng và bảo trì, giúp tiết kiệm thời gian cho người dùng.',
        'Ngoài ra, sản phẩm còn đi kèm với chế độ bảo hành dài hạn, mang lại sự yên tâm cho khách hàng.',
        'Hãy trải nghiệm sản phẩm ngay hôm nay để cảm nhận sự khác biệt mà nó mang lại!',
    ];

    return (
        <View style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
            >
                <Carousel
                    loop
                    autoplay
                    autoplayInterval={3000}
                    style={styles.carousel}
                >
                    {images.map((item, index) => (
                        <View key={index} style={styles.carouselItem}>
                            <Image source={{ uri: item.uri }} style={styles.image} />
                        </View>
                    ))}
                </Carousel>
                {images.length === 0 && <Text>No images available</Text>}
                <View style={styles.detailsContainer}>
                    <TextSFProBold style={styles.title}>Làm sạch bằng lamellar Lipocollage</TextSFProBold>
                    <View style={styles.priceFavoriteContainer}>
                        <View style={styles.priceItem}>
                            <Image
                                style={styles.priceIcon}
                                source={require('@/assets/icons/ticket.png')}
                            />
                            <TextSFProMedium style={styles.price}>100.000 VNĐ</TextSFProMedium>
                        </View>
                        <View style={styles.favoriteItem}>
                            <TouchableOpacity
                                onPress={() => {
                                    console.log('luv');
                                }}
                                style={styles.favoriteButton}
                            >
                                <Image
                                    style={styles.favoriteIcon}
                                    source={require('@/assets/icons/heart.png')}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.highlightsContainer}>
                        <Image
                            style={styles.highlightsIcon}
                            source={require('@/assets/icons/sun.png')}
                        />
                        <View>
                            {createBulletPoints(shortText)}
                        </View>
                    </View>
                    <View style={styles.quantityContainer}>
                        <Text>SỐ LƯỢNG</Text>
                    <View style={styles.quantitySelector}>
                        <TouchableOpacity
                            style={styles.quantityButton}
                            onPress={() => {
                                if (quantity > 1) setQuantity(quantity - 1);
                            }}
                        >
                            <TextSFProMedium style={styles.quantityButtonText}>-</TextSFProMedium>
                        </TouchableOpacity>
                        <TextSFProMedium style={styles.quantityText}>{quantity}</TextSFProMedium>
                        <TouchableOpacity
                            style={styles.quantityButton}
                            onPress={() => setQuantity(quantity + 1)}
                        >
                            <TextSFProMedium style={styles.quantityButtonText}>+</TextSFProMedium>
                        </TouchableOpacity>
                    </View>
                    </View>
                    <View style={styles.descriptionContainer}>
                        <Text>MÔ TẢ SẢN PHẨM</Text>
                        <View style={styles.descriptionItem}>
                            {createBulletPointsDescription(longText)}
                        </View>
                    </View>
                </View>
            </ScrollView>
            <View style={styles.buttonContainer}>
                <View style={styles.buttonSmContainer}>
                    <TouchableOpacity
                        style={styles.buttonItem}
                    >
                        <Image
                            style={styles.buttonsmIcon}
                            source={require('@/assets/icons/comment.png')}
                        />
                        <TextSFProMedium style={styles.buttonsmText}>Đánh giá</TextSFProMedium>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.buttonItem}
                    >
                        <Image
                            style={styles.buttonsmIcon}
                            source={require('@/assets/icons/shopping-cart.png')}
                        />
                        <TextSFProMedium style={styles.buttonsmText}>Thêm giỏ hàng</TextSFProMedium>
                    </TouchableOpacity>
                </View>
                <Button
                    label={'Mua ngay'}
                    backgroundColor='#A85A29'
                    borderRadius={10}
                    style={styles.buttonLg}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    carousel: {
        width: '100%',
        height: 250,
        borderRadius: 10,
    },
    carouselItem: {
        width: '100%',
        height: 250,
        borderRadius: 10,
        alignSelf: 'center',
    },
    image: {
        width: 300,
        height: 250,
        alignSelf: 'center',
    },
    detailsContainer: {
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 16,
        lineHeight: 28,
        marginTop: 20,
    },
    priceFavoriteContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 20,
        paddingStart: 10,
    },
    priceItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    priceIcon: {
        width: 23,
        height: 18,
        resizeMode: 'contain',
    },
    price: {
        fontSize: 18,
        lineHeight: 28,
        color: '#A85A29',
    },
    favoriteItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    favoriteButton: {
        width: 40,
        height: 40,
        alignItems: 'flex-end',
    },
    favoriteIcon: {
        marginTop: 7,
        width: 25,
        height: 25,
        resizeMode: 'contain',
    },
    highlightsContainer: {
        flexDirection: 'row',
        marginTop: 20,
        paddingStart: 10,
        paddingEnd: 30,
        gap: 10,
    },
    highlightsIcon: {
        width: 18,
        height: 18,
        resizeMode: 'contain',
    },
    styleBulletPoint: {
        fontSize: 20,
        lineHeight: 20,
    },
    highlightsText: {
        fontSize: 13,
        lineHeight: 20,
        textAlign: 'justify',
        width: '95%',
    },
    quantityContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        gap: 10,
    },
    quantitySelector: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 10,
        paddingHorizontal: 10,
        width: 90,
    },
    quantityButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    quantityButtonText: {
        fontSize: 18,
    },
    quantityText: {
        fontSize: 18,
        lineHeight: 28,
        textAlign: 'center',
    },
    descriptionContainer: {
        marginTop: 20,
    },
    descriptionItem: {
        marginTop: 20,
        marginEnd: 20,
    },
    descriptionText: {
        fontSize: 13,
        lineHeight: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
        gap: 10,
        paddingHorizontal: 20,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        paddingVertical: 10,
    },
    buttonSmContainer: {
        flex: 2,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        gap: 10,
    },
    buttonItem: {
        alignItems: 'center',
        gap: 10,
    },
    buttonsmIcon: {
        width: 24,
        height: 24,
        resizeMode: 'contain',
    },
    buttonsmText: {
        fontSize: 13,
        lineHeight: 20,
    },
    buttonLg: {
        flex: 1,
        width: 150,
        height: 40,
    }
});