import React from 'react';
import {
    TabController,
    View,
    Colors,
} from 'react-native-ui-lib';
import { data } from './data';
import FavoriteItem from './FavoriteItem';
import { FlatList, GestureHandlerRootView } from 'react-native-gesture-handler';
import AppBar from '@/components/app-bar/AppBar';
import { SafeAreaView } from 'react-native-safe-area-context';

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
                    <View flex>
                        <TabController.TabPage index={0}>
                            {renderFirstPage()}
                        </TabController.TabPage>
                        <TabController.TabPage index={1}>
                            {secondPage()}
                        </TabController.TabPage>
                    </View>
                </TabController>
            </SafeAreaView>
        </GestureHandlerRootView>
    );
}

export default FavoritePage;
