import {Image, Text, TouchableOpacity, View} from "react-native-ui-lib";
import i18n from "@/languages/i18n";
import { useNavigation } from "expo-router";
import BackButton from "@/assets/icons/back.svg";
import React, {useState} from "react";
import AppButton from "@/components/buttons/AppButton";
import {SafeAreaView, ScrollView, TextInput} from "react-native";
import axios from 'axios';

export const addAddress = async (data: AddressRequest) => {
  return axios.post('/api/addresses', data);
};

export interface AddressRequest {
  user_id: string;
  province: string; 
  district: string;
  address: string;
  address_type: 'home' | 'company' | 'other';
  is_default: boolean;
  is_temporary: boolean;
}

const Add = () => {
    const navigation = useNavigation();
    const [selectedItem, setSelectedItem] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        province: '',
        district: '', 
        address: '',
        name: '',
        phone: '',
        note: '',
        is_default: false,
        is_temporary: false
    });

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({...prev, [field]: value}));
    };

    const getAddressType = (id: number | null) => {
        switch(id) {
            case 1: return 'home';
            case 2: return 'company';
            case 3: return 'other';
            default: return 'home';
        }
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            const payload: AddressRequest = {
                user_id: '3fa85f64-5717-4562-b3fc-2c963f66afa6', // Should come from auth context
                province: formData.province,
                district: formData.district,
                address: formData.address,
                address_type: getAddressType(selectedItem),
                is_default: formData.is_default,
                is_temporary: formData.is_temporary
            };

            await addAddress(payload);
            navigation.goBack();
        } catch (error) {
            console.error('Failed to add address:', error);
            // Show error toast/alert here
        } finally {
            setLoading(false);
        }
    };

    const items = [
        { id: 1, name: i18n.t("address.home") },
        { id: 2, name: i18n.t("address.company") },
        { id: 3, name: i18n.t("address.other") },
    ];

    const renderItem = (item: { id: number; name: string }, index: number) => {
        const isSelected = item.id === selectedItem;
        return (
            <TouchableOpacity key={item.id} onPress={() => setSelectedItem(item.id)}>
                <View style={[styles.itemContainer, isSelected ? styles.selectedItem : styles.unselectedItem]}>
                    <Text style={[styles.itemText, isSelected ? styles.selectedItemText : styles.unselectedItemText]}>
                        {item.name}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#F4F4F4" }}>
        <View flex marginT-20>
            <View row centerV  bg-white>
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
                        {i18n.t("address.add_new_address")}
                    </Text>
                </View>
            </View>

            <View flex marginT-10>
                <View bg-white>
                    <TextInput
                        value={formData.name}
                        placeholder={i18n.t("address.name")}
                        onChangeText={(value) => handleChange('name', value)}
                        style={{ fontSize: 14, color: "#555555", height: 55, width: "100%", paddingHorizontal: 20 }}
                    />
                </View>
                <View  marginT-2 bg-white>
                    <TextInput
                        value={formData.phone}
                        placeholder={i18n.t("address.phone")}
                        onChangeText={(value) => handleChange('phone', value)}
                        style={{ fontSize: 14, color: "#555555", height: 55, width: "100%", paddingHorizontal: 20 }}
                    />
                </View>
                <View marginT-20 bg-white>
                    <TextInput
                        value={formData.province}
                        placeholder={i18n.t("address.province") || "Province"} // Add fallback text
                        onChangeText={(value) => handleChange('province', value)}
                        style={{ fontSize: 14, color: "#555555", height: 55, width: "100%", paddingHorizontal: 20 }}
                    />
                </View>
                <View  marginT-2 bg-white>
                    <TextInput
                        value={formData.district}
                        placeholder={i18n.t("address.district") || "District"} // Add fallback text
                        onChangeText={(value) => handleChange('district', value)}
                        style={{ fontSize: 14, color: "#555555", height: 55, width: "100%", paddingHorizontal: 20 }}
                    />
                </View>
                <View marginT-2 bg-white>
                    <TextInput
                        value={formData.address}
                        placeholder={i18n.t("address.address")}
                        onChangeText={(value) => handleChange('address', value)}
                        style={{ fontSize: 14, color: "#555555", height: 55, width: "100%", paddingHorizontal: 20 }}
                    />
                </View>

                <View  marginT-2 bg-white>
                    <ScrollView horizontal style={styles.scrollView} showsHorizontalScrollIndicator={false}>
                        {items.map((item, index) => renderItem(item, index))}
                    </ScrollView>
                </View>

                <View marginT-20 bg-white>
                    <TextInput
                        value={formData.note}
                        placeholder={i18n.t("address.note") as string} 
                        onChangeText={(value: string) => handleChange('note', value)}
                        multiline
                        style={{ fontSize: 14, color: "#555555", height: 100, width: "100%", paddingHorizontal: 20, backgroundColor: "#ffffff", textAlignVertical: 'top' }}
                    />
                </View>
            </View>

            <View flex padding-20 style={{ position: "absolute", bottom: 0, width: "100%" }}>
                <AppButton 
                    title={i18n.t('address.save')} 
                    type="primary" 
                    marginT-12 
                    onPress={handleSubmit}
                    disabled={loading}
                />
            </View>
        </View>
        </SafeAreaView>
    );
};

export default Add;

const styles = {
    scrollView: {
        backgroundColor: '#fff',
        padding: 20,
    },
    itemContainer: {
        padding: 10,
        borderRadius: 10,
        marginRight: 10,
    },
    selectedItem: {
        backgroundColor: '#717658',
    },
    unselectedItem: {
        backgroundColor: '#F4F4F4',
    },
    itemText: {
        color: '#717658',
    },
    selectedItemText: {
        color: '#F4F4F4',
    },
    unselectedItemText: {
        color: '#717658',
    },
};