import { PaymentMethod } from '@/app/(app)/check-out';
import { Ionicons } from '@expo/vector-icons';
import { useRef, useState } from 'react';
import { Animated, StyleSheet } from 'react-native'
import { Card, Text, TouchableOpacity, View, Image, Colors } from 'react-native-ui-lib'

const PaymentPicker = ({
    value,
    items,
    onSelect,
}: {
    value: PaymentMethod | null;
    items: PaymentMethod[];
    onSelect: (value: PaymentMethod) => void;
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const animation = useRef(new Animated.Value(0)).current;

    const toggleDropdown = () => {
        const toValue = isOpen ? 0 : 1;
        setIsOpen(!isOpen);

        Animated.timing(animation, {
            toValue,
            duration: 300,
            useNativeDriver: false,
        }).start();
    };

    const handleSelect = (method: PaymentMethod) => {
        onSelect(method);
        setIsOpen(false);
    };

    const rotateIcon = animation.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "180deg"],
    });

    return (
        <View>
            <TouchableOpacity onPress={toggleDropdown}>
                <View
                    row centerV spread padding-15
                    style={{
                        borderWidth: 1,
                        borderColor: "#E0E0E0",
                        borderRadius: 10,
                        backgroundColor: "#FCFCFC",
                    }}
                >
                    <Text h3>
                        {value?.name}
                    </Text>
                    <Animated.View
                        style={[
                            { transform: [{ rotate: rotateIcon }] },
                        ]}
                    >
                        <Ionicons name="chevron-down" size={20} color="#BCBABA" />
                    </Animated.View>
                </View>
            </TouchableOpacity>

            {isOpen && (
                <Animated.View
                    style={[
                        dropdownStyles.container,
                        {
                            maxHeight: animation.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0, 300],
                            }),
                        },
                    ]}
                >
                    {items.map((method) => (
                        <TouchableOpacity
                            key={method.id}
                            style={{
                                ...dropdownStyles.item,
                                ...(value?.name === method.name ? dropdownStyles.selectedItem : {}),
                            }}
                            onPress={() => handleSelect(method)}
                        >
                            <View row centerV flex>
                                <Ionicons
                                    name={method.iconName as any}
                                    size={24}
                                    color={Colors.grey10}
                                    style={{ marginRight: 10 }}
                                />
                                <Text grey10>{method.name}</Text>
                            </View>
                            {value?.name === method.name && (
                                <Ionicons
                                    name="checkmark-circle"
                                    size={20}
                                    color={Colors.primary}
                                />
                            )}
                        </TouchableOpacity>
                    ))
                    }
                </Animated.View>
            )}
        </View>
    );
};

export default PaymentPicker

const styles = StyleSheet.create({
    paymentOption: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#E0E0E0",
    },
    selectedOption: {
        backgroundColor: "#f0f0f0",
    },
    optionLeft: {
        flexDirection: "row",
        alignItems: "center",
    },
    paymentIconContainer: {
        width: 80,
        height: 40,
        backgroundColor: "#f8f8f8",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10,
    },
    paymentIcon: {
        width: "100%",
        height: "100%",
        resizeMode: "contain",
    },
    paymentItemText: {
        fontSize: 14,
        color: "#000000",
    },
    checkIconContainer: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: Colors.primary,
        justifyContent: "center",
        alignItems: "center",
    },
});


const dropdownStyles = StyleSheet.create({
    container: {
        backgroundColor: "#f8f8f8",
        borderRadius: 8,
        overflow: "hidden",
        marginTop: 5,
    },
    item: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#E0E0E0",
        flexDirection: "row",
        justifyContent: "space-between",
    },
    selectedItem: {
        backgroundColor: "#f0f0f0",
        justifyContent: "space-between",
    },
});