import { View } from "react-native-ui-lib";
import { router } from "expo-router";
import { ScrollView } from "react-native";
import { useState, useEffect } from "react";
import AppButton from "@/components/buttons/AppButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { deleteAddress, fetchAddresses, updateAddress } from "@/redux/features";
import AppBar from "@/components/app-bar/AppBar";
import AddressSkeletonView from "@/components/address/AddressSkeletonView";
import type { Address, UserProfile } from "@/types/address.type";
import AddressItem from "@/components/address/AddressItem";
import AppDialog from "@/components/dialog/AppDialog";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";

const AddressScreen = () => {
  const { t } = useLanguage();

  const [dialogUpdateVisible, setDialogUpdateVisible] = useState(false);
  const [dialogDeleteVisible, setdialogDeleteVisible] = useState(false);

  const [errorDescription, setErrorDescription] = useState<string>();
  const [errorDialogVisible, setErrorDialogVisible] = useState(false);

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [updateItem, setUpdateItem] = useState<Address | null>(null);

  const { user } = useAuth();

  const dispatch = useDispatch();
  const { addresses, loading } = useSelector(
    (state: RootState) => state.address
  );

  const loadUserData = async () => {
    try {
      const userProfileStr = JSON.stringify(user);
      if (userProfileStr) {
        setUserProfile(JSON.parse(userProfileStr));
      }

      await dispatch(fetchAddresses()).unwrap();
      console.log("addresses", addresses);
    } catch (error: any) {
      setErrorDescription(error.message || "Không thể cập nhật địa chỉ");
      setErrorDialogVisible(true);
    }
  };

  const deleteAddressById = async () => {
    try {
      await dispatch(deleteAddress(updateItem?.id)).unwrap();
      setdialogDeleteVisible(false);
    } catch (error: any) {
      setErrorDescription(error.message || "Không thể xóa địa chỉ");
      setErrorDialogVisible(true);
    }
  };

  const handleSelectAddress = async () => {
    try {
      const updateData = {
        province: updateItem?.province,
        district: updateItem?.district,
        ward: updateItem?.ward,
        address: updateItem?.address,
        address_type: updateItem?.address_type,
        is_default: true,
      };
      setDialogUpdateVisible(false);
      await dispatch(
        updateAddress({
          id: updateItem?.id,
          data: updateData,
        })
      ).unwrap();
      await dispatch(fetchAddresses()).unwrap();
      await AsyncStorage.setItem("selectedAddress", JSON.stringify(updateItem));
    } catch (error: any) {
      setErrorDescription(error.message || "Không thể cập nhật địa chỉ");
      setErrorDialogVisible(true);
    }
  };

  useEffect(() => {
    loadUserData();
  }, [dispatch]);

  return (
    <View flex bg-white>
      <AppBar back title={t("address.address")} />
      <View flex>
        {loading ? (
          <AddressSkeletonView />
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            {addresses.map((item: Address, index: number) => (
              <AddressItem
                key={index}
                userProfile={userProfile}
                item={item}
                setUpdateItem={setUpdateItem}
                setUpdateDialogVisible={setDialogUpdateVisible}
                setDeleteDialogVisible={setdialogDeleteVisible}
              />
            ))}
          </ScrollView>
        )}
      </View>

      <View width={"100%"} padding-16>
        <AppButton
          type="primary"
          title={t("address.add_new_address")}
          onPress={() => router.push("/(app)/address/add")}
        />
      </View>

      <AppDialog
        visible={errorDialogVisible}
        title={t("common.error")}
        description={errorDescription || ""}
        confirmButton={true}
        confirmButtonLabel={t("common.accept")}
        severity="error"
        onConfirm={() => setErrorDialogVisible(false)}
      />

      <AppDialog
        visible={dialogUpdateVisible}
        title={t("address.set_default_address")}
        description={t("address.set_default_address_confirm")}
        confirmButton={true}
        closeButtonLabel={t("common.cancel")}
        confirmButtonLabel={t("common.accept")}
        severity="info"
        onClose={() => setDialogUpdateVisible(false)}
        onConfirm={() => handleSelectAddress()}
      />

      <AppDialog
        visible={dialogDeleteVisible}
        title={t("address.delete_address")}
        description={t("address.delete_address_confirm")}
        confirmButton={true}
        closeButtonLabel={t("common.cancel")}
        confirmButtonLabel={t("common.accept")}
        severity="info"
        onClose={() => setdialogDeleteVisible(false)}
        onConfirm={() => deleteAddressById()}
      />
    </View>
  );
};

export default AddressScreen;
