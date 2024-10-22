import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, Image, Button, ListItem, Colors } from "react-native-ui-lib";
import { StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { router } from "expo-router";

interface Product {
    id: number;
    name: string;
    price: string;
    image: any;
}

const ProductItem = ({ product, onDelete }: { product: Product, onDelete: (id: number) => void }) => {
    const [quantity, setQuantity] = React.useState(1);
    return (
        <View style={styles.productItem}>
            <ListItem>
                <View style={styles.imageContainer}>
                    <Image source={product.image} style={styles.productImage} />
                </View>
                <ListItem.Part middle column containerStyle={{ paddingLeft: 16 }}>
                    <ListItem.Part containerStyle={{ marginBottom: 5 }}>
                        <Text style={styles.productName}>{product.name}</Text>
                    </ListItem.Part>
                    <ListItem.Part>
                        <Text style={styles.productPrice}>
                            <Text style={{ color: 'black', marginRight: 5 }}>$</Text>
                            <Text style={{ color: 'red' }}>{product.price} VNĐ</Text>
                        </Text>
                    </ListItem.Part>
                    <ListItem.Part>
                        <View style={styles.quantityContainer}>
                            <View style={styles.quantityButtonContainer}>
                                <TouchableOpacity
                                    style={styles.quantityButton}
                                    onPress={() => setQuantity(quantity + 1)}
                                >
                                    <Text style={styles.quantityButtonText}>+</Text>
                                </TouchableOpacity>
                            </View>
                            <Text style={styles.productQuantity}>{quantity}</Text>
                            <View style={styles.quantityButtonContainer}>
                                <TouchableOpacity
                                    style={styles.quantityButton}
                                    onPress={() => {
                                        if (quantity > 1) setQuantity(quantity - 1);
                                    }}
                                >
                                    <Text style={styles.quantityButtonText}>-</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ListItem.Part>
                </ListItem.Part>
                <ListItem.Part right>
                    <Button
                        iconSource={require('@/assets/images/home/icons/delete.png')}
                        onPress={() => onDelete(product.id)}
                        link
                        style={styles.deleteButton}
                        iconStyle={{ tintColor: 'black' }}
                    />
                </ListItem.Part>
            </ListItem>
        </View>
    );
};

const ProductList = () => {
    const [products, setProducts] = React.useState<Product[]>([
        { id: 1, name: 'Lamellar Lipocollage', price: '1,170,000', image: require('@/assets/images/268268.png') },
    ]);

    const handleDelete = (id: number) => {
        setProducts(products.filter(product => product.id !== id));
    };

    const calculateTotalPrice = () => {
        return products.reduce((total, product) => total + parseInt(product.price.replace(/,/g, '')), 0);
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={products}
                renderItem={({ item }) => <ProductItem product={item} onDelete={handleDelete} />}
                keyExtractor={(item) => item.id.toString()}
            />
            <View style={styles.totalContainer}>
                <Text style={styles.totalText}>Tổng cộng: </Text>
                <Text style={styles.totalPrice}>{calculateTotalPrice().toLocaleString()} VNĐ</Text>
            </View>
            <Button
              label='Tiếp Tục'
              labelStyle={{ fontFamily: 'SFProText-Bold', fontSize: 16 }}
              backgroundColor={Colors.primary}
              padding-20
              borderRadius={10}
              style={{ width: 338, height: 47, alignSelf: 'center', marginVertical: 10 }}
              onPress={() => {
                router.back();
              }}
              />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
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
    productItem: {
        height: 100,
        marginBottom: 19,
        // backgroundColor: '#fff',
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
    productName: {
        top: 8,
        fontSize: 16,
        fontWeight: 'bold',
    },
    productPrice: {
        top: 5,
        fontSize: 14,
        color: 'black',
    },
    productQuantity: {
        fontSize: 14,
        color: 'black',
        marginHorizontal: 10,
    },
    quantityContainer: {
        top: 28,
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
    quantityButtonText: {
        fontSize: 20,
    },
    deleteButton: {
        marginLeft: 10,
        marginTop: -20,
    },
    totalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        backgroundColor: '#E0E0E0',
        borderRadius: 10,
        borderColor: '#E0E0E0',
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

export default function Cart() {
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
            <ProductList />
        </SafeAreaView>
    );
}