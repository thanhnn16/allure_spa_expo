// app/(app)/(tabs)/profile/address/index.tsx
import { TouchableOpacity, View, Text } from "react-native-ui-lib";
import i18n from "@/languages/i18n";
import { useNavigation } from "expo-router";
import {
  Alert,
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useState, useEffect } from "react";
import AppButton from "@/components/buttons/AppButton";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AxiosInstance from "@/utils/services/helper/axiosInstance";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons from "react-native-vector-icons/Ionicons";

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
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const navigation = useNavigation();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      loadData();
    });

    return unsubscribe;
  }, [navigation]);

  const loadData = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("userToken");

      if (!token) {
        Alert.alert("Lỗi", "Vui lòng đăng nhập lại");
        return;
      }

      const [userResponse, addressResponse] = await Promise.all([
        AxiosInstance().get("/user/info", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }),
        AxiosInstance().get("/user/my-addresses", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }),
      ]);

      console.log("User Response:", userResponse.data);
      console.log("Address Response:", addressResponse.data);

      if (userResponse.data?.data) {
        setUserProfile(userResponse.data.data);
        await AsyncStorage.setItem(
          "userProfile",
          JSON.stringify(userResponse.data.data)
        );
      }

      if (addressResponse.data?.data) {
        setAddresses(addressResponse.data.data);
      }
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error);
      Alert.alert("Lỗi", "Không thể tải thông tin");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    Alert.alert(
      "Xác nhận xóa",
      "Bạn có chắc chắn muốn xóa địa chỉ này không?",
      [
        {
          text: "Hủy",
          style: "cancel",
        },
        {
          text: "Xóa",
          style: "destructive",
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem("userToken");
              await AxiosInstance().delete(`/user/addresses/${addressId}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
              loadData(); // Load lại danh sách sau khi xóa
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

  const AddressItem = ({ item }: { item: Address }) => {
    const handleSelectAddress = () => {
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

      AsyncStorage.setItem(
        "selectedAddress",
        JSON.stringify(selectedAddressData)
      )
        .then(() => {
          router.push("/(app)/check-out");
        })
        .catch((error) => {
          console.error("Lỗi khi lưu địa chỉ:", error);
          Alert.alert("Lỗi", "Không thể lưu địa chỉ đã chọn");
        });
    };

    return (
      <TouchableOpacity
        style={styles.addressCard}
        onPress={handleSelectAddress}
      >
        <View row spread centerV marginB-10>
          <View row centerV>
            <MaterialCommunityIcons
              name={item.address_type === "home" ? "home" : "office-building"}
              size={24}
              color="#22A45D"
            />
            <Text marginL-10 style={styles.addressType}>
              {i18n.t(`address.${item.address_type}`)}
            </Text>
            {item.is_default && (
              <View style={styles.defaultBadge}>
                <Text style={styles.defaultText}>
                  {i18n.t("address.default")}
                </Text>
              </View>
            )}
          </View>

          <View row>
            <TouchableOpacity
              onPress={handleSelectAddress}
              style={[styles.iconButton, { marginRight: 8 }]}
            >
              <MaterialCommunityIcons name="pencil" size={22} color="#717658" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleDeleteAddress(item.id as string)}
              style={styles.iconButton}
            >
              <Ionicons name="close-circle-outline" size={24} color="#FF4D4F" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoContainer}>
          <View row centerV marginB-10>
            <MaterialCommunityIcons
              name="map-marker"
              size={20}
              color="#666"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.label}>Địa chỉ:</Text>
            <Text style={styles.addressText}>
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
            <Text style={styles.label}>Tên khách hàng:</Text>
            <Text style={styles.infoText}>{userProfile?.full_name}</Text>
          </View>

          <View row centerV>
            <MaterialCommunityIcons
              name="phone"
              size={20}
              color="#666"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.label}>Số điện thoại:</Text>
            <Text style={styles.infoText}>{userProfile?.phone_number}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F4F4F4" }}>
      <View row centerV padding-16 backgroundColor="#fff">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Địa chỉ đã lưu</Text>
      </View>

      <View flex paddingH-16 marginT-16>
        {loading ? (
          <View center>
            <Text>Đang tải...</Text>
          </View>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            {addresses.map((item, index) => (
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
          <Text style={{ color: "#fff" }}>
            {i18n.t("address.add_new_address")}
          </Text>
        </AppButton>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: Dimensions.get("window").width * 0.25,
    color: "#000",
  },
  addressCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  addressType: {
    fontSize: 16,
    fontWeight: "600",
    color: "#22A45D",
    marginLeft: 4,
  },
  defaultBadge: {
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 8,
  },
  defaultText: {
    color: "#22A45D",
    fontSize: 12,
  },
  deleteButton: {
    padding: 4,
  },
  divider: {
    height: 1,
    backgroundColor: "#E8E8E8",
    marginVertical: 12,
  },
  infoContainer: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    color: "#666",
    width: 100,
    marginRight: 8,
  },
  addressText: {
    flex: 1,
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: "#333",
  },
  iconButton: {
    padding: 4,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
  },
});

export default Address;
