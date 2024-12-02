import AppBar from '@/components/app-bar/AppBar'
import { useLanguage } from '@/hooks/useLanguage'
import { Feather } from '@expo/vector-icons'
import { ScrollView, StyleSheet } from 'react-native'
import { View, Text, Colors } from 'react-native-ui-lib'

const data = [
  {
    id: 1,
    device: "iPhone 16 Pro Max",
    ip: "192.168.1.1",
    location: "TP. Hồ Chí Minh",
    status: "hoạt động 10 ngày trước"
  },
  {
    id: 2,
    device: "Samsung Galaxy S21",
    ip: "192.168.1.2",
    location: "TP. Hà Nội",
    status: "hoạt động 3 tháng trước"
  },
  {
    id: 3,
    device: "Google Pixel 6",
    ip: "192.168.1.3",
    location: "TP. Đà Nẵng",
    status: "hoạt động 1 tháng trước"
  },
  {
    id: 4,
    device: "OnePlus 9",
    ip: "192.168.1.4",
    location: "TP. Hải Phòng",
    status: "hoạt động 2 tuần trước"
  },
  {
    id: 5,
    device: "Samsung Galaxy S21",
    ip: "192.168.1.5",
    location: "TP. Cần Thơ",
    status: "hoạt động 3 tháng trước"
  },
  {
    id: 6,
    device: "Xiaomi Mi 11",
    ip: "192.168.1.6",
    location: "TP. Nha Trang",
    status: "hoạt động 1 tuần trước"
  },
  {
    id: 7,
    device: "Samsung Galaxy S21",
    ip: "192.168.1.7",
    location: "TP. Huế",
    status: "hoạt động 3 tháng trước"
  },
  {
    id: 8,
    device: "Oppo Find X3",
    ip: "192.168.1.8",
    location: "TP. Vũng Tàu",
    status: "hoạt động 2 tháng trước"
  },
  {
    id: 9,
    device: "Samsung Galaxy S21",
    ip: "192.168.1.9",
    location: "TP. Quy Nhơn",
    status: "hoạt động 3 tháng trước"
  },
  {
    id: 10,
    device: "Huawei P40",
    ip: "192.168.1.10",
    location: "TP. Phú Quốc",
    status: "hoạt động 3 tháng trước"
  },
]

const HistoryLogin = () => {
  const { t } = useLanguage()
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
        {data.map((item) => (
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
                <Text h3_bold>{item.device}</Text>
                <Text h3>IP: {item.ip}</Text>
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