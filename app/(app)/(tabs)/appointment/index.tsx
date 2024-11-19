import {
  ScrollView,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  Dimensions,
} from "react-native";
import {
  Colors,
  Text,
  View,
  Image,
  Button,
  SkeletonView,
} from "react-native-ui-lib";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAppointments,
  cancelAppointment,
} from "@/redux/features/appointment/appointmentThunk";
import i18n from "@/languages/i18n";
import moment from "moment-timezone";
import ClockIcon from "@/assets/icons/clock.svg";
import AppButton from "@/components/buttons/AppButton";
import { AppointmentResponeModelParams } from "@/types/service.type";
import AppBar from "@/components/app-bar/AppBar";
import Animated, { FadeInDown } from "react-native-reanimated";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import LinearGradient from "react-native-linear-gradient";
const { width } = Dimensions.get("window");

const ScheduledPage = () => {
  const [selectedItem, setSelectedItem] = useState<number>(1);
  const [isModalVisible, setModalVisible] = useState(false);
  const [note, setNote] = useState("");
  const [currentItemId, setCurrentItemId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const { appointments } = useSelector((state: any) => state.appointment);
  const loggedInUserId = useSelector((state: any) => state.auth.user.id);

  useEffect(() => {
    setLoading(true);
    dispatch(getAppointments()).finally(() => {
      setLoading(false);
    });
  }, [dispatch]);

  useEffect(() => {
    console.log("Appointments State:", appointments);
  }, [appointments]);

  const items = [
    { id: 1, name: i18n.t("appointment.all") },
    { id: 6, name: i18n.t("appointment.7upcoming") },
    { id: 2, name: i18n.t("appointment.pending"), status: "pending" },
    { id: 5, name: i18n.t("appointment.confirmed"), status: "confirmed" },
    { id: 3, name: i18n.t("appointment.completed"), status: "completed" },
    { id: 4, name: i18n.t("appointment.cancelled"), status: "cancelled" },
  ];

  const handleItemPress = (item: { id: number; status?: string }) => {
    setSelectedItem(item.id);
    let params: {
      from_date: string | null;
      to_date: string | null;
      status?: string | null;
    } = {
      from_date: moment().tz("Asia/Ho_Chi_Minh").format("YYYY-MM-DD"),
      to_date: moment()
        .tz("Asia/Ho_Chi_Minh")
        .add(7, "days")
        .format("YYYY-MM-DD"),
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
        from_date: moment().tz("Asia/Ho_Chi_Minh").format("YYYY-MM-DD"),
        to_date: moment()
          .tz("Asia/Ho_Chi_Minh")
          .add(7, "days")
          .format("YYYY-MM-DD"),
        status: "confirmed",
      };
    }

    console.log("Fetching appointments with params:", params);
    dispatch(getAppointments(params));
  };

  useEffect(() => {
    handleItemPress(items[0]);
  }, []);

  const flatListItems = appointments.map(
    (appointment: AppointmentResponeModelParams) => ({
      id: appointment.id,
      isBanner: true,
      name: appointment.title,
      note: appointment.note,
      service: appointment.service,
      start: appointment.start,
      end: appointment.end,
      times: appointment.time_slot
        ? `${i18n.t("appointment.times")}: ${moment(
            appointment.time_slot.start_time,
            "HH:mm:ss"
          )
            .tz("Asia/Ho_Chi_Minh")
            .format("HH:mm")} - ${moment(
            appointment.time_slot.end_time,
            "HH:mm:ss"
          )
            .tz("Asia/Ho_Chi_Minh")
            .format("HH:mm")}`
        : "",
      time: `${moment(appointment.start)
        .tz("Asia/Ho_Chi_Minh")
        .format(" HH:mm  DD/MM/YYYY ")}  -  ${moment(appointment.end)
        .tz("Asia/Ho_Chi_Minh")
        .format(" HH:mm  DD/MM/YYYY")}`,
      status:
        appointment.status === "Completed"
          ? i18n.t("appointment.completed")
          : appointment.status === "Pending"
          ? i18n.t("appointment.pending")
          : appointment.status === "Cancelled"
          ? i18n.t("appointment.cancelled")
          : i18n.t("appointment.confirmed"),
    })
  );

  const renderItem = (
    item: { id: number; name: string; status?: string },
    index: number
  ) => {
    const isSelected = item.id === selectedItem;
    return (
      <TouchableOpacity
        key={item.id}
        onPress={() => handleItemPress(item)}
        style={{
          marginBottom: 5,
          marginRight: 12,
          shadowColor: Colors.black,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        }}
      >
        <View
          br30
          paddingH-15
          paddingV-10
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
        bg: Colors.rgba(Colors.green30, 0.15),
        text: Colors.green10,
        icon: "check-circle" as const,
      },
      pending: {
        bg: Colors.rgba(Colors.yellow30, 0.15),
        text: Colors.yellow10,
        icon: "clock-outline" as const,
      },
      cancelled: {
        bg: Colors.rgba(Colors.red30, 0.15),
        text: Colors.red10,
        icon: "close-circle" as const,
      },
      confirmed: {
        bg: Colors.rgba(Colors.blue30, 0.15),
        text: Colors.blue10,
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
          shadowColor: Colors.black,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
          elevation: 8,
        }}
      >
        <LinearGradient
          colors={[
            Colors.white as string,
            Colors.rgba(Colors.primary, 0.05) as string,
          ]}
          style={{ borderRadius: 20 }}
        >
          <View padding-15 br20>
            {/* Header */}
            <View row spread centerV>
              <View row centerV>
                <Text h2_bold color={Colors.primary}>{`#${item.id
                  .toString()
                  .padStart(3)}`}</Text>
                {item.service?.single_price && (
                  <Text marginL-10 h3 color={Colors.secondary}>
                    {`${item.service.single_price.toLocaleString()} ₫`}
                  </Text>
                )}
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
                    {item.status}
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
                    <View row centerV marginT-8>
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
                </View>
              </View>

              {/* Notes if exists */}
              {item.note && (
                <View
                  marginT-10
                  padding-10
                  br10
                  backgroundColor={Colors.grey70}
                >
                  <Text h4>{item.note}</Text>
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
                    {`${i18n.t("appointment.cancelled_by")}: ${
                      item.cancelled_by_user.full_name
                    }`}
                  </Text>
                  {item.cancellation_note && (
                    <Text marginT-5 h4 color={Colors.red10}>
                      {`${i18n.t("appointment.cancel_reason")}: ${
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
                  title={i18n.t("appointment.cancel_appointment")}
                  onPress={() => handleCancelOrderPress(item.id)}
                  buttonStyle={{ marginTop: 15 }}
                  leftIcon={
                    <MaterialCommunityIcons
                      name="close-circle"
                      size={20}
                      color={Colors.red10}
                      style={{ marginRight: 8 }}
                    />
                  }
                />
              )}
            </View>
          </View>
        </LinearGradient>
      </Animated.View>
    );
  };

  return (
    <View flex bg-white>
      <AppBar title={i18n.t("appointment.scheduled")} />
      <View padding-15>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {items.map((item, index) => renderItem(item, index))}
        </ScrollView>

        {loading ? (
          <View>
            {[1, 2, 3].map((_, index) => (
              <View key={index}>{renderSkeletonItem()}</View>
            ))}
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

      <Modal visible={isModalVisible} transparent animationType="fade">
        <View
          flex
          center
          backgroundColor={Colors.rgba(Colors.black, 0.5)}
          style={{}}
        >
          <Animated.View
            entering={FadeInDown}
            style={{
              width: "85%",
              backgroundColor: Colors.white,
              borderRadius: 20,
              padding: 20,
              shadowColor: Colors.black,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 8,
              elevation: 8,
            }}
          >
            <Text h2_bold marginB-15>
              {i18n.t("appointment.cancel_appointment")}
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
              placeholder={i18n.t("appointment.cancel_appointment_reason")}
              value={note}
              onChangeText={setNote}
              multiline
            />

            <View row spread>
              <AppButton
                type="outline"
                title={i18n.t("appointment.cancel")}
                onPress={() => setModalVisible(false)}
              />
              <AppButton
                type="outline"
                title={i18n.t("appointment.confirm")}
                onPress={handleConfirmCancel}
              />
            </View>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
};

export default ScheduledPage;
