import React, { useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { Colors, TextField, Toast, Button } from "react-native-ui-lib";
import i18n from "@/languages/i18n";

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
        borderBottomColor: '#ccc', // Set underline color
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
        borderBottomColor: '#ccc', // Set underline color
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
    buttonText_3: {
        color: '#000',
        textAlign: 'center',
    },
    container_4: {
        marginTop: 78,
        justifyContent: 'center',
        alignItems: 'center',
    },
    fieldContainer_4: {
        width: '100%', // Full width
        height: 200, // Adjust height as needed
        borderWidth: 1,
        borderColor: '#fff', // Border color
        backgroundColor: '#fff', // Background color
        shadowColor: '#fff', // Shadow color
        shadowOffset: { width: 0, height: 2 }, // Shadow offset
        elevation: 5, // Elevation for Android shadow
    },
    buttonContainer_4: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 100,
        marginLeft: 24,
        marginRight: 24,
    },
    shortButton_4: {
        width: '100%', // Adjust width as needed
        height: 55,
        borderRadius: 8,
        marginTop: 24, // Increased margin
        backgroundColor: '#717658', // Set button background color to white
    },
    buttonText_1: {
        color: '#fff',
    },
});

export const AddAddress = () => {
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
        <>
            <View style={styles.container}>
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
                        value={phone}
                    />
                </View>
                <Toast
                    visible={showToast}
                    position="bottom"
                    backgroundColor="#FF0000"
                    message={phoneError}
                    onDismiss={() => setShowToast(false)}
                    autoDismiss={3000}
                />
            </View>
            <View style={styles.container_1}>
                <View style={styles.fieldContainer_1}>
                    <TextField
                        placeholder={i18n.t('address.form.select_address').toString()}
                        floatingPlaceholder
                        onChangeText={onChangeName}
                        enableErrors
                        value={name}
                        validate={['required']}
                        validationMessage={[i18n.t('address.form.validation.required')]}
                        showCharCounter
                        containerStyle={styles.textFieldContainer_1}
                    />
                    <TextField
                        placeholder={i18n.t('address.form.building').toString()}
                        floatingPlaceholder
                        onChangeText={onChangePhone}
                        enableErrors
                        validate={['required']}
                        validationMessage={[
                            i18n.t('address.form.validation.required'),
                            i18n.t('address.form.validation.phone.invalid')
                        ]}
                        showCharCounter
                        containerStyle={styles.textFieldContainer_1}
                        keyboardType="numeric"
                        value={phone}
                    />
                </View>
                <Toast
                    visible={showToast}
                    position="bottom"
                    backgroundColor="#FF0000"
                    message={i18n.t('address.form.validation.phone.invalid')}
                    onDismiss={() => setShowToast(false)}
                    autoDismiss={3000}
                />
            </View>
            <View style={styles.container_2}>
                <View style={styles.fieldContainer_2}>
                    <View style={styles.buttonContainer}>
                        <Button
                            label={i18n.t('address.form.type.home').toString()}
                            style={[
                                styles.button,
                                selectedButton === i18n.t('address.form.type.home') && styles.selectedButton
                            ]}
                            onPress={() => handleButtonPress(i18n.t('address.form.type.home'))}
                            backgroundColor="#fff"
                            labelStyle={styles.buttonText_3}
                        />
                        <Button
                            label={i18n.t('address.form.type.company').toString()}
                            style={[
                                styles.button,
                                selectedButton === i18n.t('address.form.type.company') && styles.selectedButton
                            ]}
                            onPress={() => handleButtonPress(i18n.t('address.form.type.company'))}
                            backgroundColor="#fff"
                            labelStyle={styles.buttonText_3}
                        />
                        <Button
                            label={i18n.t('address.form.type.other').toString()}
                            style={[
                                styles.button,
                                selectedButton === i18n.t('address.form.type.other') && styles.selectedButton
                            ]}
                            onPress={() => handleButtonPress(i18n.t('address.form.type.other'))}
                            backgroundColor="#fff"
                            labelStyle={{ color: '#000' }}
                        />
                    </View>
                </View>
                <View style={styles.noteContainer}>
                    <TextField
                        placeholder={i18n.t('address.form.note').toString()}
                        floatingPlaceholder
                        onChangeText={onChangeNote}
                        value={note}
                        multiline
                        containerStyle={styles.noteTextField}
                    />
                </View>
            </View>
            <View style={styles.container_4}>
                <View style={styles.fieldContainer_4}>
                    <View style={styles.buttonContainer_4}>
                        <Button
                            label={i18n.t('address.form.save').toString()}
                            size={Button.sizes.large}
                            backgroundColor="#717658"
                            onPress={() => { /* Add your onPress handler here */ }}
                            style={styles.shortButton_4}
                            labelStyle={styles.buttonText_1}
                        />
                    </View>
                </View>
            </View>
        </>
    );
};