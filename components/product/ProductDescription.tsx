import { StyleSheet } from 'react-native'
import { View, Text } from 'react-native-ui-lib'
import React from 'react'
import { Product } from '@/types/product.type'
import i18n from '@/languages/i18n';

interface ProductDescriptionProps {
    product: Product | null;
}

const ProductDescription: React.FC<ProductDescriptionProps> = ({ product }) => {
    if (!product) {
        return <Text>Loading...</Text>;
    }

    return (
        <View marginT-10>
            <View row>
                <Text h2>• </Text>
                <Text h3>
                    <Text h3_bold>{i18n.t("productDetail.description.brand")}: </Text>
                    {product?.brand_description}
                </Text>
            </View>
            <View row>
                <Text h2>• </Text>
                <Text h3>
                    <Text h3_bold>{i18n.t("productDetail.description.usage")}: </Text>
                    {product?.usage}
                </Text>
            </View>
            <View row>
                <Text h2>• </Text>
                <Text h3>
                    <Text h3_bold>{i18n.t("productDetail.description.benefit")}: </Text>
                    {product?.benefits}
                </Text>
            </View>
            <View row>
                <Text h2>• </Text>
                <Text h3>
                    <Text h3_bold>{i18n.t("productDetail.description.ingredient")}: </Text>
                    <Text h3_medium>{product?.key_ingredients}, </Text>
                    {product?.ingredients}
                </Text>
            </View>
            <View row>
                <Text h2>• </Text>
                <Text h3>
                <Text h3_bold>{i18n.t("productDetail.description.directions")}: </Text>
                    {product?.directions}
                </Text>
            </View>
            <View row>
                <Text h2>• </Text>
                <Text h3>
                <Text h3_bold>{i18n.t("productDetail.description.storage")}: </Text>
                    {product?.storage_instructions}
                </Text>
            </View>
            <View row>
                <Text h2>• </Text>
                <Text h3>
                <Text h3_bold>{i18n.t("productDetail.description.product_notes")}: </Text>
                    {product?.product_notes}
                </Text>
            </View>
        </View>
    )
}

export default ProductDescription

const styles = StyleSheet.create({})