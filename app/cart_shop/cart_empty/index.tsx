import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Button, Text, Image, Colors } from "react-native-ui-lib";
import { StyleSheet } from "react-native";
import { Link, router } from "expo-router";

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    backButton: {
        marginRight: 16,
    },
    backIcon: {
        width: 24,
        height: 24,
    },
    headerTitle: {
        flex: 1,
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 95,
    },
});

export default function CartEmpty() {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Button
                    iconSource={require('@/assets/images/home/arrow_ios.png')}
                    onPress={() => router.back()}
                    link
                    style={styles.backButton}
                    iconStyle={{ tintColor: 'black' }}
                />
                <Text style={styles.headerTitle}>Giỏ hàng</Text>
            </View>
            <View flex center>
                <Image source={require('@/assets/images/home/icons/cart.png')} />
                <Text style={{ fontSize: 16, color: 'gray', textAlign: 'center', marginTop: 20 }}>
                    Giỏ hàng của bạn hiện đang trống
                </Text>
            </View>
            <Link href='/cart_shop/cart' asChild>
            <Button
              label='Mua hàng ngay'
              labelStyle={{ fontFamily: 'SFProText-Bold', fontSize: 16 }}
              backgroundColor={Colors.primary}
              padding-20
              borderRadius={10}
              style={{ width: 338, height: 47, alignSelf: 'center', marginVertical: 10 }}
              onPress={() => {
                router.back();
              }}
              />
            </Link>
        </SafeAreaView>
    );
}