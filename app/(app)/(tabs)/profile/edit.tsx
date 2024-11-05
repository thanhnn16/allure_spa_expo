import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Picker,
} from "react-native-ui-lib";
import { useNavigation } from "expo-router";
import i18n from "@/languages/i18n";
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
import { updateAvatarUrlThunk } from "@/redux/features/users/updateAvatarUrlThunk";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
interface ProfileEditProps {}

const ProfileEdit = (props: ProfileEditProps) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { user } = useAuth();

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

  const handleSaveChanges = async () => {
    try {
      // Update user info
      await dispatch(
        updateUserThunk({
          full_name: name,
          phone_number: phone,
          email,
          gender,
          date_of_birth: birthday,
        })
      ).unwrap();

      // If avatar was changed, update it separately
      if (avatar.uri !== user?.avatar_url) {
        const formData = new FormData();
        const response = await fetch(avatar.uri);
        const blob = await response.blob();
        formData.append("avatar", blob, "avatar.jpg");
        await dispatch(updateAvatarUrlThunk(formData)).unwrap();
      }

      navigation.goBack();
    } catch (error) {
      console.error("Failed to update profile:", error);
      // Handle error (show error message)
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });
    if (!result.canceled) {
      setAvatar({ uri: result.assets[0].uri });
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
    <View flex marginH-20 marginT-20>
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
              : require("@/assets/images/avt.png")
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
          <View row centerV gap-10>
            <Image width={24} height={24} source={GenderIcon} />
            <Picker
              value={gender}
              onChange={(value: any) => setGender(value)}
              style={{
                borderBottomWidth: 0.5,
                flex: 1,
                height: 40,
                borderColor: "#D5D6CD",
              }}
            >
              <Picker.Item label="Nam" value="Nam" />
              <Picker.Item label="Nữ" value="Nữ" />
              <Picker.Item label="Khác" value="Khác" />
            </Picker>
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
    </View>
  );
};

export default ProfileEdit;
