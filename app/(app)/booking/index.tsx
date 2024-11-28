import { useEffect, useMemo, useState, useRef } from "react";
import {FlatList, Dimensions, Modal, Keyboard, Platform, ScrollView, KeyboardAvoidingView} from "react-native";
import AppBar from "@/components/app-bar/AppBar";
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
import { BookingPayload } from "@/types/appointment.type";
import { updateAppointment } from "@/redux/features/appointment/appointmentThunk";
import Animated, {
  withSpring,
  useSharedValue,
  FadeIn,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { View as RNView } from "react-native";
import { useLanguage } from "@/hooks/useLanguage";

const SuccessModal = ({
  visible,
  title,
  onClose,
  onViewAppointments,
  t,
}: {
  visible: boolean;
  title: string;
  onClose: () => void;
  onViewAppointments: () => void;
  t: any;
}) => (
    <Modal visible={visible} transparent>
      <View
          center
          style={{
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            flex: 1,
          }}
      >
        <Card padding-20 width="80%" height="30%" br20>
          <View center>
            <MaterialIcons name="done" size={64} color={Colors.primary} />
          </View>
          <Text text60BO center marginB-36>
            {title}
          </Text>
          <View flex center paddingH-20 marginB-10 style={{gap: 10}}>
            <View flex-1>
              <AppButton
                  title={t("service.back_to_home")}
                  type="primary"
                  marginB-10
                  onPress={onClose}
                  style={{marginRight: 10}}
              />
            </View>
            <View flex-1 marginT-24 marginB-10 >
              <AppButton
                  title={t("service.view_appointments")}
                  type="outline"
                  onPress={onViewAppointments}
              />
            </View>
          </View>
        </Card>
      </View>
    </Modal>
);

const BookingPage = () => {
  const { t } = useLanguage();

  const dispatch = useDispatch<AppDispatch>();
  const { timeSlots, loading, error, bookingSuccess } = useSelector(
    (state: RootState) => state.booking
  );
  const { user } = useSelector((state: RootState) => state.user);
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
    setTimeout(() => {
      timeSlotRef.current?.scrollTo({
        y: 400,
        animated: true,
      });
    }, 100);
  };

  const [successModal, setSuccessModal] = useState<{
    visible: boolean;
    isUpdate: boolean;
  }>({
    visible: false,
    isUpdate: false,
  });

  const handleSuccess = (isUpdate: boolean) => {
    setShowModal(false);
    setSuccessModal({
      visible: true,
      isUpdate,
    });
  };

  const handleCloseSuccess = () => {
    setSuccessModal({ visible: false, isUpdate: false });
    router.push("/home");
  };

  const handleViewAppointments = () => {
    setSuccessModal({ visible: false, isUpdate: false });
    router.push("/(app)/(tabs)/appointment");
  };

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
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      noteRef.current?.measureLayout(
          // @ts-ignore
          timeSlotRef.current,
          (x: number, y: number) => {
            timeSlotRef.current?.scrollTo({
              y: y,
              animated: true,
            });
          },
          () => console.log("measurement failed")
      );
    });

    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      timeSlotRef.current?.scrollTo({ y: 0, animated: true });
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

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
      setDialogTitle(t("service.error"));
      setDialogDescription(t("service.plase_select_date"));
      setDialogVisible(true);
      return;
    }
    if (selectedTime === undefined) {
      setDialogTitle(t("service.error"));
      setDialogDescription(t("service.plase_select_time"));
      setDialogVisible(true);
      return;
    }
    if (slot === 0) {
      setDialogTitle(t("service.error"));
      setDialogDescription(t("service.minimum_slot_error"));
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
      handleSuccess(false); // Show success modal
      setSuccess(true); // Set success state to true upon successful booking
    } catch (error: any) {
      setDialogTitle(t("service.error"));
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
        handleSuccess(true); // Show success modal
        setSuccess(true); // Set success state to true upon successful update
      }
    } catch (error: any) {
      setDialogTitle(t("service.error"));
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
      setDialogTitle(t("service.error"));
      setDialogDescription(error.message);
      setDialogVisible(true);
      dispatch(resetBookingState());
    }
  }, [bookingSuccess, error, dispatch]);

  const timeSlotRef = useRef<Animated.ScrollView>(null);
  const seatRef = useRef<RNView>(null);
  const noteRef = useRef<RNView>(null);

  const handleTimeSlotSelect = (time: any) => {
    setSelectedTime(time.id);
    Haptics.selectionAsync();
    setTimeout(() => {
      seatRef.current?.measureLayout(
        // @ts-ignore
        timeSlotRef.current,
        (x: number, y: number) => {
          timeSlotRef.current?.scrollTo({
            y: y,
            animated: true,
          });
        },
        () => console.log("measurement failed")
      );
    }, 100);
  };

  const handleSeatSelect = (seatCount: number) => {
    setSlot(seatCount);
    setTimeout(() => {
      noteRef.current?.measureLayout(
        // @ts-ignore
        timeSlotRef.current,
        (x: number, y: number) => {
          timeSlotRef.current?.scrollTo({
            y: y,
            animated: true,
          });
        },
        () => console.log("measurement failed")
      );
    }, 50);
  };

  const currentTime = moment();
  const currentDate = moment().format("YYYY-MM-DD");


  return (
      <View flex bg-white>
        <AppBar back title={t("service.make_appointment")} />
        <View flex>
          <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={{ flex: 1 }}
          >
            <ScrollView
                ref={timeSlotRef}
                contentContainerStyle={{
                  flexGrow: 1,
                  paddingBottom: 120,
                }}
            >
              <View flex paddingH-24>
            <Card
              flex
              br20
              enableShadow={false}
              backgroundColor={Colors.surface}
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
                      paddingHorizontal: 12,
                      paddingVertical: 16,
                      alignItems: "center",
                      backgroundColor: Colors.surface,
                    },
                    monthText: {
                      fontSize: 18,
                      fontWeight: "600",
                      color: Colors.text,
                    },
                  },
                  "stylesheet.day.basic": {
                    base: {
                      width: 42,
                      height: 42,
                      alignItems: "center",
                      justifyContent: "center",
                    },
                    text: {
                      fontSize: 16,
                      fontWeight: "500",
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
                    selectedColor: Colors.primary,
                  },
                  [today]: {
                    marked: true,
                    selected: today,
                    dotColor: "white",
                    borderWidth: 1,
                    borderColor: Colors.primary,
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
                    {t("service.select_time")}
                  </Text>
                  <View marginT-16>
                    <FlatList
                        scrollEnabled={false}
                        data={timeSlots}
                        renderItem={({ item }) => {
                          const isPast = selectedDate === currentDate && moment(item.start_time, "HH:mm").isBefore(currentTime);
                          return (
                              <TouchableOpacity
                                  onPress={() => handleTimeSlotSelect(item)}
                                  disabled={!item.available || isPast}
                              >
                                <Animated.View
                                    entering={FadeIn.duration(500).delay(item.id * 100)}
                                    style={{
                                      transform: [{ scale: fadeAnim }],
                                    }}
                                >
                                  <Card
                                      center
                                      enableShadow={false}
                                      br40
                                      paddingV-12
                                      paddingH-16
                                      style={{
                                        opacity: !item.available || isPast ? 0.5 : 1,
                                        backgroundColor:
                                            selectedTime === item.id
                                                ? Colors.primary_blur
                                                : Colors.card_bg,
                                        borderWidth: selectedTime === item.id ? 1 : 0,
                                        borderColor: Colors.primary_light,
                                      }}
                                  >
                                    <Text
                                        style={{
                                          color: selectedTime === item.id ? Colors.primary : Colors.text,
                                        }}
                                        text80BO
                                    >
                                      {`${item.start_time.substring(0, 5)} - ${item.end_time.substring(0, 5)}`}
                                    </Text>

                                    <View row centerV marginT-8>
                                      <Octicons
                                          name="person"
                                          size={16}
                                          color={selectedTime === item.id ? Colors.primary : Colors.icon}
                                      />
                                      <Text
                                          marginL-8
                                          text80
                                          style={{
                                            color: selectedTime === item.id ? Colors.primary : Colors.text,
                                          }}
                                      >
                                        {item.available_slots} {t("service.available")}
                                      </Text>
                                    </View>
                                  </Card>
                                </Animated.View>
                              </TouchableOpacity>
                          );
                        }}
                        keyExtractor={(item: any) => item.id.toString()}
                        numColumns={numColumns}
                        contentContainerStyle={{
                          gap: 8,
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                        columnWrapperStyle={{
                          justifyContent: "space-between",
                          width: "100%",
                        }}
                        nestedScrollEnabled
                    />
                  </View>
                </View>
            )}

            {selectedTime && (
              <View ref={seatRef}>
                <Text text60BO $textDefault marginB-10>
                  {t("service.select_seat")}
                </Text>
                <View row spread marginT-12>
                  <TouchableOpacity
                    flex-1
                    marginR-6
                    onPress={() => handleSeatSelect(1)}
                  >
                    <View
                      center
                      padding-16
                      br20
                      style={{
                        backgroundColor:
                          slot === 1 ? Colors.primary_blur : Colors.card_bg,
                        borderWidth: slot === 1 ? 1 : 0,
                        borderColor: Colors.primary,
                      }}
                    >
                      <Text color={slot === 1 ? Colors.primary : Colors.text}>
                        {t("service.1_seat")}
                      </Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    flex-1
                    marginL-6
                    onPress={() => handleSeatSelect(2)}
                    disabled={
                      timeSlots.find((item: any) => item.id === selectedTime)
                        ?.available_slots === 1
                    }
                  >
                    <View
                      center
                      padding-16
                      br20
                      style={{
                        backgroundColor:
                          slot === 2 ? Colors.primary_blur : Colors.card_bg,
                        borderWidth: slot === 2 ? 1 : 0,
                        borderColor: Colors.primary,
                      }}
                    >
                      <Text color={slot === 2 ? Colors.primary : Colors.text}>
                        {t("service.2_seat")}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            )}

                {slot !== 0 && (
                    <View ref={noteRef} marginT-20>
                      <Text text60BO $textDefault marginB-12>
                        {t("service.note")}
                      </Text>
                      <TextArea
                          value={note}
                          onChangeText={setNote}
                          placeholder={t("service.enter_content")}
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
                            title={t("service.continue")}
                            type="primary"
                            onPress={handleShowModal}
                        />
                      </View>
                    </View>
                )}
          </View>
        </ScrollView>
        </KeyboardAvoidingView>
      </View>

      <Modal visible={showModal} transparent animationType="fade">
        <View flex center backgroundColor={`rgba(${Colors.dark}, 0.5)`}>
          <Card padding-20 width="80%" br30>
            <View center marginB-20>
              <MaterialIcons name="info" size={48} color={Colors.primary} />
            </View>
            <Text text60BO center marginB-10>
              {edit_mode === "true"
                ? t("service.update_information")
                : t("service.confirm_information")}
            </Text>

            <View marginB-20>
              <Text text70 marginB-5>
                {t("service.customer_name")}:{" "}
                <Text text70BO>{user?.full_name}</Text>
              </Text>
              <Text text70 marginB-5>
                {t("service.service_name")}:{" "}
                <Text text70BO>{service_name}</Text>
              </Text>
              <Text text70 marginB-5>
                {t("service.time")}: <Text text70BO>{timeString}</Text>
              </Text>
              <Text text70 marginB-5>
                {t("service.date")}:{" "}
                <Text text70BO>
                  {moment(selectedDate).format("DD/MM/YYYY")}
                </Text>
              </Text>
              <Text text70 marginB-5>
                {t("service.note")}: <Text text70BO>{note}</Text>
              </Text>
            </View>
            <View center gap-10>
              <View center>
                <AppButton
                  title={t("service.agree")}
                  type="primary"
                  onPress={() => {
                    if (edit_mode === "true") {
                      handleUpdate();
                    } else {
                      handleBooking();
                    }
                  }}
                />
              </View>
              <View center>
                <AppButton
                  title={t("service.cancel")}
                  type="outline"
                  onPress={() => {
                    setShowModal(false);
                  }}
                />
              </View>
            </View>
          </Card>
        </View>
      </Modal>

      <SuccessModal
        visible={successModal.visible}
        title={
          successModal.isUpdate
            ? t("service.update_information")
            : t("service.confirm_information")
        }
        t={t}
        onClose={handleCloseSuccess}
        onViewAppointments={handleViewAppointments}
      />
    </View>
  );
};

const calendarTheme = {
  calendarBackground: Colors.surface,
  textSectionTitleColor: Colors.text,
  selectedDayBackgroundColor: Colors.primary,
  selectedDayTextColor: Colors.background,
  todayTextColor: Colors.primary,
  dayTextColor: Colors.text,
  textDisabledColor: Colors.gray,
  dotColor: Colors.primary,
  selectedDotColor: Colors.background,
  arrowColor: Colors.primary,
  monthTextColor: Colors.text,
  textDayFontWeight: "500",
  textMonthFontWeight: "600",
  textDayHeaderFontWeight: "600",
  textDayFontSize: 16,
  textMonthFontSize: 18,
  textDayHeaderFontSize: 14,
};

export default BookingPage;
