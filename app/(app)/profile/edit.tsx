import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Picker,
  Typography,
} from "react-native-ui-lib";
import { router } from "expo-router";
import { useLanguage } from "@/hooks/useLanguage";

import AppDialog from "@/components/dialog/AppDialog";
import { TextInput } from "react-native";
import * as ImagePicker from "expo-image-picker";
import NameIcon from "@/assets/icons/user.svg";
import PhoneIcon from "@/assets/icons/phone.svg";
import EmailIcon from "@/assets/icons/sms.svg";
import GenderIcon from "@/assets/icons/gender.svg";
import BirthdayIcon from "@/assets/icons/birthday.svg";
import { useAuth } from "@/hooks/useAuth";
import { useDispatch } from "react-redux";
import { updateUserThunk } from "@/redux/features/users/updateUserThunk";
import { uploadAvatarUrlThunk } from "@/redux/features/users/uploadAvatarUrlThunk";
import { getUserThunk } from "@/redux/features/users/getUserThunk";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { processImageForUpload } from "@/utils/helpers/imageHelper";
import AppBar from "@/components/app-bar/AppBar";
import { set } from "lodash";
import AppButton from "@/components/buttons/AppButton";
import { Ionicons } from '@expo/vector-icons';

interface ProfileEditProps {}

