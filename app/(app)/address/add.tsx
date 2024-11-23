import {
  Colors,
  Picker,
  PickerValue,
  Text,
  TouchableOpacity,
  View,
} from "react-native-ui-lib";
import { router } from "expo-router";
import { useState, useEffect } from "react";
import AppButton from "@/components/buttons/AppButton";
import { ScrollView, TextInput } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import { addAddress } from "@/redux/features";
import AppBar from "@/components/app-bar/AppBar";
import {
  getAddressDistrictThunk,
  getAddressProvinceThunk,
  getAddressWardThunk,
} from "@/redux/features/address/getAddressThunk";
import {
  Address,
  AddressDistrict,
  AddressProvince,
  AddressWard,
} from "@/types/address.type";
import AddressTextInput from "@/components/address/AddressTextInput";
import AppDialog from "@/components/dialog/AppDialog";
import { User } from "@/types/user.type";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";

const { t } = useLanguage();

export const addressTypeItems = [
  { id: 1, name: t("address.home"), type: "home" as AddressType },
  { id: 2, name: t("address.work"), type: "work" as AddressType },
  { id: 3, name: t("address.others"), type: "others" as AddressType },
];

type AddressType = "home" | "work" | "others";

const Add = () => {
  const [selectedItem, setSelectedItem] = useState<number | null>(1);
  const [loading, setLoading] = useState(false);
  const [selectedAddressType, setSelectedAddressType] =
    useState<AddressType>("home");
  const [formData, setFormData] = useState<Address>({
    user_id: "",
    province: "",
    district: "",
    ward: "",
    address: "",
    note: "",
    address_type: "home",
    is_default: false,
    is_temporary: false,
  });
  const dispatch = useDispatch();
  const [province, setProvince] = useState<AddressProvince>();
  const [provinceList, setProvinceList] = useState<AddressProvince[]>([]);
  const [district, setDistrict] = useState<AddressDistrict>();
  const [districtList, setDistrictList] = useState<AddressDistrict[]>([]);
  const [ward, setWard] = useState<AddressWard>();
  const [wardList, setWardList] = useState<AddressWard[]>([]);
  const [titleDialog, setTitleDialog] = useState<string>("");
  const [dialogDescription, setDialogDescription] = useState<string>("");
  const [dialogVisible, setDialogVisible] = useState(false);
  const [confirmButton, setConfirmButton] = useState(false);
  const [onConfirmDialog, setOnConfirmDialog] = useState<() => void>(
    () => () => {}
  );
  const [userProfile, setUserProfile] = useState<User>();
  const { user } = useAuth();

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const getProvince = async () => {
    try {
      const response = await dispatch(getAddressProvinceThunk({}));
      setProvinceList(response.payload.data);
    } catch (error: any) {
      setTitleDialog("Có lỗi xảy ra");
      setDialogDescription(
        error.message || "Không thể tải thông tin tỉnh/thành phố"
      );
      setConfirmButton(true);
      setOnConfirmDialog(() => () => {
        setDialogVisible(false);
      });
      setDialogVisible(true);
    }
  };

  const getDistrict = async (id: number) => {
    try {
      const response = await dispatch(getAddressDistrictThunk({ query: id }));
      setDistrictList(response.payload.data);
    } catch (error: any) {
      setTitleDialog("Có lỗi xảy ra");
      setDialogDescription(
        error.message || "Không thể tải thông tin quận/huyện"
      );
      setConfirmButton(true);
      setOnConfirmDialog(() => () => {
        setDialogVisible(false);
      });
      setDialogVisible(true);
    }
  };

  const getWard = async (id: number) => {
    try {
      const response = await dispatch(getAddressWardThunk({ query: id }));
      setWardList(response.payload.data);
    } catch (error: any) {
      setTitleDialog("Có lỗi xảy ra");
      setDialogDescription(
        error.message || "Không thể tải thông tin phường/xã"
      );
      setConfirmButton(true);
      setOnConfirmDialog(() => () => {
        setDialogVisible(false);
      });
      setDialogVisible(true);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("userToken");

      setTitleDialog("Đang xử lý");
      setDialogDescription("Vui lòng chờ trong giây lát");
      setConfirmButton(false);
      setDialogVisible(true);

      if (!token) {
        setTitleDialog("Có lỗi xảy ra");
        setDialogDescription("Vui lòng đăng nhập để thêm địa chỉ");
        setDialogVisible(true);
        return;
      }

      const payload: Address = {
        user_id: userProfile?.id || "",
        province: province?.name || "",
        district: district?.name || "",
        ward: ward?.name || "",
        address: formData.address,
        address_type: selectedAddressType,
        is_default: formData.is_default,
        is_temporary: formData.is_temporary,
        note: formData.note,
      };
      await dispatch(addAddress(payload)).unwrap();

      if (payload) {
        setFormData({
          user_id: formData.user_id,
          province: "",
          district: "",
          ward: "",
          address: "",
          note: "",
          address_type: "home",
          is_default: false,
          is_temporary: false,
        });
        setSelectedItem(1);
        setSelectedAddressType("home");

        setTitleDialog("Thành công");
        setDialogDescription("Đã thêm địa chỉ");
        setConfirmButton(true);
        setOnConfirmDialog(() => () => {
          router.back();
        });
        setDialogVisible(true);
      }
    } catch (error: any) {
      setTitleDialog("Lỗi");
      setDialogDescription("Không thể thêm địa chỉ");
      setOnConfirmDialog(() => () => {
        setDialogVisible(false);
      });
      setDialogVisible(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userProfileStr = JSON.stringify(user);
        if (userProfileStr) {
          setUserProfile(JSON.parse(userProfileStr));
        }
        console.log("userProfileStr", userProfileStr);
      } catch (error: any) {
        setTitleDialog("Có lỗi xảy ra");
        setDialogDescription(
          error.message || "Không thể tải thông tin người dùng"
        );
        setConfirmButton(true);
        setOnConfirmDialog(() => () => {
          setDialogVisible(false);
        });
        setDialogVisible(true);
      }
    };
    loadUserData();
  }, []);

  useEffect(() => {
    getProvince();
  }, []);

  return (
    <View flex bg-$backgroundDefault>
      <AppBar back title={t("address.add_address")} />

      <ScrollView padding-15>
        <View
          bg-white
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
          <Text h2_bold primary marginB-10>
            {t("auth.login.personal_info")}
          </Text>
          <AddressTextInput
            value={userProfile?.full_name || ""}
            placeholder={t("address.name")}
            onChangeText={() => {}}
            editable={false}
          />
          <AddressTextInput
            value={userProfile?.phone_number || ""}
            placeholder={t("address.phone_number")}
            onChangeText={() => {}}
            maxLength={10}
            keyboardType="phone-pad"
            editable={false}
          />
        </View>

        <View
          bg-white
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
          <Text color="#717658" h2_bold marginB-10>
            {t("address.address")}
          </Text>

          <Picker
            placeholder={t("address.province")}
            floatingPlaceholder
            value={province?.id}
            label={province?.name}
            enableModalBlur={true}
            onChange={(value: PickerValue) => {
              if (typeof value === "string") {
                const selectedProvince = provinceList.find(
                  (item) => item.id === value
                );
                if (selectedProvince) {
                  setProvince({
                    id: selectedProvince.id,
                    name: selectedProvince.name,
                  } as AddressProvince);
                  getDistrict(Number(selectedProvince?.id));
                }
              }
            }}
            topBarProps={{ title: t("address.province") }}
            showSearch
            searchPlaceholder={t("address.search_a_province")}
            searchStyle={{ placeholderTextColor: Colors.grey50 }}
            items={provinceList.map((item: AddressProvince) => ({
              value: item.id,
              label: item.name,
            }))}
          />

          {province?.id && (
            <Picker
              placeholder={t("address.district")}
              searchPlaceholder={t("address.search_a_district")}
              topBarProps={{ title: t("address.district") }}
              floatingPlaceholder
              value={district?.id}
              label={district?.name}
              enableModalBlur={true}
              onChange={(value: PickerValue) => {
                if (typeof value === "string") {
                  const selectedDistrict = districtList.find(
                    (item) => item.id === value
                  );
                  if (selectedDistrict) {
                    setDistrict({
                      id: selectedDistrict.id,
                      name: selectedDistrict.name,
                    } as AddressDistrict);
                    getWard(Number(selectedDistrict?.id));
                  }
                }
              }}
              showSearch
              searchStyle={{ placeholderTextColor: Colors.grey50 }}
              items={districtList.map((item: AddressDistrict) => ({
                value: item.id,
                label: item.name,
              }))}
            />
          )}

          {district?.id && (
            <Picker
              placeholder={t("address.ward")}
              floatingPlaceholder
              value={ward?.id}
              label={ward?.name}
              enableModalBlur={true}
              onChange={(value: PickerValue) => {
                if (typeof value === "string") {
                  const selectedWard = wardList.find(
                    (item) => item.id === value
                  );
                  if (selectedWard) {
                    setWard({
                      id: selectedWard.id,
                      name: selectedWard.name,
                    } as AddressWard);
                  }
                }
              }}
              topBarProps={{ title: t("address.ward") }}
              showSearch
              searchPlaceholder={t("address.search_a_ward")}
              searchStyle={{ placeholderTextColor: Colors.grey50 }}
              items={wardList.map((item: AddressWard) => ({
                value: item.id,
                label: item.name,
              }))}
            />
          )}

          {ward?.id && (
            <AddressTextInput
              value={formData.address}
              placeholder={t("address.address")}
              onChangeText={(value) => {
                console.log("value", value === "");
                handleChange("address", value);
              }}
            />
          )}

          <TextInput
            value={formData.note}
            placeholder={t("address.note")}
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
              marginTop: 10,
            }}
          />
        </View>

        <View
          bg-white
          br20
          padding-15
          marginB-20
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 3,
          }}
        >
          <Text color="#717658" h2_bold marginB-10>
            {t("address.type")}
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {addressTypeItems.map((item) => (
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
                  h3_bold
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

        <View
          bg-white
          padding-20
          style={{
            borderTopWidth: 1,
            borderTopColor: "#E5E7EB",
            left: 0,
            right: 0,
          }}
        >
          <AppButton
            title={t("address.save")}
            type="primary"
            onPress={handleSubmit}
            disabled={formData.address === "" || loading}
          />
        </View>
      </ScrollView>

      <AppDialog
        visible={dialogVisible}
        title={titleDialog || "Lỗi"}
        description={dialogDescription || ""}
        closeButton={false}
        confirmButton={confirmButton}
        confirmButtonLabel={"Đồng ý"}
        severity="info"
        onConfirm={() => onConfirmDialog()}
      />
    </View>
  );
};

export default Add;
