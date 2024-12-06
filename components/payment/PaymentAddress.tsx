import {
  Text,
  TouchableOpacity,
  View,
  Colors,
  Picker,
  PickerValue,
} from "react-native-ui-lib";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useLanguage } from "@/hooks/useLanguage";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
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
  TempAddress,
} from "@/types/address.type";
import Animated, { FadeIn } from "react-native-reanimated";
import AddressTextInput from "../address/AddressTextInput";

interface PaymentAddressComponentProps {
  isPayment?: boolean;
  onPress?: () => void;
  selectAddress?: Address | null;
  addressType: "saved" | "temp";
  setAddressType: (type: "saved" | "temp") => void;
  tempAddress: TempAddress;
  setTempAddress: React.Dispatch<React.SetStateAction<TempAddress>>;
  showDialog: (
    title: string,
    description: string,
    severity: "success" | "error" | "info" | "warning"
  ) => void;
  userProfile?: any;
}

const getAddressTypeConfig = (type: string) => {
  switch (type?.toLowerCase()) {
    case "home":
      return {
        icon: "home-outline",
        color: Colors.blue30,
        bgColor: "rgba(50, 130, 250, 0.1)",
      };
    case "work":
      return {
        icon: "briefcase-outline",
        color: Colors.orange30,
        bgColor: "rgba(255, 140, 0, 0.1)",
      };
    default:
      return {
        icon: "map-marker-outline",
        color: Colors.purple30,
        bgColor: "rgba(155, 80, 250, 0.1)",
      };
  }
};

