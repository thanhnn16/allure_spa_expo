import { View, Text } from "react-native-ui-lib";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { router } from "expo-router";
import { Dimensions } from "react-native";
import i18n from "@/languages/i18n";

interface UpcomingAppointmentProps {
  appointment: {
    id: string;
    date: string;
    time: {
      start: string;
      end: string;
    };
    staff: {
      full_name: string;
    };
    service_name: string;
  };
}

const UpcomingAppointment = ({ appointment }: UpcomingAppointmentProps) => {
  const { width } = Dimensions.get("window");

  return (
    <View marginB-20>
      <Text text60BO marginB-12 color={Colors.text}>
        {i18n.t("home.upcoming_appointment")}
      </Text>

      <View 
        style={{
          backgroundColor: Colors.white,
          borderRadius: 16,
          padding: 16,
          shadowColor: Colors.text,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 3,
        }}
      >
        {/* Service Name */}
        <Text text70BO color={Colors.primary} marginB-8>
          {appointment.service_name}
        </Text>

        {/* Date and Time Section */}
        <View row centerV marginB-12>
          <View
            center
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: Colors.primary_light,
            }}
          >
            <MaterialCommunityIcons
              name="calendar-clock"
              size={20}
              color={Colors.primary}
            />
          </View>
          <View marginL-12>
            <Text text80 color={Colors.text}>
              {appointment.date}
            </Text>
            <Text text80 color={Colors.text} marginT-4>
              {appointment.time.start} - {appointment.time.end}
            </Text>
          </View>
        </View>

        {/* Staff Section */}
        <View row centerV>
          <View
            center
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: Colors.primary_light,
            }}
          >
            <MaterialCommunityIcons
              name="account"
              size={20}
              color={Colors.primary}
            />
          </View>
          <View marginL-12>
            <Text text80 color={Colors.text}>
              {i18n.t("common.staff")}
            </Text>
            <Text text80 color={Colors.text} marginT-4>
              {appointment.staff.full_name}
            </Text>
          </View>
        </View>

        {/* View Detail Button */}
        <View
          style={{
            position: "absolute",
            right: 16,
            top: 16,
          }}
        >
          <Text
            text80
            color={Colors.primary}
            onPress={() => router.push("/service-package")}
          >
            {i18n.t("common.view_detail")} →
          </Text>
        </View>
      </View>
    </View>
  );
};

export default UpcomingAppointment;
