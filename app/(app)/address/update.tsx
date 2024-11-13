import { Image, Text, TouchableOpacity, View } from "react-native-ui-lib";
import i18n from "@/languages/i18n";
import { useNavigation, useLocalSearchParams } from "expo-router";
import BackButton from "@/assets/icons/back.svg";
import { useState } from "react";
import AppButton from "@/components/buttons/AppButton";
import { SafeAreaView, ScrollView, TextInput, Alert } from "react-native";
import { useDispatch } from "react-redux";
import { updateAddress } from "@/redux/features/address/addressSlice";

const AddressInput = ({
  value,
  placeholder,
  onChangeText,
  editable = true,
}: {
  value: string;
  placeholder: string;
  onChangeText: (text: string) => void;
  editable?: boolean;
}) => (
  <View
    bg-white
    marginB-10
    br20
    style={{
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 3,
    }}
  >
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
        color: editable ? "#333333" : "#666666",
      }}
    />
  </View>
);

const Update = () => {
  const params = useLocalSearchParams();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [selectedItem, setSelectedItem] = useState<number>(() => {
    switch (params.address_type) {
      case "home":
        return 1;
      case "work":
        return 2;
      default:
        return 3;
    }
  });
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: (params.name as string) || "",
    phone: (params.phone as string) || "",
    address: (params.address as string) || "",
    province: (params.province as string) || "",
    district: (params.district as string) || "",
    note: (params.note as string) || "",
    address_type: params.address_type as "home" | "work" | "others",
    is_default: params.is_default === "true",
    is_temporary: params.is_temporary === "true",
  });

  const items = [
    { id: 1, name: i18n.t("address.home"), type: "home" },
    { id: 2, name: i18n.t("address.work"), type: "work" },
    { id: 3, name: i18n.t("address.others"), type: "others" },
  ];

  const handleUpdateAddress = async () => {
    try {
      setLoading(true);

      let address_type: "home" | "work" | "others";
      switch (selectedItem) {
        case 1:
          address_type = "home";
          break;
        case 2:
          address_type = "work";
          break;
        default:
          address_type = "others";
      }

      const updateData = {
        ...formData,
        address_type,
        note: formData.note,
      };

      await dispatch(
        updateAddress({
          id: params.id as string,
          data: updateData,
        })
      ).unwrap();

      Alert.alert("Thành công", "Đã cập nhật địa chỉ", [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error: any) {
      console.error("Lỗi khi cập nhật địa chỉ:", error);
      Alert.alert("Lỗi", error.message || "Không thể cập nhật địa chỉ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View flex bg-F5F7FA>
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
          <Text text60 bold marginR-30 color="#717658">
            {i18n.t("address.edit_address")}
          </Text>
        </View>
      </View>

      <ScrollView padding-15>
        <View
          bg-white
          br20
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
          <Text color="#717658" marginB-10 text70BO>
            {i18n.t("auth.login.personal_info")}
          </Text>
          <AddressInput
            value={formData.name}
            placeholder={i18n.t("auth.login.fullname")}
            onChangeText={(value) =>
              setFormData((prev) => ({ ...prev, name: value }))
            }
          />
          <AddressInput
            value={formData.phone}
            placeholder={i18n.t("address.phone")}
            onChangeText={(value) =>
              setFormData((prev) => ({ ...prev, phone: value }))
            }
          />
        </View>

        <View
          bg-white
          br20
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
          <Text color="#717658" marginB-10 text70BO>
            {i18n.t("address.address")}
          </Text>
          <AddressInput
            value={formData.province}
            placeholder={i18n.t("address.province")}
            onChangeText={(value) =>
              setFormData((prev) => ({ ...prev, province: value }))
            }
          />
          <AddressInput
            value={formData.district}
            placeholder={i18n.t("address.district")}
            onChangeText={(value) =>
              setFormData((prev) => ({ ...prev, district: value }))
            }
          />
          <AddressInput
            value={formData.address}
            placeholder={i18n.t("address.address")}
            onChangeText={(value) =>
              setFormData((prev) => ({ ...prev, address: value }))
            }
          />

          <TextInput
            value={formData.note}
            placeholder={i18n.t("address.note")}
            onChangeText={(value) =>
              setFormData((prev) => ({ ...prev, note: value }))
            }
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
              marginTop: 10,
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
          <Text color="#717658" marginB-10 text70BO>
            {i18n.t("address.type")}
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {items.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => setSelectedItem(item.id)}
                center
                br8
                marginR-12
                padding-12
                paddingH-25
                style={{
                  backgroundColor:
                    selectedItem === item.id ? "#717658" : "#F4F4F4",
                  borderWidth: 1,
                  borderColor: selectedItem === item.id ? "#717658" : "#E5E7EB",
                }}
              >
                <Text
                  color={selectedItem === item.id ? "#FFFFFF" : "#717658"}
                  text70BO
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
        left-0
        right-0
        style={{
          borderTopWidth: 1,
          borderTopColor: "#E5E7EB",
        }}
      >
        <AppButton
          title={i18n.t("address.save")}
          type="primary"
          onPress={handleUpdateAddress}
          disabled={loading}
        />
      </View>
    </View>
  );
};

export default Update;
