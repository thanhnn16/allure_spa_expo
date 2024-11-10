import {Image, Text, TouchableOpacity, View} from "react-native-ui-lib";
import i18n from "@/languages/i18n";
import { useNavigation, useLocalSearchParams } from "expo-router";
import BackButton from "@/assets/icons/back.svg";
import React, {useState} from "react";
import AppButton from "@/components/buttons/AppButton";
import {SafeAreaView, ScrollView, TextInput, Alert} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import AxiosInstance from "@/utils/services/helper/axiosInstance";

const AddressInput = ({ 
    value, 
    placeholder, 
    onChangeText, 
    editable = true 
}: {
    value: string;
    placeholder: string;
    onChangeText: (text: string) => void;
    editable?: boolean;
}) => (
    <View style={{
        backgroundColor: '#ffffff',
        marginBottom: 10,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 3,
    }}>
        <TextInput
            value={value}
            placeholder={placeholder}
            onChangeText={onChangeText}
            editable={editable}
            style={{ 
                fontSize: 14,
                height: 55,
                width: "100%",
                paddingHorizontal: 20,
                color: editable ? '#333333' : '#666666',
            }}
        />
    </View>
);

const Update = () => {
    const params = useLocalSearchParams();
    const navigation = useNavigation();
    const [selectedItem, setSelectedItem] = useState<number>(() => {
        switch(params.address_type) {
            case 'home': return 1;
            case 'work': return 2;
            default: return 3;
        }
    });
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: params.name as string || "",
        phone: params.phone as string || "",
        address: params.address as string || "",
        province: params.province as string || "",
        district: params.district as string || "",
        note: params.note as string || "",
        address_type: params.address_type as 'home' | 'work' | 'others',
        is_default: params.is_default === 'true',
        is_temporary: params.is_temporary === 'true'
    });

    const items = [
        { id: 1, name: i18n.t("address.home"), type: 'home' },
        { id: 2, name: i18n.t("address.work"), type: 'work' },
        { id: 3, name: i18n.t("address.others"), type: 'others' }
    ];

    const handleUpdateAddress = async () => {
        try {
            setLoading(true);
            const token = await AsyncStorage.getItem('userToken');
            
            if (!token) {
                Alert.alert('Lỗi', 'Vui lòng đăng nhập lại');
                return;
            }

            let address_type: 'home' | 'work' | 'others';
            switch(selectedItem) {
                case 1: address_type = 'home'; break;
                case 2: address_type = 'work'; break;
                default: address_type = 'others';
            }

            const response = await AxiosInstance().put(`/user/addresses/${params.id}`, {
                ...formData,
                address_type,
                note: formData.note
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });

            if (response.data?.success) {
                Alert.alert('Thành công', 'Đã cập nhật địa chỉ', [
                    {
                        text: 'OK',
                        onPress: () => navigation.goBack()
                    }
                ]);
            }
        } catch (error) {
            console.error('Lỗi khi cập nhật địa chỉ:', error);
            Alert.alert('Lỗi', 'Không thể cập nhật địa chỉ');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#F5F7FA" }}>
            <View flex>
                <View row centerV backgroundColor="#ffffff" padding-15 
                    style={{
                        shadowColor: "#000",
                        shadowOffset: {width: 0, height: 2},
                        shadowOpacity: 0.1,
                        shadowRadius: 3,
                        elevation: 3,
                    }}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Image width={30} height={30} source={BackButton} />
                    </TouchableOpacity>
                    <View flex center>
                        <Text text60 bold marginR-30 style={{color: "#717658", fontSize: 18}}>
                            {i18n.t("address.edit_address")}
                        </Text>
                    </View>
                </View>

                <ScrollView style={{ flex: 1, padding: 15 }}>
                    <View style={{
                        backgroundColor: '#ffffff',
                        borderRadius: 12,
                        padding: 15,
                        marginBottom: 15,
                        shadowColor: "#000",
                        shadowOffset: {width: 0, height: 1},
                        shadowOpacity: 0.1,
                        shadowRadius: 2,
                        elevation: 3,
                    }}>
                        <Text style={{color: '#717658', fontWeight: '600', marginBottom: 10}}>
                            {i18n.t("auth.login.personal_info")}
                        </Text>
                        <AddressInput
                            value={formData.name}
                            placeholder={i18n.t("auth.login.fullname")}
                            onChangeText={(value) => setFormData(prev => ({...prev, name: value}))}
                        />
                        <AddressInput
                            value={formData.phone}
                            placeholder={i18n.t("address.phone")}
                            onChangeText={(value) => setFormData(prev => ({...prev, phone: value}))}
                        />
                    </View>

                    <View style={{
                        backgroundColor: '#ffffff',
                        borderRadius: 12,
                        padding: 15,
                        marginBottom: 15,
                        shadowColor: "#000",
                        shadowOffset: {width: 0, height: 1},
                        shadowOpacity: 0.1,
                        shadowRadius: 2,
                        elevation: 3,
                    }}>
                        <Text style={{color: '#717658', fontWeight: '600', marginBottom: 10}}>
                            {i18n.t("address.address")}
                        </Text>
                        <AddressInput
                            value={formData.province}
                            placeholder={i18n.t("address.province")}
                            onChangeText={(value) => setFormData(prev => ({...prev, province: value}))}
                        />
                        <AddressInput
                            value={formData.district}
                            placeholder={i18n.t("address.district")}
                            onChangeText={(value) => setFormData(prev => ({...prev, district: value}))}
                        />
                        <AddressInput
                            value={formData.address}
                            placeholder={i18n.t("address.address")}
                            onChangeText={(value) => setFormData(prev => ({...prev, address: value}))}
                        />
                        
                        <TextInput
                            value={formData.note}
                            placeholder={i18n.t("address.note")}
                            onChangeText={(value) => setFormData(prev => ({...prev, note: value}))}
                            multiline={true}
                            numberOfLines={3}
                            style={{ 
                                fontSize: 14,
                                minHeight: 80,
                                width: "100%",
                                padding: 15,
                                backgroundColor: '#ffffff',
                                borderRadius: 8,
                                textAlignVertical: 'top',
                                borderWidth: 1,
                                borderColor: '#E5E7EB',
                                marginTop: 10
                            }}
                        />
                    </View>

                    <View style={{
                        backgroundColor: '#ffffff',
                        borderRadius: 12,
                        padding: 15,
                        marginBottom: 80,
                        shadowColor: "#000",
                        shadowOffset: {width: 0, height: 1},
                        shadowOpacity: 0.1,
                        shadowRadius: 2,
                        elevation: 3,
                    }}>
                        <Text style={{color: '#717658', fontWeight: '600', marginBottom: 10}}>
                            {i18n.t("address.type")}
                        </Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            {items.map(item => (
                                <TouchableOpacity 
                                    key={item.id}
                                    onPress={() => setSelectedItem(item.id)}
                                    style={{
                                        padding: 12,
                                        paddingHorizontal: 25,
                                        borderRadius: 8,
                                        marginRight: 12,
                                        backgroundColor: selectedItem === item.id ? '#717658' : '#F4F4F4',
                                        borderWidth: 1,
                                        borderColor: selectedItem === item.id ? '#717658' : '#E5E7EB'
                                    }}
                                >
                                    <Text style={{
                                        color: selectedItem === item.id ? '#FFFFFF' : '#717658',
                                        fontWeight: '500'
                                    }}>
                                        {item.name}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </ScrollView>

                <View style={{
                    padding: 20,
                    backgroundColor: '#ffffff',
                    borderTopWidth: 1,
                    borderTopColor: '#E5E7EB',
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0
                }}>
                    <AppButton 
                        title={i18n.t('address.save')} 
                        type="primary" 
                        onPress={handleUpdateAddress}
                        disabled={loading}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
};

export default Update;

