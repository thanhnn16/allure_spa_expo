import { useLanguage } from "@/hooks/useLanguage";


import { View, Text, Image } from "react-native-ui-lib";
import AppBar from "@/components/app-bar/AppBar";
import * as Application from "expo-application";
import { ScrollView } from "react-native";

interface AboutAppProps { }

const AboutApp = () => {
  const { t } = useLanguage();

  const appName = Application.applicationName;
  const appVersion = Application.nativeApplicationVersion;
  const buildVersion = Application.nativeBuildVersion;

  const data = [
    {
      title: "Trang chủ",
      content: "Giao diện trang chủ hiển thị logo của Spa, dịch vụ nổi bật, sản phẩm bán chạy và các tin tức mới nhất. Khách hàng có thể nhanh chóng điều hướng đến giỏ hàng, tìm kiếm sản phẩm hoặc cập nhật thông báo và thông tin cá nhân."
    },
    {
      title: "Chi tiết sản phẩm và dịch vụ",
      content: "Khách hàng có thể xem chi tiết các sản phẩm mỹ phẩm và liệu trình như tên, hình ảnh, giá, mô tả, thành phần, cách sử dụng, cũng như đọc và để lại bình luận, đánh giá về sản phẩm và dịch vụ."
    },
    {
      title: "Tìm kiếm thông minh",
      content: "Chức năng tìm kiếm giúp khách hàng dễ dàng tìm thấy các sản phẩm hoặc dịch vụ chỉ bằng cách nhập tên hoặc từ khóa liên quan."
    },
    {
      title: "Đặt lịch hẹn",
      content: "Khách hàng có thể đặt lịch hẹn với Spa trực tiếp từ ứng dụng, chọn dịch vụ, ngày giờ thuận tiện, và biết trước tổng chi phí cần thanh toán."
    },
    {
      title: "Đặt hàng trực tuyến",
      content: "Dễ dàng thêm sản phẩm vào giỏ hàng, xem chi tiết đơn hàng và thông tin vận chuyển trước khi thanh toán. Khách hàng chỉ cần đăng nhập để thực hiện các giao dịch mua sắm."
    },
    {
      title: "Quản lý đơn hàng",
      content: "Ứng dụng cung cấp danh sách và chi tiết về các đơn hàng đã đặt, giúp khách hàng theo dõi tình trạng và lịch sử mua sắm của mình."
    },
    {
      title: "Thanh toán tiện lợi",
      content: "Khách hàng có thể chọn phương thức thanh toán và vận chuyển phù hợp, đồng thời quản lý thông tin cá nhân và đơn hàng ngay trong ứng dụng."
    },
    {
      title: "Thông báo và ưu đãi",
      content: "Ứng dụng cập nhật các thông báo, chương trình khuyến mãi và ưu đãi đặc biệt từ Spa, giúp khách hàng không bỏ lỡ bất kỳ cơ hội nào."
    }
  ]

  return (
    <View flex bg-white>
      <AppBar back title={t("aboutapp.title")} />
      <ScrollView>
        <View paddingH-24 paddingV-20 flex>
          <View center>
            <Image
              width={128}
              height={128}
              borderRadius={50}
              source={require("@/assets/images/logo/logo.png")}
            />
          </View>

          <View>
            <Text h2>{t("aboutapp.title1")}</Text>

            <Text marginT-20 h2_bold>
              {t("aboutapp.title2")}
            </Text>
            <Text marginT-20 h2>
              - {t("aboutapp.name_app")}{appName}
            </Text>
            <Text marginT-20 h2>
              - {t("aboutapp.version")}{appVersion} ({buildVersion})
            </Text>
            <Text marginT-20 h2>
              - {t("aboutapp.developer")}Ong Lười
            </Text>
            <Text marginT-20 h2>
              - {t("aboutapp.date_release")}26/11/2024
            </Text>

            <Text marginT-20 h2_bold>Các tính năng chính của ứng dụng Allure Spa:</Text>
            {data.map((item, index) => (
              <View key={index} marginT-10>
                <Text h2>• <Text h2_bold>{item.title}: <Text h2>{item.content}</Text></Text></Text>

              </View>
            ))}

            <Text marginT-20 h2_bold>Tại sao chọn Allure Spa?</Text>
            <Text h2>
            Ứng dụng Allure Spa không chỉ đơn giản là một nền tảng mua sắm mỹ phẩm và dịch vụ chăm sóc sắc đẹp mà còn là công cụ hữu ích giúp khách hàng dễ dàng tương tác, đánh giá và góp ý về chất lượng dịch vụ. Điều này giúp Spa không ngừng nâng cao chất lượng, mang đến những trải nghiệm tốt nhất cho người dùng.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default AboutApp;
