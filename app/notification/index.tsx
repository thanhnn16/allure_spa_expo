import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, ListItem } from "react-native-ui-lib";
import { StackNavigationProp } from '@react-navigation/stack';

type NotificationPageProps = {
    navigation: StackNavigationProp<any, any>;
};

const todayData: { id: string; title: string; description: string; time: string; type: NotificationType }[] = [
    { id: '1', title: 'Đặt hàng thành công', description: 'Bạn đã đặt hàng thành công cho đơn hàng: Làm sạch bằng lamellar..', time: '1h', type: 'success' },
    { id: '2', title: 'Đã huỷ lịch hẹn', description: 'Bạn đã huỷ lịch hẹn thành công cho dịch vụ: Kiểm tra và sửa chữa máy l...', time: '2h', type: 'cancel' },
    { id: '5', title: 'Đã đổi lịch hẹn', description: 'Bạn đã đổi lịch hẹn thành công cho dịch vụ: Kiểm tra và sửa chữa máy lạnh. V...', time: '3h', type: 'reschedule' },
    { id: '6', title: 'Đặt hàng thành công', description: 'Bạn đã đặt hàng thành công cho đơn hàng: Làm sạch bằng lamellar..', time: '4h', type: 'success' },
    { id: '7', title: 'Đã huỷ lịch hẹn', description: 'Bạn đã huỷ lịch hẹn thành công cho dịch vụ: Kiểm tra và sửa chữa máy l...', time: '5h', type: 'cancel' },
];

const yesterdayData: { id: string; title: string; description: string; time: string; type: NotificationType }[] = [
    { id: '3', title: 'Đã đổi lịch hẹn', description: 'Bạn đã đổi lịch hẹn thành công cho dịch vụ: Kiểm tra và sửa chữa máy lạnh. V...', time: '15h', type: 'reschedule' },
    { id: '4', title: 'Đã huỷ lịch hẹn', description: 'Bạn đã huỷ lịch hẹn thành công cho dịch vụ: Kiểm tra và sửa chữa máy l...', time: '16h', type: 'cancel' },
    { id: '8', title: 'Đặt hàng thành công', description: 'Bạn đã đặt hàng thành công cho đơn hàng: Làm sạch bằng lamellar..', time: '17h', type: 'success' },
    { id: '9', title: 'Đã huỷ lịch hẹn', description: 'Bạn đã huỷ lịch hẹn thành công cho dịch vụ: Kiểm tra và sửa chữa máy l...', time: '18h', type: 'cancel' },
    { id: '10', title: 'Đã đổi lịch hẹn', description: 'Bạn đã đổi lịch hẹn thành công cho dịch vụ: Kiểm tra và sửa chữa máy lạnh. V...', time: '19h', type: 'reschedule' },
];

type NotificationType = 'success' | 'cancel' | 'reschedule';

const notificationTypeMap: Record<NotificationType, { backgroundColor: string; icon: any }> = {
    success: {
        backgroundColor: '#d4edda', // Light green
        icon: require('../../assets/images/home/icons/calendartick.png'),
    },
    cancel: {
        backgroundColor: '#f8d7da', // Light red
        icon: require('../../assets/images/home/icons/calendarremove.png'),
    },
    reschedule: {
        backgroundColor: '#d6d8d9', // Light gray
        icon: require('../../assets/images/home/icons/calendaredit.png'),
    },
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    backButton: {
        marginRight: 16,
    },
    backIcon: {
        width: 24,
        height: 24,
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 110,
    },
    content: {
        flex: 1,
        padding: 16,
    },
    contentspace: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    textContent: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000', // Changed to black
    },
    list: {
        paddingVertical: 8,
    },
    listItem: {
        marginVertical: 8, // Add vertical margin to create space between items
    },
    listItemContent: {
        paddingLeft: 16,
        flexShrink: 1, // Allow text to wrap within the available space
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    timeText: {
        fontSize: 14,
        color: '#999',
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        width: 24,
        height: 24,
    },
    textContent_today: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#999',
    },
    descriptionText: {
        color: '#666',
        flexWrap: 'wrap', // Ensure text wraps within the container
    },
});

const NotificationPage: React.FC<NotificationPageProps> = ({ navigation }) => {
    const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);

    const renderItem = ({ item }: { item: { id: string; title: string; description: string; time: string; type: NotificationType } }) => {
        const { backgroundColor, icon } = notificationTypeMap[item.type];
        const isHovered = item.id === hoveredItemId;

        return (
            <TouchableOpacity
                onPressIn={() => {
                    console.log(`Hovering over item: ${item.id}`);
                    setHoveredItemId(item.id);
                }}
                onPressOut={() => {
                    console.log(`Stopped hovering over item: ${item.id}`);
                    setHoveredItemId(null);
                }}
            >
                <ListItem style={styles.listItem}>
                    <ListItem.Part left>
                        <View style={[styles.iconContainer, { backgroundColor }]}>
                            <Image source={icon} style={styles.icon} />
                        </View>
                    </ListItem.Part>
                    <ListItem.Part middle column containerStyle={styles.listItemContent}>
                        <View style={styles.titleRow}>
                            <Text style={styles.textContent}>{item.title}</Text>
                            <Text style={styles.timeText}>{item.time}</Text>
                        </View>
                        <Text style={styles.descriptionText}>{item.description}</Text>
                    </ListItem.Part>
                </ListItem>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Button
                    iconSource={() => <Image source={require('../../assets/images/home/arrow_ios.png')} style={styles.backIcon} />}
                    onPress={() => navigation.navigate('HomePage')}
                    link style={styles.backButton}
                />
                <Text style={styles.headerText}>Thông báo</Text>
            </View>
            <View style={styles.content}>
                <View style={styles.contentspace}>
                    <Text style={styles.textContent_today}>HÔM NAY</Text>
                    <Text>Đánh dấu tất cả là đã đọc</Text>
                </View>
                <FlatList
                    data={todayData}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    extraData={hoveredItemId} // Ensure FlatList re-renders when hoveredItemId changes
                    contentContainerStyle={styles.list}
                />
                <View style={styles.contentspace}>
                    <Text style={styles.textContent_today}>HÔM QUA</Text>
                    <Text>Đánh dấu tất cả là đã đọc</Text>
                </View>
                <FlatList
                    data={yesterdayData}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    extraData={hoveredItemId} // Ensure FlatList re-renders when hoveredItemId changes
                    contentContainerStyle={styles.list}
                />
            </View>
        </SafeAreaView>
    );
};

export default NotificationPage;