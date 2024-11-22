import { Colors, Text, View, SkeletonView } from "react-native-ui-lib";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAppointmentDetail } from "@/redux/features/appointment/appointmentThunk";
import AppBar from "@/components/app-bar/AppBar";
import i18n from "@/languages/i18n";
import moment from "moment";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image, ScrollView, Dimensions } from "react-native";
import { AppointmentResponeModelParams } from "@/types/service.type";
import AppButton from "@/components/buttons/AppButton";

const AppointmentDetailPage = () => {
  const { id } = useLocalSearchParams();
  const dispatch = useDispatch();
  const [appointment, setAppointment] =
    useState<AppointmentResponeModelParams | null>(null);
  const { width } = Dimensions.get("window");

  useEffect(() => {
    if (id) {
      dispatch(getAppointmentDetail(id)).then((result: any) => {
        setAppointment(result.payload);
      });
    }
  }, [id]);

  if (!appointment) {
    return (
      <View flex bg-white>
        <AppBar title={i18n.t("appointment.detail")} back />
        <ScrollView>
          <View flex padding-24>
            {/* Header SkeletonView */}
            <View row spread centerV>
              <SkeletonView width={80} height={30} />
              <View row centerV>
                <SkeletonView width={120} height={30} />
              </View>
            </View>

            {/* Service Image SkeletonView */}
            <View marginT-20>
              <SkeletonView height={200} width={width - 48} borderRadius={15} />
              <SkeletonView marginT-15 width={width - 48} height={24} />
              <SkeletonView marginT-5 width={120} height={20} />
            </View>

            {/* Info Sections SkeletonView */}
            {[1, 2, 3].map((_, index) => (
              <View key={index} row centerV marginT-15>
                <SkeletonView circle width={24} height={24} borderRadius={24} />
                <View marginL-10>
                  <SkeletonView width={150} height={20} />
                  <SkeletonView marginT-5 width={100} height={16} />
                </View>
              </View>
            ))}

            {/* Details SkeletonView */}
            <View marginT-20 style={{ gap: 15 }}>
              {[1, 2].map((_, index) => (
                <View key={index} row centerV>
                  <SkeletonView
                    circle
                    width={24}
                    height={24}
                    borderRadius={24}
                  />
                  <SkeletonView marginL-10 width={120} height={16} />
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

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
    statusColors[appointment.status.toLowerCase() as keyof typeof statusColors];

  return (
    <View flex bg-white>
      <AppBar title={i18n.t("appointment.detail")} back />
      <ScrollView>
        <View flex padding-24>
          {/* Header */}
          <View row spread centerV>
            <Text h1_bold color={Colors.primary}>{`#${appointment.id
              .toString()
              .padStart(3)}`}</Text>
            <View row centerV>
              <MaterialCommunityIcons
                name={statusConfig.icon}
                size={24}
                color={statusConfig.text}
              />
              <View marginL-8 padding-8 br30 backgroundColor={statusConfig.bg}>
                <Text h3 color={statusConfig.text}>
                  {appointment.status}
                </Text>
              </View>
            </View>
          </View>

          {/* Service Info */}
          <View marginT-20>
            <Image
              source={require("@/assets/images/banner.png")}
              style={{
                width: "100%",
                height: 200,
                borderRadius: 15,
                backgroundColor: Colors.grey60,
              }}
            />
            <Text h2_bold marginT-15>
              {appointment.title}
            </Text>
            <Text h2 color={Colors.secondary} marginT-5>
              {`${appointment.price?.toLocaleString()} ₫`}
            </Text>
          </View>

          {/* Staff Info */}
          {appointment.staff && (
            <View row centerV marginT-15>
              <MaterialCommunityIcons
                name="account"
                size={24}
                color={Colors.primary}
              />
              <View marginL-10>
                <Text h3_bold>{i18n.t("appointment.staff")}</Text>
                <Text h3>{appointment.staff.full_name}</Text>
              </View>
            </View>
          )}

          {/* Customer Info */}
          <View row centerV marginT-15>
            <MaterialCommunityIcons
              name="account-circle"
              size={24}
              color={Colors.primary}
            />
            <View marginL-10>
              <Text h3_bold>{i18n.t("appointment.customer")}</Text>
              <Text h3>{appointment.user?.full_name}</Text>
            </View>
          </View>

          {/* Slots Info */}
          <View row centerV marginT-15>
            <MaterialCommunityIcons
              name="seat"
              size={24}
              color={Colors.primary}
            />
            <View marginL-10>
              <Text h3_bold>{i18n.t("appointment.slots")}</Text>
              <Text h3>
                {appointment.slots} {i18n.t("appointment.seats")}
              </Text>
            </View>
          </View>

          {/* Appointment Details */}
          <View marginT-20 style={{ gap: 15 }}>
            {/* Time Slot */}
            {appointment.time_slot && (
              <View row centerV>
                <MaterialCommunityIcons
                  name="clock-time-four"
                  size={24}
                  color={Colors.primary}
                />
                <Text marginL-10 h3>
                  {`${moment(
                    appointment.time_slot.start_time,
                    "HH:mm:ss"
                  ).format("HH:mm")} - ${moment(
                    appointment.time_slot.end_time,
                    "HH:mm:ss"
                  ).format("HH:mm")}`}
                </Text>
              </View>
            )}

            {/* Date */}
            <View row centerV>
              <MaterialCommunityIcons
                name="calendar"
                size={24}
                color={Colors.primary}
              />
              <Text marginL-10 h3>
                {moment(appointment.start).format("DD/MM/YYYY")}
              </Text>
            </View>

            {/* Notes */}
            {appointment.note && (
              <View marginT-10 padding-15 br20 backgroundColor={Colors.grey70}>
                <Text h3_bold marginB-5>
                  {i18n.t("appointment.notes")}:
                </Text>
                <Text h3>{appointment.note}</Text>
              </View>
            )}

            {/* Cancellation Info */}
            {appointment.status === "cancelled" &&
              appointment.cancelled_by_user && (
                <View
                  marginT-10
                  padding-15
                  br10
                  backgroundColor={Colors.rgba(Colors.red30, 0.1)}
                >
                  <Text h3 color={Colors.red10}>
                    {`${i18n.t("appointment.cancelled_by")}: ${
                      appointment.cancelled_by_user.full_name
                    }`}
                  </Text>
                  {appointment.cancellation_note && (
                    <Text marginT-5 h3 color={Colors.red10}>
                      {`${i18n.t("appointment.cancel_reason")}: ${
                        appointment.cancellation_note
                      }`}
                    </Text>
                  )}
                </View>
              )}
          </View>

          {/* Edit Button - Only show for pending appointments */}
          {appointment.status === "pending" && (
            <View marginT-20>
              <AppButton
                  type="primary"
                  onPress={() =>
                      router.push({
                        pathname: "/booking",
                        params: {
                          service_id: appointment.service.id,
                          service_name: appointment.service.service_name,
                          edit_mode: "true",
                          appointment_id: appointment.id,
                          note: appointment.note,
                          date: appointment.start,
                          time_slot_id: appointment.time_slot.id,
                          slots: appointment.slots,
                        },
                      })
                  }
                  children={
                    <View row gap-4 centerV>
                      <MaterialCommunityIcons
                          name="pencil"
                          size={16}
                          color={Colors.white}
                      />
                      <Text h4 white>
                        {i18n.t("appointment.edit")}
                      </Text>
                    </View>
                  }
              />
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default AppointmentDetailPage;
