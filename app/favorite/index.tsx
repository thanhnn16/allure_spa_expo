import React from 'react';
import {
    TabController,
    View,
} from 'react-native-ui-lib';
import { data } from './data';
import FavoriteItem from './FavoriteItem';
import { FlatList, GestureHandlerRootView } from 'react-native-gesture-handler';

const renderFirstPage = () => {
    return (
        <View flex bg-$backgroundDefault>
            <FlatList
                data={data}
                renderItem={({ item }) => <FavoriteItem item={item} />}
                keyExtractor={(item) => item.id.toString()}
                numColumns={2}
                columnWrapperStyle={{ justifyContent: 'space-between' }}
                style={{ padding: 10 }}
                contentContainerStyle={{ gap: 10 }}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}

const secondPage = () => {
    return (
        <View flex bg-$backgroundDefault>
            <FlatList
                data={data}
                renderItem={({ item }) => <FavoriteItem item={item} />}
                keyExtractor={(item) => item.id.toString()}
                numColumns={2}
                columnWrapperStyle={{ justifyContent: 'space-between' }}
                style={{ padding: 10 }}
                contentContainerStyle={{ gap: 10 }}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}

const FavoritePage = () => {
    return (
        <GestureHandlerRootView>
            <TabController items={[{ label: 'Tất cả' }, { label: 'Giảm giá' }]}>
                <TabController.TabBar height={50} containerStyle={{ marginTop: 100 }}/>
                <View flex>
                    <TabController.TabPage index={0}>{renderFirstPage()}</TabController.TabPage>
                    <TabController.TabPage index={1} lazy>{secondPage()}</TabController.TabPage>
                </View>
            </TabController>
        </GestureHandlerRootView>
    );
}

export default FavoritePage;