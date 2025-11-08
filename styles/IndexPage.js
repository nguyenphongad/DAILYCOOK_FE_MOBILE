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
  
  // Cập nhật styles cho date header section
  dateHeaderSection: {
    padding: 0, // Giảm padding
    marginHorizontal: 15,
    marginBottom: 16,
    alignItems: 'flex-start', 
    borderLeftWidth: 4,
    paddingLeft: 15,
    borderColor: '#64ba82',
  },
  dayTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#35A55E',
    marginBottom: 4,
    textAlign: 'left', // Căn lề trái
  },
  dateSubtitle: {
    fontSize: 16,
    color: '#666666',
    fontWeight: '400',
    textAlign: 'left', // Căn lề trái
  },
  
  
  // Thêm style mới cho phần nutrition
  nutritionSection: {
    paddingHorizontal: 15,
  },
  sectionTitle: {
    fontSize: 18,
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
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    // elevation: 1,
    position: 'relative',
  },
  aiImageContainer: {
    alignItems: 'center',
  },
  aiImage: {
    width: 150,
    height: 150,
    marginBottom: 35,
  },
  aiFeaturesContainer: {
    marginBottom: 16, // Giảm marginBottom vì không cần chỗ cho nút
  },
  aiFeatureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  aiFeatureBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#35A55E',
    marginTop: 6,
    marginRight: 12,
  },
  aiFeatureText: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
    flex: 1,
    fontWeight: '400',
  },
  aiSuggestionButtonExternal: {
    position: 'absolute',
    bottom: 60,
    left: 15,
    right: 15,
    flexDirection: 'row',
    backgroundColor: '#35A55E',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    // elevation: 3,
    zIndex: 1000, // Đảm bảo nút luôn hiển thị trên cùng
  },
  aiSuggestionButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginRight:20,
    fontSize:16
  },

  // Settings sheet styles
  settingsSheetContent: {
    padding: 16,
  },
  
  settingsSheetTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 20,
    textAlign: 'center',
  },
  
  settingsOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    marginBottom: 12,
  },
  
  settingsOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  settingsOptionText: {
    fontSize: 16,
    color: '#333333',
    marginLeft: 12,
    fontWeight: '500',
  },

  // Thêm style cho text màu đỏ (xóa thực đơn)
  settingsOptionTextDanger: {
    fontSize: 16,
    color: '#E86F50',
    marginLeft: 12,
    fontWeight: '500',
  },
  
  // AI Modal styles
  aiModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
  },
  
  aiModalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: '100%',
    maxWidth: 400,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  
  aiModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#35A55E',
  },
  
  aiModalIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#28A745',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  
  aiModalTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  
  aiModalCloseButton: {
    padding: 8,
  },
  
  aiModalBody: {
    maxHeight: '70%',
  },
  
  aiModalBodyContent: {
    padding: 16,
    paddingBottom: 0,
  },
  
  aiLoadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  
  aiLoadingImage: {
    width: 80,
    height: 80,
    marginBottom: 16,
  },
  
  aiLoadingText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },
  
  aiSuggestionContainer: {
    // Để trống cho animation
  },
  
  aiAnalysisContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  
  aiAnalysisTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 12,
  },
  
  aiAnalysisItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  
  aiAnalysisCheckmarkContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#28A745',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  
  aiAnalysisCheckmark: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  
  aiAnalysisItem: {
    fontSize: 14,
    color: '#666666',
    flex: 1,
    fontWeight: '400',
  },
  
  aiIntroText: {
    fontSize: 14,
    color: '#333333',
    marginBottom: 12,
    lineHeight: 20,
  },
  
  aiMealSuggestions: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
  },
  
  aiMealHeader: {
    fontSize: 16,
    fontWeight: '500',
    color: '#35A55E',
    marginBottom: 8,
  },
  
  aiMealItem: {
    fontSize: 14,
    color: '#333333',
    marginBottom: 4,
    lineHeight: 20,
  },
  
  aiAcceptButton: {
    backgroundColor: '#35A55E',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  },
  
  aiAcceptButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  
  menuGrid: {
    marginTop: 5,
  },
  
  // Thêm styles cho layout dọc
  menuItemCardVertical: {
    flexDirection: 'row',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 0.2,
    marginBottom: 12,
    padding: 12,
  },
  
  menuItemImageVertical: {
    width: 80,
    height: 80,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  
  menuItemContentVertical: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  
  menuItemInfo: {
    flex: 1,
  },
  
  menuItemNameVertical: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  
  menuItemDescription: {
    fontSize: 13,
    color: '#666666',
    marginBottom: 8,
    lineHeight: 18,
  },
  
  menuItemActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  
  viewDetailButton: {
    backgroundColor: '#F0F8F0',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#35A55E',
  },
  
  viewDetailButtonText: {
    fontSize: 12,
    color: '#35A55E',
    fontWeight: '500',
  },
  
  acknowledgeButton: {
    backgroundColor: '#35A55E',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  
  acknowledgeButtonText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  
  // Cập nhật typeMealContainer cho layout dọc
  typeMealContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#D32F2F',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
  },
  
  typeMealText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default styles;
