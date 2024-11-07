import React from 'react'
import { View, Text, Image, TouchableOpacity, Card } from 'react-native-ui-lib'
import HeartIcon from '@/assets/icons/heart.svg'
import StarIcon from '@/assets/icons/star.svg'

interface FavoriteItemProps {
    id: number;
    name: string;
    price: number;
    image: string;
}

const FavoriteItem = ({ item }: { item: FavoriteItemProps }) => {
    return (
        <Card borderRadius={10} elevation={23}>
            <View>
                <Image
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
                        <View row centerV gap-2>
                            <Image
                                source={StarIcon}
                                size={24}
                            />
                        </View>
                        <Text h3>5.0</Text>
                        <Text h3>|</Text>
                        <Text h3>475 đã bán</Text>
                    </View>
                    <View row paddingV-5>
                        <Text h2_bold secondary>{item.price}đ</Text>
                        <View flex right>
                            <TouchableOpacity>
                                <Image
                                    source={HeartIcon}
                                    size={24}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </Card>
    )
}

export default FavoriteItem
