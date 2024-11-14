import { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  ScrollView,
  Modal,
} from "react-native";
import AppBar from "@/components/app-bar/AppBar";
import i18n from "@/languages/i18n";
import { router, useLocalSearchParams } from "expo-router";
import { View, Text, TouchableOpacity, TextField } from "react-native-ui-lib";
import { Calendar } from "react-native-calendars";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import moment from "moment";
import AppButton from "@/components/buttons/AppButton";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import AxiosInstance from "@/utils/services/helper/axiosInstance";
import { User } from "@/types/user.type";
import Octicons from "@expo/vector-icons/Octicons";

const BookingPage = () => {
  const user: User = useSelector((state: RootState) => state.auth.user);
  const windowWidth = Dimensions.get("window").width;
  const padding = 24;
  const gap = 24;
  const numColumns = 2;
  const itemWidth = (windowWidth - padding * 2 - gap) / numColumns;

  const { service_id, service_name } = useLocalSearchParams();
  const [today] = useState(moment().format("YYYY-MM-DD"));
  const [maxDate] = useState(moment().add(1, "year").format("YYYY-MM-DD"));
  const [selectedDate, setSelectedDate] = useState<string>(today.toString());
  const [selectedTime, setSelectedTime] = useState<number>();
  const [note, setNote] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [timeSlots, setTimeSlots] = useState([]);
  const [timeString, setTimeString] = useState<string>("");
  const [slot, setSlot] = useState<number>(0);
  const [success, setSuccess] = useState<boolean>(false);

  const handleDayPress = (day: any) => {
    setSelectedDate(day.dateString);
  };

  useEffect(() => {
    const getTimeSlots = async () => {
      try {
        const res = await AxiosInstance().get(
          `time-slots/available?date=${selectedDate}`
        );
        const data = res?.data.data;
        setTimeSlots(data);
      } catch (error: any) {
        console.log("Get time slots error", error.data);
      }
    };
    getTimeSlots();
  }, [selectedDate]);

  useMemo(() => {
    timeSlots.filter((item: any) => {
      if (item.id === selectedTime) {
        return setTimeString(item.start_time + " - " + item.end_time);
      }
    });
  }, [selectedTime]);

  const handleShowModal = () => {
    if (selectedDate === "") return alert(i18n.t("service.plase_select_date"));
    if (selectedTime === undefined)
      return alert(i18n.t("service.plase_select_time"));
    setShowModal(true);
  };
  const handleBooking = async () => {
    try {
      const body = {
        user_id: user?.id,
        service_id: Number(service_id),
        staff_id: null,
        slots: Number(slot),
        appointment_date: selectedDate,
        time_slot_id: Number(selectedTime),
        appointment_type: "consultation",
        status: "pending",
        note: note === "" ? "Không có ghi chú" : note,
      };

      const res = await AxiosInstance().post("/appointments", body);

      if (res?.data?.status === 422) {
        alert(res.data.message);
        return;
      }

      if (res?.status === 200 || res?.status === 201) {
        setShowModal(false);
        setSuccess(true);
      }
    } catch (error: any) {
      // Xử lý lỗi chi tiết hơn
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Có lỗi xảy ra khi đặt lịch";

      console.log("Booking error:", {
        message: errorMessage,
        details: error.response?.data,
      });

      alert(errorMessage);
    }
  };
  const renderTimeSlot = (time: any) => {
    return (
      <TouchableOpacity
        key={time.id}
        onPress={() => setSelectedTime(time.id)}
        style={styles.timeSlotContainer}
        disabled={!time.available}
      >
        <View
          backgroundColor={selectedTime === time.id ? "#717658" : "#F9FAFB"}
          center
          width={itemWidth}
          style={[
            styles.timeSlot,
            selectedTime === time.id && styles.selectedTimeSlot,
          ]}
        >
          <Text
            color={selectedTime === time.id ? "#FFFFFF" : "#6B7280"}
            style={styles.timeText}
          >
            {`${time.start_time.substring(0, 5)} - ${time.end_time.substring(
              0,
              5
            )}`}
          </Text>
          <Text color={selectedTime === time.id ? "#F9FAFB" : "#000000"}>
            Còn trống {time.max_bookings} chỗ
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <View flex bg-$white>
        <AppBar back title={i18n.t("service.make_appointment")} />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View paddingH-24 gap-24>
            <View style={styles.calendarContainer}>
              <Calendar
                current={today}
                renderArrow={(direction: any) => {
                  if (direction === "left") {
                    return (
                      <MaterialIcons
                        name="arrow-back-ios-new"
                        size={20}
                        color="#717658"
                      />
                    );
                  }
                  return (
                    <MaterialIcons
                      name="arrow-forward-ios"
                      size={20}
                      color="#717658"
                    />
                  );
                }}
                theme={{
                  ...calendarTheme,
                  "stylesheet.calendar.header": {
                    header: {
                      flexDirection: "row",
                      justifyContent: "space-between",
                      paddingHorizontal: 10,
                      paddingVertical: 12,
                      alignItems: "center",
                    },
                    monthText: {
                      fontSize: 18,
                      fontWeight: "600",
                      color: "#000000",
                    },
                  },
                  "stylesheet.day.basic": {
                    base: {
                      width: 40,
                      height: 40,
                      alignItems: "center",
                      justifyContent: "center",
                    },
                    text: {
                      fontSize: 16,
                      fontWeight: "400",
                    },
                  },
                }}
                minDate={today}
                maxDate={maxDate}
                onDayPress={handleDayPress}
                markedDates={{
                  [selectedDate]: {
                    selected: true,
                    disableTouchEvent: true,
                    selectedColor: "#717658",
                    borderRadius: 8,
                  },
                  [today]: {
                    marked: true,
                    selected: today,
                    dotColor: "white",
                    borderWidth: 1,
                    borderColor: "#717658",
                  },
                }}
                enableSwipeMonths={true}
                firstDay={1}
                hideExtraDays={false}
              />
            </View>

            {timeSlots.length > 0 && (
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>
                  {i18n.t("service.select_time")}
                </Text>
                <View marginT-16>
                  <FlatList
                    scrollEnabled={false}
                    data={timeSlots}
                    renderItem={({ item }) => renderTimeSlot(item)}
                    keyExtractor={(item: any) => item.id.toString()}
                    numColumns={numColumns}
                    columnWrapperStyle={styles.timeSlotRow}
                    contentContainerStyle={{ gap: 12 }}
                    nestedScrollEnabled
                  />
                </View>
              </View>
            )}

            {selectedTime && (
              <View gap-10>
                <Text style={styles.sectionTitle}>
                  {i18n.t("service.select_seat")}
                </Text>
                <View gap-12 row flex>
                  <TouchableOpacity
                    onPress={() => setSlot(1)}
                    style={styles.timeSlotContainer}
                  >
                    <View
                      center
                      backgroundColor={slot == 1 ? "#717658" : "#F9FAFB"}
                      style={styles.timeSlot}
                    >
                      <Text color={slot == 1 ? "#FFFFFF" : "#000000"}>
                        {i18n.t("service.1_seat")}
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setSlot(2)}
                    style={styles.timeSlotContainer}
                  >
                    <View
                      center
                      backgroundColor={slot == 2 ? "#717658" : "#F9FAFB"}
                      style={styles.timeSlot}
                    >
                      <Text color={slot == 2 ? "#FFFFFF" : "#000000"}>
                        {i18n.t("service.2_seat")}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {slot != 0 && (
              <View>
                <Text h2_bold>{i18n.t("service.note")}</Text>
                <TextField
                  value={note}
                  onChangeText={(text) => setNote(text)}
                  placeholder={i18n.t("service.enter_content").toString()}
                  placeholderTextColor="#8C8585"
                  multiline
                  numberOfLines={10}
                  marginT-20
                  style={{
                    borderWidth: 1,
                    borderColor: "#D9D9D9",
                    borderRadius: 10,
                    paddingHorizontal: 10,
                    paddingVertical: 10,
                    textAlignVertical: "top",
                    height: 200,
                  }}
                />
              </View>
            )}

            <AppButton
              title={i18n.t("service.continue")}
              type="primary"
              onPress={() => {
                handleShowModal();
              }}
            />
          </View>
        </ScrollView>
      </View>
      <Modal
        visible={showModal}
        transparent
        onRequestClose={() => setShowModal(false)}
        style={styles.modal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View flex gap-12>
              <Text h1_bold center>
                {i18n.t("service.confirm_information")}
              </Text>
              <View center>
                <Octicons name="checklist" size={44} color="#717658" />
              </View>
              <View gap-5>
                <Text h2>
                  {i18n.t("service.customer_name")}:
                  <Text h2_bold> {user.full_name}</Text>
                </Text>
                <Text h2>
                  {i18n.t("service.service_name")}:
                  <Text h2_bold> {service_name}</Text>
                </Text>
                <Text h2>
                  {i18n.t("service.time")}:<Text h2_bold> {timeString}</Text>
                </Text>
                <Text h2>
                  {i18n.t("service.date")}:{" "}
                  <Text h2_bold>
                    {" "}
                    {moment(selectedDate).format("DD/MM/YYYY")}
                  </Text>
                </Text>
                <Text h2>
                  {i18n.t("service.note")}:{" "}
                  <Text h2_bold>
                    {" "}
                    {note === "" ? i18n.t("service.no_notes") : note}
                  </Text>
                </Text>
              </View>
            </View>
            <View gap-12 marginT-20>
              <AppButton
                title={i18n.t("service.agree")}
                type="primary"
                onPress={() => {
                  handleBooking();
                }}
              />
              <AppButton
                title={i18n.t("service.cancel")}
                type="outline"
                onPress={() => {
                  setShowModal(false);
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
      <Modal visible={success} transparent style={styles.modal}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View flex gap-12>
              <Text h1_bold center>
                {i18n.t("service.appointment_successful")}
              </Text>
              <View center>
                <MaterialIcons name="done" size={64} color="black" />
              </View>
            </View>
            <View gap-12 marginT-20>
              <AppButton
                title={i18n.t("service.back_to_home")}
                type="primary"
                onPress={() => {
                  router.replace("/(tabs)");
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const calendarTheme = {
  calendarBackground: "#FFFFFF",
  textSectionTitleColor: "#6B7280",
  selectedDayBackgroundColor: "#717658",
  selectedDayTextColor: "#ffffff",
  todayTextColor: "#717658",
  dayTextColor: "#2d4150",
  textDisabledColor: "#d9e1e8",
  dotColor: "#717658",
  selectedDotColor: "#ffffff",
  arrowColor: "#717658",
  monthTextColor: "#000000",
  textDayFontWeight: "400",
  textMonthFontWeight: "600",
  textDayHeaderFontWeight: "600",
  textDayFontSize: 16,
  textMonthFontSize: 18,
  textDayHeaderFontSize: 14,
};

const styles = StyleSheet.create({
  calendarContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    padding: 12,
  },
  sectionContainer: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 4,
  },
  timeSlotContainer: {
    flex: 1,
    paddingBottom: 5,
  },
  timeSlot: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    paddingVertical: 5,
    gap: 5,
  },
  selectedTimeSlot: {
    borderColor: "#717658",
  },
  timeText: {
    fontSize: 15,
    fontWeight: "500",
  },
  timeSlotRow: {
    justifyContent: "space-between",
  },
  modal: {
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    height: "50%",
  },
});

export default BookingPage;
