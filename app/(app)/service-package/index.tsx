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
import AppBar from "@/components/app-bar/AppBar";
import AppButton from "@/components/buttons/AppButton";
import { router } from "expo-router";

const ServicePackageScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { packages, isLoading } = useSelector(
    (state: RootState) => state.servicePackage
  );

  useEffect(() => {
    if (user?.id) {
      dispatch(getServicePackagesThunk(user.id));
    }
  }, [dispatch, user?.id]);

  if (isLoading) {
    return (
      <View flex center>
        <Text>Đang tải...</Text>
      </View>
    );
  }

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
      <View backgroundColor={Colors.blue80}>
        <View marginT-16 padding-16 br20>
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

  const handleBooking = (pkg: any) => {
    router.push({
      pathname: "/(app)/booking",
      params: {
        service_id: pkg.service_id,
        service_name: pkg.service_name,
        package_id: pkg.id,
      },
    });
  };

  return (
    <View flex bg-white>
      <AppBar back title="Gói dịch vụ của tôi" />
      <ScrollView>
        <View padding-16>
          {packages.length === 0 ? (
            <View center padding-16>
              <Text text70>Bạn chưa có gói dịch vụ nào</Text>
            </View>
          ) : (
            packages.map((pkg: any) => (
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

                  {/* Add booking button */}
                  {pkg.remaining_sessions > 0 && (
                    <View marginT-16>
                      <AppButton
                        title="Đặt lịch hẹn"
                        type="primary"
                        onPress={() => handleBooking(pkg)}
                      />
                    </View>
                  )}
                </View>
              </Card>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default ServicePackageScreen;
