import { Animated, StyleSheet, } from 'react-native'
import { Colors, Text, TouchableOpacity, View } from 'react-native-ui-lib'
import React, { useRef, useState } from 'react'
import { Ionicons } from '@expo/vector-icons';
import { Voucher } from '@/types/voucher.type';

interface VoucherDropdownProps {
    value: Voucher | null;
    items: Voucher[];
    onSelect: (voucher: Voucher | null) => void;
}

const VoucherDropdown = ({
    value,
    items,
    onSelect,
}: VoucherDropdownProps) => {
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

    const handleSelect = (voucher: Voucher) => {
        if (value?.id === voucher.id) {
            onSelect(null);
        } else {
            onSelect(voucher);
        }
    };

    const isVoucherValid = (voucher: Voucher): boolean => {
        const now = new Date();
        const endDate = new Date(voucher.end_date);
        return endDate > now && voucher.remaining_uses > 0;
    };

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
                    <Text h3>{value?.code || "Không có"}</Text>
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
                    {items.map((item) => {
                        const isValid = isVoucherValid(item);
                        return (
                            <TouchableOpacity
                                key={item.id}
                                style={{
                                    ...dropdownStyles.item,
                                    ...(value?.code === item.code ? dropdownStyles.selectedItem : {}),
                                    ...((!isValid) ? dropdownStyles.disabledItem : {}),
                                }}
                                onPress={() => {
                                    if (isValid) {
                                        handleSelect(item);
                                        toggleDropdown();
                                    }
                                }}
                                disabled={!isValid}
                            >
                                <View style={dropdownStyles.voucherInfo}>
                                    <View style={dropdownStyles.voucherHeader}>
                                        <Text style={dropdownStyles.voucherCode}>{item.code}</Text>
                                        {!isValid && (
                                            <View style={dropdownStyles.expiredBadge}>
                                                <Text style={dropdownStyles.expiredText}>
                                                    {item.remaining_uses <= 0 ? 'Hết lượt dùng' : 'Hết hạn'}
                                                </Text>
                                            </View>
                                        )}
                                    </View>
                                    <Text style={dropdownStyles.description}>{item.description}</Text>
                                    <View style={dropdownStyles.voucherMeta}>
                                        <Text style={dropdownStyles.metaText}>
                                            HSD: {item.end_date_formatted}
                                        </Text>
                                        <Text style={dropdownStyles.metaText}>
                                            Còn lại: {item.remaining_uses} lượt
                                        </Text>
                                    </View>
                                </View>
                                <View row centerV gap-5>
                                    {value?.code === item.code && (
                                        <View>
                                            <Ionicons
                                                name="checkmark-circle"
                                                size={16}
                                                color={Colors.primary}
                                            />
                                        </View>
                                    )}
                                    <Text style={dropdownStyles.discountText}>
                                        Giảm {item.formatted_discount}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        );
                    })}
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
    voucherInfo: {
        flex: 1,
        marginRight: 10,
    },
    voucherHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    voucherCode: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.primary,
        marginRight: 8,
    },
    description: {
        fontSize: 13,
        color: Colors.grey30,
        marginBottom: 4,
    },
    voucherMeta: {
        flexDirection: 'row',
        gap: 12,
    },
    metaText: {
        fontSize: 12,
        color: Colors.grey40,
    },
    discountText: {
        color: Colors.secondary,
        fontWeight: 'bold',
    },
    expiredBadge: {
        backgroundColor: Colors.grey50,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    expiredText: {
        color: Colors.white,
        fontSize: 10,
    },
    disabledItem: {
        opacity: 0.6,
        backgroundColor: Colors.grey60 + '10',
    },
});