import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, Image, Button, ListItem, Colors } from "react-native-ui-lib";
import { StyleSheet, FlatList, TouchableOpacity, Pressable } from "react-native";
import { Link, router } from "expo-router";
import AppBar from "@/components/app-bar/AppBar";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    clearCart,
    setCartItems
} from "@/redux/features/cart/cartSlice";
import CartProductItem from "@/components/cart/CartProductItem";
import { RootState } from "@/redux/store";
import CartEmptyIcon from "@/assets/icons/cart_empty.svg";
import i18n from "@/languages/i18n";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { FormatNumberOptions } from "i18n-js";
import formatCurrency from "@/utils/price/formatCurrency";

export default function Cart() {
    const dispatch = useDispatch();
    const { items, totalAmount } = useSelector(
        (state: RootState) => state.cart
    );

    const CART_ITEMS_KEY = '@cart_items';
    useEffect(() => {
        const loadCart = async () => {
            try {
                const cartItems = await AsyncStorage.getItem(CART_ITEMS_KEY);
                if (cartItems) {
                    dispatch(setCartItems(JSON.parse(cartItems)));
                }
            } catch (error) {
                console.error('Error loading cart items:', error);
            }
        }
        loadCart();
    }, []);

    const handleClearCart = () => {
        dispatch(clearCart())
    };

    const formattedPrice = formatCurrency({ price: totalAmount });

    const CartHaveItems = () => {
        return <View flex paddingH-20>
            <View right paddingB-5>
                <TouchableOpacity onPress={handleClearCart}>
                    <Text h3_bold secondary>Xóa tất cả</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={items}
                renderItem={({ item }) => <CartProductItem {...item} />}
                keyExtractor={(item) => item.id.toString()}
            />
            <View style={styles.totalContainer}>
                <Text h3_bold>Tổng cộng: </Text>
                <Text h3_bold secondary>{formattedPrice}</Text>
            </View>
            <Link href="/payment" asChild>
                <Button
                    label='Tiếp Tục'
                    labelStyle={{ fontFamily: 'SFProText-Bold', fontSize: 16 }}
                    backgroundColor={Colors.primary}
                    padding-20
                    borderRadius={10}
                    style={{ width: 338, height: 47, alignSelf: 'center', marginVertical: 10 }}
                />
            </Link>
        </View>
    }

    const CartEmpty = () => {
        return <View flex center>
            <Pressable
                onPress={() => router.back()}
                style={{ alignItems: 'center' }}
            >
                <Image
                    source={CartEmptyIcon}
                    style={{ width: 200, height: 200 }}
                />
                <Text h2_bold marginT-20>Giỏ hàng trống</Text>
                <View marginT-10>
                    <Text h3>Khám phá sản phẩm khác nhé</Text>
                </View>
            </Pressable>
        </View>
    }

    return (
        <GestureHandlerRootView>
            <SafeAreaView style={styles.container}>
                <AppBar title="Giỏ Hàng" back />
                {items.length === 0 ? <CartEmpty /> : <CartHaveItems />}
            </SafeAreaView>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    totalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        marginHorizontal: 10,
        backgroundColor: 'rgba(113, 118, 88, 0.2)',
        borderRadius: 10,
    },
    totalText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    totalPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'red',
    },
});