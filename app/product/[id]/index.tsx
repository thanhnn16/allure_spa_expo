import { Link, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, SafeAreaView, ScrollView } from 'react-native';
import { Text, AnimatedImage, Button, Image, TouchableOpacity, View, PageControl, Icon, Assets, PanningProvider } from 'react-native-ui-lib';
import ImageView from "react-native-image-viewing";

import { Carousel, PageControlPosition } from 'react-native-ui-lib/src/components/carousel';

import CommentIcon from '@/assets/icons/comment.svg'
import HeartIcon from '@/assets/icons/heart.svg'
import TicketIcon from '@/assets/icons/ticket.svg'
import ShoppingCartIcon from '@/assets/icons/shopping-cart.svg'
import SunIcon from '@/assets/icons/sun.svg'
import AppBar from '@/components/app_bar/app_bar';
import i18n from '@/languages/i18n';
import AppDialog from '@/components/dialog/AppDialog';


export default function DetailsScreen() {
    const { id } = useLocalSearchParams();
    const [images, setImages] = useState<{ uri: string }[]>([]);
    const [index, setIndex] = useState(0);
    const [imageViewIndex, setImageViewIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [visible, setIsVisible] = useState(false);
    const [dialogVisible, setDialogVisible] = useState(false);
    useEffect(() => {
        setImages([
            { uri: 'https://picsum.photos/1600/900' },
            { uri: 'https://picsum.photos/1920/1080' }
        ]);
    }, []);

    const handleOpenImage = (index: number) => {
        setImageViewIndex(index);
        setIsVisible(true);
    }

    const FooterComponent = () => {
        return (
            <View marginB-20 padding-20>
                <Text h2 white>{`${imageViewIndex + 1} / ${images.length}`}</Text>
            </View>
        )
    }

    const createBulletPoints = (lines: string[]) => {
        return lines.map((line, index) => (
            <View key={index} row>
                <Text h2>• </Text>
                <Text h3>{line}</Text>
            </View>
        ));
    };

    const createBulletPointsDescription = (lines: string[]) => {
        return lines.map((line, index) => (
            <View key={index} row>
                <Text h2>• </Text>
                <Text h3>{line}</Text>
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
        <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }}>
            <AppBar title='' />
            <ScrollView
                showsVerticalScrollIndicator={false}
            >
                <View
                    style={{
                        width: '90%',
                        height: 200,
                        borderRadius: 20,
                        overflow: 'hidden',
                        marginTop: 10,
                        alignSelf: 'center',
                    }}
                >
                    <Carousel
                        onChangePage={(index: number) => setIndex(index)}
                        pageControlPosition={PageControlPosition.OVER}
                        pageControlProps={{
                            size: 10,
                            color: '#ffffff',
                            inactiveColor: '#c4c4c4'
                        }}
                    >
                        {images.map((item, index) => (
                            <Pressable
                                onPress={() => handleOpenImage(index)}
                                key={index}
                            >
                                <AnimatedImage
                                    animationDuration={1000}
                                    source={{ uri: item.uri }}
                                    aspectRatio={16 / 9}
                                    cover
                                    key={index}
                                />
                            </Pressable>
                        ))}
                    </Carousel>
                </View>
                <ImageView
                    images={images}
                    imageIndex={0}
                    visible={visible}
                    onRequestClose={() => setIsVisible(false)}
                    onImageIndexChange={(index) => setImageViewIndex(index)}
                    key={index}
                    swipeToCloseEnabled={true}
                    doubleTapToZoomEnabled={true}
                    FooterComponent={FooterComponent}
                />
                <View padding-20 gap-10>
                    <Text h1_bold marginB-10>Làm sạch bằng lamellar Lipocollage</Text>
                    <View row marginB-10>
                        <Image
                            source={TicketIcon}
                            size={24}
                        />
                        <Text h1_medium secondary marginL-5>100.000 VNĐ</Text>
                        <View flex right>
                            <TouchableOpacity
                                onPress={() => console.log('mua ha')}
                            >
                                <Image
                                    source={HeartIcon}
                                    size={24}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View row paddingR-20>
                        <View>
                            <Image
                                source={SunIcon}
                                size={24}
                            />
                        </View>
                        <View>
                            {createBulletPoints(shortText)}
                        </View>
                    </View>
                </View>
                <View
                    row marginV-20
                    style={{
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <Text h1_medium>{i18n.t('productDetail.quantity')}</Text>
                    <View
                        row gap-10
                        style={{
                            borderWidth: 1,
                            borderColor: '#E0E0E0',
                            borderRadius: 10,
                        }}
                    >
                        <TouchableOpacity
                            style={{
                                padding: 10
                            }}
                            onPress={() => setQuantity(Math.max(1, quantity - 1))}
                        >
                            <Text>-</Text>
                        </TouchableOpacity>
                        <Text style={{ padding: 10 }}>{quantity}</Text>
                        <TouchableOpacity
                            style={{
                                padding: 10
                            }}
                            onPress={() => setQuantity(quantity + 1)}
                        >
                            <Text>+</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View marginT-10 paddingR-10>
                    <Text h1_medium>{i18n.t('productDetail.product_description')}</Text>
                    <View marginT-10>
                        {createBulletPointsDescription(longText)}
                    </View>
                </View>
            </ScrollView>
            <View
                row padding-20
                style={{
                    borderTopStartRadius: 30,
                    borderTopEndRadius: 30,
                    borderWidth: 2,
                    borderColor: '#E0E0E0',
                }}
            >
                <View row gap-30>
                    <Link href='/rating/1' asChild>
                        <TouchableOpacity>
                            <View center marginB-4>
                                <Image
                                    source={CommentIcon}
                                    size={24}
                                />
                            </View>
                            <Text h3_medium>{i18n.t('productDetail.reviews')}</Text>
                        </TouchableOpacity>
                    </Link>
                    <Link href='/favorite' asChild>
                        <TouchableOpacity>
                            <View center marginB-4>
                                <Image
                                    source={ShoppingCartIcon}
                                    size={24}
                                />
                            </View>
                            <Text h3_medium>{i18n.t('productDetail.add_to_cart')}</Text>
                        </TouchableOpacity>
                    </Link>
                </View>
                <Link href='/(tabs)/home' asChild>
                    <View flex right>
                        <Button
                            label={i18n.t('productDetail.buy_now').toString()}
                            backgroundColor='#717658'
                            borderRadius={10}
                            onPress={() => {
                                console.log('mua ha');
                            }}
                        />
                    </View>
                </Link>
            </View>
        </SafeAreaView>
    );
}
