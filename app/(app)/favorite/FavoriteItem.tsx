import React from 'react';
import { View, Text, Image, Card } from 'react-native-ui-lib';

interface ItemDetails {
    service_name: string;
    single_price?: number;
    media: { full_url: string }[];
    description: string;
    category: { service_category_name: string };
    duration?: number;
}

interface FavoriteItemProps {
    id: number;
    item_details: ItemDetails;
}

const FavoriteItem = ({ item }: { item: FavoriteItemProps }) => {
    if (!item) {
        return null;
    }

    const {
        service_name = '',
        single_price = 0,
        media = [],
        description = '',
        category = { service_category_name: '' },
        duration = 0,
    } = item.item_details;

    console.log('service_name:', service_name);
    console.log('single_price:', single_price);
    console.log('media:', media);
    console.log('description:', description);
    console.log('category:', category);
    console.log('duration:', duration);

    return (
        <Card borderRadius={10} elevation={23} style={{ width: '100%', height: '100%', marginBottom: 10 }}>
            <View>
                {media.length > 0 && (
                    <Image
                        borderTopLeftRadius={10}
                        borderTopRightRadius={10}
                        width="100%"
                        height={150}
                        source={{ uri: media[0].full_url }}
                    />
                )}
                <View padding-8>
                    <Text h3>{service_name}</Text>
                    <Text>{single_price ? single_price.toLocaleString('vi-VN') : 'N/A'} VNĐ</Text>
                    <Text>{description}</Text>
                    <Text>{category.service_category_name}</Text>
                    <Text>{duration ? `${duration} minutes` : 'N/A'}</Text>
                </View>
            </View>
        </Card>
    );
};

export default FavoriteItem;
