// import { StyleSheet, View, Text, FlatList, Button, TouchableOpacity } from 'react-native';
// import React from 'react';
// import { MaterialIcons } from '@expo/vector-icons';

// const addressData = [
//     { id: '1', text1: 'Nhà', address1: '340 Nguyễn Văn Lượng, Phường 10, Gò Vấp, Hồ Chí Minh, Việt Nam', text2: 'Tèo', text3: 'Số điện thoại 1' },
//     { id: '2', text1: 'Nhà', address1: '340 Nguyễn Văn Lượng, Phường 10, Gò Vấp, Hồ Chí Minh, Việt Nam', text2: 'Nè', text3: 'Số điện thoại 2' },
//     { id: '3', text1: 'Nhà', address1: '340 Nguyễn Văn Lượng, Phường 10, Gò Vấp, Hồ Chí Minh, Việt Nam', text2: 'Tí', text3: 'Số điện thoại 3' },
//     { id: '4', text1: 'Nhà', address1: '340 Nguyễn Văn Lượng, Phường 10, Gò Vấp, Hồ Chí Minh, Việt Nam', text2: 'Ơi', text3: 'Số điện thoại 4' },
// ];

// interface AddressItemProps {
//     text1: string;
//     address1: string;
//     text2: string;
//     text3: string;
// }

// const AddressItem: React.FC<AddressItemProps> = ({ text1, address1, text2, text3 }) => (
//     <View>
//         <View style={styles.row}>
//             <View style={styles.iconTextContainer}>
//                 <MaterialIcons name="location-on" size={24} color="black" />
//                 <Text style={styles.iconText}>{text1}</Text>
//             </View>
//             <Text style={styles.sideText}>update</Text>
//         </View>
//         <View style={styles.column}>
//             <Text style={styles.subText}>{address1}</Text>
//         </View>
//         <View style={[styles.row, styles.rowSpace]}>
//             <Text style={[styles.subText, styles.nameText]}>{text2}</Text>
//             <Text style={styles.subText}>{text3}</Text>
//         </View>
//         <View style={styles.horizontalLine} />
//     </View>
// );

// export const Address = () => {
//     return (
//         <View style={styles.container}>
//             <Text style={styles.mainText}>Địa chỉ đã lưu</Text>
//             <FlatList
//                 style={styles.frame}
//                 data={addressData}
//                 renderItem={({ item }) => (
//                     <AddressItem
//                         text1={item.text1}
//                         address1={item.address1}
//                         text2={item.text2}
//                         text3={item.text3}
//                     />
//                 )}
//                 keyExtractor={(item) => item.id}
//             />
//             <View style={styles.buttonFrame}>
//                 <TouchableOpacity style={styles.buttonAddAddress} onPress={() => { /* Add your onPress handler here */ }}>
//                     <Text style={styles.buttonAddAddressText}>Thêm địa chỉ</Text>
//                 </TouchableOpacity>
//             </View>
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         padding: 16,
//         backgroundColor: '#f0f0f0', // Background color for the entire screen
//     },
//     frame: {
//         width: '100%',
//         height: 200, // Set a fixed height to make the frame shorter
//         paddingVertical: 5, // Reduce vertical padding
//         paddingHorizontal: 10, // Keep horizontal padding
//         borderWidth: 2,
//         borderColor: '#fff', // Change border color to white
//         borderRadius: 8,
//         backgroundColor: '#fff', // Background color for the frame
//         marginBottom: 298, // Add margin to separate the frame from the button
//         shadowColor: '#000', // Shadow color
//         shadowOffset: { width: 0, height: 2 }, // Shadow offset
//         shadowOpacity: 0.25, // Shadow opacity
//         shadowRadius: 3.84, // Shadow radius
//         elevation: 5, // Elevation for Android shadow
//     },
//     row: {
//         flexDirection: 'row',
//         marginBottom: 16,
//         justifyContent: 'space-between',
//         alignItems: 'center',
//     },
//     iconTextContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//     },
//     mainText: {
//         fontSize: 20,
//         marginBottom: 16,
//     },
//     iconText: {
//         fontSize: 18,
//         marginLeft: 8,
//         fontFamily: 'Inter-Bold', // Updated to use Inter-Bold
//     },
//     column: {
//         marginBottom: 16,
//     },
//     subText: {
//         fontSize: 16,
//         marginBottom: 0,
//         fontFamily: 'Inter-Regular',
//     },
//     nameText: {
//         marginBottom: 0, // Remove extra margin to align with phone number
//     },
//     rowSpace: {
//         justifyContent: 'space-between',
//     },
//     sideText: {
//         fontSize: 16,
//         fontFamily: 'Inter-Regular',
//     },
//     horizontalLine: {
//         borderBottomColor: '#000',
//         borderBottomWidth: 1,
//     },
//     buttonAddAddress: {
//         justifyContent: 'center',
//         alignItems: 'center',
//         width: '100%',
//         height: '100%',
//         backgroundColor: '#717658',
//         borderRadius: 8,
//     },
//     buttonAddAddressText: {
//         color: 'white',
//         fontSize: 16,
//     },
//     buttonFrame: {
//         position: 'absolute',
//         marginTop: 684,
//         alignSelf: 'center',
//         justifyContent: 'center',
//         width: 259.82, // Set the width of the button
//         height: 55, // Set the height of the button
//         borderWidth: 2,
//         borderColor: '#FFFFFF', // Frame color
//         borderRadius: 8,
//         backgroundColor: '#717658', // Background color for the frame
//     },
// });


