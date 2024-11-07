import React, { useEffect, useState } from 'react';
import { FlatList, View, SafeAreaView } from 'react-native';
import AppBar from '@/components/app-bar/AppBar';
import { TabController, Colors } from 'react-native-ui-lib';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import FavoriteItem from './FavoriteItem';
import AxiosInstance from '@/utils/services/helper/axiosInstance'; // Assuming you have AxiosInstance set up for API calls

const FavoritePage = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await AxiosInstance().get('/services'); // Adjust API endpoint as needed
                setData(response.data); // Assuming the response contains an array of services
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const renderPageContent = (pageData: any) => {
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
        // @ts-ignore
        return renderPageContent(data.filter(item => item.on_sale));
    };

    // @ts-ignore
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
                            {loading ? <Text>Loading...</Text> : renderPageContent(data)}
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
