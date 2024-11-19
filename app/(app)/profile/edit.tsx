import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Picker,
} from "react-native-ui-lib";
import { Alert } from "react-native";
import { useNavigation } from "expo-router";
import i18n from "@/languages/i18n";
import AppDialog from "@/components/dialog/AppDialog";
import BackButton from "@/assets/icons/back.svg";
import { TextInput } from "react-native";
import * as ImagePicker from "expo-image-picker";
import NameIcon from "@/assets/icons/user.svg";
import PhoneIcon from "@/assets/icons/phone.svg";
import EmailIcon from "@/assets/icons/sms.svg";
import AddressIcon from "@/assets/icons/location.svg";
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
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
import { validateImage } from "@/utils/helpers/imageHelper";
import { processImageForUpload } from "@/utils/helpers/imageHelper";

interface ProfileEditProps {}

const ProfileEdit = (props: ProfileEditProps) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { user, setUser: setAuthUser } = useAuth();

  // Initialize state with user data
  const [name, setName] = React.useState(user?.full_name || "");
  const [phone, setPhone] = React.useState(user?.phone_number || "");
  const [email, setEmail] = React.useState(user?.email || "");
  const [gender, setGender] = React.useState(user?.gender || "");
  const [birthday, setBirthday] = React.useState(
    user?.date_of_birth ? new Date(user.date_of_birth) : new Date()
  );
  const [avatar, setAvatar] = React.useState<{ uri: string }>({
    uri: user?.avatar_url || "",
  });
  const [isDatePickerVisible, setDatePickerVisible] = React.useState(false);
  const [isDialogVisible, setDialogVisible] = React.useState(false);

  React.useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await dispatch(getUserThunk()).unwrap();
        setName(user.full_name);
        setPhone(user.phone_number);
        setEmail(user.email);
        setGender(user.gender);
        setBirthday(new Date(user.date_of_birth));
        setAvatar({ uri: user.avatar_url });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, [dispatch]);

  const handleSaveChanges = async () => {
    try {
      //validate email format
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
      if (!emailRegex.test(email)) {
        console.log("Invalid email format");
        return;
      }
      //validate phone number format
      const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
      if (!phoneRegex.test(phone)) {
        console.log("Invalid phone number format");
        return;
      }
      // Update user info
      await dispatch(
        updateUserThunk({
          full_name: name,
          phone_number: phone,
          email,
          gender,
          date_of_birth: birthday.toISOString().split("T")[0], // dòng này là để format ngày sinh thành YYYY-MM-DD
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

      //hiển thị thông khi update thành công
      console.log("Update profile successfully");
      setDialogVisible(true);
    } catch (error) {
      console.error("Failed to update profile:", error);
      // Handle error (show error message)
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
        const processedUri = await processImageForUpload(result.assets[0].uri);

        const formData = new FormData();
        formData.append('avatar', {
          uri: processedUri,
          type: 'image/jpeg',
          name: 'avatar.jpg',
        } as any);

        const uploadedUser = await dispatch(uploadAvatarUrlThunk(formData)).unwrap();
        const updatedUser = await dispatch(getUserThunk()).unwrap();

        // Cập nhật state local
        setAvatar({ uri: updatedUser.avatar_url + '?' + new Date().getTime() });

        // Cập nhật user trong auth context
        if (setAuthUser) {
          setAuthUser({
            ...updatedUser,
            avatar_url: updatedUser.avatar_url + '?' + new Date().getTime()
          });
        }

        Alert.alert("Thành công", "Cập nhật ảnh đại diện thành công");
      }
    } catch (error: any) {
      console.error("Failed to upload avatar:", error);
      Alert.alert("Lỗi", error.message || "Không thể tải lên ảnh đại diện");
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

  return (
    <View flex bg-white paddingH-24>
      <View row centerV>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
            console.log("Back");
          }}
        >
          <Image width={30} height={30} source={BackButton} />
        </TouchableOpacity>
        <View flex center>
          <Text
            text60BO
            marginR-30
            style={{ color: "#717658", letterSpacing: 0.75 }}
          >
            {i18n.t("profile.edit_profile")}
          </Text>
        </View>
      </View>
      <View center marginT-30 gap-7>
        <Image
          width={76}
          height={76}
          borderRadius={50}
          style={{ borderColor: "#D5D6CD", borderWidth: 2 }}
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
            placeholder: "Họ và tên",
            value: name,
            icon: NameIcon,
            onChangeText: setName,
          },
          {
            placeholder: "Số điện thoại",
            value: phone,
            icon: PhoneIcon,
            onChangeText: setPhone,
          },
          {
            placeholder: "Email",
            value: email,
            icon: EmailIcon,
            onChangeText: setEmail,
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
                }}
                placeholder={item.placeholder}
                value={item.value}
                onChangeText={item.onChangeText}
              />
            </View>
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
                <Picker.Item label="Nam" value="male" />
                <Picker.Item label="Nữ" value="female" />
                <Picker.Item label="Khác" value="other" />
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
              />
            )}
          </View>
        </View>
      </View>
      <View centerH marginT-30>
        <TouchableOpacity
          center
          style={{
            width: "80%",
            height: 50,
            backgroundColor: "#717658",
            padding: 10,
            borderRadius: 15,
            elevation: 5,
            marginTop: 20,
          }}
          onPress={handleSaveChanges}
        >
          <Text center white text70BO>
            {i18n.t("profile.change_info")}
          </Text>
        </TouchableOpacity>
      </View>
      <AppDialog
        visible={isDialogVisible}
        onClose={() => setDialogVisible(false)}
        confirmButton
        confirmButtonLabel="OK"
        severity="success"
        title="Cập nhật thông tin thành công"
        description="Thông tin của bạn đã được cập nhật thành công"
        onConfirm={() => {
          setDialogVisible(false);
          navigation.goBack();
        }}
      />
    </View>
  );
};

export default ProfileEdit;
