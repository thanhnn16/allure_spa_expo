import { router } from "expo-router";
import React from "react";
import { View, Text, SafeAreaView, StyleSheet, Image } from "react-native";
import { Button } from "react-native-ui-lib";

type NotNotificationPageProps = {
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
    body: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageContainer: {
        alignItems: 'center',
        position: 'relative',
    },
    image: {
        width: 500,
        height: 500,
    },
    overlayText: {
        position: 'absolute',
        color: '#666',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 380,
    },
});

const NotNotificationPage: React.FC<NotNotificationPageProps> = () => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Button
                    iconSource={() => <Image source={require('@/assets/images/home/arrow_ios.png')} style={styles.backIcon} />}
                    onPress={() => router.back()}
                    link style={styles.backButton}
                />
                <Text style={styles.headerText}>Thông báo</Text>
            </View>
            <View style={styles.body}>
                <View style={styles.imageContainer}>
                    <Text style={styles.overlayText}>Hiện không có thông báo nào</Text>
                    <Image source={require('@/assets/images/home/icons/notification.png')} style={styles.image} />
                </View>
            </View>
        </View>
    );
};

export default NotNotificationPage;