import { PaymentMethod } from "@/app/(app)/check-out";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Colors,
  Text,
  View,
  TouchableOpacity,
  ExpandableSection,
} from "react-native-ui-lib";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLanguage } from "@/hooks/useLanguage";

interface PaymentPickerProps {
  value?: PaymentMethod | null;
  items?: PaymentMethod[];
  onSelect?: (value: PaymentMethod) => void;
}

const presets = {
  container: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    borderWidth: 1,
    paddingVertical: 4,
    borderColor: Colors.border,
  },
  item: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.border,
  },
};

const PaymentPicker = ({ value, items, onSelect }: PaymentPickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();

  const handleSelect = (method: PaymentMethod) => {
    onSelect?.(method);
    setIsOpen(false);
  };

  const renderHeader = () => (
    <TouchableOpacity
      onPress={() => onSelect && setIsOpen(!isOpen)}
      style={presets.container}
    >
      <View row spread centerV padding-12>
        <View row centerV>
          {value && (
            <Ionicons
              name={value.iconName as any}
              size={20}
              color={Colors.primary}
              style={{ marginRight: 8 }}
            />
          )}
          <Text text80 color={value ? Colors.text : Colors.grey30}>
            {value?.name || t("checkout.select_payment_method")}
          </Text>
        </View>
        <MaterialCommunityIcons
          name={isOpen ? "chevron-up" : "chevron-down"}
          size={20}
          color={Colors.grey30}
        />
      </View>
    </TouchableOpacity>
  );

  const renderContent = () => (
    <View marginT-4 style={[presets.container, { overflow: "hidden" }]}>
      {items?.map((method, index) => (
        <TouchableOpacity
          key={method.id}
          onPress={() => handleSelect(method)}
          style={[
            presets.item,
            index === items.length - 1 && { borderBottomWidth: 0 },
          ]}
        >
          <View row spread centerV>
            <View row centerV flex>
              <Ionicons
                name={method.iconName as any}
                size={20}
                color={value?.id === method.id ? Colors.primary : Colors.grey30}
                style={{ marginRight: 8 }}
              />
              <Text
                text80
                color={value?.id === method.id ? Colors.primary : Colors.text}
              >
                {method.name}
              </Text>
            </View>
            {value?.id === method.id && (
              <MaterialCommunityIcons
                name="check-circle"
                size={18}
                color={Colors.primary}
              />
            )}
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <ExpandableSection expanded={isOpen} sectionHeader={renderHeader()}>
      {renderContent()}
    </ExpandableSection>
  );
};

export default PaymentPicker;
