import { StyleSheet, ScrollView } from 'react-native';
import { Text, View } from '@/components/Themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

export default function AboutScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          <Text style={styles.title}>Giới thiệu DailyCook</Text>
          <View style={styles.separator} />
          
          <Text style={styles.subtitle}>Ứng dụng nấu ăn thông minh cho cuộc sống hiện đại</Text>
          
          <Text style={styles.paragraph}>
            DailyCook là ứng dụng quản lý dinh dưỡng và hỗ trợ nấu ăn toàn diện được thiết kế đặc biệt cho người Việt Nam. Chúng tôi hiểu rằng trong nhịp sống hiện đại, việc chuẩn bị các bữa ăn đầy đủ dinh dưỡng mỗi ngày là một thách thức. DailyCook ra đời với sứ mệnh biến việc nấu nướng trở nên dễ dàng, thú vị và phù hợp với nhu cầu dinh dưỡng cá nhân của bạn.
          </Text>
          
          <Text style={styles.paragraph}>
            Với kho công thức đồ ăn phong phú được phân loại theo nhiều tiêu chí khác nhau như thời gian nấu, độ khó, nguyên liệu có sẵn, hay mục đích dinh dưỡng, DailyCook giúp bạn dễ dàng tìm được những món ăn phù hợp với điều kiện và mong muốn của mình. Mỗi công thức đều được biên soạn chi tiết với hướng dẫn từng bước kèm hình ảnh minh họa, giúp cả những người mới bắt đầu cũng có thể nấu được những món ăn ngon, đẹp mắt.
          </Text>
          
          <Text style={styles.paragraph}>
            Tính năng nổi bật của DailyCook là khả năng tạo kế hoạch bữa ăn tự động dựa trên thông tin cá nhân của người dùng. Bằng cách nhập các thông số như chiều cao, cân nặng, mức độ vận động, mục tiêu sức khỏe (giảm cân, tăng cơ, duy trì cân nặng...), ứng dụng sẽ tính toán nhu cầu dinh dưỡng hàng ngày và đề xuất thực đơn phù hợp. Bạn cũng có thể tùy chỉnh thực đơn theo sở thích cá nhân, giới hạn các nguyên liệu không mong muốn hoặc chọn theo chế độ ăn đặc biệt như ăn chay, ăn kiêng, ăn theo nhóm máu...
          </Text>
          
          <Text style={styles.paragraph}>
            DailyCook còn tích hợp tính năng quản lý tủ lạnh, giúp bạn theo dõi nguyên liệu hiện có và gợi ý các món ăn có thể chế biến từ những nguyên liệu đó. Đặc biệt, ứng dụng sẽ nhắc nhở bạn về thực phẩm sắp hết hạn để tránh lãng phí. Tính năng lập danh sách mua sắm tự động dựa trên thực đơn đã chọn giúp việc chuẩn bị nguyên liệu trở nên dễ dàng hơn bao giờ hết.
          </Text>
          
          <Text style={styles.paragraph}>
            Không chỉ là công cụ nấu ăn, DailyCook còn là người bạn đồng hành trên hành trình xây dựng thói quen ăn uống lành mạnh. Ứng dụng cung cấp các thông tin dinh dưỡng chi tiết cho từng món ăn, giúp bạn dễ dàng theo dõi lượng calo, protein, carb, chất béo và các vi chất quan trọng khác trong chế độ ăn hàng ngày. Hệ thống theo dõi tiến trình trực quan giúp bạn nhìn thấy rõ sự thay đổi theo thời gian và duy trì động lực để đạt được mục tiêu sức khỏe của mình.
          </Text>
          
          <Text style={styles.paragraph}>
            Cộng đồng DailyCook là nơi kết nối những người yêu thích nấu ăn trên khắp cả nước. Tại đây, bạn có thể chia sẻ công thức của riêng mình, tham khảo ý kiến từ những đầu bếp khác, tham gia các thử thách nấu ăn thú vị và nhận được sự hỗ trợ trên hành trình khám phá ẩm thực. Chúng tôi tin rằng việc nấu ăn không chỉ là một kỹ năng cần thiết mà còn là một nghệ thuật đem lại niềm vui và sự kết nối.
          </Text>
          
          <Text style={styles.paragraph}>
            DailyCook không ngừng cập nhật và phát triển để mang đến cho người dùng trải nghiệm tốt nhất. Chúng tôi lắng nghe mọi phản hồi và luôn nỗ lực cải thiện ứng dụng để đáp ứng nhu cầu ngày càng cao của cộng đồng. Hãy để DailyCook trở thành người bạn đồng hành đáng tin cậy trong căn bếp của bạn, giúp mỗi bữa ăn không chỉ ngon miệng mà còn đầy đủ dinh dưỡng và mang đậm dấu ấn cá nhân.
          </Text>
          
          <Text style={styles.paragraph}>
            Tải DailyCook ngay hôm nay và bắt đầu hành trình khám phá niềm vui nấu nướng cùng sức khỏe tốt hơn mỗi ngày!
          </Text>
          
          <View style={styles.contactSection}>
            <Text style={styles.contactTitle}>Liên hệ với chúng tôi:</Text>
            <Text style={styles.contactInfo}>Email: support@dailycook.vn</Text>
            <Text style={styles.contactInfo}>Hotline: 1900 1234</Text>
            <Text style={styles.contactInfo}>Website: www.dailycook.vn</Text>
            <Text style={styles.copyright}>© 2023 DailyCook. Bản quyền thuộc về DailyCook.</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#35A55E',
    textAlign: 'center',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
    fontStyle: 'italic',
  },
  separator: {
    marginVertical: 20,
    height: 2,
    width: '30%',
    alignSelf: 'center',
    backgroundColor: '#35A55E',
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginBottom: 15,
    textAlign: 'justify',
  },
  contactSection: {
    marginTop: 30,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#35A55E',
    marginBottom: 10,
  },
  contactInfo: {
    fontSize: 15,
    color: '#555',
    marginBottom: 5,
  },
  copyright: {
    fontSize: 14,
    color: '#888',
    marginTop: 15,
    textAlign: 'center',
  }
});
