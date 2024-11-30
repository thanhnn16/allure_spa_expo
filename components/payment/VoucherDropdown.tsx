import { Voucher } from "@/types/voucher.type";
import { useState } from "react";
import {
  Colors,
  Text,
  View,
  TouchableOpacity,
  ExpandableSection,
} from "react-native-ui-lib";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet } from "react-native";
import { useLanguage } from "@/hooks/useLanguage";

interface VoucherDropdownProps {
  value: Voucher | null;
  items: Voucher[];
  onSelect: (voucher: Voucher | null) => void;
  isLoading?: boolean;
}

const VoucherDropdown = ({ value, items, onSelect, isLoading }: VoucherDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();

  const handleSelect = (voucher: Voucher) => {
    if (value?.id === voucher.id) {
      onSelect(null);
    } else {
      onSelect(voucher);
    }
    setIsOpen(false);
  };

  const isVoucherValid = (voucher: Voucher): boolean => {
    const now = new Date();
    const endDate = new Date(voucher.end_date);
    return endDate > now && voucher.remaining_uses > 0;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  const renderHeader = () => (
    <TouchableOpacity
      onPress={() => setIsOpen(!isOpen)}
      style={[styles.header, value && styles.headerSelected]}
    >
      <View row spread centerV>
        <View row centerV flex>
          <MaterialCommunityIcons
            name="ticket-percent-outline"
            size={16}
            color={value ? Colors.primary : Colors.grey30}
            style={{ marginRight: 6 }}
          />
          <View>
            {isLoading ? (
              <Text text80 color={Colors.grey30}>
                {t("common.loading")}...
              </Text>
            ) : (
              <Text text80 color={value ? Colors.text : Colors.grey30}>
                {value ? value.code : t("checkout.select_voucher")}
              </Text>
            )}
            {value && !isLoading && (
              <Text text90 color={Colors.grey30}>
                {value.formatted_discount}
              </Text>
            )}
          </View>
        </View>
        <MaterialCommunityIcons
          name={isOpen ? "chevron-up" : "chevron-down"}
          size={18}
          color={Colors.grey30}
        />
      </View>
    </TouchableOpacity>
  );

  const renderVoucherStatus = (item: Voucher) => {
    const isValid = isVoucherValid(item);
    if (!isValid) {
      return (
        <View style={styles.statusBadge}>
          <Text white text90>
            {item.remaining_uses <= 0 ? "Hết lượt" : "Hết hạn"}
          </Text>
        </View>
      );
    }
    return null;
  };

  const renderVoucherItem = (item: Voucher) => {
    const isValid = isVoucherValid(item);
    const isSelected = value?.id === item.id;

    return (
      <TouchableOpacity
        key={item.id}
        onPress={() => isValid && handleSelect(item)}
        disabled={!isValid}
        style={[
          styles.voucherItem,
          !isValid && styles.disabledVoucher,
          isSelected && styles.selectedVoucher,
        ]}
      >
        <View row spread>
          {/* Left side - Code, Description and Status */}
          <View flex-3>
            <View row centerV marginB-4>
              <Text
                text80
                color={isValid ? Colors.primary : Colors.grey40}
                marginR-8
              >
                {item.code}
              </Text>
              {isSelected && (
                <View style={styles.selectedBadge}>
                  <Text white text90>
                    Đang chọn
                  </Text>
                </View>
              )}
              {renderVoucherStatus(item)}
            </View>
            <Text text90 grey30 numberOfLines={2} marginB-4>
              {item.description}
            </Text>
            <View row centerV>
              <MaterialCommunityIcons
                name="clock-outline"
                size={12}
                color={Colors.grey40}
                style={{ marginRight: 4 }}
              />
              <Text text90 grey40>
                HSD: {formatDate(item.end_date)}
              </Text>
            </View>
          </View>

          {/* Right side - Discount Value */}
          <View flex-2 right>
            <Text text80 color={isValid ? Colors.secondary : Colors.grey40}>
              {item.formatted_discount}
            </Text>
            <Text text90 grey40 marginT-4>
              Còn {item.remaining_uses} lượt
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderContent = () => (
    <View style={styles.dropdownContent}>
      {isLoading ? (
        <View padding-12 center>
          <Text text80 grey30>
            {t("common.loading")}...
          </Text>
        </View>
      ) : items.length === 0 ? (
        <View padding-12 center>
          <Text text80 grey30>
            {t("checkout.no_vouchers_available")}
          </Text>
        </View>
      ) : (
        items.map(renderVoucherItem)
      )}
    </View>
  );

  return (
    <ExpandableSection
      expanded={isOpen}
      sectionHeader={renderHeader()}
      onPress={() => setIsOpen(!isOpen)}
    >
      {renderContent()}
    </ExpandableSection>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.grey60,
  },
  headerSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + "08",
  },
  dropdownContent: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.grey60,
    borderRadius: 8,
    marginTop: 4,
    maxHeight: 300,
  },
  voucherItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey60,
  },
  selectedVoucher: {
    backgroundColor: Colors.primary + "08",
  },
  disabledVoucher: {
    opacity: 0.6,
    backgroundColor: Colors.grey60 + "10",
  },
  statusBadge: {
    backgroundColor: Colors.grey40,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  selectedBadge: {
    backgroundColor: Colors.green30,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 4,
  },
});

export default VoucherDropdown;
