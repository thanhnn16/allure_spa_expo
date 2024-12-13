import { Colors, Picker, PickerValue, Text, TouchableOpacity, View } from "react-native-ui-lib";
import { useLanguage } from "@/hooks/useLanguage";

import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, TextInput } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import AppBar from "@/components/app-bar/AppBar";
import { Address, AddressDistrict, AddressProvince, AddressWard } from "@/types/address.type";
import { fetchAddresses } from "@/redux/features/address/addressThunk";
import AppDialog from "@/components/dialog/AppDialog";
import AddressTextInput from "@/components/address/AddressTextInput";
import { RootState } from "@/redux/store";
import { User } from "@/types/user.type";
import { getAddressDistrictThunk, getAddressProvinceThunk, getAddressWardThunk } from "@/redux/features/address/getAddressThunk";
import { useAuth } from "@/hooks/useAuth";
import { router } from "expo-router";
import { updateAddress } from "@/redux/features/address/addressThunk";
import AppButton from "@/components/buttons/AppButton";

type AddressType = "home" | "work" | "others";

const UpdateScreen = () => {
  const { t } = useLanguage();
  const { id } = useLocalSearchParams();
  const dispatch = useDispatch();


  const addressTypeItems = [
    { id: 1, name: t("address.home"), type: "home" as AddressType },
    { id: 2, name: t("address.work"), type: "work" as AddressType },
    { id: 3, name: t("address.others"), type: "others" as AddressType },
  ];

  const [formData, setFormData] = useState<Address>({
    user_id: "",
    province: "",
    district: "",
    ward: "",
    address: "",
    address_type: "others",
    is_default: false,
    is_temporary: false,
  });

  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<User>();
  const [address, setAddress] = useState<Address>();

  const [selectedAddressType, setSelectedAddressType] = useState<AddressType>("home");
  const [selectedItem, setSelectedItem] = useState<number | null>(1);

  const [province, setProvince] = useState<AddressProvince>();
  const [provinceList, setProvinceList] = useState<AddressProvince[]>([]);

  const [district, setDistrict] = useState<AddressDistrict>();
  const [districtList, setDistrictList] = useState<AddressDistrict[]>([]);


  const [ward, setWard] = useState<AddressWard>();
  const [wardList, setWardList] = useState<AddressWard[]>([]);


  const { addresses } = useSelector(
    (state: RootState) => state.address
  );

  const [initialAddress, setInitialAddress] = useState({
    province: '',
    district: '',
    ward: ''
  });

  const [loading, setLoading] = useState(false);

  const [isFormValid, setIsFormValid] = useState(false);

  const [dialogState, setDialogState] = useState({
    title: "",
    description: "",
    visible: false,
    confirmButton: false,
    onConfirm: () => { },
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const isValid = !!(
      province?.name &&
      district?.name &&
      ward?.name &&
      formData.address &&
      selectedAddressType
    );
    setIsFormValid(isValid);
    return isValid;
  };

  useEffect(() => {
    validateForm();
  }, [province, district, ward, formData.address, selectedAddressType]);

  const getProvince = async () => {
    try {
      const response = await dispatch(getAddressProvinceThunk({}));
      setProvinceList(response.payload.data);

      if (address) {
        const selectedProvince = response.payload.data.find(
          (item: AddressProvince) => item.name === address.province
        );
        if (selectedProvince) {
          setProvince(selectedProvince);
          getDistrict(Number(selectedProvince.id));
        }
      }
    } catch (error: any) {
      handleError(error, "Không thể tải thông tin tỉnh/thành phố");
    }
  };

  const getDistrict = async (id: number) => {
    try {
      const response = await dispatch(getAddressDistrictThunk({ query: id }));
      setDistrictList(response.payload.data);

      if (address) {
        const selectedDistrict = response.payload.data.find(
          (item: AddressDistrict) => item.name === address.district
        );
        if (selectedDistrict) {
          setDistrict(selectedDistrict);
          getWard(Number(selectedDistrict.id));
        }
      }
    } catch (error: any) {
      handleError(error, "Không thể tải thông tin quận/huyện");
    }
  };

  const getWard = async (id: number) => {
    try {
      const response = await dispatch(getAddressWardThunk({ query: id }));
      setWardList(response.payload.data);

      if (address) {
        const selectedWard = response.payload.data.find(
          (item: AddressWard) => item.name === address.ward
        );
        if (selectedWard) {
          setWard(selectedWard);
        }
      }
    } catch (error: any) {
      handleError(error, "Không thể tải thông tin phường/xã");
    }
  };

  const handleUpdateAddress = async () => {
    try {
      if (!validateForm()) {
        showDialog("Thông báo", "Vui lòng nhập đầy đủ thông tin địa chỉ", true);
        return;
      }

      setLoading(true);
      showDialog("Đang xử lý", "Vui lòng chờ trong giây lát", false);

      const payload: Address = {
        user_id: userProfile?.id || "",
        province: province?.name || "",
        district: district?.name || "",
        ward: ward?.name || "",
        address: formData.address,
        address_type: selectedAddressType,
        is_default: formData.is_default,
        is_temporary: formData.is_temporary,
      };

      await dispatch(updateAddress({ id: id as string, data: payload })).unwrap();
      showDialog("Thành công", "Đã cập nhật địa chỉ", true, () => router.back());
    } catch (error: any) {
      handleError(error, "Không thể cập nhật địa chỉ");
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
      } catch (error: any) {
        handleError(error, "Không thể cập nhật địa chỉ");
      }
    };
    loadUserData();
  }, []);

  useEffect(() => {
    const loadAddressData = async () => {
      try {
        const response = await dispatch(fetchAddresses()).unwrap();
        const address = response?.find((item: Address) => Number(item.id) === Number(id));
        if (!address) {
          throw new Error("Không tìm thấy địa chỉ");
        }
        setAddress(address);

        setInitialAddress({
          province: address.province,
          district: address.district,
          ward: address.ward
        });

        setFormData((prev) => ({
          ...prev,
          province: address.province,
          district: address.district,
          ward: address.ward,
          address: address.address,
          address_type: address.address_type,
          is_default: address.is_default,
          is_temporary: address.is_temporary,
        }));

        const addressType = addressTypeItems.find(item => item.type === address.address_type);
        if (addressType) {
          setSelectedItem(addressType.id);
          setSelectedAddressType(addressType.type);
        }
      } catch (error: any) {
        handleError(error, "Không thể tải thông tin địa chỉ");
      }
    };
    loadAddressData();
  }, []);

  useEffect(() => {
    getProvince();
  }, []);

  const showDialog = (
    title: string,
    description: string,
    confirmButton = true,
    onConfirm = () => { }
  ) => {
    setDialogState({
      title,
      description,
      visible: true,
      confirmButton,
      onConfirm
    });
  };

  const handleError = (error: any, defaultMessage: string) => {
    showDialog(
      "Có lỗi xảy ra",
      error.message || defaultMessage,
      true,
      () => setDialogState(prev => ({ ...prev, visible: false }))
    );
  };

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
            {t("auth.login.personal_info")}
          </Text>
          <AddressTextInput
            value={userProfile?.full_name || ""}
            placeholder={t("auth.login.enter_full_name")}
            onChangeText={(value) =>
              setFormData((prev) => ({ ...prev, name: value }))
            }
          />
          <AddressTextInput
            value={userProfile?.phone_number || ""}
            placeholder={t("address.phone")}
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
            {t("address.address")}
          </Text>
          <Picker
            placeholder="Tỉnh/Thành phố"
            floatingPlaceholder
            value={province?.id || ''}
            label={province?.name || initialAddress.province}
            enableModalBlur={true}
            onChange={(value: PickerValue) => {
              if (typeof value === 'string') {
                const selectedProvince = provinceList.find((item) => item.id === value);
                if (selectedProvince) {
                  setProvince({
                    id: selectedProvince.id,
                    name: selectedProvince.name
                  } as AddressProvince);
                  getDistrict(Number(selectedProvince.id));
                  setDistrict(undefined);
                  setWard(undefined);
                }
              }
            }}
            topBarProps={{ title: 'Tỉnh/Thành phố' }}
            showSearch
            searchPlaceholder={'Tìm một tỉnh/thành phố'}
            searchStyle={{ placeholderTextColor: Colors.grey50 }}
            items={
              provinceList?.map((item: AddressProvince) => ({
                value: item.id,
                label: item.name,
              })) || []
            }
          />

          {province?.id && (
            <Picker
              placeholder="Quận/Huyện"
              floatingPlaceholder
              value={district?.id || ''}
              label={district?.name || initialAddress.district}
              enableModalBlur={true}
              onChange={(value: PickerValue) => {
                if (typeof value === 'string') {
                  const selectedDistrict = districtList.find((item) => item.id === value);
                  if (selectedDistrict) {
                    setDistrict({
                      id: selectedDistrict.id,
                      name: selectedDistrict.name
                    } as AddressDistrict);
                    getWard(Number(selectedDistrict.id));
                    setWard(undefined);
                  }
                }
              }}
              topBarProps={{ title: 'Quận/Huyện' }}
              showSearch
              searchPlaceholder={'Tìm một quận/huyện'}
              searchStyle={{ placeholderTextColor: Colors.grey50 }}
              items={
                districtList?.map((item: AddressDistrict) => ({
                  value: item.id,
                  label: item.name,
                })) || []
              }
            />
          )}

          {district?.id && (
            <Picker
              placeholder="Phường/Xã"
              floatingPlaceholder
              value={ward?.id || ''}
              label={ward?.name || initialAddress.ward}
              enableModalBlur={true}
              onChange={(value: PickerValue) => {
                if (typeof value === 'string') {
                  const selectedWard = wardList.find((item) => item.id === value);
                  if (selectedWard) {
                    setWard({
                      id: selectedWard.id,
                      name: selectedWard.name
                    } as AddressWard);
                  }
                }
              }}
              topBarProps={{ title: 'Phường/Xã' }}
              showSearch
              searchPlaceholder={'Tìm một phường/xã'}
              searchStyle={{ placeholderTextColor: Colors.grey50 }}
              items={
                wardList?.map((item: AddressWard) => ({
                  value: item.id,
                  label: item.name,
                })) || []
              }
            />
          )}

          {ward?.id && (
            <AddressTextInput
              value={formData.address}
              placeholder={t("address.address")}
              onChangeText={(value) => handleChange("address", value)}
            />
          )}
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
          title={t("address.save")}
          type="primary"
          onPress={handleUpdateAddress}
          disabled={loading}
        />
      </View>

      <AppDialog
        visible={dialogState.visible}
        title={dialogState.title}
        description={dialogState.description}
        closeButton={false}
        confirmButton={dialogState.confirmButton}
        confirmButtonLabel="Đồng ý"
        severity="info"
        onConfirm={dialogState.onConfirm}
      />
    </View>
  );
};

export default UpdateScreen;
