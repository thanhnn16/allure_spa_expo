import React from 'react'
import { FlatList } from 'react-native';
import { TouchableOpacity, Image, View, Text } from 'react-native-ui-lib';


interface RenderCategoryProps {
    cateData: any
}

const RenderCategory: React.FC<RenderCategoryProps> = ({ cateData }) => {

    const renderCateItem = (item: any) => {
        const rItem = item.item;
        return (
            <TouchableOpacity center marginR-20 >
                <View width={44} height={44} backgroundColor='#F3F4F6' center style={{ borderRadius: 30 }}>
                    <Image source={rItem.icon} width={24} height={24} />
                </View>
                <Text marginT-5>{rItem.name}</Text>
            </TouchableOpacity>
        )
    }
    return (
        <View width={'100%'} height={65} marginT-15>
            <FlatList
                data={cateData}
                renderItem={renderCateItem}
                keyExtractor={item => item.id.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
            />
        </View>
    )
}

export default RenderCategory
