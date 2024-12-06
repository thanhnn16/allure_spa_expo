import React from "react";
import { View, Text, TouchableOpacity, Image, Card, Colors, Button } from "react-native-ui-lib";
import ArrowRight from "@/assets/icons/arrow.svg";
import { useLanguage } from "@/hooks/useLanguage";

import { useAuth } from "@/hooks/useAuth";
import { Href, router } from "expo-router";
import AppBar from "@/components/app-bar/AppBar";
import { useDispatch } from "react-redux";
import { getUserThunk } from "@/redux/features/users/getUserThunk";
import { Ionicons } from '@expo/vector-icons';

interface ProfileDetailProps { }

const ProfileDetail = (props: ProfileDetailProps) => {
  const { t } = useLanguage();

  const { user, setAuthUser } = useAuth();
  const dispatch = useDispatch();

  React.useEffect(() => {
    const fetchUser = async () => {
      const updatedUser = await dispatch(getUserThunk()).unwrap();
      setAuthUser && setAuthUser(updatedUser);
    };
    fetchUser();
  }, [user?.avatar_url]);

  const needsVerification = user && (!user.phone_verified_at || !user.email_verified_at);

  const renderVerificationStatus = () => {
    if (!needsVerification) {
      return (
        <Card marginT-16 padding-16 bg-grey70>
          <View row centerV marginB-12>
            <Ionicons name="checkmark-circle" size={20} color={Colors.green30} />
            <Text h3_bold marginL-8 green30>{t("profile.verification_complete")}</Text>
          </View>
          
          <View row spread centerV marginB-8>
            <View row centerV flex-1>
              <Ionicons name="phone-portrait-outline" size={16} color={Colors.grey40} />
              <Text h3 grey40 marginL-8>{t("profile.phone_verified")}</Text>
            </View>
            <Ionicons name="checkmark-circle" size={16} color={Colors.green30} />
          </View>

          <View row spread centerV>
            <View row centerV flex-1>
              <Ionicons name="mail-outline" size={16} color={Colors.grey40} />
              <Text h3 grey40 marginL-8>{t("profile.email_verified")}</Text>
            </View>
            <Ionicons name="checkmark-circle" size={16} color={Colors.green30} />
          </View>
        </Card>
      );
    }

    return (
      <Card marginT-16 padding-16 bg-grey70>
        <View row centerV marginB-12>
          <Ionicons name="warning" size={20} color={Colors.red30} />
          <Text h3_bold marginL-8 red30>{t("profile.verification_required")}</Text>
        </View>
        
        {!user?.phone_verified_at && (
          <View row spread centerV marginB-8>
            <View row centerV flex-1>
              <Ionicons name="phone-portrait-outline" size={16} color={Colors.grey40} />
              <Text h3 grey40 marginL-8>{t("profile.phone_not_verified")}</Text>
            </View>
            <Button 
              label={t("profile.verify_now")}
              size="small"
              backgroundColor={Colors.primary}
              onPress={() => router.push("/(app)/profile/verify-phone")}
            />
          </View>
        )}

        {!user?.email_verified_at && (
          <View row spread centerV>
            <View row centerV flex-1>
              <Ionicons name="mail-outline" size={16} color={Colors.grey40} />
              <Text h3 grey40 marginL-8>{t("profile.email_not_verified")}</Text>
            </View>
            <Button 
              label={t("profile.verify_now")}
              size="small"
              backgroundColor={Colors.primary}
              onPress={() => router.push("/(app)/profile/verify-email")}
            />
          </View>
        )}
      </Card>
    );
  };

  return (
    <View flex bg-white>
      <AppBar back title={t("profile.title")} />
      <View flex paddingH-24>
        <View center marginT-30 gap-7>
          <Image
            width={128}
            height={128}
            br100
            errorSource={require("@/assets/images/logo/logo.png")}
            style={{ borderColor: "#D5D6CD", borderWidth: 1 }}
            source={
              user?.avatar_url
                ? {
                  uri: user.avatar_url,
                  headers: {
                    Pragma: 'no-cache'
                  }
                }
                : require("@/assets/images/logo/logo.png")
            }
          />
          <Text h1_bold>{user?.full_name || t("profile.username")}</Text>
          <Text h2 gray>{user?.phone_number || ""}</Text>
        </View>

        {renderVerificationStatus()}

        <Card width={"100%"} marginT-20>
          {[
            {
              title: t("profile.edit_profile"),
              icon: require("@/assets/images/edit.png"),
              onPress: () => {
                router.push("/(app)/profile/edit");
              },
            },
            {
              title: t("profile.change_password"),
              icon: require("@/assets/images/key.png"),
              onPress: () => {
                router.push("/(app)/profile/change-password");
              },
            },
            {
              title: t("profile.history_login"),
              icon: require("@/assets/images/global.png"),
              onPress: () => {
                router.push("/profile/history-login" as Href);
              },
            },
            {
              title: t("profile.dowload_information"),

              icon: require("@/assets/images/dowload.png"),
              onPress: () => {
                console.log("download");
              },
            },
            {
              title: t("profile.delete_account"),
              icon: require("@/assets/images/deleteacount.png"),
              onPress: () => {
                router.push("/(app)/profile/delete-account");
              },
            },
          ].map((item, index) => (
            <TouchableOpacity key={index} onPress={item.onPress}>
              <View row padding-10 gap-20 center>
                <TouchableOpacity
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 50,
                    backgroundColor: "#F7F7F7",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Image source={item.icon} width={24} height={24} />
                </TouchableOpacity>
                <View flex gap-5>
                  <Text h3_bold>{item.title}</Text>
                </View>
                <Image source={ArrowRight} />
              </View>
            </TouchableOpacity>
          ))}
        </Card>
      </View>
    </View>
  );
};

export default ProfileDetail;
