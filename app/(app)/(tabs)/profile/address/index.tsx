import React, { useState } from "react";
import { StyleSheet, View, Text, Modal } from "react-native";
import { SortableList, Button, Colors, Typography, TouchableOpacity } from "react-native-ui-lib";
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Link } from "expo-router";

const addressData = [
    { id: '1', text1: 'Nhà', address1: '340 Nguyễn Văn Lượng, Phường 10, Gò Vấp, Hồ Chí Minh, Việt Nam', text2: 'Tèo', text3: 'Số điện thoại 1' },
    { id: '2', text1: 'Nhà', address1: '340 Nguyễn Văn Lượng, Phường 10, Gò Vấp, Hồ Chí Minh, Việt Nam', text2: 'Nè', text3: 'Số điện thoại 2' },
    { id: '3', text1: 'Nhà', address1: '340 Nguyễn Văn Lượng, Phường 10, Gò Vấp, Hồ Chí Minh, Việt Nam', text2: 'Tí', text3: 'Số điện thoại 3' },
    { id: '4', text1: 'Nhà', address1: '340 Nguyễn Văn Lượng, Phường 10, Gò Vấp, Hồ Chí Minh, Việt Nam', text2: 'Ơi', text3: 'Số điện thoại 4' },
];

const onOrderChange = (data: any) => {
    console.log("Order changed:", data);
};

const AddressItem: React.FC<{ item: any, onLongPress: (id: string) => void }> = ({ item, onLongPress }) => {
    const navigation = useNavigation();

    return (
        <TouchableOpacity onLongPress={() => onLongPress(item.id)} style={styles.itemContainer}>
            <View style={styles.row}>
                <View style={styles.iconTextContainer}>
                    <MaterialIcons name="home" size={24} />
                    <Text style={styles.iconText}>{item.text1}</Text>
                </View>
                <Link href="/(tabs)/profile/address/update" asChild>
                <TouchableOpacity>
                    <Text style={styles.updateText}>update</Text>
                </TouchableOpacity>
                </Link>
            </View>
            <View style={styles.column}>
                <Text style={styles.subText}>{item.address1}</Text>
            </View>
            <View style={[styles.row, styles.rowSpace]}>
                <Text style={styles.subText}>{item.text2}</Text>
                <Text style={styles.subText}>{item.text3}</Text>
            </View>
            <View style={styles.horizontalLine} />
        </TouchableOpacity>
    );
};

export const Address = () => {
    const [addresses, setAddresses] = useState(addressData);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
    const navigation = useNavigation();

    const handleLongPress = (id: string) => {
        setSelectedAddressId(id);
        setModalVisible(true);
    };

    const confirmDelete = () => {
        setAddresses(addresses.filter(address => address.id !== selectedAddressId));
        setModalVisible(false);
        setSelectedAddressId(null);
    };

    const cancelDelete = () => {
        setModalVisible(false);
        setSelectedAddressId(null);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.mainText}>Địa chỉ đã lưu</Text>
            <View style={styles.frame}>
                <SortableList
                    flexMigration={true}
                    data={addresses}
                    onOrderChange={onOrderChange}
                    renderItem={({ item }) => <AddressItem item={item} onLongPress={handleLongPress} />}
                    keyExtractor={(item) => item.id}
                />
            </View>
            <View>
                <Link href="/(tabs)/profile/address/add" asChild>
                <Button
                    label={'Thêm địa chỉ'}
                    size={Button.sizes.large}
                    backgroundColor={Colors.grey40}
                    style={styles.shortButton}
                />
                </Link>
            </View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={cancelDelete}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Bạn có chắc chắn muốn xoá địa chỉ này?</Text>
                        <View style={styles.modalButtonContainer}>
                            <Button label="Xoá" onPress={confirmDelete} style={styles.modalButton} />
                            <Button label="Không" onPress={cancelDelete} style={styles.modalButton} />
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

export default Address;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: Colors.grey60,
    },
    frame: {
        width: '100%',
        height: 500,
        marginBottom: 16,
        borderRadius: 8,
        backgroundColor: Colors.white,
        padding: 20, // Increased padding
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    itemContainer: {
        marginBottom: 24, // Increased margin
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8, // Added margin to separate rows
    },
    iconTextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    mainText: {
        fontSize: 20,
        marginBottom: 24, // Increased margin
        ...Typography.text20,
    },
    iconText: {
        fontSize: 18,
        marginLeft: 8,
        fontWeight: 'bold', // Make the text bold
        ...Typography.text18,
    },
    column: {
        marginBottom: 16,
        marginLeft: 32, // Align the address text with the icon and "Nhà" text
    },
    subText: {
        fontSize: 16,
        ...Typography.text16,
    },
    rowSpace: {
        justifyContent: 'space-between',
        marginLeft: 32, // Align the phone number text with the address and "Nhà" text
    },
    updateText: {
        fontSize: 16,
        color: Colors.blue30,
        ...Typography.text16,
    },
    deleteText: {
        fontSize: 16,
        color: Colors.red30,
        ...Typography.text16,
    },
    horizontalLine: {
        borderBottomColor: Colors.black,
        borderBottomWidth: 1,
        marginTop: 8, // Added margin to separate the line
    },
    shortButton: {
        width: '100%',
        height: 55,
        borderRadius: 8,
        marginTop: 24, // Increased margin
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalView: {
        width: 300,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 8,
        alignItems: 'center',
    },
    modalText: {
        fontSize: 18,
        marginBottom: 20,
    },
    modalButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    modalButton: {
        width: '45%',
    },
});
