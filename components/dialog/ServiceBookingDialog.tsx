import { Dialog, Text, View } from "react-native-ui-lib";
import Colors from "@/constants/Colors";
import { useLanguage } from "@/hooks/useLanguage";
import AppButton from "../buttons/AppButton";
import React from "react";
import { Dimensions, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import formatCurrency from "@/utils/price/formatCurrency";

interface ServiceBookingDialogProps {
  visible: boolean;
  title: string;
  description?: string;
  closeButton?: boolean;
  confirmButton?: boolean;
  secondaryConfirmButton?: boolean;
  secondaryConfirmButtonLabel?: string;
  closeButtonLabel?: string;
  confirmButtonLabel?: string;
  onClose?: () => void;
  onConfirm?: () => void;
  onConfrimSecondary?: () => void;
  severity: "success" | "error" | "info" | "warning";
  loading?: boolean;
  children?: React.ReactNode;
  showActionSheet: boolean;
  setShowActionSheet: (visible: boolean) => void;
  setCombo: (combo: number) => void;
  price?: number;
  singlePrice?: number;
  combo5Price?: number;
  combo10Price?: number;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const ServiceBookingDialog = ({
  visible,
  onClose,
  onConfirm,
  onConfrimSecondary,
  title,
  loading = false,
  setCombo,
  singlePrice,
  combo5Price,
  combo10Price,
}: ServiceBookingDialogProps) => {
  const { t } = useLanguage();
  const [selectedCombo, setSelectedCombo] = React.useState(0);

  const handleComboSelect = (comboType: number) => {
    setSelectedCombo(comboType);
    setCombo(comboType);
  };

  return (
    <Dialog
      useSafeArea
      visible={visible}
      onDismiss={onClose}
      width={SCREEN_WIDTH * 0.9}
      height={SCREEN_HEIGHT * 0.65}
      containerStyle={{
        backgroundColor: Colors.white,
        borderRadius: 12,
        paddingBottom: 20,
      }}
      ignoreBackgroundPress={false}
    >
      <View>
        {/* Header */}
        <View paddingH-20 paddingT-20 marginB-10>
          <Text h2 center color={Colors.textColor}>
            {title}
          </Text>
        </View>

        {/* Single Booking Option */}
        <View paddingH-20>
          <TouchableOpacity onPress={() => handleComboSelect(0)}>
            <View
              marginB-15
              style={{
                borderWidth: 1,
                borderColor:
                  selectedCombo === 0 ? Colors.primary : Colors.grey60,
                borderRadius: 12,
                padding: 15,
                backgroundColor:
                  selectedCombo === 0 ? Colors.primary + "10" : Colors.white,
              }}
            >
              <View row centerV spread>
                <View flex>
                  <View row centerV spread>
                    <View row centerV>
                      <Text h3_bold color={Colors.textColor}>
                        Đặt một buổi
                      </Text>
                      <Text h3_bold color={Colors.textColor}>
                        {" "}
                        ({formatCurrency({ price: singlePrice || 0 })})
                      </Text>
                    </View>
                    {selectedCombo === 0 && (
                      <Ionicons
                        name="checkmark-circle"
                        size={24}
                        color={Colors.primary}
                      />
                    )}
                  </View>
                  <Text text13 red marginT-5>
                    Không áp dụng ưu đãi
                  </Text>
                  <Text text12 grey30 marginT-5>
                    Thanh toán trực tiếp tại Spa
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>

          {/* Combo 5 */}
          <TouchableOpacity onPress={() => handleComboSelect(1)}>
            <View
              marginB-15
              style={{
                borderWidth: 1,
                borderColor:
                  selectedCombo === 1 ? Colors.primary : Colors.grey60,
                borderRadius: 12,
                padding: 15,
                backgroundColor:
                  selectedCombo === 1 ? Colors.primary + "10" : Colors.white,
              }}
            >
              <View row centerV spread>
                <View flex>
                  <View row centerV spread>
                    <View row centerV>
                      <Text h3_bold color={Colors.primary}>
                        Combo 5 buổi 🎁
                      </Text>
                      <Text h3_bold color={Colors.primary}>
                        {" "}
                        ({formatCurrency({ price: combo5Price || 0 })})
                      </Text>
                    </View>
                    {selectedCombo === 1 && (
                      <Ionicons
                        name="checkmark-circle"
                        size={24}
                        color={Colors.primary}
                      />
                    )}
                  </View>
                  <Text text13 style={{ color: "#FF6B00" }} marginT-5 bold>
                    Tiết kiệm 20% + 1 buổi free (6 buổi)
                  </Text>
                  <Text text12 green10 marginT-5>
                    Thanh toán online - Sử dụng linh hoạt
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>

          {/* Combo 10 */}
          <TouchableOpacity onPress={() => handleComboSelect(2)}>
            <View
              style={{
                borderWidth: 1,
                borderColor:
                  selectedCombo === 2 ? Colors.primary : Colors.grey60,
                borderRadius: 12,
                padding: 15,
                backgroundColor:
                  selectedCombo === 2 ? Colors.primary + "10" : Colors.white,
              }}
            >
              <View row centerV spread>
                <View flex>
                  <View row centerV spread>
                    <View row centerV>
                      <Text h3_bold color={Colors.primary}>
                        Combo 10 buổi 🎁
                      </Text>
                      <Text h3_bold color={Colors.primary}>
                        {" "}
                        ({formatCurrency({ price: combo10Price || 0 })})
                      </Text>
                    </View>
                    {selectedCombo === 2 && (
                      <Ionicons
                        name="checkmark-circle"
                        size={24}
                        color={Colors.primary}
                      />
                    )}
                  </View>
                  <Text text13 style={{ color: "#FF6B00" }} marginT-5 bold>
                    Tiết kiệm 30% + 3 buổi free (13 buổi)
                  </Text>
                  <Text text12 green10 marginT-5>
                    Thanh toán online - Sử dụng linh hoạt
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Action Buttons */}
        <View paddingH-20 marginT-10>
          <AppButton
            title={selectedCombo > 0 ? "Mua combo ngay" : "Đặt một buổi"}
            onPress={selectedCombo > 0 ? onConfrimSecondary : onConfirm}
            type="primary"
            loading={loading}
            marginB-10
          />
          <AppButton title="Đóng" onPress={onClose} type="text" />
        </View>
      </View>
    </Dialog>
  );
};

export default ServiceBookingDialog;
