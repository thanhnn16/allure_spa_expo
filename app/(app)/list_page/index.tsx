import { Dimensions, FlatList, SafeAreaView, StyleSheet, } from 'react-native'
import React, { useEffect, useMemo, useState } from 'react'
import AppBar from '@/components/app-bar/AppBar'
import { useLocalSearchParams } from 'expo-router'
import AppSearch from '@/components/inputs/AppSearch'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { ServiceResponeModel } from '@/types/service.type'
import ServiceItem from '@/components/home/ServiceItem'
import ProductItem from '@/components/home/ProductItem'
import { Product } from '@/types/product.type'
import { getServicesThunk } from '@/redux/features/service/getServicesThunk'
import { View } from 'react-native-ui-lib'

const index = () => {
    const productList = useSelector((state: RootState) => state.product.products);

    const dispatch = useDispatch();

    const { type } = useLocalSearchParams();

    const [title, setTitle] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [serviceList, setServiceList] = useState(
        useSelector((state: RootState) => state.service.servicesList).data
    );

    const { width: WINDOW_WIDTH, height: WINDOW_HEIGHT } = Dimensions.get("window");

    useEffect(() => {
        const getDataList = async () => {
            if (type === 'service') {
                const res = await dispatch(getServicesThunk(currentPage));
                const data = res?.payload.data;
                if (data) {
                    setServiceList((prevList: any) => [...prevList, ...data]);
                }
            }
            if (type === 'product') {
                dispatch({ type: 'product/fetchProducts', payload: { page: currentPage } });
            }
        };
        getDataList();
    }, [currentPage]);

    const renderList = useMemo(() => {
        if (type === 'service') {
            setTitle('Dịch vụ');
        } else if (type === 'product') {
            setTitle('Sản phẩm');
        }

        const data = type === 'service' ? serviceList : productList;
        const ItemComponent = type === 'service' ? ServiceItem : ProductItem;

        return (
            <FlatList
                data={data}
                renderItem={({ item }) =>
                    item && (type === 'service' ? item.service_name : item.name)
                        ? <ItemComponent
                            item={item}
                            widthItem={WINDOW_WIDTH * 0.4}
                            heightItem={WINDOW_HEIGHT * 0.32}
                            heightImage={WINDOW_HEIGHT * 0.18}
                        />
                        : null
                }
                keyExtractor={(item) => item.id.toString()}
                numColumns={2}
                columnWrapperStyle={{ justifyContent: 'space-between' }}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ gap: 10 }}
                onEndReached={() => setCurrentPage(currentPage + 1)}
                onEndReachedThreshold={0.5}
                style={{ marginTop: 15, }}
            />
        );
    }, [type, currentPage]);

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: 'white' }}>
            <AppBar back title={title} />
            <View paddingH-24 paddingB-100  >
                <AppSearch />
                <View marginB-30>
                    {renderList}
                </View>
            </View >
        </SafeAreaView>
    )
}

export default index

const styles = StyleSheet.create({})