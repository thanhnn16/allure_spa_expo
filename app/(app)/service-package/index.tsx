import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { getServicePackagesThunk } from "@/redux/features/servicePackage/getServicePackagesThunk";
import { ScrollView } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { View, Text, Card, ProgressBar } from "react-native-ui-lib";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";

const ServicePackageScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.user);
  const servicePackages = user?.service_packages || [];

  useEffect(() => {
    dispatch(getServicePackagesThunk());
  }, [dispatch]);

  const renderPackageType = (packageType: any) => {
    return (
      <View padding-4 br100 bg-white marginL-8>
        <Text text70 white>
          {packageType.name}
        </Text>
      </View>
    );
  };

  const renderNextAppointment = (nextAppointment: any) => {
    if (!nextAppointment) return null;

    return (
      <View marginT-16 padding-16 br20 backgroundColor={Colors.blue80}>
        <View row centerV>
          <MaterialCommunityIcons
            name="calendar-clock"
            size={20}
            color={Colors.blue30}
          />
          <View marginL-12 flex>
            <Text text70BO color={Colors.blue20}>
              Lịch hẹn sắp tới
            </Text>
            <Text text80 color={Colors.blue20} marginT-4>
              {nextAppointment.date}
            </Text>

            <View row centerV marginT-8>
              <MaterialCommunityIcons
                name="clock-outline"
                size={16}
                color={Colors.blue30}
              />
              <Text text80 color={Colors.blue20} marginL-4>
                {nextAppointment.time.start} - {nextAppointment.time.end}
              </Text>
            </View>

            {nextAppointment.staff && (
              <View row centerV marginT-8>
                <MaterialCommunityIcons
                  name="account"
                  size={16}
                  color={Colors.blue30}
                />
                <Text text80 color={Colors.blue20} marginL-4>
                  Thực hiện bởi: {nextAppointment.staff.full_name}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    );
  };

  const renderSessionInfo = (label: string, value: number) => (
    <View flex center>
      <Text text80 grey40>
        {label}
      </Text>
      <Text text70BO marginT-4>
        {value}
      </Text>
    </View>
  );

  return (
    <ScrollView style={{ backgroundColor: Colors.grey70 }}>
      <View padding-16>
        {servicePackages.map((pkg: any) => (
          <Card
            key={pkg.id}
            elevation={2}
            marginB-16
            enableShadow
            containerStyle={{ borderRadius: 16 }}
          >
            <Card.Section
              content={[
                {
                  text: pkg.service_name,
                  contentType: true,
                },
              ]}
            />
            <View padding-16>
              {/* Header */}
              <View row spread centerV>
                <View row centerV flex>
                  <Text text65M flex>
                    {pkg.service_name}
                  </Text>
                  {renderPackageType(pkg.package_type)}
                </View>
              </View>

              <Text text80 grey40 marginT-8>
                Hết hạn: {pkg.formatted_expiry_date || "Không giới hạn"}
              </Text>

              {/* Progress */}
              <View marginT-16>
                <ProgressBar
                  progress={pkg.progress_percentage}
                  progressColor={
                    pkg.progress_percentage >= 100
                      ? Colors.green30
                      : Colors.blue30
                  }
                />
              </View>

              {/* Sessions Info */}
              <View row spread marginT-16>
                {renderSessionInfo("Tổng số buổi", pkg.total_sessions)}
                {renderSessionInfo("Đã sử dụng", pkg.used_sessions)}
                {renderSessionInfo("Còn lại", pkg.remaining_sessions)}
              </View>

              {/* Next Appointment */}
              {renderNextAppointment(pkg.next_appointment_details)}
            </View>
          </Card>
        ))}
      </View>
    </ScrollView>
  );
};

export default ServicePackageScreen;
