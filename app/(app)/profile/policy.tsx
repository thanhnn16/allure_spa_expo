import AppBar from '@/components/app-bar/AppBar'
import { ScrollView, StyleSheet } from 'react-native'
import { View, Text } from 'react-native-ui-lib'

const orderData = [
  {
    content: 'Khách hàng có thể dễ dàng đặt mua mỹ phẩm và đặt lịch hẹn spa trực tiếp trên ứng dụng Allure Spa.'
  },
  {
    content: 'Sau khi đặt hàng thành công, khách hàng sẽ nhận được xác nhận qua email hoặc thông báo trên ứng dụng.'
  },
  {
    content: 'Đối với các sản phẩm mỹ phẩm, vui lòng kiểm tra kỹ thông tin sản phẩm và số lượng trước khi xác nhận đặt hàng.'
  }
]

const orderInfoData = [
  {
    content: 'Khách hàng cần cung cấp thông tin chính xác và đầy đủ để đảm bảo quá trình giao hàng diễn ra thuận lợi.'
  },
  {
    content: 'Allure Spa sẽ không chịu trách nhiệm nếu thông tin đặt hàng sai sót dẫn đến việc giao hàng không thành công.'
  }
]

const paymentData = [
  {
    content: 'Allure Spa chấp nhận các phương thức thanh toán bao gồm thẻ tín dụng, thẻ ghi nợ, và các phương thức thanh toán trực tuyến như PayPal.'
  },
  {
    content: 'Thanh toán cần phải hoàn tất trước khi đơn hàng được xử lý và vận chuyển.'
  },
  {
    content: 'Tất cả các giao dịch thanh toán trực tuyến đều được bảo mật thông qua cổng thanh toán SSL.'
  }
]

const handlePaymentData = [
  {
    content: 'Sau khi khách hàng hoàn tất thanh toán, Allure Spa sẽ tiến hành xác nhận và xử lý đơn hàng.'
  },
  {
    content: 'Trong trường hợp thanh toán không thành công, khách hàng sẽ nhận được thông báo và hướng dẫn cụ thể để thực hiện lại quá trình thanh toán.'
  },
]

const timeDeliveryData = [
  {
    content: 'Đơn hàng mỹ phẩm sẽ được vận chuyển trong vòng 3-5 ngày làm việc kể từ ngày xác nhận đơn hàng.'
  },
  {
    content: 'Thời gian giao hàng có thể thay đổi tùy thuộc vào địa điểm giao hàng và điều kiện vận chuyển.'
  },
]

const costDeliveryData = [
  {
    content: 'Chi phí vận chuyển sẽ được tính dựa trên địa điểm giao hàng và sẽ hiển thị tại thời điểm thanh toán.'
  },
  {
    content: 'Khách hàng có thể kiểm tra chi phí vận chuyển trước khi xác nhận đặt hàng.'
  },
]

const trackOrderData = [
  {
    content: 'Sau khi đơn hàng được gửi đi, khách hàng sẽ nhận được thông tin theo dõi để tiện theo dõi quá trình giao hàng.'
  },
  {
    content: 'Khách hàng có thể liên hệ với bộ phận chăm sóc khách hàng nếu có bất kỳ vấn đề gì trong quá trình vận chuyển.'
  }
]

const returnData = [
  {
    content: 'Allure Spa chấp nhận đổi trả sản phẩm trong vòng 14 ngày kể từ ngày nhận hàng.'
  },
  {
    content: 'Sản phẩm phải còn nguyên vẹn, chưa qua sử dụng, và bao bì không bị hỏng hóc.'
  },
  {
    content: 'Khách hàng cần giữ lại hóa đơn và các giấy tờ liên quan khi thực hiện đổi trả.'
  },
  {
    content: 'Để bắt đầu quy trình đổi trả, vui lòng liên hệ với bộ phận chăm sóc khách hàng qua email support@allurespa.com hoặc gọi số hotline.'
  }
]

const noReturnData = [
  {
    content: 'Các sản phẩm đã qua sử dụng hoặc bao bì bị hỏng sẽ không đủ điều kiện để đổi trả.'
  },
  {
    content: 'Các sản phẩm khuyến mãi hoặc giảm giá đặc biệt không được chấp nhận đổi trả, trừ khi có lỗi từ nhà sản xuất.'
  }
]

