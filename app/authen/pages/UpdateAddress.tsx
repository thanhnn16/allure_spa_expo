import React, { useState } from "react";
import { View, StyleSheet, Dimensions, Button, TouchableOpacity, Text } from "react-native";
import { TextField, Toast } from "react-native-ui-lib";

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
    },
    buttonText: {
        color: '#000',
    },
    fieldContainer: {
        width: '100%', // Full width
        height: 150,
        borderWidth: 1,
        borderColor: '#fff', // Border color
        backgroundColor: '#fff', // Background color
        shadowColor: '#fff', // Shadow color
        shadowOffset: { width: 0, height: 2 }, // Shadow offset
        elevation: 5, // Elevation for Android shadow
    },
    textFieldContainer: {
        borderBottomColor: '#000', // Set underline color
        borderBottomWidth: 0.5,
    },
    container_1: {
        marginTop: 10,
    },
    fieldContainer_1: {
        width: '100%', // Full width
        height: 150,
        borderWidth: 1,
        borderColor: '#fff', // Border color
        backgroundColor: '#fff', // Background color
        shadowColor: '#fff', // Shadow color
        shadowOffset: { width: 0, height: 2 }, // Shadow offset
        elevation: 5, // Elevation for Android shadow
    },
    textFieldContainer_1: {
        borderBottomColor: '#000', // Set underline color
        borderBottomWidth: 0.5,
    },
    container_2: {
        marginTop: 10,
    },
    fieldContainer_2: {
        width: '100%', // Full width
        height: 100,
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#fff', // Border color
        backgroundColor: '#fff', // Background color
        shadowColor: '#fff', // Shadow color
        shadowOffset: { width: 0, height: 2 }, // Shadow offset
        elevation: 5, // Elevation for Android shadow
    },
    buttonContainer: {
        flexDirection: 'row',
    },
    button: {
        width: 100,
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#000',
        backgroundColor: '#fff',
        marginHorizontal: 5,
        alignItems: 'center',
    },
    selectedButton: {
        backgroundColor: '#717658',
    },
    noteContainer: {
        marginTop: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: '#fff',
        backgroundColor: '#fff',
    },
    noteTextField: {
        height: 100,
    },
});

export const UpdateAddress = () => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [selectedButton, setSelectedButton] = useState<string | null>(null);
    const [note, setNote] = useState('');

    const onChangeNote = (value: string) => {
        setNote(value);
    };

    const onChangeName = (value: string) => {
        setName(value);
    };

    const onChangePhone = (value: string) => {
        if (/^\d*$/.test(value)) {
            setPhone(value);
            setPhoneError('');
            setShowToast(false);
        } else {
            setPhoneError('Phone number is invalid');
            setShowToast(true);
        }
    };
    const handleButtonPress = (button: string) => {
        setSelectedButton(button);
    };

    return (
        <><><><View style={styles.container}>
            <View style={styles.fieldContainer}>
                <TextField
                    placeholder={'Name'}
                    floatingPlaceholder
                    onChangeText={onChangeName}
                    enableErrors
                    value={name}
                    validate={['required']}
                    validationMessage={['Field is required']}
                    showCharCounter
                    containerStyle={styles.textFieldContainer} // Apply custom styles
                />
                <TextField
                    placeholder={'Phone Number'}
                    floatingPlaceholder
                    onChangeText={onChangePhone}
                    enableErrors
                    validate={['required']}
                    validationMessage={['Field is required', phoneError]}
                    showCharCounter
                    containerStyle={styles.textFieldContainer} // Apply custom styles
                    keyboardType="numeric" // Set keyboard type to numeric
                    value={phone} />
            </View>
            <Toast
                visible={showToast}
                position="bottom"
                backgroundColor="#FF0000"
                message={phoneError}
                onDismiss={() => setShowToast(false)}
                autoDismiss={3000} />
        </View>
        </><><View style={styles.container_1}>
            <View style={styles.fieldContainer_1}>
                <TextField
                    placeholder={'Địa chỉ'}
                    floatingPlaceholder
                    onChangeText={onChangeName}
                    enableErrors
                    value={name}
                    validate={['required']}
                    validationMessage={['Field is required']}
                    showCharCounter
                    containerStyle={styles.textFieldContainer_1} // Apply custom styles
                />
                <TextField
                    placeholder={'Nhập địa chỉ cụ thể'}
                    floatingPlaceholder
                    onChangeText={onChangePhone}
                    enableErrors
                    validate={['required']}
                    validationMessage={['Field is required', phoneError]}
                    showCharCounter
                    containerStyle={styles.textFieldContainer_1} // Apply custom styles
                    keyboardType="numeric" // Set keyboard type to numeric
                    value={phone} />
            </View>
            <Toast
                visible={showToast}
                position="bottom"
                backgroundColor="#FF0000"
                message={phoneError}
                onDismiss={() => setShowToast(false)}
                autoDismiss={3000} />
        </View>
            </></><View style={styles.container_2}>
                <View style={styles.fieldContainer_2}>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[
                                styles.button,
                                selectedButton === 'Nhà' && styles.selectedButton
                            ]}
                            onPress={() => handleButtonPress('Nhà')}
                        >
                            <Text style={styles.buttonText}>Nhà</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.button,
                                selectedButton === 'Công ty' && styles.selectedButton
                            ]}
                            onPress={() => handleButtonPress('Công ty')}
                        >
                            <Text style={styles.buttonText}>Công ty</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.button,
                                selectedButton === 'Khác' && styles.selectedButton
                            ]}
                            onPress={() => handleButtonPress('Khác')}
                        >
                            <Text style={styles.buttonText}>Khác</Text>
                        </TouchableOpacity>
                    </View>
                    
                </View>
                <View style={styles.noteContainer}>
                        <TextField
                            placeholder={'Ghi chú'}
                            floatingPlaceholder
                            onChangeText={onChangeNote}
                            value={note}
                            multiline
                            containerStyle={styles.noteTextField} // Apply custom styles
                        />
                    </View>
            </View></>
    );
};