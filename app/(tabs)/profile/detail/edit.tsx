import React, {useState} from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    Picker,
    DateTimePicker, DateTimePickerMode,
} from "react-native-ui-lib";
import {router, useNavigation} from "expo-router";
import BackButton from "@/assets/icons/back.svg";
import {TextInput} from "react-native";
import * as ImagePicker from "expo-image-picker";
import NameIcon from "@/assets/icons/user.svg";
import PhoneIcon from "@/assets/icons/phone.svg";
import EmailIcon from "@/assets/icons/sms.svg";
import AddressIcon from "@/assets/icons/location.svg";
import GenderIcon from "@/assets/icons/gender.svg";
import BirthdayIcon from "@/assets/icons/birthday.svg";

interface ProfileEditProps {
}

const ProfileEdit = (props: ProfileEditProps) => {
    const [name, setName] = React.useState("Nguyễn Văn Tèo");
    const [phone, setPhone] = React.useState("0346 542 636");
    const [email, setEmail] = React.useState("example@gmail.com");
    const [address, setAddress] = React.useState("Hà Nội");
    const [gender, setGender] = React.useState("Nam");
    const [birthday, setBirthday] = React.useState("01/01/2000");
    const [isDatePickerVisible, setDatePickerVisible] = React.useState(false);
    const [avatar, setAvatar] = React.useState<{ uri: string }>({
        uri: "@/assets/images/avt.png",
    });

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
                `${sekectedDate.getDate()}/${sekectedDate.getMonth() + 1
                }/${sekectedDate.getFullYear()}`
            );
        }
    };

    const [open, setOpen] = React.useState(false);
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.5,
        });
        if (!result.canceled) {
            setAvatar({uri: result.assets[0].uri});
        }
    };
    return (
        <View flex marginH-20 marginT-40 useSafeArea>
            <View row centerV>
                <TouchableOpacity
                    onPress={() => {
                        router.back();
                    }}
                >
                    <Image width={30} height={30} source={BackButton}/>
                </TouchableOpacity>
                <View flex center>
                    <Text
                        text60BO
                        marginR-30
                        style={{color: "#717658", letterSpacing: 0.75}}
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
                    style={{borderColor: "#D5D6CD", borderWidth: 2}}
                    source={avatar}
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
                    {
                        placeholder: "Địa chỉ",
                        value: address,
                        icon: AddressIcon,
                        onChangeText: setAddress,
                    },
                ].map((item, index) => (
                    <View key={index} marginT-20>
                        <View row centerV gap-10>
                            <Image width={24} height={24} source={item.icon}/>
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
                        <Image width={24} height={24} source={GenderIcon}/>
                        <Picker value={gender} onChange={(itemValue) => setGender(itemValue as string)}>
                            <Picker.Item label="Nam" value="Nam"/>
                            <Picker.Item label="Nữ" value="Nữ"/>
                            <Picker.Item label="Khác" value="Khác"/>
                        </Picker>
                    </View>
                </View>
                <View marginT-20>
                    <View row centerV gap-10>
                        <Image width={24} height={24} source={BirthdayIcon}/>
                            <DateTimePicker
                                value={new Date()}
                                mode="date"
                                onChange={handleConfirm}
                                display={"inline"}
                            />
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
