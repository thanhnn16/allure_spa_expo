// app/(app)/(tabs)/profile/address/index.tsx
import { Image, Text, TouchableOpacity, View } from "react-native-ui-lib";
import i18n from "@/languages/i18n";
import { useNavigation } from "expo-router";
import BackButton from "@/assets/icons/back.svg";
import { SafeAreaView, ScrollView } from "react-native";
import React from "react";
import AppButton from "@/components/buttons/AppButton";
import { Link, useRouter } from "expo-router";

// @ts-ignore
const AddressItem = ({ item }) => (
    <TouchableOpacity>
        <View row padding-10 gap-20 center style={{ position: "relative" }}>
            <Image
                source={
                    item.type === "house"
                        ? require("@/assets/icons/house.svg")
                        : item.type === "company"
                            ? require("@/assets/icons/company.svg")
                            : require("@/assets/icons/other.svg")
                }
                width={20}
                height={20}
            />
            <View flex gap-5>
                <Text text70BL>
                    {item.type === "house"
                        ? i18n.t("address.home")
                        : item.type === "company"
                            ? i18n.t("address.company")
                            : i18n.t("address.other")}
                </Text>
                <View flex gap-5>
                    <View row marginT-10>
                        <Text style={[labelStyle, { width: 100 }]}>{i18n.t("address.address")}: </Text>
                        <Text style={textStyle} flex>{item.address}</Text>
                    </View>
                    <View row marginT-5>
                        <Text style={[labelStyle, { width: 100 }]}>{i18n.t("address.name")}: </Text>
                        <Text style={textStyle} flex>{item.name}</Text>
                    </View>
                    <View row marginT-5>
                        <Text style={[labelStyle, { width: 100 }]}>{i18n.t("address.phone")}: </Text>
                        <Text style={textStyle} flex>{item.phone}</Text>
                    </View>
                </View>
            </View>
            <TouchableOpacity
                style={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                }}
            >
                <Text>⚒️</Text>
            </TouchableOpacity>
        </View>
    </TouchableOpacity>
);

const Address = () => {
    const navigation = useNavigation();
    const router = useRouter();

    const addressItems = [
        {
            type: "house",
            address: "340 Nguyễn Văn Lượng, Phường 10, Gò Vấp, Hồ Chí Minh, Việt Nam",
            name: "tèo",
            phone: "0943652872",
        },
        {
            type: "company",
            address: "123 Lê Lợi, Quận 1, Hồ Chí Minh, Việt Nam",
            name: "tí",
            phone: "0987654321",
        },
        {
            type: "other",
            address: "456 Trần Hưng Đạo, Quận 5, Hồ Chí Minh, Việt Nam",
            name: "tũn",
            phone: "0912345678",
        },
        {
            type: "house",
            address: "340 Nguyễn Văn Lượng, Phường 10, Gò Vấp, Hồ Chí Minh, Việt Nam",
            name: "tèo",
            phone: "0943652872",
        },
        {
            type: "company",
            address: "340 Nguyễn Văn Lượng, Phường 10, Gò Vấp, Hồ Chí Minh, Việt Nam",
            name: "tèo",
            phone: "0943652872",
        },
    ];

    return (
        <SafeAreaView style={{ flex: 1 }}>
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
                    <Text text60 bold marginR-30 style={{ color: "#717658" }}>
                        {i18n.t("address.title")}
                    </Text>
                </View>
            </View>

            <ScrollView
                contentContainerStyle={{
                    paddingBottom: 5,
                    backgroundColor: "#fff",
                    paddingVertical: 2,
                    paddingHorizontal: 3,
                    elevation: 5,
                    borderRadius: 10,
                }}
                showsVerticalScrollIndicator={false}
            >
                {addressItems.map((item, index) => (
                    <React.Fragment key={index}>
                        <View style={{ marginBottom: 10, backgroundColor: "#fff", borderRadius: 10, padding: 10, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5 }}>
                            <AddressItem item={item} />
                        </View>
                    </React.Fragment>
                ))}
            </ScrollView>
            <View style={{ position: "absolute", bottom: 0, width: "100%" }}>
                <AppButton 
                    type="primary"
                    onPress={() => router.push("/profile/address/add")}
                >
                    <Text style={{ color: "#fff" }}>
                        {i18n.t("address.add_new_address")}
                    </Text>
                </AppButton>
            </View>
        </View>
        </SafeAreaView>
    );
};

export default Address;

const labelStyle = {
    fontWeight: "bold",
    color: "#010F07",
    fontSize: 14,
};

const textStyle = {
    fontSize: 14,
    color: "rgba(1, 15, 7, 0.52)",
};
