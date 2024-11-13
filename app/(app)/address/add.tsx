import { Image, Text, TouchableOpacity, View } from "react-native-ui-lib";
import i18n from "@/languages/i18n";
import { useNavigation } from "expo-router";
import BackButton from "@/assets/icons/back.svg";
import { useState, useEffect } from "react";
import { useWindowDimensions } from "react-native";
import AppButton from "@/components/buttons/AppButton";
import { SafeAreaView, ScrollView, TextInput, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import { addAddress } from "@/redux/features";
export interface AddressRequest {
  user_id: string;
  province: string;
  district: string;
  address: string;
  address_type: "home" | "work" | "others";
  is_default: boolean;
  is_temporary: boolean;
  note?: string;
}

// Update interface to match actual API response
interface UserResponse {
  message: string;
  status_code: number;
  success: boolean;
  data: {
    id: string;
    phone_number: string;
    full_name: string;
  };
}

const AddressInput = ({
  value,
  placeholder,
  onChangeText,
  editable = true,
}) => (
  <View marginB-10>
    <TextInput
      value={value}
      placeholder={placeholder}
      onChangeText={onChangeText}
      editable={editable}
      style={{
        fontSize: 14,
        height: 55,
        width: "100%",
        paddingHorizontal: 20,
        backgroundColor: editable ? "#ffffff" : "#f5f5f5",
        color: "#555555",
      }}
    />
  </View>
);

// Thêm interface cho loại địa chỉ
type AddressType = "home" | "work" | "others";

const Add = () => {
  const navigation = useNavigation();
  const window = useWindowDimensions();
  const [selectedItem, setSelectedItem] = useState<number | null>(1);
  const [loading, setLoading] = useState(false);
  const [selectedAddressType, setSelectedAddressType] =
    useState<AddressType>("home");
  const [formData, setFormData] = useState({
    province: "",
    district: "",
    address: "",
    name: "",
    phone: "",
    note: "",
    is_default: false,
    is_temporary: false,
    user_id: "",
  });
  const dispatch = useDispatch();

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userProfileStr = await AsyncStorage.getItem("userProfile");
        if (userProfileStr) {
          const userProfile = JSON.parse(userProfileStr);
          setFormData((prev) => ({
            ...prev,
            name: userProfile.full_name || "",
            phone: userProfile.phone_number || "",
            user_id: userProfile.id || "",
          }));
        }
      } catch (error) {
        console.error("Error loading user data:", error);
        Alert.alert(
          "Lỗi",
          "Không thể tải thông tin người dùng. Vui lòng thử lại sau."
        );
      }
    };

    loadUserData();
  }, []);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Sửa lại hàm getAddressType
  const getAddressType = (id: number | null): AddressType => {
    switch (id) {
      case 1:
        return "home";
      case 2:
        return "work";
      case 3:
        return "others";
      default:
        return "home";
    }
  };

  // Trong hàm handleSubmit, thêm xử lý lỗi chi tiết hơn
  const handleSubmit = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("userToken");

      if (!token) {
        Alert.alert("Lỗi", "Vui lòng đăng nhập để thêm địa chỉ");
        return;
      }

      const payload: AddressRequest = {
        user_id: formData.user_id,
        province: formData.province,
        district: formData.district,
        address: formData.address,
        address_type: selectedAddressType,
        is_default: formData.is_default,
        is_temporary: formData.is_temporary,
        note: formData.note,
      };

      await dispatch(addAddress(payload)).unwrap();

      Alert.alert("Thành công", "Thêm địa chỉ thành công", [
        {
          text: "OK",
          onPress: () => {
            // Reset form data
            setFormData({
              province: "",
              district: "",
              address: "",
              name: formData.name, // Giữ lại thông tin người dùng
              phone: formData.phone,
              note: "",
              is_default: false,
              is_temporary: false,
              user_id: formData.user_id,
            });
            // Reset loại địa chỉ về mặc định
            setSelectedItem(1);
            setSelectedAddressType("home");

            navigation.goBack();
          },
        },
      ]);
    } catch (error: any) {
      console.error("Lỗi khi thêm địa chỉ:", error);
      Alert.alert("Lỗi", error.message || "Không thể thêm địa chỉ");
    } finally {
      setLoading(false);
    }
  };

  // Cập nhật lại mảng items
  const items = [
    { id: 1, name: i18n.t("address.home"), type: "home" as AddressType },
    { id: 2, name: i18n.t("address.work"), type: "work" as AddressType },
    { id: 3, name: i18n.t("address.others"), type: "others" as AddressType },
  ];

  return (
    <View flex>
      <View
        row
        centerV
        bg-white
        padding-15
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          elevation: 3,
        }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image width={30} height={30} source={BackButton} />
        </TouchableOpacity>
        <View flex center>
          <Text text60 bold marginR-30 color="#717658" style={{ fontSize: 18 }}>
            {i18n.t("address.add_new_address")}
          </Text>
        </View>
      </View>

      <ScrollView padding-15>
        <View
          bg-white
          br12
          padding-15
          marginB-15
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 3,
          }}
        >
          <Text color="#717658" text70BO marginB-10>
            {i18n.t("auth.login.personal_info")}
          </Text>
          <AddressInput
            value={formData.name}
            placeholder={i18n.t("auth.login.fullname")}
            onChangeText={() => {}}
            editable={false}
          />
          <AddressInput
            value={formData.phone}
            placeholder={i18n.t("address.phone")}
            onChangeText={(value) => handleChange("phone", value)}
          />
        </View>

        <View
          bg-white
          br12
          padding-15
          marginB-15
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 3,
          }}
        >
          <Text color="#717658" text70BO marginB-10>
            {i18n.t("address.address")}
          </Text>
          <AddressInput
            value={formData.province}
            placeholder={i18n.t("address.province")}
            onChangeText={(value) => handleChange("province", value)}
          />
          <AddressInput
            value={formData.district}
            placeholder={i18n.t("address.district")}
            onChangeText={(value) => handleChange("district", value)}
          />
          <AddressInput
            value={formData.address}
            placeholder={i18n.t("address.address")}
            onChangeText={(value) => handleChange("address", value)}
          />

          <TextInput
            value={formData.note}
            placeholder={i18n.t("address.note")}
            onChangeText={(value) => handleChange("note", value)}
            multiline={true}
            numberOfLines={3}
            style={{
              fontSize: 14,
              minHeight: 80,
              width: "100%",
              padding: 15,
              backgroundColor: "#ffffff",
              borderRadius: 8,
              textAlignVertical: "top",
              borderWidth: 1,
              borderColor: "#E5E7EB",
            }}
          />
        </View>

        <View
          bg-white
          br20
          padding-15
          marginB-80
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 3,
          }}
        >
          <Text color="#717658" text70BO marginB-10>
            {i18n.t("address.type")}
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {items.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => {
                  setSelectedItem(item.id);
                  setSelectedAddressType(item.type);
                }}
                style={{
                  padding: 12,
                  paddingHorizontal: 25,
                  borderRadius: 8,
                  marginRight: 12,
                  backgroundColor:
                    selectedItem === item.id ? "#717658" : "#F4F4F4",
                  borderWidth: 1,
                  borderColor: selectedItem === item.id ? "#717658" : "#E5E7EB",
                }}
              >
                <Text
                  style={{
                    color: selectedItem === item.id ? "#FFFFFF" : "#717658",
                    fontWeight: "500",
                  }}
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      <View
        bg-white
        padding-20
        absB
        style={{
          borderTopWidth: 1,
          borderTopColor: "#E5E7EB",
          left: 0,
          right: 0,
        }}
      >
        <AppButton
          title={i18n.t("address.save")}
          type="primary"
          onPress={handleSubmit}
          disabled={loading}
        />
      </View>
    </View>
  );
};

export default Add;
