import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  SHOPPING_ITEMS: '@shopping_items',
  LAST_UPDATE: '@shopping_last_update'
};

// Kiểm tra xem data có phải hôm nay không
const isToday = (dateString) => {
  const today = new Date();
  const checkDate = new Date(dateString);
  
  return today.getFullYear() === checkDate.getFullYear() &&
         today.getMonth() === checkDate.getMonth() &&
         today.getDate() === checkDate.getDate();
};

// Lưu shopping items
export const saveShoppingItems = async (items) => {
  try {
    const dataToSave = {
      items,
      lastUpdate: new Date().toISOString()
    };
    await AsyncStorage.setItem(STORAGE_KEYS.SHOPPING_ITEMS, JSON.stringify(dataToSave));
  } catch (error) {
    console.error('Error saving shopping items:', error);
  }
};

// Lấy shopping items
export const getShoppingItems = async () => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.SHOPPING_ITEMS);
    if (data) {
      const parsed = JSON.parse(data);
      
      // Kiểm tra xem có phải hôm nay không, nếu không thì clear
      if (!isToday(parsed.lastUpdate)) {
        await clearShoppingItems();
        return { items: [], isNewDay: true };
      }
      
      return { items: parsed.items || [], isNewDay: false };
    }
    return { items: [], isNewDay: false };
  } catch (error) {
    console.error('Error getting shopping items:', error);
    return { items: [], isNewDay: false };
  }
};

// Xóa shopping items
export const clearShoppingItems = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.SHOPPING_ITEMS);
  } catch (error) {
    console.error('Error clearing shopping items:', error);
  }
};
