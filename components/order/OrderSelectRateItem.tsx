import { View, Text, Image, Colors, TouchableOpacity, RadioButton } from "react-native-ui-lib";
import { OrderItem } from "@/types/order.type";

const OrderSelectRateItem = ({ item }: { item: OrderItem }) => {
    const product = item.product || item.service;
    if (!product) return null;
    const imageUrl = product.media?.[0]?.full_url;

    return (
        <TouchableOpacity
            //   onPress={() => router.push(`/(app)/product/${product.id}`)}
            style={{ marginTop: 5 }}
        >
            <View bg-white row centerV gap-12>
                <RadioButton value={item.id} color={Colors.primary} />
                <Image
                    width={48}
                    height={48}
                    br20
                    source={
                        imageUrl
                            ? { uri: imageUrl }
                            : require("@/assets/images/logo/logo.png")
                    }
                    defaultSource={require("@/assets/images/logo/logo.png")}
                />

                <View flex>
                    <Text h3 numberOfLines={2}>
                        {product?.name || ""}
                    </Text>

                    {item.service_type && (
                        <Text h3_bold secondary marginT-4>
                            {item.service_type}
                        </Text>
                    )}
                </View>
            </View>
            <View width={'100%'} height={1} backgroundColor={Colors.$backgroundElevatedLight}></View>
        </TouchableOpacity>
    );
};

export default OrderSelectRateItem;
