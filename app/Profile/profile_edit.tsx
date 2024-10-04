import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native-ui-lib";
import { useNavigation } from "expo-router";
import BackButton from "@/assets/icons/back.svg";
import { TextInput } from "react-native";
import NameIcon from "@/assets/icons/user.svg";
import PhoneIcon from "@/assets/icons/phone.svg";
import EmailIcon from "@/assets/icons/sms.svg";
import AddressIcon from "@/assets/icons/location.svg";
import GenderIcon from "@/assets/icons/gender.svg";
import BirthdayIcon from "@/assets/icons/birthday.svg";
// import RNPickerSelect from "react-native-picker-select";
import DropDowPicker from "react-native-dropdown-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
interface ProfileEditProps {}

const ProfileEdit = (props: ProfileEditProps) => {
  const navigation = useNavigation();
  const [name, setName] = React.useState("Nguyễn Văn Tèo");
  const [phone, setPhone] = React.useState("0346 542 636");
  const [email, setEmail] = React.useState("example@gmail.com");
  const [address, setAddress] = React.useState("Hà Nội");
  const [gender, setGender] = React.useState("Nam");
  const [birthday, setBirthday] = React.useState("01/01/2000");
  const [isDatePickerVisible, setDatePickerVisible] = React.useState(false);

  const showDatePicker = () => {
    setDatePickerVisible(true);
  };
  const hideDatePicker = () => {
    setDatePickerVisible(false);
  };
  const handleConfirm = (event: any, sekectedDate?: Date) => {
    hideDatePicker();
    if (sekectedDate) {
      setBirthday(
        `${sekectedDate.getDate()}/${
          sekectedDate.getMonth() + 1
        }/${sekectedDate.getFullYear()}`
      );
    }
  }
  const [items, setItems] = React.useState([
    { label: "Nam", value: "Nam" },
    { label: "Nữ", value: "Nữ" },
    { label: "Khác", value: "Khác" },
  ]);
  const [open, setOpen] = React.useState(false);
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
            Chỉnh Sửa Hồ Sơ
          </Text>
        </View>
      </View>
      <View center marginT-30 gap-7>
        <Image
          width={76}
          height={76}
          borderRadius={50}
          style={{ borderColor: "#D5D6CD", borderWidth: 2 }}
          source={require("@/assets/images/avt.png")}
        />
        <TouchableOpacity
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
          {
            placeholder: "Địa chỉ",
            value: address,
            icon: AddressIcon,
            onChangeText: setAddress,
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
            <DropDowPicker
              open={open}
              value={gender}
              items={items}
              setOpen={setOpen}
              setValue={setGender}
              setItems={setItems}
              placeholder="Chọn giới tính"
              style={{
                borderBottomWidth: 0.5,
                borderWidth: 0, 
                flex: 1,
                width: "92%",
                borderColor: "#D5D6CD",
                borderRadius: 10,
                marginLeft: 0,
              }}
              dropDownContainerStyle={{ backgroundColor: "#D5D6CD" }}
              >

              </DropDowPicker>
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
              <Text>{birthday}</Text>
            </TouchableOpacity>
            {isDatePickerVisible && (
              <DateTimePicker
                value={new Date()}
                mode="date"
                is24Hour={true}
                onChange={handleConfirm}
                
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
        >
          <Text center white text70BO>
            Lưu thông tin
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProfileEdit;
