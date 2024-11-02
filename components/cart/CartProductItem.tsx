import { Text, View, Image, TouchableOpacity, Button } from 'react-native-ui-lib'
import { StyleSheet } from 'react-native'
import React from 'react'
import { CartItem, incrementCartItem, decrementCartItem, removeCartItem } from '@/redux/features/cart/cartSlice';
import { useDispatch } from 'react-redux';

const CartProductItem = ( product: CartItem ) => {
    const dispatch = useDispatch();
    const handleIncreaseQuantity = (id: number) => {
        dispatch(incrementCartItem(id));
    };
    const handleDecreaseQuantity = (id: number) => {
        dispatch(decrementCartItem(id));
    };
    const handleDelete = (id: number) => {
        dispatch(removeCartItem(id));
    };

    const productImage =
        product.media && product.media.length > 0
            ? { uri: product.media[0].full_url }
            : require("@/assets/images/home/product1.png");

    const formattedPrice = new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(parseFloat(product.price));

    return (
        <View row centerV marginB-10>
            <View style={styles.imageContainer}>
                <Image source={productImage} style={styles.productImage} />
            </View>
            <View marginL-16>
                <View width={'80%'}>
                    <Text h3_bold>{product.name}</Text>
                </View>
                <View>
                    <Text h3_bold secondary>{formattedPrice}</Text>
                </View>
                <View>
                    <View gap-13 style={styles.quantityContainer}>
                        <View style={styles.quantityButtonContainer}>
                            <TouchableOpacity
                                style={styles.quantityButton}
                                onPress={() => {
                                    handleDecreaseQuantity(product.id);
                                }}
                            >
                                <Text h2_medium>-</Text>
                            </TouchableOpacity>
                        </View>
                        <Text h2>{product.quantity}</Text>
                        <View style={styles.quantityButtonContainer}>
                            <TouchableOpacity
                                style={styles.quantityButton}
                                onPress={() => {
                                    handleIncreaseQuantity(product.id);
                                }}
                            >
                                <Text h2_medium>+</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
            <View style={styles.deleteButton}>
                <Button
                    iconSource={require('@/assets/images/home/icons/delete.png')}
                    onPress={() => handleDelete(product.id)}
                    link
                    iconStyle={{ tintColor: 'black' }}
                />
            </View>
        </View>
    )
}

export default CartProductItem

const styles = StyleSheet.create({
    productItem: {
        marginBottom: 19,
    },
    imageContainer: {
        borderRadius: 10,
        backgroundColor: '#fff',
        width: 100,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    productImage: {
        backgroundColor: '#E0E0E0',
        width: 100,
        height: 100,
        borderRadius: 10,
    },
    productQuantity: {
        fontSize: 14,
        color: 'black',
        marginHorizontal: 10,
    },
    quantityContainer: {
        marginTop: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    quantityButtonContainer: {
        borderWidth: 1,
        backgroundColor: '#E0E0E0',
        borderColor: '#E0E0E0',
        borderRadius: 10,
        marginHorizontal: 5,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    quantityButton: {
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    deleteButton: {
        position: 'absolute',
        right: 5,
        top: 5,
    }
})