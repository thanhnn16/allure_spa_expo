import { StyleSheet } from "react-native";
import {
  Text,
  TouchableOpacity,
  View,
  Colors,
  Picker,
  PickerValue,
  TextField,
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
  AddressDistrict,
  AddressProvince,
  AddressWard,
} from "@/types/address.type";
import Animated, { FadeIn } from "react-native-reanimated";

export interface PaymentAddressProps {
  addressType: string;
  fullName: string;
  phoneNumber: string;
  address: string;
  district: string;
  province: string;
}

interface TempAddress {
  full_name: string;
  phone_number: string;
  address: string;
  ward: string;
  district: string;
  province: string;
}

interface PaymentAddressComponentProps {
  isPayment?: boolean;
  onPress?: () => void;
  selectAddress?: PaymentAddressProps | null;
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
  isPayment,
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
      setProvinceList(response.payload.data);
    } catch (error: any) {
      showDialog(
        t("common.error"),
        error.message || t("address.province_load_error"),
        "error"
      );
    }
  };

  const getDistrict = async (id: number) => {
    try {
      const response = await dispatch(getAddressDistrictThunk({ query: id }));
      setDistrictList(response.payload.data);
    } catch (error: any) {
      showDialog(
        t("common.error"),
        error.message || t("address.district_load_error"),
        "error"
      );
    }
  };

  const getWard = async (id: number) => {
    try {
      const response = await dispatch(getAddressWardThunk({ query: id }));
      setWardList(response.payload.data);
    } catch (error: any) {
      showDialog(
        t("common.error"),
        error.message || t("address.ward_load_error"),
        "error"
      );
    }
  };

  useEffect(() => {
    if (addressType === "temp") {
      getProvince();
    }
  }, [addressType]);

  const handleFieldChange = (field: keyof TempAddress, value: string) => {
    setTempAddress((prev) => ({
      ...prev,
      [field]: value,
    }));
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
                        getAddressTypeConfig(selectAddress.addressType).bgColor
                      }
                      paddingH-8
                      paddingV-4
                      br20
                    >
                      <MaterialCommunityIcons
                        name={
                          getAddressTypeConfig(selectAddress.addressType)
                            .icon as any
                        }
                        size={14}
                        color={
                          getAddressTypeConfig(selectAddress.addressType).color
                        }
                        style={{ marginRight: 4 }}
                      />
                      <Text
                        text90
                        style={{
                          color: getAddressTypeConfig(selectAddress.addressType)
                            .color,
                          fontWeight: "600",
                        }}
                      >
                        {t(
                          `address.${
                            selectAddress.addressType?.toLowerCase() || "other"
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
                <Text text70 marginB-5 style={{ fontWeight: "600" }}>
                  {userProfile?.full_name}
                </Text>
                <Text grey30 text80 marginB-5>
                  {userProfile?.phone_number}
                </Text>
                <Text grey30 text80 style={{ lineHeight: 20 }}>
                  {selectAddress.address}, {selectAddress.district},{" "}
                  {selectAddress.province}
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
            {[
              {
                key: "full_name",
                label: t("address.full_name"),
                icon: "account-outline",
                value: userProfile?.full_name || "",
                editable: false,
              },
              {
                key: "phone_number",
                label: t("address.phone_number"),
                icon: "phone-outline",
                value: userProfile?.phone_number || "",
                editable: false,
                keyboardType: "phone-pad",
              },
            ].map((field) => (
              <View key={field.key} marginB-10>
                <TextField
                  value={field.value}
                  onChangeText={(text) =>
                    handleFieldChange(field.key as keyof TempAddress, text)
                  }
                  placeholder={field.label}
                  editable={field.editable}
                  leadingAccessory={
                    <View marginR-10>
                      <MaterialCommunityIcons
                        name={field.icon as any}
                        size={20}
                        color={Colors.grey30}
                      />
                    </View>
                  }
                  keyboardType={field.keyboardType as any}
                  fieldStyle={[styles.field]}
                />
              </View>
            ))}

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
                    handleFieldChange("province", selectedProvince.name);
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
                      getWard(Number(selectedDistrict?.id));
                      handleFieldChange("district", selectedDistrict.name);
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

            <TextField
              value={tempAddress.address}
              placeholder={t("address.street_address")}
              onChangeText={(text) => handleFieldChange("address", text)}
              leadingAccessory={
                <View marginR-10>
                  <MaterialCommunityIcons
                    name="map-marker-outline"
                    size={20}
                    color={Colors.grey30}
                  />
                </View>
              }
              fieldStyle={[styles.field]}
            />
          </View>
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  field: {
    borderWidth: 1,
    borderColor: Colors.grey50,
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: Colors.white,
    height: 44,
    marginBottom: 10,
  },
});

export default PaymentAddress;
