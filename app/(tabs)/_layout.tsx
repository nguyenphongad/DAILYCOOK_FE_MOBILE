import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Pressable, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';

// Quản lý menu bằng JSON
const tabMenus = [
	{
		name: 'index',
		title: 'Món ăn',
		icon: 'cutlery', // Thay đổi từ 'home' sang 'cutlery' (icon dao dĩa)
	},
	{
		name: 'shopping',
		title: 'Mua sắm',
		icon: 'shopping-basket', // Thay đổi từ 'shopping-cart' sang 'shopping-basket' (icon giỏ đựng)
	},
	{
		name: 'about',
		title: 'Danh Mục',
		icon: 'list', // Thay đổi từ 'info-circle' sang 'list' (icon danh sách)
	},
	{
		name: 'account',
		title: 'Tài khoản',
		icon: 'user', // Giữ nguyên 'user' (icon người dùng)
	},
];

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
	name: React.ComponentProps<typeof FontAwesome>['name'];
	color: string;
}) {
	return <FontAwesome size={24} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
	return (
		<>
			{/* Đặt StatusBar style là "dark" để hiển thị chữ đen trên nền trắng */}
			<StatusBar style="dark" />
			<Tabs
				screenOptions={{
					tabBarActiveTintColor: '#35A55E', // Màu khi active - đã đổi từ #3498db sang #35A55E
					tabBarInactiveTintColor: '#7f8c8d', // Màu khi không active
					tabBarStyle: { 
						backgroundColor: '#FFFFFF',  // Màu nền của tab bar
						borderTopColor: '#e0e0e0',  // Màu viền trên của tab bar
						marginTop: -50, 
					},
					headerStyle: {
						backgroundColor: '#FFFFFF', // Màu nền của header
					},
					headerTintColor: '#2c3e50', // Màu chữ của header
					headerTitleStyle: {
						fontWeight: 'bold',
					},
					headerShown: false,
				}}>
				{tabMenus.map((tab) => (
					<Tabs.Screen
						key={tab.name}
						name={tab.name}
						options={{
							title: tab.title,
							tabBarIcon: ({ color }) => (
								<TabBarIcon name={tab.icon as any} color={color} />
							),
						}}
					/>
				))}
			</Tabs>
		</>
	);
}
