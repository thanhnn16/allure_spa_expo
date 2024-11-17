import i18n from "@/languages/i18n";
import { setSelectedAddress } from "@/redux/features/address/addressSlice";
import { deleteAddress, updateAddress } from "@/redux/features/address/addressThunk";
import { Address, UserProfile } from "@/types/address.type";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Href, router } from "expo-router";
import { Alert } from "react-native";
import { TouchableOpacity, View, Text, Colors } from "react-native-ui-lib";
import { useDispatch } from "react-redux";

interface AddressItemProps {
    item: Address;
    userProfile: UserProfile | null;
    setDialogVisible: (visible: boolean) => void;
    onPress?: () => void;
    setUpdateItem?: (item: Address) => void;
}

const AddressItem = ({ item, userProfile, setDialogVisible, setUpdateItem }: AddressItemProps) => {
    const dispatch = useDispatch();

    const handleDeleteAddress = async (addressId: string) => {
        Alert.alert(
            "Xác nhận xóa",
            "Bạn có chắc chắn muốn xóa địa chỉ này không?",
            [
                { text: "Hủy", style: "cancel" },
                {
                    text: "Xóa",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await dispatch(deleteAddress(addressId)).unwrap();
                            Alert.alert("Thành công", "Đã xóa địa chỉ");
                        } catch (error) {
                            console.error("Lỗi khi xóa địa chỉ:", error);
                            Alert.alert("Lỗi", "Không thể xóa địa chỉ");
                        }
                    },
                },
            ],
            { cancelable: true }
        );
    };

    const handleSelectAddress = async (item: Address) => {
        setDialogVisible(true);
        setUpdateItem?.(item);
    };

    return (
        <View
            style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 3,
                backgroundColor: "white",
                borderRadius: 10,
                marginVertical: 10,
                marginHorizontal: 20,
                borderColor: "#e3e4de",
            }}
        >
            {item.is_default && (
                <View width={120} br20 marginT-10 marginL-10 padding-5 backgroundColor={Colors.primary_light}>
                    <Text h3_bold primary center>Mặc định</Text>
                </View>
            )}
            <View row spread centerV padding-10>
                <View row centerV>
                    <MaterialCommunityIcons
                        name={item.address_type === "home" ? "home" : "office-building"}
                        size={24}
                        color={Colors.primary}
                    />
                    <Text h2_bold primary marginL-4>
                        {i18n.t(`address.${item.address_type}`)}
                    </Text>
                </View>

                <View row gap-8>
                    {!item.is_default && (
                        <TouchableOpacity
                            onPress={() => handleSelectAddress(item)}
                            backgroundColor={Colors.primary_light}
                            padding-4
                            br50
                        >
                            <MaterialCommunityIcons name="pencil" size={24} color="#717658" />
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity
                        onPress={() => router.push(`"address/update/${item.id}/index` as Href)}
                        backgroundColor={Colors.primary_light}
                        padding-4
                        br50
                    >
                        <MaterialCommunityIcons name="pencil" size={24} color="#717658" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => handleDeleteAddress(item.id as string)}
                        backgroundColor={Colors.primary_light}
                        padding-4
                        br40
                    >
                        <Ionicons name="close-circle-outline" size={24} color={Colors.secondary} />
                    </TouchableOpacity>
                </View>
            </View>
            <View height={1} bg-$backgroundPrimaryLight />

            <View padding-10>
                <View row  centerV marginB-10>
                    <MaterialCommunityIcons
                        name="map-marker"
                        size={20}
                        color="#666"
                        style={{ marginRight: 8 }}
                    />
                    <View flexS>
                    <Text h3_bold>{i18n.t("address.address")}: {" "}
                        <Text h3 numberOfLines={2}>
                            {item.address}, {item.ward}, {item.district}, {item.province}
                        </Text>
                    </Text>
                    </View>
                </View>

                <View row centerV marginB-10>
                    <MaterialCommunityIcons
                        name="account"
                        size={20}
                        color="#666"
                        style={{ marginRight: 8 }}
                    />
                    <Text h3_bold>{i18n.t("address.customer_name")}: </Text>
                    <Text h3 grey10 flex>
                        {userProfile?.full_name}
                    </Text>
                </View>

                <View row centerV marginB-10>
                    <MaterialCommunityIcons
                        name="phone"
                        size={20}
                        color="#666"
                        style={{ marginRight: 8 }}
                    />
                    <Text h3_bold>{i18n.t("address.phone_number")}: </Text>
                    <Text h3 flex>
                        {userProfile?.phone_number}
                    </Text>
                </View>

                {item.note && (
                    <View row centerV>
                        <MaterialCommunityIcons
                            name="phone"
                            size={20}
                            color="#666"
                            style={{ marginRight: 8 }}
                        />
                        <Text h3_bold>Ghi chú: </Text>
                        <Text h3 flex>
                            {item.note}
                        </Text>
                    </View>
                )}
            </View>
        </View>

    );
};

export default AddressItem;