const ProfileEdit = (props: ProfileEditProps) => {
  const { t } = useLanguage();

  const dispatch = useDispatch();
  const { user, setUser: setAuthUser } = useAuth();

  // Initialize state with user data
  const [name, setName] = useState(user?.full_name || "");
  const [phone, setPhone] = useState(user?.phone_number || "");
  const [email, setEmail] = useState(user?.email || "");
  const [gender, setGender] = useState(user?.gender || "");
  const [birthday, setBirthday] = useState(
    user?.date_of_birth ? new Date(user.date_of_birth) : new Date()
  );
  const [avatar, setAvatar] = useState<{ uri: string }>({
    uri: user?.avatar_url || "",
  });
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [isDialogVisible, setDialogVisible] = useState(false);

  const [errorDialog, setErrorDialog] = useState(false);
  const [uploadAvatarLoading, setUploadAvatarLoading] = useState(false);
  const [uploadAvatarSuccess, setUploadAvatarSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Thêm state để kiểm tra trạng thái xác thực
  const isPhoneVerified = !!user?.phone_verified_at;
  const isEmailVerified = !!user?.email_verified_at;

  React.useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const user = await dispatch(getUserThunk()).unwrap();
        setName(user.full_name);
        setPhone(user.phone_number);
        setEmail(user.email);
        setGender(user.gender);
        setBirthday(new Date(user.date_of_birth));
        setAvatar({ uri: user.avatar_url });
        setLoading(false);
      } catch (error: any) {
        setLoading(false);
        setError(error);
      }
    };
    fetchUserData();
  }, [dispatch]);

  const handleSaveChanges = async () => {
    try {
      // Chỉ validate email nếu chưa xác thực và có thay đổi
      if (!isEmailVerified && email !== user?.email) {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!emailRegex.test(email)) {
          setError("Invalid email format");
          return;
        }
      }

      // Chỉ validate số điện thoại nếu chưa xác thực và có thay đổi
      if (!isPhoneVerified && phone !== user?.phone_number) {
        const phoneRegex = /(0[3|5|7|8|9])+([0-9]{8})\b/;
        if (!phoneRegex.test(phone)) {
          setError("Invalid phone number format");
          return;
        }
      }

      // Update user info
      setLoading(true);
      await dispatch(
        updateUserThunk({
          full_name: name,
          phone_number: phone,
          email,
          gender,
          date_of_birth: birthday.toISOString().split("T")[0],
        })
      ).unwrap();

      //fetch user info after update
      const updatedUser = await dispatch(getUserThunk()).unwrap();
      setName(updatedUser.full_name);
      setPhone(updatedUser.phone_number);
      setEmail(updatedUser.email);
      setGender(updatedUser.gender);
      setBirthday(new Date(updatedUser.date_of_birth));
      setAvatar({ uri: updatedUser.avatar_url });
      setLoading(false);
      setDialogVisible(true);
    } catch (error: any) {
      setLoading(false);
      setError(error);
    }
  };

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5,
      });

      if (!result.canceled && result.assets[0]) {
        setUploadAvatarLoading(true);
        try {
          const processedUri = await processImageForUpload(
            result.assets[0].uri
          );

          const formData = new FormData();
          formData.append("avatar", {
            uri: processedUri,
            name: "avatar.jpg",
            type: "image/jpeg",
          } as any);

          // Upload avatar
          await dispatch(uploadAvatarUrlThunk(formData)).unwrap();

          // Fetch updated user data
          const updatedUser = await dispatch(getUserThunk()).unwrap();
          setAvatar({ uri: updatedUser.avatar_url });

          setUploadAvatarLoading(false);
          setUploadAvatarSuccess(true);
        } catch (error: any) {
          setUploadAvatarLoading(false);
          setError(error);
        }
      }
    } catch (error: any) {
      setUploadAvatarLoading(false);
      setError(error);
    }
  };

  const showDatePicker = () => {
    setDatePickerVisible(true);
  };

  const handleDateChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date
  ) => {
    setDatePickerVisible(false);
    if (selectedDate && event.type === "set") {
      setBirthday(selectedDate);
    }
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0]; // Returns YYYY-MM-DD format
  };

  // Thêm hàm tính ngày tối đa cho phép (16 năm trước)
  const getMaxDate = () => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 16);
    return date;
  };

  return (
    <View flex bg-white>
      <AppBar back title={t("profile.edit_profile")} />
      <View paddingH-24>
        <View center marginT-30 gap-7>
          <Image
            width={128}
            height={128}
            borderRadius={128}
            style={{ borderColor: "#D5D6CD", borderWidth: 1 }}
            center
            errorSource={require("@/assets/images/logo/logo.png")}
            source={
              avatar.uri
                ? { uri: avatar.uri }
                : require("@/assets/images/logo/logo.png")
            }
          />
          <TouchableOpacity
            onPress={pickImage}
            style={{
              position: "absolute",
              right: 120,
              bottom: 0,
              backgroundColor: "#FFFFFF",
              borderRadius: 10,
              padding: 5,
              elevation: 5,
            }}
          >
            <Image
              width={16}
              height={16}
              source={require("@/assets/images/edit.png")}
            />
          </TouchableOpacity>
        </View>
        <View marginT-20>
          {[
            {
              placeholder: t("auth.register.fullname"),
              value: name,
              icon: NameIcon,
              onChangeText: setName,
              editable: true, // Tên luôn có thể sửa
            },
            {
              placeholder: t("auth.register.phone_number"),
              value: phone,
              icon: PhoneIcon,
              onChangeText: setPhone,
              editable: !isPhoneVerified, // Chỉ có thể sửa nếu chưa xác thực
            },
            {
              placeholder: t("auth.register.email"),
              value: email,
              icon: EmailIcon,
              onChangeText: setEmail,
              editable: !isEmailVerified, // Chỉ có thể sửa nếu chưa xác thực
            },
          ].map((item, index) => (
            <View key={index} marginT-20>
              <View row centerV gap-10>
                <Image width={24} height={24} source={item.icon} />
                <TextInput
                  style={{
                    marginLeft: 10,
                    borderBottomWidth: 0.5,
                    flex: 1,
                    height: 40,

                    borderColor: "#D5D6CD",
                    color: item.editable ? '#000000' : '#999999', // Text màu xám nếu không thể sửa
                  }}
                  placeholder={item.placeholder}
                  value={item.value}
                  onChangeText={item.onChangeText}
                  editable={item.editable}
                />
                {/* Hiển thị icon xác thực nếu đã verify */}
                {((item.icon === PhoneIcon && isPhoneVerified) || 
                  (item.icon === EmailIcon && isEmailVerified)) && (
                  <View marginL-5>
                    <Ionicons 
                      name="checkmark-circle" 
                      size={16} 
                      color="#4CAF50"
                    />
                  </View>
                )}
              </View>
              {/* Hiển thị thông báo nếu đã xác thực */}
              {((item.icon === PhoneIcon && isPhoneVerified) || 
                (item.icon === EmailIcon && isEmailVerified)) && (
                <Text marginT-5 style={{color: '#999999', fontSize: 12}}>
                  {t("profile.verified_field")}
                </Text>
              )}
            </View>
          ))}
          <View marginT-20>
            <View row centerV gap-20>
              <Image width={24} height={24} source={GenderIcon} />
              <View style={{ flex: 1 }}>
                <Picker
                  value={gender}
                  onChange={(value: any) => setGender(value)}
                  style={{
                    borderBottomWidth: 0.5,
                    width: "100%",
                    height: 40,
                    borderColor: "#D5D6CD",
                    // backgroundColor: "red",
                  }}
                >
                  <Picker.Item
                    label={t("auth.edit_profile.male")}
                    value="male"
                  />
                  <Picker.Item
                    label={t("auth.edit_profile.femail")}
                    value="female"
                  />
                  <Picker.Item
                    label={t("auth.edit_profile.other")}
                    value="other"
                  />
                </Picker>
              </View>
            </View>
          </View>
          <View marginT-20>
            <View row centerV gap-10>
              <Image width={24} height={24} source={BirthdayIcon} />
              <TouchableOpacity
                centerV
                onPress={showDatePicker}
                style={{
                  borderBottomWidth: 0.5,
                  flex: 1,
                  height: 40,
                  borderColor: "#D5D6CD",
                  marginLeft: 10,
                }}
              >
                <Text>{formatDate(birthday)}</Text>
              </TouchableOpacity>
              {isDatePickerVisible && (
                <DateTimePicker
                  value={birthday}
                  mode="date"
                  is24Hour={true}
                  onChange={handleDateChange}
                  maximumDate={getMaxDate()}
                />
              )}
            </View>
          </View>
        </View>
        <View centerH marginT-30>
          <AppButton
            title={t("profile.change_info")}
            type="primary"
            onPress={handleSaveChanges}
            disabled={name === "" || phone === "" || email === "" || loading}
          />
        </View>
        <AppDialog
          visible={isDialogVisible}
          onClose={() => setDialogVisible(false)}
          closeButton={false}
          confirmButtonLabel={t("auth.edit_profile.agree")}
          severity="success"
          title={t("auth.edit_profile.success")}
          description={t("auth.edit_profile.success_description")}
          onConfirm={() => {
            setDialogVisible(false);
            router.back();
          }}
        />
        <AppDialog
          visible={!!error}
          onConfirm={() => setError(null)}
          confirmButtonLabel={t("auth.edit_profile.agree")}
          closeButton={false}
          severity="error"
          title={t("auth.edit_profile.error")}
          description={error || t("auth.edit_profile.error_description")}
        />
        <AppDialog
          visible={uploadAvatarLoading}
          severity="info"
          title={t("auth.edit_profile.is_upload_avatar")}
          closeButton={false}
          confirmButton={false}
        />
        <AppDialog
          visible={loading}
          severity="info"
          title={t("auth.edit_profile.is_upload_profile")}
          description={t("auth.edit_profile.is_upload_profile_description")}
          closeButton={false}
          confirmButton={false}
        />
        <AppDialog
          visible={uploadAvatarSuccess}
          severity="success"
          title={t("auth.edit_profile.upload_avatar_success")}
          description={t("auth.edit_profile.upload_avatar_description")}
          closeButton={false}
          confirmButtonLabel="Đóng"
          onConfirm={() => {
            setUploadAvatarSuccess(false);
          }}
        />
      </View>
    </View>
  );
};

export default ProfileEdit;
