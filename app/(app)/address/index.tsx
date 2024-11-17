import { View } from "react-native-ui-lib";
import i18n from "@/languages/i18n";
import { router } from "expo-router";
import { ScrollView } from "react-native";
import { useState, useEffect } from "react";
import AppButton from "@/components/buttons/AppButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { fetchAddresses } from "@/redux/features";
import AppBar from "@/components/app-bar/AppBar";
import AddressSkeletonView from "@/components/address/AddressSkeletonView";
import type { Address, UserProfile } from "@/types/address.type";
import AddressItem from "@/components/address/AddressItem";
import AppDialog from "@/components/dialog/AppDialog";

const AddressScreen = () => {
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogTitle, setDialogTitle] = useState<string>("");
  const [diaglogDescription, setDialogDescription] = useState<string>("");
  const [dialogConfirmButton, setDialogConfirmButton] = useState<boolean>(false);
  const [dialogOnPress, setDialogOnPress] = useState<() => void>(() => { });
  const [errorDescription, setErrorDescription] = useState<string>();
  const [errorDialogVisible, setErrorDialogVisible] = useState(false);
  const [setErrorDialogOnPress, setSetErrorDialogOnPress] = useState<() => void>(() => { });
  const [UpdateItem, setUpdateItem] = useState<Address>();
  const dispatch = useDispatch();
  const { addresses, loading, error } = useSelector(
    (state: RootState) => state.address
  );
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  

  const loadData = async () => {
    try {
      const userProfileStr = await AsyncStorage.getItem("userProfile");
      if (userProfileStr) {
        setUserProfile(JSON.parse(userProfileStr));
      }

      await dispatch(fetchAddresses()).unwrap();
    } catch (error: any) {
      setErrorDescription(error.message || "Không thể cập nhật địa chỉ");
      setErrorDialogVisible(true);
      setSetErrorDialogOnPress(() => {
        router.back();
      });
    }
  };

  useEffect(() => {
    loadData();
  }, [dispatch]);

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
                setDialogTitle={setDialogTitle}
                setDialogDescription={setDialogDescription}
                setDialogOnPress={setDialogOnPress}
                setDialogConfirmButton={setDialogConfirmButton}
                setErrorDialogVisible={setErrorDialogVisible}
                setErrorDescription={setErrorDescription}
                setErrorDialogOnPress={setErrorDialogOnPress}
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
        onClose={setErrorDialogOnPress}
      />

      <AppDialog
        visible={dialogVisible}
        title={dialogTitle}
        description={diaglogDescription}
        confirmButton={dialogConfirmButton}
        closeButtonLabel={i18n.t("common.cancel")}
        confirmButtonLabel={"Đồng ý"}
        severity="info"
        onClose={() => setDialogVisible(false)}
        onConfirm={dialogOnPress}
      />
    </View>
  );
};

export default AddressScreen;