const customerCareData = [
  {
    content: 'Khách hàng liên hệ với bộ phận chăm sóc khách hàng để thông báo về nhu cầu đổi trả và cung cấp thông tin đơn hàng cùng lý do đổi trả.'
  }
]

const sendReturnData = [
  {
    content: 'Sau khi được hướng dẫn, khách hàng gửi sản phẩm cần đổi trả về địa chỉ mà Allure Spa cung cấp.'
  },
  {
    content: 'Khách hàng chịu trách nhiệm về chi phí vận chuyển khi đổi trả sản phẩm, ngoại trừ trường hợp sản phẩm bị lỗi hoặc không đúng với đơn đặt hàng.'
  }
]

const checkReturnData = [
  {
    content: 'Sau khi nhận được sản phẩm đổi trả, Allure Spa sẽ tiến hành kiểm tra và xác nhận tình trạng sản phẩm.'
  },
  {
    content: 'Nếu sản phẩm đủ điều kiện, Allure Spa sẽ thực hiện đổi trả hoặc hoàn tiền theo yêu cầu của khách hàng.'
  }
]

const refundData = [
  {
    content: 'Sau khi nhận và kiểm tra sản phẩm trả lại, Allure Spa sẽ xử lý hoàn tiền trong vòng 5-7 ngày làm việc.'
  },
  {
    content: 'Số tiền hoàn lại sẽ được trả về tài khoản thanh toán ban đầu của khách hàng.'
  },
  {
    content: 'Khách hàng sẽ nhận được thông báo qua email khi việc hoàn tiền hoàn tất.'
  }
]

const refundFeeData = [
  {
    content: 'Chi phí hoàn tiền sẽ bao gồm toàn bộ giá trị sản phẩm và chi phí vận chuyển ban đầu (nếu có).'
  },
  {
    content: 'Trong trường hợp sản phẩm bị lỗi hoặc không đúng với đơn đặt hàng, Allure Spa sẽ chịu trách nhiệm chi phí vận chuyển và hoàn tiền đầy đủ cho khách hàng.'
  }
]

const changeBookData = [
  {
    content: 'Khách hàng có thể đổi lịch hẹn spa miễn phí nếu thông báo trước 24 giờ so với thời gian hẹn ban đầu.'
  },
  {
    content: 'Đối với thông báo đổi lịch muộn hơn, Allure Spa sẽ tính phí hủy lịch hẹn tương đương với 50% giá trị dịch vụ đã đặt.'
  }
]

const collectData = [
  {
    content: 'Allure Spa cam kết bảo mật thông tin cá nhân của khách hàng và chỉ sử dụng thông tin này cho mục đích cung cấp dịch vụ tốt nhất.'
  },
  {
    content: 'Thông tin cá nhân của khách hàng sẽ không được chia sẻ với bên thứ ba, ngoại trừ khi có yêu cầu pháp lý hoặc để hoàn thành đơn hàng.'
  }
]

const paymentSecurityData = [
  {
    content: 'Allure Spa sử dụng các cổng thanh toán bảo mật SSL để đảm bảo an toàn cho các giao dịch trực tuyến.'
  },
  {
    content: 'Khách hàng có thể an tâm khi sử dụng các phương thức thanh toán trực tuyến trên ứng dụng của chúng tôi.'
  }
]