import React from "react";

const addressData = [
    { id: '1', text1: 'Nhà', address1: '340 Nguyễn Văn Lượng, Phường 10, Gò Vấp, Hồ Chí Minh, Việt Nam', text2: 'Tèo', text3: 'Số điện thoại 1' },
    { id: '2', text1: 'Nhà', address1: '340 Nguyễn Văn Lượng, Phường 10, Gò Vấp, Hồ Chí Minh, Việt Nam', text2: 'Nè', text3: 'Số điện thoại 2' },
    { id: '3', text1: 'Nhà', address1: '340 Nguyễn Văn Lượng, Phường 10, Gò Vấp, Hồ Chí Minh, Việt Nam', text2: 'Tí', text3: 'Số điện thoại 3' },
    { id: '4', text1: 'Nhà', address1: '340 Nguyễn Văn Lượng, Phường 10, Gò Vấp, Hồ Chí Minh, Việt Nam', text2: 'Ơi', text3: 'Số điện thoại 4' },
];
import { StyleSheet, View, Text } from "react-native";
import { SortableList, Button, Colors, Typography, TouchableOpacity } from "react-native-ui-lib";
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const onOrderChange = (data: any) => {
    console.log("Order changed:", data);
};

const AddressItem: React.FC<{ item: any }> = ({ item }) => {
    const navigation = useNavigation();

    return (
        <View style={styles.itemContainer}>
            <View style={styles.row}>
                <View style={styles.iconTextContainer}>
                    <MaterialIcons name="home" size={24} color={Colors.black} />
                    <Text style={styles.iconText}>{item.text1}</Text>
                </View>
                <TouchableOpacity onPress={() => navigation.navigate('UpdateAddress')}>
                    <Text style={styles.updateText}>update</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.column}>
                <Text style={styles.subText}>{item.address1}</Text>
            </View>
            <View style={[styles.row, styles.rowSpace]}>
                <Text style={styles.subText}>{item.text2}</Text>
                <Text style={styles.subText}>{item.text3}</Text>
            </View>
            <View style={styles.horizontalLine} />
        </View>
    );
};

export const Address = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.mainText}>Địa chỉ đã lưu</Text>
            <View style={styles.frame}>
                <SortableList
                    data={addressData}
                    onOrderChange={onOrderChange}
                    renderItem={({ item }) => <AddressItem item={item} />}
                    keyExtractor={(item) => item.id}
                />
            </View>
            <Button
                label={'Thêm địa chỉ'}
                size={Button.sizes.large}
                backgroundColor={Colors.grey40}
                onPress={() => { /* Add your onPress handler here */ }}
                style={styles.shortButton}
            />
        </View>
    );
}

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
});