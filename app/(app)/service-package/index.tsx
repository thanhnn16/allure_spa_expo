import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { getServicePackagesThunk } from "@/redux/features/servicePackage/getServicePackagesThunk";
import { ScrollView } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  View,
  Text,
  Card,
  ProgressBar,
  SkeletonView,
} from "react-native-ui-lib";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import AppBar from "@/components/app-bar/AppBar";
import AppButton from "@/components/buttons/AppButton";
import { router } from "expo-router";
import { Dimensions } from "react-native";
import i18n from "@/languages/i18n";

const ServicePackageScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.user);
  const { packages, isLoading } = useSelector(
    (state: RootState) => state.servicePackage
  );
  const { width } = Dimensions.get("window");

  useEffect(() => {
    if (user?.id) {
      dispatch(getServicePackagesThunk(user.id));
    }
  }, [dispatch, user?.id]);

  if (isLoading) {
    return (
      <View flex bg-white>
        <AppBar back title={i18n.t("service_package.title")} />
        <ScrollView>
          <View padding-16>
            {[1, 2].map((item) => (
              <Card
                key={item}
                elevation={2}
                marginB-16
                enableShadow
                containerStyle={{ borderRadius: 16 }}
              >
                <View padding-16>
                  <SkeletonView height={24} width={width * 0.6} />
                  <SkeletonView height={16} width={width * 0.4} marginT-8 />
                  <SkeletonView height={8} width={width * 0.8} marginT-16 />
                  <View row spread marginT-16>
                    {[1, 2, 3].map((i) => (
                      <View key={i} flex center>
                        <SkeletonView height={14} width={width * 0.15} />
                        <SkeletonView
                          height={18}
                          width={width * 0.1}
                          marginT-4
                        />
                      </View>
                    ))}
                  </View>
                </View>
              </Card>
            ))}
          </View>
        </ScrollView>
      </View>
    );
  }

  const renderPackageType = (packageType: any) => {
    return (
      <View padding-8 br20 backgroundColor={Colors.primary_light} marginL-8>
        <Text text80 color={Colors.primary}>
          {packageType.name}
        </Text>
      </View>
    );
  };

  const renderSessionInfo = (label: string, value: number) => (
    <View
      flex-1
      marginH-4
      center
      style={{
        borderRadius: 16,
        padding: 12,
        backgroundColor: Colors.background,
        shadowColor: Colors.text,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
      }}
    >
      <Text text80 color={Colors.icon} center numberOfLines={1}>
        {label}
      </Text>
      <Text text60BL marginT-4 color={Colors.primary} center>
        {value}
      </Text>
    </View>
  );

  const renderNextAppointment = (nextAppointment: any) => {
    if (!nextAppointment) return null;

    return (
      <View
        marginT-16
        padding-16
        br20
        style={{
          backgroundColor: Colors.background,
          shadowColor: Colors.text,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 8,
          elevation: 2,
        }}
      >
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
              name="calendar-clock"
              size={20}
              color={Colors.primary}
            />
          </View>
          <View marginL-12 flex>
            <Text text70BO color={Colors.text}>
              {i18n.t("appointment.next_appointment")}
            </Text>
            <Text text80 color={Colors.text} marginT-4>
              {nextAppointment.date}
            </Text>

            <View row centerV marginT-8>
              <View
                center
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 12,
                  backgroundColor: Colors.primary_light,
                  marginRight: 8,
                }}
              >
                <MaterialCommunityIcons
                  name="clock-outline"
                  size={14}
                  color={Colors.primary}
                />
              </View>
              <Text text80 color={Colors.text}>
                {nextAppointment.time.start} - {nextAppointment.time.end}
              </Text>
            </View>

            {nextAppointment.staff && (
              <View row centerV marginT-8>
                <View
                  center
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    backgroundColor: Colors.primary_light,
                    marginRight: 8,
                  }}
                >
                  <MaterialCommunityIcons
                    name="account"
                    size={14}
                    color={Colors.primary}
                  />
                </View>
                <Text text80 color={Colors.text}>
                  {i18n.t("appointment.performed_by")}:{" "}
                  {nextAppointment.staff.full_name}
                </Text>
              </View>
            )}
            <View marginT-8>
              <AppButton
                type="text"
                onPress={() => {
                  router.push(`/(app)/appointment/${nextAppointment.id}`);
                }}
                children={
                  <View row centerV>
                    <Text text80 color={Colors.primary}>
                      {i18n.t("appointment.detail")}
                    </Text>
                    <MaterialCommunityIcons
                      name="chevron-right"
                      size={16}
                      style={{ marginTop: 2 }}
                      color={Colors.primary}
                    />
                  </View>
                }
              />
            </View>
          </View>
        </View>
      </View>
    );
  };

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
    <View flex bg-background>
      <AppBar back title={i18n.t("service_package.title")} />
      <ScrollView>
        <View padding-16>
          {packages.length === 0 ? (
            <View center padding-32 bg-background br20>
              <MaterialCommunityIcons
                name="package-variant"
                size={48}
                color={Colors.icon}
              />
              <Text text70 marginT-16 color={Colors.icon}>
                {i18n.t("service_package.no_packages")}
              </Text>
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
                <View padding-16>
                  {/* Header */}
                  <View row spread centerV>
                    <View row centerV flex>
                      <Text text65M flex color={Colors.text}>
                        {pkg.service_name}
                      </Text>
                      {renderPackageType(pkg.package_type)}
                    </View>
                  </View>

                  <Text text80 color={Colors.icon} marginT-8>
                    {pkg.formatted_expiry_date ? (
                      <>
                        <MaterialCommunityIcons
                          name="clock-outline"
                          size={14}
                          color={Colors.icon}
                        />
                        {" " +
                          i18n.t("service_package.expires_on") +
                          ": " +
                          pkg.formatted_expiry_date}
                      </>
                    ) : (
                      i18n.t("service_package.unlimited_time")
                    )}
                  </Text>

                  {/* Progress */}
                  <View marginT-24>
                    <View row spread marginB-8>
                      <Text text80 color={Colors.primary}>
                        {i18n.t("service_package.progress")}
                      </Text>
                      <Text text80 color={Colors.primary}>{`${Math.round(
                        pkg.progress_percentage
                      )}%`}</Text>
                    </View>
                    <ProgressBar
                      progress={pkg.progress_percentage}
                      progressColor={
                        pkg.progress_percentage >= 100
                          ? Colors.secondary
                          : Colors.primary
                      }
                      style={{ height: 8 }}
                    />
                  </View>

                  {/* Sessions Info */}
                  <View row centerV marginH-4 marginT-24>
                    {renderSessionInfo(
                      i18n.t("service_package.total_sessions"),
                      pkg.total_sessions
                    )}
                    {renderSessionInfo(
                      i18n.t("service_package.used_sessions"),
                      pkg.used_sessions
                    )}
                    {renderSessionInfo(
                      i18n.t("service_package.remaining_sessions"),
                      pkg.remaining_sessions
                    )}
                  </View>

                  {/* Next Appointment */}
                  {renderNextAppointment(pkg.next_appointment_details)}

                  {/* Booking button */}
                  {pkg.remaining_sessions > 0 && (
                    <View marginT-24>
                      <AppButton
                        title={i18n.t("service_package.book_appointment")}
                        type="outline"
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