const policy = () => {
  return (
    <View flex bg-white>
      <AppBar back title="Chính sách" />
      <ScrollView style={{ paddingHorizontal: 16 }}>
        <Text marginT-20 h2_bold>1. Chính sách Mua hàng:</Text>

        <Text marginT-20 h3_bold>1.1 Đặt hàng:</Text>
        <Text marginT-20 h3_bold>Đặt hàng sản phẩm:</Text>
        {orderData.map((item, index) => (
          <View key={index} marginT-10>
            <Text h3>• <Text h3>{item.content}</Text></Text>
          </View>
        ))}
        <Text marginT-20 h3_bold>Thông tin đặt hàng:</Text>
        {orderInfoData.map((item, index) => (
          <View key={index} marginT-10>
            <Text h3>• <Text h3>{item.content}</Text></Text>
          </View>
        ))}

        <Text marginT-20 h3_bold>1.2 Thanh toán:</Text>
        <Text marginT-20 h3_bold>Phương thức thanh toán:</Text>
        {paymentData.map((item, index) => (
          <View key={index} marginT-10>
            <Text h3>• <Text h3>{item.content}</Text></Text>
          </View>
        ))}
        <Text marginT-20 h3_bold>Xử lý thanh toán:</Text>
        {handlePaymentData.map((item, index) => (
          <View key={index} marginT-10>
            <Text h3>• <Text h3>{item.content}</Text></Text>
          </View>
        ))}

        <Text marginT-20 h3_bold>1.3 Vận chuyển:</Text>
        <Text marginT-20 h3_bold>Thời gian giao hàng:</Text>
        {timeDeliveryData.map((item, index) => (
          <View key={index} marginT-10>
            <Text h3>• <Text h3>{item.content}</Text></Text>
          </View>
        ))}
        <Text marginT-20 h3_bold>Chi phí vận chuyển:</Text>
        {costDeliveryData.map((item, index) => (
          <View key={index} marginT-10>
            <Text h3>• <Text h3>{item.content}</Text></Text>
          </View>
        ))}
        <Text marginT-20 h3_bold>Theo dõi đơn hàng:</Text>
        {trackOrderData.map((item, index) => (
          <View key={index} marginT-10>
            <Text h3>• <Text h3>{item.content}</Text></Text>
          </View>
        ))}

        <Text marginT-20 h2_bold>2. Chính sách Đổi trả:</Text>

        <Text marginT-20 h3_bold>2.1 Điều kiện đổi trả:</Text>
        <Text marginT-20 h3_bold>Điều kiện chung:</Text>
        {returnData.map((item, index) => (
          <View key={index} marginT-10>
            <Text h3>• <Text h3>{item.content}</Text></Text>
          </View>
        ))}
        <Text marginT-20 h3_bold>Sản phẩm không đủ điều kiện đổi trả:</Text>
        {noReturnData.map((item, index) => (
          <View key={index} marginT-10>
            <Text h3>• <Text h3>{item.content}</Text></Text>
          </View>
        ))}

        <Text marginT-20 h3_bold>2.2 Quy trình đổi trả:</Text>
        <Text marginT-20 h3_bold>Liên hệ chăm sóc khách hàng:</Text>
        {customerCareData.map((item, index) => (
          <View key={index} marginT-10>
            <Text h3>• <Text h3>{item.content}</Text></Text>
          </View>
        ))}
        <Text marginT-20 h3_bold>Gửi sản phẩm đổi trả:</Text>
        {sendReturnData.map((item, index) => (
          <View key={index} marginT-10>
            <Text h3>• <Text h3>{item.content}</Text></Text>
          </View>
        ))}
        <Text marginT-20 h3_bold>Kiểm tra và xử lý đổi trả:</Text>
        {checkReturnData.map((item, index) => (
          <View key={index} marginT-10>
            <Text h3>• <Text h3>{item.content}</Text></Text>
          </View>
        ))}

        <Text marginT-20 h3_bold>2.3 Hoàn tiền:</Text>
        <Text marginT-20 h3_bold>Quy trình hoàn tiền:</Text>
        {refundData.map((item, index) => (
          <View key={index} marginT-10>
            <Text h3>• <Text h3>{item.content}</Text></Text>
          </View>
        ))}
        <Text marginT-20 h3_bold>Chi phí hoàn tiền:</Text>
        {refundFeeData.map((item, index) => (
          <View key={index} marginT-10>
            <Text h3>• <Text h3>{item.content}</Text></Text>
          </View>
        ))}

        <Text marginT-20 h3_bold>2.4 Đổi lịch hẹn spa:</Text>
        <Text marginT-20 h3_bold>Thay đổi lịch hẹn:</Text>
        {changeBookData.map((item, index) => (
          <View key={index} marginT-10>
            <Text h3>• <Text h3>{item.content}</Text></Text>
          </View>
        ))}

        <Text marginT-20 h2_bold>3. Chính sách Bảo mật:</Text>

        <Text marginT-20 h3_bold>3.1 Thu thập và sử dụng thông tin:</Text>
        {collectData.map((item, index) => (
          <View key={index} marginT-10>
            <Text h3>• <Text h3>{item.content}</Text></Text>
          </View>
        ))}
        <Text marginT-20 h3_bold>3.2 Bảo mật thanh toán:</Text>
        {paymentSecurityData.map((item, index) => (
          <View key={index} marginT-10>
            <Text h3>• <Text h3>{item.content}</Text></Text>
          </View>
        ))}

      </ScrollView>
    </View>
  )
}

export default policy

const styles = StyleSheet.create({})