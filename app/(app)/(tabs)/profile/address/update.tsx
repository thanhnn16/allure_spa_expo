import {Image, Text, TextField, TouchableOpacity, View} from "react-native-ui-lib";
import i18n from "@/languages/i18n";
import { useNavigation } from "expo-router";
import BackButton from "@/assets/icons/back.svg";
import React, {useState} from "react";
import AppButton from "@/components/buttons/AppButton";
import {Input} from "postcss";
import {ScrollView} from "react-native";


const Update = () => {
    const navigation = useNavigation();
    const [selectedItem, setSelectedItem] = useState<number | null>(null);


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
    // @ts-ignore
    return (
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
                        {i18n.t("address.edit_address")}
                    </Text>
                </View>
            </View>

            <View flex marginT-10>
                <View bg-white>
                    <TextField
                        value="Nguyen Van A"
                        onChangeText={() => {}}
                        style={{ fontSize: 14, color: "#555555", height: 55, width: "100%", paddingHorizontal: 20 }}
                    />
                </View>
                <View  marginT-2 bg-white>
                    <TextField
                        value="0123456789"
                        onChangeText={() => {}}
                        style={{ fontSize: 14, color: "#555555", height: 55, width: "100%", paddingHorizontal: 20 }}
                    />
                </View>
                <View marginT-30 bg-white>
                    <TextField
                        value="340 Nguyễn Văn Lượng, Phường 10, Gò Vấp, Hồ Chí Minh, Việt Nam"
                        onChangeText={() => {}}
                        style={{ fontSize: 14, color: "#555555", height: 55, width: "100%", paddingHorizontal: 20 }}
                    />
                </View>
                <View  marginT-2 bg-white>
                    <TextField
                        value="House"
                        onChangeText={() => {}}
                        style={{ fontSize: 14, color: "#555555", height: 55, width: "100%", paddingHorizontal: 20 }}
                    />
                </View>

                <View  marginT-2 bg-white>
                    <ScrollView horizontal style={styles.scrollView} showsHorizontalScrollIndicator={false}>
                        {items.map((item, index) => renderItem(item, index))}
                    </ScrollView>
                </View>

                <View marginT-20 bg-white>
                    <TextField
                        placeholder={i18n.t("address.note") as string}
                        onChangeText={() => {}}
                        multiline
                        style={{ fontSize: 14, color: "#555555", height: 100, width: "100%", paddingHorizontal: 20, backgroundColor: "#ffffff", textAlignVertical: 'top' }}
                    />
                </View>
            </View>

            <View flex padding-20 style={{ position: "absolute", bottom: 0, width: "100%" }}>
                <AppButton title={i18n.t('address.save_address')} type="primary" marginT-12  />

                <AppButton title={i18n.t('address.delete_address')} type="outline" marginT-12  />

            </View>
        </View>
    );
};

export default Update;

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
