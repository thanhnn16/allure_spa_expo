import { TouchableOpacity, View, Text } from "react-native-ui-lib";
import i18n from "@/languages/i18n";
import { useNavigation } from "expo-router";
import { Alert, ScrollView } from "react-native";
import { useState, useEffect } from "react";
import AppButton from "@/components/buttons/AppButton";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { fetchAddresses, deleteAddress } from "@/redux/features";
import AppBar from "@/components/app-bar/AppBar";

interface UserProfile {
  full_name: string;
  phone_number: string;
}

interface Address {
  id?: string;
  province: string;
  district: string;
  address: string;
  address_type: "home" | "work" | "others";
  is_default: boolean;
  is_temporary: boolean;
  note?: string;
}

const Address = () => {
  const dispatch = useDispatch();
  const { addresses, loading, error } = useSelector(
    (state: RootState) => state.address
  );
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const router = useRouter();
  const navigation = useNavigation();

  useEffect(() => {
    loadData();
  }, [dispatch]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      loadData();
    });

    return unsubscribe;
  }, [navigation, dispatch]);

  const loadData = async () => {
    try {
      const userProfileStr = await AsyncStorage.getItem("userProfile");
      if (userProfileStr) {
        setUserProfile(JSON.parse(userProfileStr));
      }

      await dispatch(fetchAddresses()).unwrap();
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error);
      Alert.alert("Lỗi", "Không thể tải thông tin");
    }
  };

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
    const selectedAddressData = {
      fullName: userProfile?.full_name || "",
      phoneNumber: userProfile?.phone_number || "",
      fullAddress: `${item.address}, ${item.district}, ${item.province}`,
      addressType: item.address_type || "",
      isDefault: item.is_default ? "1" : "0",
      note: item.note || "",
      addressId: item.id,
      province: item.province,
      district: item.district,
      address: item.address,
    };

    try {
      await AsyncStorage.setItem(
        "selectedAddress",
        JSON.stringify(selectedAddressData)
      );
      router.push("/(app)/check-out");
    } catch (error) {
      console.error("Lỗi khi lưu địa chỉ:", error);
      Alert.alert("Lỗi", "Không thể lưu địa chỉ đã chọn");
    }
  };

  const AddressItem = ({ item }: { item: Address }) => {
    return (
      <TouchableOpacity onPress={() => handleSelectAddress(item)}>
        <View row spread centerV marginB-10>
          <View row centerV>
            <MaterialCommunityIcons
              name={item.address_type === "home" ? "home" : "office-building"}
              size={24}
              color="#22A45D"
            />
            <Text text60 color="#22A45D" marginL-4>
              {i18n.t(`address.${item.address_type}`)}
            </Text>
            {item.is_default && (
              <View bg-green20 padding-4 br40 marginL-8>
                <Text text80 green20>
                  {i18n.t("address.default")}
                </Text>
              </View>
            )}
          </View>

          <View row>
            <TouchableOpacity
              onPress={() => handleSelectAddress(item)}
              bg-grey60
              padding-4
              br40
              marginR-8
            >
              <MaterialCommunityIcons name="pencil" size={22} color="#717658" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleDeleteAddress(item.id as string)}
              bg-grey60
              padding-4
              br40
            >
              <Ionicons name="close-circle-outline" size={24} color="#FF4D4F" />
            </TouchableOpacity>
          </View>
        </View>

        <View height={1} bg-grey20 marginV-12 />

        <View>
          <View row centerV marginB-10>
            <MaterialCommunityIcons
              name="map-marker"
              size={20}
              color="#666"
              style={{ marginRight: 8 }}
            />
            <Text text60>{i18n.t("address.address")}:</Text>
            <Text text70 grey10 flex>
              {item.address}, {item.district}, {item.province}
            </Text>
          </View>

          <View row centerV marginB-10>
            <MaterialCommunityIcons
              name="account"
              size={20}
              color="#666"
              style={{ marginRight: 8 }}
            />
            <Text text60>{i18n.t("address.customer_name")}:</Text>
            <Text text70 grey10 flex>
              {userProfile?.full_name}
            </Text>
          </View>

          <View row centerV>
            <MaterialCommunityIcons
              name="phone"
              size={20}
              color="#666"
              style={{ marginRight: 8 }}
            />
            <Text text60>{i18n.t("address.phone_number")}:</Text>
            <Text text70 grey10 flex>
              {userProfile?.phone_number}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View flex bg-white>
      <AppBar back title={i18n.t("address.address")} />
      <View flex paddingH-16 marginT-16>
        {loading ? (
          <View center>
            <Text text60> {i18n.t("common.loading")}...</Text>
          </View>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            {addresses.map((item: Address, index: number) => (
              <AddressItem key={index} item={item} />
            ))}
          </ScrollView>
        )}
      </View>

      <View padding-16>
        <AppButton
          type="primary"
          onPress={() => router.push("/(app)/address/add")}
        >
          <Text white>{i18n.t("address.add_new_address")}</Text>
        </AppButton>
      </View>
    </View>
  );
};

export default Address;
