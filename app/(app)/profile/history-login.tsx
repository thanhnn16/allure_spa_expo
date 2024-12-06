import AppBar from '@/components/app-bar/AppBar'
import { useLanguage } from '@/hooks/useLanguage'
import { getUserHistoryLogin } from '@/redux/features/history-login/getUserHistoryLogin'
import { RootState } from '@/redux/store'
import { UserHistoryLogin } from '@/types/user.type'
import { Feather } from '@expo/vector-icons'
import { useEffect, useState } from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import { View, Text, Colors } from 'react-native-ui-lib'
import { useDispatch, useSelector } from 'react-redux'

const HistoryLogin = () => {
  const { t } = useLanguage();
  const dispatch = useDispatch();

  const [userHistory, setUserHistory] = useState<UserHistoryLogin[]>([]);

  const { history, isLoading} = useSelector((state: RootState) => state.historylogin);

  useEffect(() => {
    dispatch(getUserHistoryLogin())
    setUserHistory(history.data);
  }, [])

  if (isLoading) {
    return <View flex center>
      <Text>Loading...</Text>
    </View>
  }
  return (
    <View flex bg-white>

      <AppBar back title={t("auth.history_login.title")}/>
      <ScrollView style={{ flex: 1, paddingHorizontal: 20 }}>
        <Text h2_bold>{t("auth.history_login.current_device")}</Text>
        <View style={styles.section}>
          <View gap-12 paddingB-20>
            <View
              paddingT-12
              style={{
                width: 56,
                height: 56,
                borderRadius: 12,
                backgroundColor: Colors.primary_blur,
                borderWidth: 1,
                borderColor: Colors.primary_light,
                alignItems: "center",
                justifyContent: "center",
                alignSelf: "center",
              }}
            >
              <Feather
                name={"smartphone" as any}
                size={24}
                color={Colors.primary}
              />
            </View>
            <Text center h3_bold>iPhone 16 Pro Max</Text>
          </View>
          <View row gap-12>

            <View>

              <Text h3>IP: 192.168.1.1</Text>
              <Text h4>TP. Hồ Chí Minh ∙ đang hoạt động</Text>
            </View>
          </View>
        </View>
        <Text h2_bold>{t("auth.history_login.other_device")}</Text>
        {userHistory.map((item: any) => (
          <View key={item.id} style={styles.section}>
            <View row gap-12>
              <View
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 12,
                  backgroundColor: Colors.primary_blur,
                  borderWidth: 1,
                  borderColor: Colors.primary_light,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Feather
                  name={"smartphone" as any}
                  size={24}
                  color={Colors.primary}
                />
              </View>
              <View>
                <Text h3_bold>{item.device_type}</Text>
                <Text h3>IP: {item.ip_address}</Text>
                <Text h4>{item.location} ∙ {item.status}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  )
}

export default HistoryLogin

const styles = StyleSheet.create({
  section: {
    padding: 16,
    backgroundColor: Colors.white,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: Colors.grey40,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    borderColor: Colors.primary_light,
    borderWidth: 1,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  }
})