import { useEffect, useMemo, useState, useRef } from "react";
import { FlatList, Dimensions, Modal } from "react-native";
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
import { User } from "@/types/user.type";
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
import { Wizard } from 'react-native-ui-lib';


const BookingPage = () => {
  const { t } = useLanguage();

  const dispatch = useDispatch<AppDispatch>();
  const { timeSlots, error, bookingSuccess } = useSelector(
    (state: RootState) => state.booking
  );
  const user: User = useSelector((state: RootState) => state.auth.user);
  const windowWidth = Dimensions.get("window").width;
  const padding = 24;
  const gap = 24;
  const numColumns = 2;

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
      setShowConfirmModal(true); // Show confirm modal
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
        setShowUpdateModal(true); // Show update modal
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
    }, 100);
  };

  const [activeIndex, setActiveIndex] = useState(0);

  const handleStepChange = (index: number) => {
    if (index === 1 && !selectedDate) {
      setDialogTitle(t("service.error"));
      setDialogDescription(t("service.plase_select_date"));
      setDialogVisible(true);
      return;
    }
    if (index === 2 && !selectedTime) {
      setDialogTitle(t("service.error"));
      setDialogDescription(t("service.plase_select_time"));
      setDialogVisible(true);
      return;
    }
    setActiveIndex(index);
  };

  const renderDateStep = () => {
    return (
      <View marginT-20>
        <Card flex br20 enableShadow={false} backgroundColor={Colors.surface}>
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
      </View>
    );
  };

  const renderTimeStep = () => {
    return timeSlots.length > 0 && (
      <View marginT-20 marginB-20>
        <Text text60BO $textDefault marginB-10>
          {t("service.select_time")}
        </Text>
        <View marginT-16>
          <FlatList
            scrollEnabled={false}
            data={timeSlots}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleTimeSlotSelect(item)}
                disabled={!item.available}
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
                      opacity: !item.available ? 0.5 : 1,
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
                        color:
                          selectedTime === item.id
                            ? Colors.primary
                            : Colors.text,
                      }}
                      text80BO
                    >
                      {`${item.start_time.substring(
                        0,
                        5
                      )} - ${item.end_time.substring(0, 5)}`}
                    </Text>

                    <View row centerV marginT-8>
                      <Octicons
                        name="person"
                        size={16}
                        color={
                          selectedTime === item.id
                            ? Colors.primary
                            : Colors.icon
                        }
                      />
                      <Text
                        marginL-8
                        text80
                        style={{
                          color:
                            selectedTime === item.id
                              ? Colors.primary
                              : Colors.text,
                        }}
                      >
                        {item.available_slots} {t("service.available")}
                      </Text>
                    </View>
                  </Card>
                </Animated.View>
              </TouchableOpacity>
            )}
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
    );
  };

  const renderSeatStep = () => {
    return (
      <View marginT-20>
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
    );
  };

  const renderNoteStep = () => {
    return (
      <View marginT-20>
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
    );
  };

  const renderCurrentStep = () => {
    switch (activeIndex) {
      case 0:
        return renderDateStep();
      case 1:
        return renderTimeStep();
      case 2:
        return renderSeatStep();
      case 3:
        return renderNoteStep();
      default:
        return renderDateStep();
    }
  };

  return (
    <View flex bg-white>
      <AppBar back title={t("service.make_appointment")} />
      <View flex>
        <Wizard activeIndex={activeIndex} onActiveIndexChanged={handleStepChange}>
          <Wizard.Step
            state={Wizard.States.ENABLED}
            label={t("service.select_date")}
          />
          <Wizard.Step
            state={selectedDate ? Wizard.States.ENABLED : Wizard.States.DISABLED}
            label={t("service.select_time")}
          />
          <Wizard.Step
            state={selectedTime ? Wizard.States.ENABLED : Wizard.States.DISABLED}
            label={t("service.select_seat")}
          />
          <Wizard.Step
            state={slot ? Wizard.States.ENABLED : Wizard.States.DISABLED}
            label={t("service.note")}
          />
        </Wizard>
        {renderCurrentStep()}
      </View>

      <Modal visible={showModal} transparent animationType="slide">
        <View flex center bg-$backgroundDefault>
          <Card padding-20 width="80%" br20>
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
                <Text text70BO>{user.full_name}</Text>
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
            <View row spread marginT-20 paddingH-20 marginB-10>
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
              <AppButton
                title={t("service.cancel")}
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
              {t("service.confirm_information")}
            </Text>
            <View paddingH-20 marginB-10>
              <AppButton
                title={t("service.back_to_home")}
                type="primary"
                marginB-10
                onPress={() => {
                  setShowConfirmModal(false);
                  router.push("/home");
                }}
              />
              <AppButton
                title={t("service.view_appointments")}
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
              {t("service.update_information")}
            </Text>
            <View paddingH-20 marginB-10>
              <AppButton
                title={t("service.back_to_home")}
                type="primary"
                marginB-10
                onPress={() => {
                  setShowUpdateModal(false);
                  router.push("/home");
                }}
              />
              <AppButton
                title={t("service.view_appointments")}
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
