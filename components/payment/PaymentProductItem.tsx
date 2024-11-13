import { Product } from '@/app/(app)/check-out';
import i18n from '@/languages/i18n';
import formatCurrency from '@/utils/price/formatCurrency';
import { Dimensions, StyleSheet } from 'react-native'
import { Text, View, Image } from 'react-native-ui-lib'

interface PaymentProductItemProps {
    product: Product;
}

const PaymentProductItem = ({product} : PaymentProductItemProps) => {
    const windowWidth = Dimensions.get("window").width;
    const total = parseFloat(product.price) * product.quantity;
    return (
        <View key={product.id} marginB-10>
            <View
                row centerV
                style={{
                    backgroundColor: '#fff',
                    borderTopStartRadius: 13,
                    borderTopEndRadius: 13,
                    padding: 10,
                    borderWidth: 1,
                    borderColor: '#rgba(113, 118, 88, 0.2)',
                }}
            >
                <View style={styles.imageContainer}>
                    <Image source={require('@/assets/images/268268.png')} style={styles.productImage} />
                </View>
                <View marginL-16>
                    <View width={windowWidth * 0.55}>
                        <Text h3_bold>{product.name}</Text>
                    </View>
                    <View>
                        <Text h3_bold secondary>{formatCurrency({ price: Number(product?.price) })}</Text>
                    </View>
                    <View>
                        <Text>{i18n.t("checkout.amount")}: {product?.quantity}</Text>
                    </View>
                </View>
            </View>
            <View
                row
                style={{
                    justifyContent: 'space-between',
                    borderBottomStartRadius: 13,
                    borderBottomEndRadius: 13,
                    backgroundColor: '#rgba(113, 118, 88, 0.2)',
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                }}
            >
                <Text h3_bold>{i18n.t("checkout.total")}:</Text>
                <Text h3_bold secondary>{formatCurrency({ price: total })}</Text>
            </View>
        </View>
    )
}

export default PaymentProductItem

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
})