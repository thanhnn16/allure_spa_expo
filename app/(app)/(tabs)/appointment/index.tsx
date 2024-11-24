import AppBar from "@/components/app-bar/AppBar";
import AppButton from "@/components/buttons/AppButton";
import { resetAppointmentState } from "@/redux/features/appointment/appointmentSlice";
import {
  cancelAppointment,
  getAppointments,
} from "@/redux/features/appointment/appointmentThunk";
import { AppointmentResponeModelParams } from "@/types/service.type";
import formatCurrency from "@/utils/price/formatCurrency";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import moment from "moment";
import { useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  Modal,
  ScrollView,
  TextInput,
  RefreshControl,
  Platform,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Animated, { FadeInDown } from "react-native-reanimated";
import {
  Colors,
  Image,
  SkeletonView,
  Text,
  TouchableOpacity,
  View,
} from "react-native-ui-lib";
import { useDispatch, useSelector } from "react-redux";
import { CalendarProvider, ExpandableCalendar } from "react-native-calendars";
import { Positions } from "react-native-calendars/src/expandableCalendar";
import { updateCalendarLocale } from "@/utils/calendar/localeConfig";
import "moment/locale/vi";
import "moment/locale/ja";
import { useLanguage } from "@/hooks/useLanguage";
import i18n from "@/languages/i18n";

const { width } = Dimensions.get("window");

interface ExpandableCalendarProps {
  initialPosition?: Positions;
  firstDay?: number;
  markedDates?: any;
  allowShadow?: boolean;
  hideArrows?: boolean;
  disableAllTouchEventsForDisabledDays?: boolean;
  disableAllTouchEventsForInactiveDays?: boolean;
  showWeekNumbers?: boolean;
  animateScroll?: boolean;
  closeOnDayPress?: boolean;
  disabledOpacity?: number;
  numberOfDays?: number;
  hideKnob?: boolean;
  rightArrowImageSource?: any;
  leftArrowImageSource?: any;
  theme?: any;
  customHeaderTitle?: React.ReactElement;
}

const ExpandableCalendarComponent: React.FC<ExpandableCalendarProps> = ({
  initialPosition = Positions.CLOSED,
  firstDay = 1,
  markedDates,
  allowShadow = false,
  hideArrows = false,
  disableAllTouchEventsForDisabledDays = false,
  disableAllTouchEventsForInactiveDays = false,
  showWeekNumbers = false,
  animateScroll = true,
  closeOnDayPress = true,
  disabledOpacity = 0.6,
  numberOfDays = 1,
  hideKnob = false,
  theme,
  customHeaderTitle,
  ...props
}) => (
  <ExpandableCalendar
    initialPosition={initialPosition}
    firstDay={firstDay}
    markedDates={markedDates}
    allowShadow={allowShadow}
    hideArrows={hideArrows}
    disableAllTouchEventsForDisabledDays={disableAllTouchEventsForDisabledDays}
    disableAllTouchEventsForInactiveDays={disableAllTouchEventsForInactiveDays}
    showWeekNumbers={showWeekNumbers}
    animateScroll={animateScroll}
    closeOnDayPress={closeOnDayPress}
    numberOfDays={numberOfDays}
    hideKnob={hideKnob}
    theme={theme}
    customHeaderTitle={customHeaderTitle}
    {...props}
    calendarStyle={{
      paddingLeft: 16,
      paddingRight: 16,
    }}
    headerStyle={{
      paddingHorizontal: 16,
    }}
  />
);

const ScheduledPage = () => {
const { t } = useLanguage();

  const [selectedItem, setSelectedItem] = useState<number>(1);
  const [isModalVisible, setModalVisible] = useState(false);
  const [note, setNote] = useState("");
  const [currentItemId, setCurrentItemId] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const [selectedDate, setSelectedDate] = useState(
    moment().format("YYYY-MM-DD")
  );
  const dispatch = useDispatch();
  const { appointments, loading } = useSelector(
    (state: any) => state.appointment
  );
  const [allAppointments, setAllAppointments] = useState<
    AppointmentResponeModelParams[]
  >([]);

  useEffect(() => {
    dispatch(getAppointments());
    return () => {
      dispatch(resetAppointmentState());
    };
  }, [dispatch]);

  useEffect(() => {
    const fetchAllAppointments = async () => {
      try {
        const response = await dispatch(
          getAppointments({
            from_date: null,
            to_date: null,
          })
        ).unwrap();
        setAllAppointments(response);
      } catch (error) {
        console.log("Error fetching all appointments:", error);
      }
    };

    fetchAllAppointments();
  }, []);

  const items = [
    { id: 1, name: t("appointment.all") },
    { id: 6, name: t("appointment.7upcoming") },
    { id: 2, name: t("appointment.pending"), status: "pending" },
    { id: 5, name: t("appointment.confirmed"), status: "confirmed" },
    { id: 3, name: t("appointment.completed"), status: "completed" },
    { id: 4, name: t("appointment.cancelled"), status: "cancelled" },
  ];

  const handleItemPress = (item: { id: number; status?: string }) => {
    setSelectedItem(item.id);
    let params: {
      from_date: string | null;
      to_date: string | null;
      status?: string | null;
    } = {
      from_date: moment().format("YYYY-MM-DD"),
      to_date: moment().add(7, "days").format("YYYY-MM-DD"),
      status: item.status,
    };

    if (item.id === 1) {
      params = {
        from_date: null,
        to_date: null,
        status: null,
      };
    }

    if (item.id === 6) {
      params = {
        from_date: moment().format("YYYY-MM-DD"),
        to_date: moment().add(7, "days").format("YYYY-MM-DD"),
        status: "confirmed",
      };
    }
    dispatch(resetAppointmentState());
    dispatch(getAppointments(params));
  };

  useEffect(() => {
    handleItemPress(items[0]);
  }, []);

  const renderItem = (item: { id: number; name: string; status?: string }) => {
    const isSelected = item.id === selectedItem;
    return (
      <TouchableOpacity
        marginR-12
        key={item.id}
        onPress={() => handleItemPress(item)}
      >
        <View
          br30
          paddingH-15
          centerV
          height={40}
          backgroundColor={isSelected ? Colors.primary : Colors.white}
          style={{
            borderWidth: 1,
            borderColor: isSelected ? Colors.primary : Colors.grey60,
          }}
        >
          <Text h3 color={isSelected ? Colors.white : Colors.text}>
            {item.name}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderSkeletonItem = () => (
    <View
      padding-15
      marginB-10
      br20
      backgroundColor={Colors.white}
      style={{
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}
    >
      <SkeletonView height={20} width={width * 0.4} />
      <View marginT-10>
        <SkeletonView height={120} width={width - 60} />
      </View>
      <View row marginT-10>
        <SkeletonView height={20} width={width * 0.6} />
      </View>
    </View>
  );

  const handleCancelOrderPress = (id: number) => {
    setCurrentItemId(id);
    setModalVisible(true);
  };

  const handleConfirmCancel = () => {
    if (currentItemId !== null) {
      dispatch(cancelAppointment({ id: currentItemId, note })).then(() => {
        dispatch(getAppointments());
      });
      setModalVisible(false);
      setNote("");
    }
  };

  const renderFlatListItem = ({
    item,
    index,
  }: {
    item: AppointmentResponeModelParams;
    index: number;
  }) => {
    const statusColors = {
      completed: {
        bg: Colors.rgba(Colors.primary, 0.15),
        text: Colors.primary,
        icon: "check-circle" as const,
      },
      pending: {
        bg: Colors.rgba(Colors.secondary, 0.15),
        text: Colors.secondary,
        icon: "clock-outline" as const,
      },
      cancelled: {
        bg: Colors.rgba(Colors.red30, 0.15),
        text: Colors.red10,
        icon: "close-circle" as const,
      },
      confirmed: {
        bg: Colors.rgba(Colors.primary, 0.15),
        text: Colors.primary,
        icon: "calendar-check" as const,
      },
    };

    const statusConfig =
      statusColors[item.status.toLowerCase() as keyof typeof statusColors];

    return (
      <Animated.View
        entering={FadeInDown.delay(index * 100).springify()}
        style={{
          marginBottom: 15,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.08,
          shadowRadius: 8,
          elevation: Platform.OS === 'android' ? 8 : 0,
        }}
      >
        <LinearGradient
          colors={[Colors.white as string, Colors.primary_blur as string]}
          style={{ 
            borderRadius: 20,
            ...(Platform.OS === 'ios' && {
              borderWidth: 1,
              borderColor: Colors.rgba(Colors.grey60, 0.2),
            })
          }}
        >
          <View padding-15 br20>
            {/* Header */}
            <View row spread centerV>
              <View row centerV>
                <Text h2_bold color={Colors.primary}>{`#${item.id
                  .toString()
                  .padStart(3)}`}</Text>
              </View>
              <View row centerV>
                <MaterialCommunityIcons
                  name={statusConfig.icon}
                  size={20}
                  color={statusConfig.text}
                />
                <View
                  marginL-8
                  padding-8
                  br30
                  backgroundColor={statusConfig.bg}
                >
                  <Text h4 color={statusConfig.text}>
                    {t(`appointment.status.${item.status.toLowerCase()}`)}
                  </Text>
                </View>
              </View>
            </View>

            {/* Content */}
            <View paddingT-15>
              <View row>
                <Image
                  source={require("@/assets/images/banner.png")}
                  style={{
                    width: 110,
                    height: 110,
                    borderRadius: 15,
                    backgroundColor: Colors.grey60,
                  }}
                />
                <View flex marginL-15>
                  <Text h3_bold numberOfLines={2}>
                    {item.title}
                  </Text>

                  {/* Time Slot */}
                  {item.time_slot && (
                    <View row centerV marginT-4>
                      <MaterialCommunityIcons
                        name="clock-time-four"
                        size={16}
                        color={Colors.primary}
                      />
                      <Text marginL-5 h4 color={Colors.text}>
                        {`${moment(
                          item.time_slot.start_time,
                          "HH:mm:ss"
                        ).format("HH:mm")} - ${moment(
                          item.time_slot.end_time,
                          "HH:mm:ss"
                        ).format("HH:mm")}`}
                      </Text>
                    </View>
                  )}

                  {/* Date */}
                  <View row centerV marginT-5>
                    <MaterialCommunityIcons
                      name="calendar"
                      size={16}
                      color={Colors.primary}
                    />
                    <Text marginL-5 h4 color={Colors.text}>
                      {moment(item.start).format("DD/MM/YYYY")}
                    </Text>
                  </View>

                  {item.service?.single_price && (
                    <View marginT-8>
                      <Text h3_bold color={Colors.secondary}>
                        {formatCurrency({ price: item.service.single_price })}
                      </Text>
                    </View>
                  )}
                </View>
              </View>

              {/* Notes if exists */}
              {item.note && (
                <View
                  marginT-10
                  padding-12
                  br10
                  backgroundColor={Colors.grey70}
                  style={{
                    borderLeftWidth: 3,
                    borderLeftColor: Colors.primary,
                  }}
                >
                  <View row>
                    <MaterialCommunityIcons
                      name="note-text-outline"
                      size={16}
                      color={Colors.primary}
                      style={{ marginTop: 2 }}
                    />
                    <View flex marginL-8>
                      <Text h4_bold color={Colors.primary} marginB-4>
                        {t("appointment.note")}:
                      </Text>
                      <Text h4 color={Colors.text}>
                        {item.note}
                      </Text>
                    </View>
                  </View>
                </View>
              )}

              {/* Cancellation info */}
              {item.status === "cancelled" && item.cancelled_by_user && (
                <View
                  marginT-10
                  padding-10
                  br10
                  backgroundColor={Colors.rgba(Colors.red30, 0.1)}
                >
                  <Text h4 color={Colors.red10}>
                    {`${t("appointment.cancelled_by")}: ${
                      item.cancelled_by_user.full_name
                    }`}
                  </Text>
                  {item.cancellation_note && (
                    <Text marginT-5 h4 color={Colors.red10}>
                      {`${t("appointment.cancel_reason")}: ${
                        item.cancellation_note
                      }`}
                    </Text>
                  )}
                </View>
              )}

              {/* Cancel button */}
              {item.status === "pending" && (
                <AppButton
                  type="outline"
                  onPress={() => handleCancelOrderPress(item.id)}
                  buttonStyle={{ marginTop: 15, width: "100%" }}
                  children={
                    <View row gap-4 centerV>
                      <MaterialCommunityIcons
                        name="close-circle"
                        size={16}
                        color={Colors.red10}
                      />
                      <Text h4 color={Colors.red10}>
                        {t("appointment.cancel_appointment")}
                      </Text>
                    </View>
                  }
                />
              )}

              {/* Add View Details button */}
              <AppButton
                type="outline"
                onPress={() => router.push(`/appointment/${item.id}`)}
                buttonStyle={{ marginTop: 15, width: "100%" }}
                children={
                  <View row gap-4 centerV>
                    <Text h4 color={Colors.primary}>
                      {t("appointment.view_details")}
                    </Text>
                    <MaterialCommunityIcons
                      name="arrow-right"
                      size={16}
                      color={Colors.primary}
                    />
                  </View>
                }
              />
            </View>
          </View>
        </LinearGradient>
      </Animated.View>
    );
  };

  const getMarkedDates = () => {
    const markedDates: any = {};
    allAppointments?.forEach((appointment: AppointmentResponeModelParams) => {
      const date = moment(appointment.start).format("YYYY-MM-DD");
      const statusColors = {
        completed: Colors.green30,
        pending: Colors.yellow30,
        cancelled: Colors.red30,
        confirmed: Colors.blue30,
      };

      if (!markedDates[date]) {
        markedDates[date] = {
          marked: true,
          dotColor:
            statusColors[
              appointment.status.toLowerCase() as keyof typeof statusColors
            ],
          selected: date === selectedDate,
          selectedColor:
            date === selectedDate
              ? Colors.rgba(
                  statusColors[
                    appointment.status.toLowerCase() as keyof typeof statusColors
                  ],
                  0.1
                )
              : undefined,
        };
      }
    });
    return markedDates;
  };

  const renderViewModeToggle = () => (
    <TouchableOpacity
      onPress={() => {
        const newMode = viewMode === "list" ? "calendar" : "list";
        setViewMode(newMode);

        if (newMode === "list") {
          setSelectedItem(1);
          dispatch(resetAppointmentState());
          dispatch(
            getAppointments({
              from_date: null,
              to_date: null,
              status: null,
            })
          );
        }
      }}
      style={{ position: "absolute", right: 15 }}
    >
      <MaterialCommunityIcons
        name={viewMode === "list" ? "calendar" : "format-list-bulleted"}
        size={24}
        color={Colors.primary}
      />
    </TouchableOpacity>
  );

  const calendarTheme = {
    // Background
    calendarBackground: Colors.white,
    backgroundColor: Colors.white,

    // Text colors
    textSectionTitleColor: Colors.text,
    selectedDayBackgroundColor: Colors.primary,
    selectedDayTextColor: Colors.white,
    todayTextColor: Colors.primary,
    dayTextColor: Colors.text,
    textDisabledColor: Colors.grey40,

    // Dots & Marking
    dotColor: Colors.primary,
    selectedDotColor: Colors.white,

    // Month navigation
    arrowColor: Colors.primary,
    monthTextColor: Colors.text,

    // Header
    textDayFontSize: Platform.OS === 'ios' ? 14 : 15,
    textMonthFontSize: Platform.OS === 'ios' ? 16 : 18,
    textDayHeaderFontSize: Platform.OS === 'ios' ? 12 : 13,

    // General
    todayButtonFontSize: 16,
    todayButtonTextColor: Colors.primary,

    // Additional styling
    "stylesheet.calendar.header": {
      dayHeader: {
        color: Colors.text,
        fontSize: Platform.OS === 'ios' ? 12 : 14,
        fontWeight: '600',
        paddingBottom: 8,
        paddingTop: 8,
      },
      header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: Platform.OS === 'ios' ? 8 : 12,
      },
      headerContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      },
    },
    todayButtonFontWeight: "600",
    todayButtonPosition: "right",
    todayButtonMarginRight: 16,
    dayContainerPadding: 4,

    ...(Platform.OS === 'ios' && {
      textDayFontSize: 14,
      textMonthFontSize: 16,
      textDayHeaderFontSize: 12,
      selectedDayBackgroundColor: Colors.rgba(Colors.primary, 0.9),
    }),
  };

  const renderCalendarView = () => (
    <View flex>
      <CalendarProvider
        date={selectedDate}
        onDateChanged={(date) => {
          setSelectedDate(date);
          dispatch(
            getAppointments({
              from_date: date,
              to_date: date,
            })
          );
        }}
      >
        <ExpandableCalendarComponent
          key="expandable-calendar"
          markedDates={getMarkedDates()}
          theme={calendarTheme}
          customHeaderTitle={
            <View flex center>
              <Text h2_bold color={Colors.text}>
                {moment(selectedDate).format("MMMM YYYY")}
              </Text>
            </View>
          }
        />

        <View paddingH-24 paddingV-12>
          <Text h3_bold color={Colors.text}>
            {moment(selectedDate).format("dddd, DD MMMM YYYY")}
          </Text>
        </View>

        <View flex paddingH-24 marginT-10>
          {loading ? (
            <View paddingT-20>
              {[1, 2].map((_, index) => (
                <View key={index}>{renderSkeletonItem()}</View>
              ))}
            </View>
          ) : (
            <FlatList
              showsVerticalScrollIndicator={false}
              data={appointments}
              renderItem={renderFlatListItem}
              keyExtractor={(item) => item.id.toString()}
              ListEmptyComponent={() => (
                <View center paddingT-60>
                  <MaterialCommunityIcons
                    name="calendar-blank"
                    size={56}
                    color={Colors.grey40}
                  />
                  <Text h2_bold center marginT-16 marginB-8>
                    {t("appointment.no_appointments_title")}
                  </Text>
                  <Text h3 center grey30 marginB-24>
                    {t("appointment.no_appointments_for_selected_date")}
                  </Text>
                  <AppButton
                    type="primary"
                    title={t("appointment.book_appointment")}
                    onPress={() => router.push("/(app)/service-package")}
                    buttonStyle={{ minWidth: 200 }}
                  />
                </View>
              )}
              refreshControl={
                <RefreshControl
                  refreshing={loading}
                  onRefresh={() => {
                    dispatch(
                      getAppointments({
                        from_date: selectedDate,
                        to_date: selectedDate,
                      })
                    );
                  }}
                  colors={[Colors.primary]}
                />
              }
            />
          )}
        </View>
      </CalendarProvider>
    </View>
  );

  // Update calendar locale when language changes
  useEffect(() => {
    updateCalendarLocale();
  }, [i18n.locale]);

  useEffect(() => {
    // Update moment locale when language changes
    moment.locale(i18n.locale);
  }, [i18n.locale]);

  const renderCancelModal = () => (
    <Modal visible={isModalVisible} transparent animationType="fade">
      <View
        flex
        center
        backgroundColor={Colors.rgba(Colors.black, 0.5)}
      >
        <Animated.View
          entering={FadeInDown}
          style={{
            width: '85%',
            backgroundColor: Colors.white,
            borderRadius: 20,
            padding: 20,
            ...(Platform.OS === 'ios' 
              ? {
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.15,
                  shadowRadius: 10,
                }
              : {
                  elevation: 8,
                }
            ),
          }}
        >
          <Text h2_bold marginB-15>
            {t("appointment.cancel_appointment")}
          </Text>

          <TextInput
            style={{
              minHeight: 100,
              borderColor: Colors.grey40,
              borderWidth: 1,
              borderRadius: 15,
              padding: 15,
              marginBottom: 20,
              textAlignVertical: "top",
            }}
            placeholder={t("appointment.cancel_appointment_reason")}
            value={note}
            onChangeText={setNote}
            multiline
          />

          <View row spread>
            <AppButton
              type="outline"
              title={t("appointment.cancel")}
              onPress={() => setModalVisible(false)}
            />
            <AppButton
              type="outline"
              title={t("appointment.confirm")}
              onPress={handleConfirmCancel}
            />
          </View>
        </Animated.View>
      </View>
    </Modal>
  );

  return (
    <View flex bg-white>
      <AppBar
        title={t("appointment.scheduled")}
        rightComponent={renderViewModeToggle()}
      />

      {viewMode === "list" ? (
        <>
          <View height={46} center paddingH-24>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {items.map((item) => renderItem(item))}
            </ScrollView>
          </View>
          <View flex paddingH-24>
            {loading ? (
              <View>
                {[1, 2, 3].map((_, index) => (
                  <View key={index}>{renderSkeletonItem()}</View>
                ))}
              </View>
            ) : !appointments || (appointments.length === 0 && !loading) ? (
              <View flex center>
                <View center gap-10>
                  <MaterialCommunityIcons
                    name="calendar-blank"
                    size={64}
                    color={Colors.grey40}
                  />
                  <Text h2_bold center>
                    {t("appointment.no_appointments_title")}
                  </Text>
                  <Text h3 center grey30>
                    {t(
                      `appointment.no_${
                        selectedItem === 1
                          ? "appointments"
                          : selectedItem === 6
                          ? "next_7days"
                          : selectedItem === 2
                          ? "pending"
                          : selectedItem === 5
                          ? "confirmed"
                          : selectedItem === 3
                          ? "completed"
                          : "cancelled"
                      }`
                    )}
                  </Text>
                  <AppButton
                    type="primary"
                    title={t("appointment.book_for_service_package")}
                    onPress={() => {
                      router.push("/(app)/service-package");
                    }}
                  />
                  <AppButton
                    type="outline"
                    title={t("appointment.find_service")}
                    onPress={() => {
                      router.push("/(app)/see-more?type=service");
                    }}
                  />
                </View>
              </View>
            ) : (
              <FlatList
                showsVerticalScrollIndicator={false}
                data={appointments}
                renderItem={renderFlatListItem}
                keyExtractor={(item) => item.id.toString()}
              />
            )}
          </View>
        </>
      ) : (
        renderCalendarView()
      )}

      {renderCancelModal()}
    </View>
  );
};

export default ScheduledPage;
