import React, { useEffect, useState } from 'react';
import { FlatList, View, Text } from 'react-native';
import AppBar from '@/components/app-bar/AppBar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TabController, Colors } from 'react-native-ui-lib';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import FavoriteItem from './FavoriteItem';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { fetchFavoritesThunk } from '@/redux/features/favorite/favoritesThunk';

const FavoritePage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const favorites = useSelector((state: RootState) => state.favorite.favorites);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            await dispatch(fetchFavoritesThunk());
            setLoading(false);
        };

        fetchData();
    }, [dispatch]);

    const renderPageContent = (pageData: any[]) => {
        return (
            <FlatList
                data={pageData}
                renderItem={({ item }) => <FavoriteItem item={item} />}
                keyExtractor={(item) => item.id.toString()}
                numColumns={2}
                columnWrapperStyle={{ justifyContent: 'space-between' }}
                style={{ padding: 10 }}
                contentContainerStyle={{ gap: 10 }}
                showsVerticalScrollIndicator={false}
            />
        );
    };

    const secondPage = () => {
        return renderPageContent(favorites.filter((item: { on_sale: any; }) => item.on_sale));
    };

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
                <AppBar title='Yêu thích' />
                <TabController
                    items={[
                        { label: 'Tất cả' },
                        { label: 'Giảm giá' }
                    ]}
                >
                    <TabController.TabBar
                        enableShadow
                        backgroundColor={Colors.white}
                        labelColor={Colors.$textDefault}
                        selectedLabelColor={Colors.$textPrimary}
                        indicatorStyle={{ backgroundColor: Colors.$textPrimary, height: 2 }}
                        containerStyle={{ height: 48 }}
                    />
                    <View>
                        <TabController.TabPage index={0}>
                            {loading ? <Text>Loading...</Text> : renderPageContent(favorites)}
                        </TabController.TabPage>
                        <TabController.TabPage index={1}>
                            {loading ? <Text>Loading...</Text> : secondPage()}
                        </TabController.TabPage>
                    </View>
                </TabController>
            </SafeAreaView>
        </GestureHandlerRootView>
    );
};

export default FavoritePage;
