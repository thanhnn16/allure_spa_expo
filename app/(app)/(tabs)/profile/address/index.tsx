// app/(app)/(tabs)/profile/address/index.tsx
import { Image, Text, TouchableOpacity, View } from "react-native-ui-lib";
import i18n from "@/languages/i18n";
import { useNavigation } from "expo-router";
import BackButton from "@/assets/icons/back.svg";
import { SafeAreaView, ScrollView } from "react-native";
import React, { useState, useEffect } from "react";
import AppButton from "@/components/buttons/AppButton";
import { Link, useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import AxiosInstance from "@/utils/services/helper/AxiosInstance";

interface UserProfile {
    full_name: string;
    phone_number: string;
}

interface Address {
    id?: string;
    province: string;
    district: string;
    address: string;
    address_type: 'home' | 'company' | 'other';
    is_default: boolean;
    is_temporary: boolean;
}

interface TransformedAddress {
    type: string;
    address: string;
    name: string;
    phone: string;
    is_default: boolean;
}

const getUserProfile = async (token: string) => {
    return AxiosInstance().get('/user/info', {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
        }
    });
};

const getAddresses = async (token: string, userId: number) => {
    return AxiosInstance().post(`/user/addresses`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
        }
    });
};

// Transform address for display
const transformAddress = (address: Address, userProfile: UserProfile | null) => ({
    type: address.address_type === 'home' ? 'house' : address.address_type,
    address: `${address.address}, ${address.district}, ${address.province}`,
    name: userProfile?.full_name || '',
    phone: userProfile?.phone_number || '',
    is_default: address.is_default
});

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
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [addresses, setAddresses] = useState<TransformedAddress[]>([]);
    const [userId, setUserId] = useState<number | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const token = await AsyncStorage.getItem('userToken');
                if (!token) return;

                // First get user profile
                const profileResponse = await getUserProfile(token);
                if (profileResponse.data?.data) {
                    const profile = profileResponse.data.data;
                    setUserProfile({
                        full_name: profile.full_name,
                        phone_number: profile.phone_number
                    });
                    setUserId(parseInt(profile.id)); // Store user ID
                }
            } catch (error) {
                console.error('Error loading profile:', error);
            }
        };

        loadData();
    }, []);

    // Separate useEffect for loading addresses after we have userId
    useEffect(() => {
        const loadAddresses = async () => {
            try {
                const token = await AsyncStorage.getItem('userToken');
                if (!token || !userId) return;

                const addressResponse = await getAddresses(token, userId);
                if (addressResponse.data?.data) {
                    const transformedAddresses = addressResponse.data.data.map(
                        (address: Address) => transformAddress(address, userProfile)
                    );
                    setAddresses(transformedAddresses);
                }
            } catch (error) {
                console.error('Error loading addresses:', error);
            }
        };

        if (userId && userProfile) {
            loadAddresses();
        }
    }, [userId, userProfile]);

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

                {userProfile && (
                    <View style={{ marginBottom: 20, backgroundColor: "#fff", borderRadius: 10, padding: 15 }}>
                        <Text style={labelStyle}>{i18n.t("profile.personal_info")}</Text>
                        <View marginT-10>
                            <View row marginT-5>
                                <Text style={[labelStyle, { width: 100 }]}>{i18n.t("profile.name")}: </Text>
                                <Text style={textStyle} flex>{userProfile.full_name}</Text>
                            </View>
                            <View row marginT-5>
                                <Text style={[labelStyle, { width: 100 }]}>{i18n.t("profile.phone")}: </ Text>
                                <Text style={textStyle} flex>{userProfile.phone_number}</Text>
                            </View>
                        </View>
                    </View>
                )}

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
                    {addresses.map((item, index) => (
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
    fontWeight: "700" as const,
    color: "#010F07",
    fontSize: 14,
};

const textStyle = {
    fontSize: 14,
    color: "rgba(1, 15, 7, 0.52)",
};
