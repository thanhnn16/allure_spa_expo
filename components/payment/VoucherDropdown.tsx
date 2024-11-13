import { Animated, StyleSheet, } from 'react-native'
import { Colors, Text, TouchableOpacity, View } from 'react-native-ui-lib'
import React, { useRef, useState } from 'react'
import { Voucher } from '@/app/(app)/check-out';
import { Ionicons } from '@expo/vector-icons';

const VoucherDropdown = ({
    value,
    items,
    onSelect,
}: {
    value: string;
    items: Voucher[];
    onSelect: (voucher: Voucher) => void;
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
                    <Text h3>{value || "Không có"}</Text>
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
                    {items.map((item) => (
                        <TouchableOpacity
                            key={item.value}
                            style={{
                                ...dropdownStyles.item,
                                ...(value === item.label ? dropdownStyles.selectedItem : {}),
                            }}

                            onPress={() => {
                                onSelect(item);
                                toggleDropdown();
                            }}
                        >
                            <View>
                                <Text>{item.label}</Text>
                            </View>
                            <View row centerV gap-5>
                                {value === item.label && (
                                    <View>
                                        <Ionicons
                                            name="checkmark-circle"
                                            size={16}
                                            color={Colors.primary}
                                        />
                                    </View>
                                )}
                                <Text>
                                    Giảm {item.discountPercentage}%
                                </Text>

                            </View>
                        </TouchableOpacity>
                    ))}
                </Animated.View>
            )}
        </View>
    );
};

export default VoucherDropdown

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