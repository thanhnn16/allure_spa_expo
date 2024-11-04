import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Dimensions, SafeAreaView, ScrollView } from "react-native";
import AppBar from "@/components/app-bar/AppBar";
import i18n from "@/languages/i18n";
import { router, useLocalSearchParams } from "expo-router";
import {
  View,
  Text,
  TouchableOpacity,
  GridList,
  Spacings,
  TextField,
  Modal,
} from "react-native-ui-lib";
import { Calendar } from "react-native-calendars";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import moment from "moment";
import AppButton from "@/components/buttons/AppButton";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import AxiosInstance from "@/utils/services/helper/AxiosInstance";

const BookingPage = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const windowWidth = Dimensions.get("window").width;
  const padding = 24;
  const gap = 24;
  const numColumns = 2;
  const itemWidth = (windowWidth - padding * 2 - gap) / numColumns;

  const { service_id, combo_id } = useLocalSearchParams();
  const [today] = useState(moment().format("YYYY-MM-DD"));
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState();
  const [note, setNote] = useState<string>("")
  const [showModal, setShowModal] = useState<boolean>(false);

  const handleDayPress = (day: any) => {
    setSelectedDate(day.dateString);
  };

  const renderTimeSlot = (time: any) => {
    return (
      <TouchableOpacity
        key={time.id}
        onPress={() => setSelectedTime(time.id)}
        style={styles.timeSlotContainer}
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
            {`${time.start_time} - ${time.end_time}`}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const handleBooking = async () => {
    try {
      if (selectedDate === "") return alert(i18n.t("service.plase_select_date"));
      if (selectedTime === undefined) return alert(i18n.t("service.plase_select_time"));

      const body = {
        user_id: user?.id,
        service_id: service_id,
        staff_id: 1,
        appointment_date: moment(selectedDate).format("DD-MM-YYYY"),
        time_slot_id: selectedTime,
        appointment_type: "consultation",
        status: "pending",
        note: note === "" ? "Không có ghi chú" : note
      }
      console.log(body);
      const res = await AxiosInstance().post("/appointments", body);
      if (res.status === 200) {
        alert(i18n.t("service.appointment_successful"));
        router.replace("/(tabs)");
      }
    } catch (error: any) {
      console.log("Booking error", error);
    }
  }


  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View flex bg-$white >
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
                maxDate={"2050-12-31"}
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
                    selected: selectedDate === today,
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

            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>
                {i18n.t("service.select_time")}
              </Text>
              <View marginT-16>
                <FlatList
                  scrollEnabled={false}
                  data={times}
                  renderItem={({ item }) => renderTimeSlot(item)}
                  keyExtractor={(item) => item.id.toString()}
                  numColumns={numColumns}
                  columnWrapperStyle={styles.timeSlotRow}
                  contentContainerStyle={{ gap: 12 }}
                  nestedScrollEnabled
                />

              </View>
            </View>

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
                }}
              />
            </View>

            <AppButton
              title={i18n.t("service.continue")}
              type="primary"
              onPress={() => { handleBooking() }}
            />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
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
    paddingBottom: 5
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
    height: 30
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
});

var times = [
  { id: 1, start_time: "08:00", end_time: "09:00" },
  { id: 2, start_time: "09:00", end_time: "10:00" },
  { id: 3, start_time: "10:00", end_time: "11:00" },
  { id: 4, start_time: "11:00", end_time: "12:00" },
  { id: 5, start_time: "12:00", end_time: "13:00" },
  { id: 6, start_time: "13:00", end_time: "14:00" },
  { id: 7, start_time: "14:00", end_time: "15:00" },
  { id: 8, start_time: "15:00", end_time: "16:00" },
  { id: 9, start_time: "16:00", end_time: "17:00" },
  { id: 10, start_time: "17:00", end_time: "18:00" },
];

export default BookingPage;
