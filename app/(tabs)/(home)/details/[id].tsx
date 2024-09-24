import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { Text ,AnimatedImage, Button, Image, TouchableOpacity, View, PageControl, Icon } from 'react-native-ui-lib';
import { Carousel } from 'react-native-ui-lib/src/components/carousel';


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
                <Text>• </Text>
                <Text text13>{line}</Text>
            </View>
        ));
    };

    const createBulletPointsDescription = (lines: string[]) => {
        return lines.map((line, index) => (
            <View key={index} row>
                <Text>• </Text>
                <Text text13>{line}</Text>
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
        <View bg-$backgroundDefault flex padding-20>
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
                <View>
                    <Text text60 marginV-10>Làm sạch bằng lamellar Lipocollage</Text>
                    <View row marginB-10>
                        <Image
                            source={require('@/assets/icons/ticket.svg')}
                        />
                        <Text text16 marginL-5>100.000 VNĐ</Text>
                        <View flex right>
                            <TouchableOpacity
                                onPress={() => {
                                    console.log('luv');
                                }}
                            >
                                <Icon
                                    source={require('@/assets/icons/heart.svg')}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View row>
                        <Icon
                            source={require('@/assets/icons/sun.svg')}
                            size={24}
                        />
                        <View>
                            {createBulletPoints(shortText)}
                        </View>
                    </View>
                    <View 
                        row marginV-20
                    >
                        <Text text60>SỐ LƯỢNG</Text>
                        <View 
                            border-1 row flex right
                        >
                            <TouchableOpacity
                                onPress={() => {
                                    if (quantity > 1) setQuantity(quantity - 1);
                                }}
                            >
                                <Text>-</Text>
                            </TouchableOpacity>
                            <Text>{quantity}</Text>
                            <TouchableOpacity
                                onPress={() => setQuantity(quantity + 1)}
                            >
                                <Text>+</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View marginT-10>
                        <Text text60>MÔ TẢ SẢN PHẨM</Text>
                        <View>
                            {createBulletPointsDescription(longText)}
                        </View>
                    </View>
                </View>
            </ScrollView>
            <View row paddingV-10>
                <View row gap-30>
                    <TouchableOpacity
                        onPress={() => {
                            console.log('đánh giá i');
                        }}
                    >
                        <Icon
                            source={require('@/assets/icons/comment.svg')}
                            size={24}
                        />
                        <Text>Đánh giá</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            console.log('thêm giỏ hàng òy á');
                        }}
                    >
                        <Icon
                            source={require('@/assets/icons/shopping-cart.svg')}
                            size={24}
                        />
                        <Text>Thêm giỏ hàng</Text>
                    </TouchableOpacity>
                </View>
                <View flex right>
                    <Button
                        label={'Mua ngay'}
                        backgroundColor='#A85A29'
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