const PaymentAddress = ({
  onPress,
  selectAddress,
  addressType,
  setAddressType,
  tempAddress,
  setTempAddress,
  showDialog,
  userProfile,
}: PaymentAddressComponentProps) => {
  const { t } = useLanguage();
  const dispatch = useDispatch();

  const [province, setProvince] = useState<AddressProvince>();
  const [provinceList, setProvinceList] = useState<AddressProvince[]>([]);
  const [district, setDistrict] = useState<AddressDistrict>();
  const [districtList, setDistrictList] = useState<AddressDistrict[]>([]);
  const [ward, setWard] = useState<AddressWard>();
  const [wardList, setWardList] = useState<AddressWard[]>([]);

  const getProvince = async () => {
    try {
      const response = await dispatch(getAddressProvinceThunk({}));
      if (response.payload?.data) {
        setProvinceList(response.payload.data);
      } else {
        throw new Error("No province data received");
      }
    } catch (error: any) {
      console.error("Province loading error:", error);
      showDialog(t("common.error"), t("address.province_load_error"), "error");
    }
  };

  const getDistrict = async (provinceId: string) => {
    try {
      if (!provinceId) {
        throw new Error("Province ID is required");
      }
      const response = await dispatch(
        getAddressDistrictThunk({ query: Number(provinceId) })
      );
      if (response.payload?.data) {
        setDistrictList(response.payload.data);
      } else {
        throw new Error("No district data received");
      }
    } catch (error: any) {
      showDialog(t("common.error"), t("address.district_load_error"), "error");
    }
  };

  const getWard = async (districtId: string) => {
    try {
      if (!districtId) {
        throw new Error("District ID is required");
      }
      const response = await dispatch(
        getAddressWardThunk({ query: Number(districtId) })
      );
      if (response.payload?.data) {
        setWardList(response.payload.data);
      } else {
        throw new Error("No ward data received");
      }
    } catch (error: any) {
      showDialog(t("common.error"), t("address.ward_load_error"), "error");
    }
  };

  useEffect(() => {
    getProvince();
  }, []);

  const handleFieldChange = (field: keyof TempAddress, value: string) => {
    setTempAddress((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePhoneNumberChange = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, "");
    handleFieldChange("phone_number", numericValue);
  };

  const isPhoneNumberValid = (phone: string) => {
    return /^[0-9]{10}$/.test(phone);
  };

  return (
    <View>
      <View
        row
        br30
        marginB-12
        padding-4
        backgroundColor={Colors.surface_variant}
      >
        {[
          {
            type: "saved",
            icon: "bookmark-outline",
            label: t("checkout.saved_address"),
          },
          {
            type: "temp",
            icon: "pencil-outline",
            label: t("checkout.temp_address"),
          },
        ].map((item) => (
          <TouchableOpacity
            key={item.type}
            flex-1
            onPress={() => setAddressType(item.type as "saved" | "temp")}
          >
            <View
              center
              padding-8
              br20
              backgroundColor={
                addressType === item.type ? Colors.white : "transparent"
              }
              style={
                addressType === item.type && {
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.05,
                  shadowRadius: 3,
                  elevation: 2,
                }
              }
            >
              <MaterialCommunityIcons
                name={item.icon as any}
                size={16}
                color={
                  addressType === item.type ? Colors.primary : Colors.grey30
                }
                style={{ marginBottom: 2 }}
              />
              <Text
                text90
                color={
                  addressType === item.type ? Colors.primary : Colors.grey30
                }
              >
                {item.label}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <Animated.View
        entering={FadeIn.duration(300)}
        style={{
          backgroundColor: Colors.white,
          borderRadius: 16,
          padding: 20,
          borderWidth: 1,
          borderColor: Colors.border,
        }}
      >
        {addressType === "saved" ? (
          <TouchableOpacity onPress={onPress}>
            {selectAddress ? (
              <>
                <View row spread marginB-10>
                  <View row centerV>
                    <View
                      row
                      centerV
                      backgroundColor={
                        getAddressTypeConfig(selectAddress.address_type).bgColor
                      }
                      paddingH-8
                      paddingV-4
                      br20
                    >
                      <MaterialCommunityIcons
                        name={
                          getAddressTypeConfig(selectAddress.address_type)
                            .icon as any
                        }
                        size={14}
                        color={
                          getAddressTypeConfig(selectAddress.address_type).color
                        }
                        style={{ marginRight: 4 }}
                      />
                      <Text
                        text90
                        style={{
                          color: getAddressTypeConfig(
                            selectAddress.address_type
                          ).color,
                          fontWeight: "600",
                        }}
                      >
                        {t(
                          `address.${selectAddress.address_type?.toLowerCase() || "other"
                          }`
                        )}
                      </Text>
                    </View>
                  </View>
                  <MaterialCommunityIcons
                    name="chevron-right"
                    size={20}
                    color={Colors.grey30}
                  />
                </View>

                <Text
                  text70
                  marginB-5
                  color={Colors.grey10}
                  style={{
                    fontWeight: "600",
                    fontSize: 16,
                  }}
                >
                  {userProfile?.full_name || ""}
                </Text>
                <Text
                  text80
                  marginB-5
                  color={Colors.grey30}
                  style={{
                    fontSize: 14,
                  }}
                >
                  {userProfile?.phone_number || ""}
                </Text>
                <Text
                  text80
                  color={Colors.grey30}
                  style={{
                    lineHeight: 20,
                    fontSize: 14,
                  }}
                >
                  {selectAddress.address}, {selectAddress.ward},{" "}
                  {selectAddress.district}, {selectAddress.province}
                </Text>
              </>
            ) : (
              <View row spread centerV>
                <Text grey30>{t("checkout.select_address")}</Text>
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={24}
                  color={Colors.grey30}
                />
              </View>
            )}
          </TouchableOpacity>
        ) : (
          <View>
            {(
              tempAddress.full_name.length < 3 || 
              tempAddress.phone_number.length < 3 ||
              tempAddress.province.length < 3 ||
              tempAddress.district.length < 3 ||
              tempAddress.ward.length < 3 ||
              tempAddress.address.length < 3
            ) && (
              <View
                row
                gap-8
                style={{
                  padding: 8,
                  backgroundColor: Colors.primary_light,
                  borderRadius: 8,
                  marginBottom: 16,
                  borderColor: Colors.primary,
                  borderWidth: 1,
                }}
              >
                <Ionicons
                  name="location-outline"
                  size={16}
                  color={Colors.primary}
                />
                <Text h3>
                  {t("checkout.missing_address_info")}: {" "}
                  {tempAddress.full_name.length < 3 ? t("address.name") : ""}
                  {tempAddress.phone_number.length < 3 ? t("address.phone_number") + ", " : ""}
                  {tempAddress.province.length < 3 ? t("address.province") + ", " : ""}
                  {tempAddress.district.length < 3 ? t("address.district") + ", " : ""}
                  {tempAddress.ward.length < 3 ? t("address.ward") + ", " : ""}
                  {tempAddress.address.length < 5 ? t("address.address") + ", " : ""}
                </Text>
              </View>)}
            <AddressTextInput
              value={tempAddress.full_name}
              placeholder={t("address.name")}
              onChangeText={(value) => handleFieldChange("full_name", value)}
              error={tempAddress.full_name !== "" && tempAddress.full_name.length < 2}
              errorMessage={t("address.name_too_short")}
            />

            <AddressTextInput
              value={tempAddress.phone_number}
              placeholder={t("address.phone_number")}
              onChangeText={handlePhoneNumberChange}
              keyboardType="phone-pad"
              maxLength={10}
              error={tempAddress.phone_number !== "" && !isPhoneNumberValid(tempAddress.phone_number)}
              errorMessage={t("address.invalid_phone")}
            />

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
                    handleFieldChange("province", selectedProvince.name);
                    getDistrict(String(selectedProvince?.id));
                    setDistrict(undefined);
                    setWard(undefined);
                    handleFieldChange("district", "");
                    handleFieldChange("ward", "");
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
                      handleFieldChange("district", selectedDistrict.name);
                      getWard(String(selectedDistrict?.id));
                      setWard(undefined);
                      handleFieldChange("ward", "");
                    }
                  }
                }}
                topBarProps={{ title: t("address.district") }}
                showSearch
                searchPlaceholder={t("address.search_a_district")}
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
                      handleFieldChange("ward", selectedWard.name);
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
                value={tempAddress.address}
                placeholder={t("address.address")}
                onChangeText={(value) => handleFieldChange("address", value)}
                error={tempAddress.address !== "" && tempAddress.address.length < 5}
                errorMessage={t("address.address_too_short")}
              />
            )}
          </View>
        )}
      </Animated.View>
    </View>
  );
};

export default PaymentAddress;
