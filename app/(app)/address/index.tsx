import { View, Text } from "react-native-ui-lib";
import i18n from "@/languages/i18n";
import { router, useNavigation } from "expo-router";
import { Alert, Dimensions, ScrollView } from "react-native";
import { useState, useEffect } from "react";
import AppButton from "@/components/buttons/AppButton";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { fetchAddresses, updateAddress } from "@/redux/features";
import AppBar from "@/components/app-bar/AppBar";
import AddressSkeletonView from "@/components/address/AddressSkeletonView";
import type { Address, UserProfile } from "@/types/address.type";
import AddressItem from "@/components/address/AddressItem";
import AppDialog from "@/components/dialog/AppDialog";
import { set } from "lodash";

const AddressScreen = () => {
  const [dialogVisible, setDialogVisible] = useState(false);
  const [UpdateItem, setUpdateItem] = useState<Address>();
  const dispatch = useDispatch();
  const { addresses, loading, error } = useSelector(
    (state: RootState) => state.address
  );
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [errorDescription, setErrorDescription] = useState<string>();
  const [errorDialogVisible, setErrorDialogVisible] = useState(false);

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

  useEffect(() => {
    loadData();
  }, [dispatch]);

  // useEffect(() => {
  //   const unsubscribe = navigation.addListener("focus", () => {
  //     loadData();
  //   });

  //   return unsubscribe;
  // }, [navigation, dispatch]);

  const handleSelectAddress = async (item: Address) => {
    try {
      const updateData = {
        "province": item.province,
        "district": item.district,
        "ward": item.ward,
        "address": item.address,
        "address_type": item.address_type,
        "is_default": true,
      };

      await dispatch(
        updateAddress({
          id: item.id,
          data: updateData,
        })
      ).unwrap();
      setDialogVisible(false);
      await dispatch(fetchAddresses()).unwrap();

    } catch (error: any) {
      setErrorDescription(error.message || "Không thể cập nhật địa chỉ");
      setErrorDialogVisible(true);
    }
  };

  return (
    <View flex bg-white>
      <AppBar back title={i18n.t("address.address")} />
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
                setDialogVisible={setDialogVisible}
                setUpdateItem={setUpdateItem}
              />
            ))}
          </ScrollView>
        )}
      </View>

      <View padding-16>
        <AppButton
          type="primary"
          title={i18n.t("address.add_new_address")}
          onPress={() => router.push("/(app)/address/add")}
        />
      </View>

      <AppDialog
        visible={errorDialogVisible}
        title={"Có lỗi xảy ra"}
        description={errorDescription || ""}
        closeButtonLabel={i18n.t("common.cancel")}
        confirmButtonLabel={"Cập nhật"}
        severity="info"
        onClose={() => setErrorDialogVisible(false)}
      />

      <AppDialog
        visible={dialogVisible}
        title={"Đặt địa chỉ mặc định"}
        description={"Bạn có chắc chắn muốn đặt địa chỉ này là mặc định không?"}
        closeButtonLabel={i18n.t("common.cancel")}
        confirmButtonLabel={"Cập nhật"}
        severity="info"
        onClose={() => setDialogVisible(false)}
        onConfirm={() => handleSelectAddress(UpdateItem as Address)}
      />
    </View>
  );
};

export default AddressScreen;