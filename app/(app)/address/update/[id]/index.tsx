import { Colors, Image, Picker, PickerValue, Text, TouchableOpacity, View } from "react-native-ui-lib";
import i18n from "@/languages/i18n";
import { useNavigation, useLocalSearchParams } from "expo-router";
import BackButton from "@/assets/icons/back.svg";
import { useEffect, useState } from "react";
import AppButton from "@/components/buttons/AppButton";
import { SafeAreaView, ScrollView, TextInput, Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import AppBar from "@/components/app-bar/AppBar";
import { Address, AddressDistrict, AddressProvince, AddressWard, UserProfile } from "@/types/address.type";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchAddresses } from "@/redux/features/address/addressThunk";
import AppDialog from "@/components/dialog/AppDialog";
import AddressTextInput from "@/components/address/AddressTextInput";
import { RootState } from "@/redux/store";
import { User } from "@/types/user.type";
import { addressTypeItems } from "../../add";
import { getAddressDistrictThunk, getAddressProvinceThunk, getAddressWardThunk } from "@/redux/features/address/getAddressThunk";
import { get, set } from "lodash";
import { useAuth } from "@/hooks/useAuth";

type AddressType = "home" | "work" | "others";

const UpdateScreen = () => {
  const { id } = useLocalSearchParams();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState<Address>({
    user_id: "",
    province: "",
    district: "",
    ward: "",
    address: "",
    note: "",
    address_type: "others",
    is_default: false,
    is_temporary: false,
  });

  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<User>();
  const [address, setAddress] = useState<Address>();

  const [errorDescription, setErrorDescription] = useState<string>();
  const [errorDialogVisible, setErrorDialogVisible] = useState(false);

  const [selectedAddressType, setSelectedAddressType] = useState<AddressType>("home");
  const [selectedItem, setSelectedItem] = useState<number | null>(1);

  const [province, setProvince] = useState<AddressProvince | string >();
  const [provinceList, setProvinceList] = useState<AddressProvince[]>([]);

  const [district, setDistrict] = useState<AddressDistrict>();
  const [districtList, setDistrictList] = useState<AddressDistrict[]>([]);

  
  const [ward, setWard] = useState<AddressWard>();
  const [wardList, setWardList] = useState<AddressWard[]>([]);
  

  const { addresses, loading, error } = useSelector(
    (state: RootState) => state.address
  );

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const getProvince = async () => {
    try {
      const response = await dispatch(getAddressProvinceThunk({}));
      setProvinceList(response.payload.data);
      setProvince(addresses?.province);
      const selectedProvince = provinceList.find((item) => item.id === address?.province);
      if (address) {
        getDistrict(Number(selectedProvince?.id));
      }
    } catch (error: any) {
      setErrorDescription(error.message || "Không thể tải thông tin tỉnh/thành phố");
      setErrorDialogVisible(true);
    }
  };

  const getDistrict = async (id: number) => {
    try {
      const response = await dispatch(getAddressDistrictThunk({ query: id }));
      setDistrictList(response.payload.data);
      const selectedDistrict = districtList.find((item) => item.id === address?.district);
      // if (address) {
      //   getWard(Number(selectedDistrict?.id));
      // }

    } catch (error: any) {
      setErrorDescription(error.message || "Không thể tải thông tin quận/huyện");
      setErrorDialogVisible(true);
    }
  }

  const getWard = async (id: number) => {
    try {
      const response = await dispatch(getAddressWardThunk({ query: id }));
      setWardList(response.payload.data);

    } catch (error: any) {
      setErrorDescription(error.message || "Không thể tải thông tin phường/xã");
      setErrorDialogVisible(true);
    }
  }

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userProfileStr = JSON.stringify(user);
        if (userProfileStr) {
          setUserProfile(JSON.parse(userProfileStr));
        }
      } catch (error: any) {
        setErrorDescription(error.message || "Không thể cập nhật địa chỉ");
        setErrorDialogVisible(true);
      }
    };
    loadUserData();
  }, []);

  useEffect(() => {
    const loadAddressData = async () => {
      try {
        await dispatch(fetchAddresses()).unwrap();
        const address = addresses.find((item: Address) => Number(item.id) === Number(id));
        setAddress(address);
        setFormData((prev) => ({
          ...prev,
          province: address.province,
          district: address.district,
          ward: address.ward,
          address: address.address,
          address_type: address.address_type,
          is_default: address.is_default,
          is_temporary: address.is_temporary,
          note: address.note,
        }));
        selectedAddressType === "home" && setSelectedItem(1);
      } catch (error: any) {
        setErrorDescription(error.message || "Không thể cập nhật địa chỉ");
        setErrorDialogVisible(true);
      }
    };
    loadAddressData();
  }, []);

  useEffect(() => {
    getProvince();
  }, []);

  return (
    <View flex bg-F5F7FA>
      <AppBar back title="Cập nhật địa chỉ" />

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
          <Text color="#717658" marginB-10 h2_bold>
            {i18n.t("auth.login.personal_info")}
          </Text>
          <AddressTextInput
            value={userProfile?.full_name || ""}
            placeholder={i18n.t("auth.login.fullname")}
            onChangeText={(value) =>
              setFormData((prev) => ({ ...prev, name: value }))
            }
          />
          <AddressTextInput
            value={userProfile?.phone_number || ""}
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
          <Picker
            placeholder="Tỉnh/Thành phố"
            floatingPlaceholder
            value={province?.id}
            label={ address?.province || province?.name }
            enableModalBlur={true}
            onChange={(value: PickerValue) => {
              if (typeof value === 'string') {
                const selectedProvince = provinceList.find((item) => item.id === value);
                if (selectedProvince) {
                  setProvince({ id: selectedProvince.id, name: selectedProvince.name } as AddressProvince);
                  getDistrict(Number(selectedProvince?.id));

                }
              }
            }}
            topBarProps={{ title: 'Tỉnh/Thành phố' }}
            showSearch
            searchPlaceholder={'Tìm một tỉnh/thành phố'}
            searchStyle={{ placeholderTextColor: Colors.grey50 }}
            items={
              provinceList.map((item: AddressProvince) => ({
                value: item.id,
                label: item.name,
              }))
            }
          />

          {province?.id && (
            <Picker
              placeholder="Quận/Huyện"
              floatingPlaceholder
              value={district?.id}
              label={district?.name}
              enableModalBlur={true}
              onChange={(value: PickerValue) => {
                if (typeof value === 'string') {
                  const selectedDistrict = districtList.find((item) => item.id === value);
                  console.log("selectedDistrict", selectedDistrict);
                  console.log("value", value);
                  if (selectedDistrict) {
                    setDistrict({ id: selectedDistrict.id, name: selectedDistrict.name } as AddressDistrict);
                    getWard(Number(selectedDistrict?.id));
                  }
                }
              }}
              topBarProps={{ title: 'Quận/Huyện' }}
              showSearch
              searchPlaceholder={'Tìm một quận/huyện'}
              searchStyle={{ placeholderTextColor: Colors.grey50 }}
              items={
                districtList.map((item: AddressDistrict) => ({
                  value: item.id,
                  label: item.name,
                }))
              }
            />
          )}

          {/* {district?.id && (
            <Picker
              placeholder="Phường/Xã"
              floatingPlaceholder
              value={ward?.id}
              label={ward?.name}
              enableModalBlur={true}
              onChange={(value: PickerValue) => {
                if (typeof value === 'string') {
                  const selectedWard = wardList.find((item) => item.id === value);
                  if (selectedWard) {
                    setWard({ id: selectedWard.id, name: selectedWard.name } as AddressWard);
                  }
                }
              }}
              topBarProps={{ title: 'Phường/Xã' }}
              showSearch
              searchPlaceholder={'Tìm một phường/xã'}
              searchStyle={{ placeholderTextColor: Colors.grey50 }}
              items={
                wardList.map((item: AddressWard) => ({
                  value: item.id,
                  label: item.name,
                }))
              }
            />
          )} */}

          {/* {ward?.id && (
            <AddressTextInput
              value={formData.address}
              placeholder={i18n.t("address.address")}
              onChangeText={(value) => {
                handleChange("address", value)
              }}
            />
          )} */}

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
      </ScrollView>

      {/* <View
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
      </View> */}

      <AppDialog
        visible={errorDialogVisible}
        title={"Có lỗi xảy ra"}
        description={errorDescription || ""}
        closeButtonLabel={i18n.t("common.cancel")}
        confirmButtonLabel={"Cập nhật"}
        severity="info"
        onClose={() => setErrorDialogVisible(false)}
      />
    </View>
  );
};

export default UpdateScreen;
