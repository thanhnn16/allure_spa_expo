import { useEffect, useMemo, useState } from "react";
import { FlatList, Dimensions, Modal } from "react-native";
import AppBar from "@/components/app-bar/AppBar";
import i18n from "@/languages/i18n";
import { router, useLocalSearchParams } from "expo-router";
import {
  View,
  Text,
  TouchableOpacity,
  Colors,
  Card,
  TextArea,
} from "react-native-ui-lib";
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
import { BookingPayload } from "@/types/appointment.type";
import { updateAppointment } from "@/redux/features/appointment/appointmentThunk";
import Animated, { withSpring, useSharedValue } from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { FadeIn } from "react-native-reanimated";

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

  const fadeAnim = useSharedValue(0);

  useEffect(() => {
    fadeAnim.value = withSpring(1, {
      damping: 15,
      stiffness: 100,
    });
  }, []);

  const handleDayPress = (day: any) => {
    setSelectedDate(day.dateString.toString());
  };

  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [showUpdateModal, setShowUpdateModal] = useState<boolean>(false);

  const {
    service_id,
    service_name,
    package_id,
    edit_mode,
    appointment_id,
    note: initialNote = "",
    date: initialDate = "",
    time_slot_id: initialTimeSlotId,
    slots: initialSlots,
  } = useLocalSearchParams();
  useEffect(() => {
    if (edit_mode === "true") {
      setNote(initialNote.toString());
      setSelectedDate(initialDate.toString());
      setSelectedTime(Number(initialTimeSlotId));
      setSlot(Number(initialSlots));
    }
    if (initialDate) {
      setSelectedDate(moment(initialDate).format("YYYY-MM-DD").toString());
    }
  }, [edit_mode, initialNote, initialDate, initialTimeSlotId, initialSlots]);

  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
    if (
      note !== initialNote ||
      selectedDate !== initialDate ||
      selectedTime !== Number(initialTimeSlotId) ||
      slot !== Number(initialSlots)
    ) {
      setIsChanged(true);
    } else {
      setIsChanged(false);
    }
  }, [
    note,
    selectedDate,
    selectedTime,
    slot,
    initialNote,
    initialDate,
    initialTimeSlotId,
    initialSlots,
  ]);

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
    const bookingData: BookingPayload = {
      user_id: user.id,
      staff_id: null,
      service_id: Number(service_id),
      slots: Number(slot),
      appointment_date: selectedDate,
      status: "pending",
      time_slot_id: Number(selectedTime),
      appointment_type: package_id ? "service_package" : "service",
      ...(package_id && { user_service_package_id: Number(package_id) }),
      note: note === "" ? "Không có ghi chú" : note,
    };

    try {
      await dispatch(createBooking(bookingData));
      setShowConfirmModal(true); // Show confirm modal
      setSuccess(true); // Set success state to true upon successful booking
    } catch (error: any) {
      setDialogTitle(i18n.t("service.error"));
      setDialogDescription(error.message);
      setDialogVisible(true);
    }
  };

  const handleUpdate = async () => {
    const bookingData: BookingPayload = {
      user_id: user.id,
      staff_id: null,
      service_id: Number(service_id),
      slots: Number(slot),
      appointment_date: selectedDate,
      status: "pending",
      time_slot_id: Number(selectedTime),
      appointment_type: package_id ? "service_package" : "service",
      ...(package_id && { user_service_package_id: Number(package_id) }),
      note: note === "" ? "Không có ghi chú" : note,
    };

    try {
      if (appointment_id) {
        await dispatch(
          updateAppointment({ ...bookingData, id: appointment_id })
        );
        setShowUpdateModal(true); // Show update modal
        setSuccess(true); // Set success state to true upon successful update
      }
    } catch (error: any) {
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
      <Animated.View
        entering={FadeIn.duration(500).delay(time.id * 100)}
        style={{
          transform: [{ scale: fadeAnim }],
        }}
      >
        <TouchableOpacity
          key={time.id}
          onPress={() => {
            setSelectedTime(time.id);
            Haptics.selectionAsync();
          }}
          disabled={!time.available}
        >
          <Card
            flex
            center
            enableShadow
            br40
            padding-16
            marginB-8
            style={{
              opacity: !time.available ? 0.5 : 1,
              backgroundColor:
                selectedTime === time.id
                  ? Colors.$backgroundPrimaryHeavy
                  : Colors.$backgroundNeutralLight,
            }}
          >
            <Text
              $textDefault={selectedTime !== time.id}
              $textPrimary={selectedTime === time.id}
              text70BO
            >
              {`${time.start_time.substring(0, 5)} - ${time.end_time.substring(
                0,
                5
              )}`}
            </Text>

            <View row centerV marginT-8>
              <Octicons
                name="person"
                size={16}
                color={
                  selectedTime === time.id
                    ? Colors.$textDefaultLight
                    : Colors.$textNeutral
                }
              />
              <Text marginL-8 text80>
                {time.available_slots} {i18n.t("service.available")}
              </Text>
            </View>
          </Card>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View flex bg-white>
      <AppBar back title={i18n.t("service.make_appointment")} />
      <View flex>
        <Animated.ScrollView
          entering={FadeIn.duration(500)}
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: 40,
          }}
        >
          <View flex padding-24>
            <Card
              flex
              padding-16
              marginT-16
              bg-$backgroundDefault
              br40
              enableShadow
            >
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
            </Card>

            {timeSlots.length > 0 && (
              <View marginT-20 marginB-20>
                <Text text60BO $textDefault marginB-10>
                  {i18n.t("service.select_time")}
                </Text>
                <View marginT-16>
                  <FlatList
                    scrollEnabled={false}
                    data={timeSlots}
                    renderItem={({ item }) => renderTimeSlot(item)}
                    keyExtractor={(item: any) => item.id.toString()}
                    numColumns={numColumns}
                    contentContainerStyle={{ gap: 12 }}
                    nestedScrollEnabled
                  />
                </View>
              </View>
            )}

            {selectedTime && (
              <View>
                <Text text60BO $textDefault marginB-10>
                  {i18n.t("service.select_seat")}
                </Text>
                <View row spread marginT-12>
                  <TouchableOpacity flex-1 marginR-6 onPress={() => setSlot(1)}>
                    <View
                      center
                      padding-16
                      br20
                      bg-$backgroundPrimaryHeavy={slot === 1}
                      bg-$backgroundNeutralLight={slot !== 1}
                    >
                      <Text $textDefault={slot !== 1} $textPrimary={slot === 1}>
                        {i18n.t("service.1_seat")}
                      </Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    flex-1
                    marginL-6
                    onPress={() => setSlot(2)}
                    disabled={
                      timeSlots.find((item: any) => item.id === selectedTime)
                        ?.available_slots === 1
                    }
                  >
                    <View
                      center
                      padding-16
                      br20
                      bg-$backgroundPrimaryHeavy={slot === 2}
                      bg-$backgroundNeutralLight={slot !== 2}
                      style={{
                        opacity:
                          timeSlots.find(
                            (item: any) => item.id === selectedTime
                          )?.available_slots === 1
                            ? 0.5
                            : 1,
                      }}
                    >
                      <Text $textDefault={slot !== 2} $textPrimary={slot === 2}>
                        {i18n.t("service.2_seat")}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {slot !== 0 && (
              <View marginT-20>
                <Text text60BO $textDefault marginB-12>
                  {i18n.t("service.note")}
                </Text>
                <TextArea
                  value={note}
                  onChangeText={setNote}
                  placeholder={i18n.t("service.enter_content")}
                  multiline
                  numberOfLines={5}
                  maxLength={200}
                  br20
                  bg-$backgroundNeutralLight
                  padding-16
                  style={{
                    height: 120,
                    textAlignVertical: "top",
                  }}
                />
                <View marginT-20>
                  <AppButton
                    title={i18n.t("service.continue")}
                    type="primary"
                    onPress={handleShowModal}
                  />
                </View>
              </View>
            )}
          </View>
        </Animated.ScrollView>

        {isChanged && (
          <View absB absR padding-20>
            <TouchableOpacity
              onPress={handleShowModal}
              bg-$backgroundPrimaryHeavy
              padding-16
              br30
            >
              <MaterialIcons
                name="check"
                size={24}
                color={Colors.$iconDefaultLight}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>

      <Modal visible={showModal} transparent animationType="slide">
        <View flex center bg-$backgroundDefault>
          <Card padding-20 width="80%" br20>
            <View center marginB-20>
              <MaterialIcons name="info" size={48} color={Colors.primary} />
            </View>
            <Text text60BO center marginB-10>
              {edit_mode === "true"
                ? i18n.t("service.update_information")
                : i18n.t("service.confirm_information")}
            </Text>

            <View marginB-20>
              <Text text70 marginB-5>
                {i18n.t("service.customer_name")}:{" "}
                <Text text70BO>{user.full_name}</Text>
              </Text>
              <Text text70 marginB-5>
                {i18n.t("service.service_name")}:{" "}
                <Text text70BO>{service_name}</Text>
              </Text>
              <Text text70 marginB-5>
                {i18n.t("service.time")}: <Text text70BO>{timeString}</Text>
              </Text>
              <Text text70 marginB-5>
                {i18n.t("service.date")}:{" "}
                <Text text70BO>
                  {moment(selectedDate).format("DD/MM/YYYY")}
                </Text>
              </Text>
              <Text text70 marginB-5>
                {i18n.t("service.note")}: <Text text70BO>{note}</Text>
              </Text>
            </View>
            <View row spread marginT-20 paddingH-20 marginB-10>
              <AppButton
                title={i18n.t("service.agree")}
                type="primary"
                onPress={() => {
                  if (edit_mode === "true") {
                    handleUpdate();
                  } else {
                    handleBooking();
                  }
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
          </Card>
        </View>
      </Modal>

      <Modal visible={showConfirmModal} transparent>
        <View flex center bg-$backgroundDefault>
          <Card padding-20 width="80%" br20>
            <View center marginB-20>
              <MaterialIcons name="done" size={64} color={Colors.primary} />
            </View>
            <Text text60BO center marginB-20>
              {i18n.t("service.confirm_information")}
            </Text>
            <View paddingH-20 marginB-10>
              <AppButton
                title={i18n.t("service.back_to_home")}
                type="primary"
                marginB-10
                onPress={() => {
                  setShowConfirmModal(false);
                  router.push("/home");
                }}
              />
              <AppButton
                title={i18n.t("service.view_appointments")}
                type="outline"
                onPress={() => {
                  setShowConfirmModal(false);
                  router.push("/(app)/(tabs)/appointment");
                }}
              />
            </View>
          </Card>
        </View>
      </Modal>

      <Modal visible={showUpdateModal} transparent>
        <View flex center bg-$backgroundDefault>
          <Card padding-20 width="80%" br20>
            <View center marginB-20>
              <MaterialIcons name="done" size={64} color={Colors.primary} />
            </View>
            <Text text60BO center marginB-20>
              {i18n.t("service.update_information")}
            </Text>
            <View paddingH-20 marginB-10>
              <AppButton
                title={i18n.t("service.back_to_home")}
                type="primary"
                marginB-10
                onPress={() => {
                  setShowUpdateModal(false);
                  router.push("/home");
                }}
              />
              <AppButton
                title={i18n.t("service.view_appointments")}
                type="outline"
                onPress={() => {
                  setShowUpdateModal(false);
                  router.push("/(app)/(tabs)/appointment");
                }}
              />
            </View>
          </Card>
        </View>
      </Modal>
    </View>
  );
};

const calendarTheme = {
  calendarBackground: "#FFFFFF",
  textSectionTitleColor: "#6B7280",
  selectedDayBackgroundColor: Colors.$backgroundPrimaryHeavy,
  selectedDayTextColor: "#ffffff",
  todayTextColor: Colors.$textPrimary,
  dayTextColor: "#2d4150",
  textDisabledColor: "#d9e1e8",
  dotColor: Colors.$iconPrimary,
  selectedDotColor: "#ffffff",
  arrowColor: Colors.$iconPrimary,
  monthTextColor: "#000000",
  textDayFontWeight: "400",
  textMonthFontWeight: "600",
  textDayHeaderFontWeight: "600",
  textDayFontSize: 18,
  textMonthFontSize: 20,
  textDayHeaderFontSize: 14,
};

export default BookingPage;
