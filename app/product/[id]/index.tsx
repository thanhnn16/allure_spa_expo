import { Link, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { Svg } from 'react-native-svg';
import { Text ,AnimatedImage, Button, Image, TouchableOpacity, View, PageControl, Icon, Assets } from 'react-native-ui-lib';

import { Carousel } from 'react-native-ui-lib/src/components/carousel';

import CommentIcon from '@/assets/icons/comment.svg'
import HeartIcon from '@/assets/icons/heart.svg'
import TicketIcon from '@/assets/icons/ticket.svg'
import ShoppingCartIcon from '@/assets/icons/shopping-cart.svg'
import SunIcon from '@/assets/icons/sun.svg'


export default function DetailsScreen() {
    const { id } = useLocalSearchParams();
    const [images, setImages] = useState<{ uri: string }[]>([]);
    const [index, setIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);
    useEffect(() => {
        setImages([
            { uri: 'https://picsum.photos/300/200' },
            { uri: 'https://picsum.photos/300/200' }
        ]);
    }, []);

    const createBulletPoints = (lines: string[]) => {
        return lines.map((line, index) => (
            <View key={index} row>
                <Text h3>• </Text>
                <Text h3>{line}</Text>
            </View>
        ));
    };

    const createBulletPointsDescription = (lines: string[]) => {
        return lines.map((line, index) => (
            <View key={index} row>
                <Text h3>• </Text>
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
        <View bg-$backgroundDefault flex>
            <ScrollView
                showsVerticalScrollIndicator={false}
            >
                <Carousel
                    loop
                    autoplay
                    autoplayInterval={3000}
                >
                    {images.map((item, index) => (
                        <AnimatedImage 
                            animationDuration={1000}
                            source={{ uri: item.uri }}
                            aspectRatio={4/3}
                            cover
                            key={index}
                        />
                    ))}
                </Carousel>
                <View paddingT-10>
                    <PageControl
                        currentPage={index}
                        numOfPages={images.length}
                        color='#000'
                    />
                </View>
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
                                onPress={() => {
                                    console.log('luv');
                                }}
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
                    <View 
                        row marginV-20
                        style={{
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >
                        <Text h1_bold>SỐ LƯỢNG</Text>
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
                                onPress={() => {
                                    if (quantity > 1) setQuantity(quantity - 1);
                                }}
                            >
                                <Text>-</Text>
                            </TouchableOpacity>
                            <Text style= {{padding: 10}}>{quantity}</Text>
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
                        <Text h1_bold>MÔ TẢ SẢN PHẨM</Text>
                        <View marginT-10>
                            {createBulletPointsDescription(longText)}
                        </View>
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
                            <Text h3_medium>Đánh giá</Text>
                        </TouchableOpacity>
                    </Link>
                    <TouchableOpacity
                        onPress={() => {
                            console.log('thêm giỏ hàng òy á');
                        }}
                    >
                        <View center marginB-4>
                            <Image
                                source={ShoppingCartIcon}
                                size={24}
                            />
                        </View>
                        <Text h3_medium>Thêm giỏ hàng</Text>
                    </TouchableOpacity>
                </View>
                <View flex right>
                    <Button
                        label={'Mua ngay'}
                        backgroundColor='#717658'
                        borderRadius={10}
                        onPress={() => {
                            console.log('mua ha');
                        }}
                    />
                </View>
            </View>
        </View>
    );
}