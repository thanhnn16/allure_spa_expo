import { useEffect } from "react";
import { View, Text, Card, SkeletonView } from "react-native-ui-lib";
import { useLocalSearchParams, router } from "expo-router";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import AppBar from "@/components/app-bar/AppBar";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { useLanguage } from "@/hooks/useLanguage";
import { getServicePackageDetailThunk } from "@/redux/features/servicePackage/getServicePackageDetailThunk";
import { getUsageHistoryThunk } from "@/redux/features/servicePackage/getUsageHistoryThunk";
import { clearCurrentPackage } from "@/redux/features/servicePackage/servicePackageSlice";
import moment from 'moment';
import 'moment/locale/vi';
import { Dimensions } from "react-native";
import { LoadingScreen } from "@/app/loading";
import { ScrollView } from "react-native";

const ServicePackageDetailScreen = () => {
    const { id } = useLocalSearchParams();
    const { t } = useLanguage();
    const dispatch = useDispatch<AppDispatch>();
    const screenWidth = Dimensions.get('window').width;

    const { currentPackage, usageHistory, isLoadingDetail, isLoadingHistory } = useSelector(
        (state: RootState) => state.servicePackage
    );

    useEffect(() => {
        if (id) {
            dispatch(getServicePackageDetailThunk(Number(id)));
            dispatch(getUsageHistoryThunk(Number(id)));
        }
        return () => {
            dispatch(clearCurrentPackage());
        };
    }, [dispatch, id]);

    if (isLoadingDetail || isLoadingHistory) {
        return (
            <View flex bg-background>
                <AppBar back title={t("service_package.service_history")} />
                <View padding-16>
                    {/* SkeletonView cho next session */}
                    <Card marginB-16 elevation={2} enableShadow containerStyle={{ borderRadius: 16 }}>
                        <View padding-16>
                            <View row centerV>
                                <SkeletonView borderRadius={100} width={24} height={24} />
                                <View marginL-12>
                                    <SkeletonView width={screenWidth * 0.4} height={20} />
                                    <SkeletonView width={screenWidth * 0.3} height={16} marginT-4 />
                                </View>
                            </View>
                        </View>
                    </Card>

                    {/* SkeletonView cho treatment sessions */}
                    {[1, 2, 3].map((_, index) => (
                        <Card
                            key={index}
                            elevation={2}
                            marginB-12
                            enableShadow
                            containerStyle={{ borderRadius: 16 }}
                        >
                            <View padding-16>
                                <View row spread>
                                    <View>
                                        <SkeletonView width={screenWidth * 0.3} height={20} />
                                        <SkeletonView width={screenWidth * 0.4} height={16} marginT-8 />
                                        <SkeletonView width={screenWidth * 0.5} height={16} marginT-4 />
                                    </View>
                                    <SkeletonView width={screenWidth * 0.2} height={16} />
                                </View>
                                <SkeletonView width={screenWidth * 0.7} height={16} marginT-8 />
                            </View>
                        </Card>
                    ))}
                </View>
            </View>
        );
    }

    const formatDateTime = (dateString: string) => {
        return moment(dateString).format('DD/MM/YYYY HH:mm');
    };

    const renderTreatmentSession = (session: any, index: number) => (
        <Card
            key={session.id}
            elevation={2}
            marginB-12
            enableShadow
            containerStyle={{ borderRadius: 16 }}
        >
            <View padding-16>
                <View row spread>
                    <View>
                        <Text text70BO color={Colors.text}>
                            {t("service_package.session")} #{currentPackage?.total_sessions - index}
                        </Text>

                        {/* Thời gian */}
                        <View row centerV marginT-8>
                            <MaterialCommunityIcons
                                name="calendar"
                                size={16}
                                color={Colors.icon}
                            />
                            <Text text80 color={Colors.text} marginL-4>
                                {session.start_time}
                            </Text>
                        </View>

                        {/* Nhân viên thực hiện */}
                        <View row centerV marginT-4>
                            <MaterialCommunityIcons
                                name="account"
                                size={16}
                                color={Colors.icon}
                            />
                            <Text text80 color={Colors.text} marginL-4>
                                {t("service_package.performed_by")}: {session.staff?.full_name || "N/A"}
                            </Text>
                        </View>
                    </View>

                    {/* Kết quả */}
                    {session.result && (
                        <View>
                            <Text text80 color={Colors.text}>
                                <Text text80 color={Colors.text}>
                                    {t("service_package.result")}:{" "}
                                </Text>
                                {session.result}
                            </Text>
                        </View>
                    )}
                </View>

                {/* Ghi chú */}
                {session.notes && (
                    <View marginT-8>
                        <Text text80 color={Colors.text}>
                            <Text text80 color={Colors.text}>
                                {t("service_package.notes")}:{" "}
                            </Text>
                            {session.notes}
                        </Text>
                    </View>
                )}
            </View>
        </Card>
    );

    const renderNextSession = () => {
        if (!currentPackage?.next_session_date) return null;

        return (
            <Card
                marginB-16
                elevation={2}
                enableShadow
                containerStyle={{ borderRadius: 16, backgroundColor: Colors.primary_light }}
            >
                <View padding-16>
                    <View row centerV>
                        <MaterialCommunityIcons
                            name="calendar-clock"
                            size={24}
                            color={Colors.primary}
                        />
                        <View marginL-12>
                            <Text text70BO color={Colors.primary}>
                                {t("service_package.next_session")}
                            </Text>
                            <Text text80 color={Colors.primary} marginT-4>
                                {currentPackage.next_session_date}
                            </Text>
                        </View>
                    </View>
                </View>
            </Card>
        );
    };

    return (
        <View flex bg-background>
            <AppBar back title={t("service_package.service_history")} />

            <ScrollView>
                <View padding-16>
                    {/* Hiển thị thông tin buổi dịch vụ tiếp theo */}
                    {renderNextSession()}

                    {/* Lịch sử các buổi điều trị */}
                    {currentPackage?.treatment_sessions?.length ? (
                        currentPackage.treatment_sessions.map((session: any, index: number) =>
                            renderTreatmentSession(session, index)
                        )
                    ) : (
                        <View center padding-32>
                            <MaterialCommunityIcons
                                name="history"
                                size={48}
                                color={Colors.icon}
                            />
                            <Text text70 marginT-16 color={Colors.icon}>
                                {t("service_package.no_service_history")}
                            </Text>
                        </View>
                    )}
                </View>
            </ScrollView>
        </View>
    );
};

export default ServicePackageDetailScreen; 