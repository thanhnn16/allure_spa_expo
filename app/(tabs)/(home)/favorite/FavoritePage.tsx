import React, { useEffect, useState } from 'react'
import { FlatList } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { View, Text, TouchableOpacity, TabController, Colors } from 'react-native-ui-lib'
import FavoriteItem from './FavoriteItem';

interface FavoriteItemProps {
    id: number;
    name: string;
    price: number;
    image: string;
};

//default data
// default data for load favorite
const data = [
    {
        id: 1,
        name: 'Sửa rửa mặt',
        price: 100,
        image: 'https://via.placeholder.com/150'
    },
    {
        id: 2,
        name: 'Kem tẩy lông',
        price: 200,
        image: 'https://via.placeholder.com/150'
    },
    {
        id: 3,
        name: 'Kem trị mụn',
        price: 300,
        image: 'https://via.placeholder.com/150'
    },
    {
        id: 4,
        name: 'Kem trị mụn',
        price: 300,
        image: 'https://via.placeholder.com/150'
    },
    {
        id: 5,
        name: 'Kem trị mụn',
        price: 300,
        image: 'https://via.placeholder.com/150'
    },
];
// empty data for test
const dataEmpty: FavoriteItemProps[] = [];

const FavoritePage = () => {
    const [emptyFavorite, setEmptyFavorite] = useState(true);
    const [FavoriteData, setFavoriteData] = useState<FavoriteItemProps[]>([]);

    useEffect(() => {
        const fetchFavoriteData = () => {
            if (data.length === 0) {
                setEmptyFavorite(true);
            } else {
                setEmptyFavorite(false);
            }
            setFavoriteData(data);
        };
        fetchFavoriteData();
    }, []);

    const EmptyFavoritePage = () => {
        return (
        <View flex center bg-$backgroundDefault>
            <Text>Bạn chưa yêu thích sản phẩm nào.</Text>
            <Text>Khám phá ngay!</Text>
        </View>
        )
    }
      
    const FullFavoritePage = () => {
        return (
            <View flex bg-$backgroundDefault>
                <TabController items={[{label: 'Tất cả'}, {label: 'Giảm giá'}]}>
                <TabController.TabBar
                    enableShadow
                    indicatorStyle={{
                        backgroundColor: '#717658',
                        height: 3,
                        borderTopLeftRadius: 10,
                        borderTopRightRadius: 10,
                    }}
                    selectedLabelColor={'#717658'}
                    labelStyle={{fontFamily: 'SFProText-Bold'}}
                    selectedLabelStyle={{fontFamily: 'SFProText-Bold'}}
                    indicatorInsets={55}
                    labelColor='#808080'
                />
                <View flex>
                    <TabController.TabPage index={0}>{renderFirstPage()}</TabController.TabPage>
                    <TabController.TabPage index={1} lazy>{renderSecondPage()}</TabController.TabPage>
                    </View>
                </TabController>
            </View>
        )
    }
    
    const renderFirstPage = () => {
        return (
            <View flex bg-$backgroundDefault>
                <FlatList
                    data={FavoriteData}
                    renderItem={({item}) => <FavoriteItem item={item} />}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={2}
                    columnWrapperStyle={{ justifyContent: 'space-between' }}
                    style={{padding: 10}}
                    contentContainerStyle={{ gap: 10 }}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        )
    }
    
    const renderSecondPage = () => {
        return (
            <View flex bg-$backgroundDefault>
                <FlatList
                    data={FavoriteData}
                    renderItem={({item}) => <FavoriteItem item={item} />}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={2}
                    columnWrapperStyle={{ justifyContent: 'space-between' }}
                    style={{padding: 10}}
                    contentContainerStyle={{ gap: 10 }}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        )
    }

    const HandleFavoritePage = () => {
        if (emptyFavorite) {
            return <EmptyFavoritePage />
        } else {
            return <FullFavoritePage />
        }
    }
    return (
        <GestureHandlerRootView>
            <HandleFavoritePage />
        </GestureHandlerRootView>
    )
}





export default FavoritePage