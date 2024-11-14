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
import {View, Text, TouchableOpacity, TextField, Colors} from "react-native-ui-lib";
import { Calendar } from "react-native-calendars";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import moment from "moment";
import AppButton from "@/components/buttons/AppButton";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
  getTimeSlots,
  createBooking,
} from "@/redux/features/booking/bookingThunk";
import { resetBookingState } from "@/redux/features/booking/bookingSlice";
import Octicons from "@expo/vector-icons/Octicons";
import { User } from "@/types/user.type";

import AppDialog from "@/components/dialog/AppDialog";


const BookingPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { timeSlots, loading, error, bookingSuccess } = useSelector(
    (state: RootState) => state.booking
  );
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
  const [timeString, setTimeString] = useState<string>("");
  const [slot, setSlot] = useState<number>(0);
  const [success, setSuccess] = useState<boolean>(false);

  const [dialogVisible, setDialogVisible] = useState<boolean>(false);
  const [dialogTitle, setDialogTitle] = useState<string>("");
  const [dialogDescription, setDialogDescription] = useState<string>("");



  const handleDayPress = (day: any) => {
    setSelectedDate(day.dateString);
  };

  useEffect(() => {
    dispatch(getTimeSlots(selectedDate));
  }, [selectedDate, dispatch]);

  useMemo(() => {
    timeSlots.filter((item: any) => {
      if (item.id === selectedTime) {
        return setTimeString(item.start_time + " - " + item.end_time);
      }
    });
  }, [selectedTime]);

  const handleShowModal = () => {
    if (selectedDate === "") {
      setDialogTitle(i18n.t("service.error"));
      setDialogDescription(i18n.t("service.plase_select_date"));
      setDialogVisible(true);
      return;
    }
    if (selectedTime === undefined) {
      setDialogTitle(i18n.t("service.error"));
      setDialogDescription(i18n.t("service.plase_select_time"));
      setDialogVisible(true);
      return;
    }
    if (slot === 0) {
      setDialogTitle(i18n.t("service.error"));
      setDialogDescription(i18n.t("service.minimum_slot_error"));
      setDialogVisible(true);
      return;
    }
    setShowModal(true);
  };

  const handleBooking = async () => {
    const bookingData = {
      service_id: Number(service_id),
      staff_id: null,
      slots: Number(slot),
      appointment_date: selectedDate,
      time_slot_id: Number(selectedTime),
      appointment_type: "consultation",
      status: "pending",
      note: note === "" ? "Không có ghi chú" : note,
    };

    try {
      await dispatch(createBooking(bookingData));
    } catch (error) {
      setDialogTitle(i18n.t("service.error"));
      setDialogDescription(error.message);
      setDialogVisible(true);
    }
  };

  useEffect(() => {
    if (bookingSuccess) {
      setShowModal(false);
      setSuccess(true);
      dispatch(resetBookingState());
    }
    if (error) {
      setDialogTitle(i18n.t("service.error"));
      setDialogDescription(error.message);
      setDialogVisible(true);
      dispatch(resetBookingState());
    }
  }, [bookingSuccess, error, dispatch]);

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
            Còn trống {time.available_slots} chỗ
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  // @ts-ignore
  return (
    <View style={{ flex: 1 }}>
      <View flex bg-$white>
        <AppBar back title={i18n.t("service.make_appointment")} />
        <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}>
          <View style={{ flex: 1, paddingHorizontal: 24 }}>
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
                    disabled={
                      timeSlots.find((item: any) => item.id === selectedTime)
                        ?.available_slots === 1
                    }
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
                <View style={styles.noteContainer}>
                  <Text style={styles.noteTitle}>{i18n.t("service.note")}</Text>
                  <TextField
                      value={note}
                      onChangeText={(text) => setNote(text)}
                      placeholder={i18n.t("service.enter_content").toString()}
                      placeholderTextColor="#8C8585"
                      multiline
                      numberOfLines={10}
                      style={styles.enhancedNoteInput}
                  />
                </View>
            )}

            <View style={{ paddingVertical: 20 }}>
              <AppButton
                  title={i18n.t("service.continue")}
                  type="primary"
                  onPress={() => {
                    handleShowModal();
                  }}
              />
            </View>
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
            <View style={styles.iconContainer}>
              <MaterialIcons name="info" size={48} color={Colors.primary} />
            </View>
            <Text style={styles.modalTitle}>
              {i18n.t("service.confirm_information")}
            </Text>
            <View style={styles.iconContainer}>
              <Octicons name="checklist" size={44} color="#717658" />
            </View>
            <View style={styles.modalTextContainer}>
              <Text style={styles.modalText}>
                {i18n.t("service.customer_name")}: <Text style={styles.modalTextBold}>{user.full_name}</Text>
              </Text>
              <Text style={styles.modalText}>
                {i18n.t("service.service_name")}: <Text style={styles.modalTextBold}>{service_name}</Text>
              </Text>
              <Text style={styles.modalText}>
                {i18n.t("service.time")}: <Text style={styles.modalTextBold}>{timeString}</Text>
              </Text>
              <Text style={styles.modalText}>
                {i18n.t("service.date")}: <Text style={styles.modalTextBold}>{moment(selectedDate).format("DD/MM/YYYY")}</Text>
              </Text>
              <Text style={styles.modalText}>
                {i18n.t("service.note")}: <Text style={styles.modalTextBold}>{note === "" ? i18n.t("service.no_notes") : note}</Text>
              </Text>
            </View>
            <View style={styles.buttonContainer}>
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
            <View style={styles.iconContainer}>
              <MaterialIcons name="done" size={64} color={Colors.primary} />
            </View>
            <Text style={styles.successTitle}>
              {i18n.t("service.appointment_successful")}
            </Text>
            <View style={styles.buttonContainer2}>
              <AppButton
                  title={i18n.t("service.back_to_home")}
                  type="primary"
                  onPress={() => {
                    router.push("/(tabs)");
                    setSuccess(false);
                  }}
                  buttonStyle={styles.primaryButton2}
              />
              <AppButton
                  title={i18n.t("service.make_appointment")}
                  type="outline"
                  onPress={() => {
                   router.push("/(app)/(tabs)/appointment");
                    setSuccess(false);
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
    alignItems: "center",
  },
  iconContainer: {
    marginBottom: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: Colors.text,
  },
  modalTextContainer: {
    marginBottom: 20,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 5,
  },
  modalTextBold: {
    fontWeight: "bold",
  },
  buttonContainer: {
    width: "100%",
    marginTop: 20,
    paddingHorizontal: 20,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  primaryButton: {
    flex: 1,
    marginRight: 10,
  },
  outlineButton: {
    flex: 1,
    marginLeft: 10,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: Colors.text,
  },
  centeredButtonContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginTop: 20,
  },
  primaryButton2: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    textAlign: "center",
  },

  noteContainer: {
    marginBottom: 20,
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#000",
  },
  noteInput: {
    borderWidth: 1,
    borderColor: "#D9D9D9",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 15,
    textAlignVertical: "top",
    height: 200,
    backgroundColor: "#F9FAFB",
  },
  enhancedNoteInput: {
    borderWidth: 1,
    borderColor: "#D9D9D9",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 15,
    textAlignVertical: "top",
    height: 200,
    backgroundColor: "#F9FAFB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonContainer2: {
    width: "100%",
    marginTop: 20,
    paddingHorizontal: 20,
    marginBottom: 10,
  }
});

export default BookingPage;
