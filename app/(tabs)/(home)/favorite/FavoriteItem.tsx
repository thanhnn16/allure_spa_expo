import React from 'react'
import { View, Text, Image, AnimatedImage, Card, Dividers, Colors, } from 'react-native-ui-lib'

interface FavoriteItemProps {
    id: number;
    name: string;
    price: number;
    image: string;
};

const FavoriteItem = ({ item }: { item: FavoriteItemProps }) => {
    return (
        <Card borderRadius={10} elevation={23}>
            <View>
                <AnimatedImage 
                    borderTopLeftRadius={10} 
                    borderTopRightRadius={10} 
                    width={180} 
                    height={200} 
                    source={{ uri: item.image }} 
                />
                <View padding-8>
                    <View paddingV-5>
                        <Text h2_bold>{item.name}</Text>
                    </View>
                    <View row centerV gap-8>
                        <Text h3>5.0</Text>
                        <Text h3>|</Text>
                        <Text h3>475 đã bán</Text>
                    </View>
                    <View paddingV-5>
                        <Text h2_bold secondary>{item.price}đ</Text>
                    </View>
                </View>
            </View>
        </Card>
    )
}

export default FavoriteItem