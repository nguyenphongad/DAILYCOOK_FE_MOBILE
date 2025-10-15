import { StyleSheet, Dimensions } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D4E9E1',
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 20, // Thêm padding dưới để tránh bị cắt nội dung
  },
  headerText: {
    fontSize: 18,
    fontWeight: '500',
    color: 'white',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  weatherIcon: {
    width: 30,
    height: 30,
    marginRight: 12,
  },
  waterReminderButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 15,
  },
  waterReminderIcon: {
    width: 20,
    height: 20,
  },
  
  // Xóa các style không còn cần thiết vì đã chuyển sang component riêng
  // waterReminderSheet, waterReminderTitle, waterReminderText,
  // waterReminderSettingButton, waterReminderSettingButtonText
  
  // Thêm style mới cho phần nutrition
  nutritionSection: {
    paddingHorizontal: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  nutritionList: {
    paddingRight: 10,
    marginTop: 15
  },
  nutritionCard: {
    width: 140,
    height: 120,
    borderRadius: 15,
    marginRight: 12,
    padding: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1,
    marginBottom: 5,
    justifyContent: 'space-between', // Để phân bố không gian đều
  },
  nutritionCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  nutritionCardIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  nutritionCardContent: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 8, // Thêm khoảng cách trước thanh tiến trình
  },
  nutritionCardValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginRight: 5,
  },
  nutritionCardUnit: {
    fontSize: 14,
    color: '#777777', // Màu nhạt hơn
    marginBottom: 3, // Để căn chỉnh với giá trị
  },
  nutritionCardLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  
  calendarContainer: {
    marginTop: 20,
    paddingHorizontal: 10,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingHorizontal: 5,
  },
  monthTitleContainer: {
    backgroundColor: 'rgba(53, 165, 94, 0.2)', // Màu xanh chủ đạo mờ nhạt
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  monthTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#35A55E', 
  },
  
  calendarNavigationContainer: {
    position: 'relative',
    marginBottom: 10,
  },
  calendarFlatListContent: {
    // Giữ trống hoặc thêm padding nếu cần
  },
  weekContainer: {
    width: Dimensions.get('window').width - 20, // Tăng kích thước lên vì không còn nút điều hướng
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 0,
    alignSelf: 'center', // Căn giữa tuần
  },
  dateItem: {
    width: 40, 
    height: 65,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    backgroundColor: 'transparent', 
    marginHorizontal: 3,
    // Thêm viền xanh nhạt cho tất cả các item ngày
    borderWidth: 1,
    borderColor: 'rgba(53, 165, 94, 0.3)',
  },
  activeDateItem: {
    backgroundColor: 'transparent', 
    // Viền xanh đậm cho item ngày active
    borderWidth: 1,
    borderColor: '#35A55E',
  },
  futureDateItem: {
    backgroundColor: 'transparent', 
    // Viền xám nhạt cho ngày tương lai
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  dayText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
    fontWeight: '400',
  },
  activeDayText: {
    color: '#35A55E', // Chỉ đổi màu chữ mà không đổi nền
    fontWeight: '600',
  },
  futureDayText: {
    color: '#999',
  },
  
  // Điều chỉnh lại style của date circle (không cần viền vì đã có viền ở item cha)
  dateCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 0, // Bỏ viền của circle
  },
  activeDateCircle: {
    backgroundColor: '#35A55E', // Nền xanh đậm cho ngày active
    borderWidth: 0,
  },
  futureDateCircle: {
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  
  menuSection: {
    marginTop: 10,
    marginHorizontal: 15,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  settingsButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(53, 165, 94, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mealTypeTabs: {
    flexDirection: 'row',
    marginBottom: 16,
    justifyContent: 'space-between', // Căn đều tất cả các tab
    width: '100%', // Đảm bảo container sử dụng toàn bộ chiều rộng
  },
  mealTypeTabsTwo: {
    justifyContent: 'space-between', // Nếu có 2 bữa thì căn đều 2 bên
  },
  mealTypeTabsOne: {
    justifyContent: 'center', // Nếu chỉ có 1 bữa thì canh giữa
  },
  mealTypeTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8, // Giảm padding ngang
    backgroundColor: 'rgba(53, 165, 94, 0.1)',
    borderRadius: 20,
    justifyContent: 'center',
    marginRight: 0, // Bỏ margin để không bị tràn
  },
  mealTypeTabHalf: {
    flex: 0.48, // Khi có 2 bữa ăn thì mỗi tab chiếm 48% chiều rộng
  },
  mealTypeTabFull: {
    flex: 1, // Khi chỉ có 1 bữa ăn thì tab chiếm 100% chiều rộng
  },
  mealTypeTabThird: {
    flex: 0.32, // Khi có 3 bữa, mỗi tab chiếm khoảng 32% chiều rộng
  },
  activeMealTypeTab: {
    backgroundColor: '#35A55E',
  },
  mealTypeText: {
    fontSize: 14,
    color: '#35A55E',
    marginLeft: 5,
  },
  activeMealTypeText: {
    color: '#FFFFFF',
  },
  aiRecommendationCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  aiHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  aiIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFB800',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  aiHeaderText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    flex: 1,
  },
  refreshButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  aiDescription: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  menuGrid: {
    marginTop: 5,
  },
  menuRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  menuItemCard: {
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  menuItemImage: {
    width: '100%',
    height: 100,
    resizeMode: 'cover',
  },
  menuItemContent: {
    padding: 10,
  },
  menuItemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 5,
  },
  menuItemMacros: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  menuItemMacro: {
    fontSize: 12,
    color: '#666666',
  },
  viewFullMenuButton: {
    backgroundColor: '#35A55E',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 15,
    marginBottom: 20,
  },
  viewFullMenuText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginRight: 8,
  },
  
  // Cập nhật mealItemContainer để tương thích với thiết kế mới
  mealItemContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 20,
  },
  
  // Thêm style cho typeMeal
  typeMealContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#D32F2F', // Màu đỏ đậm
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  typeMealText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF', // Chữ màu trắng
  },
  
  // Thay đổi màu chữ cho activeDateText từ xanh sang trắng
  activeDateText: {
    color: '#FFFFFF', // Đổi màu chữ thành trắng cho ngày active
    fontWeight: '600',
  },
  noMealContainer: {
    padding: 20,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 15,
  },
  noMealText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

export default styles;
