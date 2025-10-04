import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';

// Quản lý menu bằng JSON
const tabMenus = [
	{
		name: 'index',
		title: 'Trang chủ',
		icon: 'home',
	},
	{
		name: 'shopping',
		title: 'Mua sắm',
		icon: 'shopping-cart',
	},
	{
		name: 'about',
		title: 'Giới thiệu',
		icon: 'info-circle',
	},
	{
		name: 'account',
		title: 'Tài khoản',
		icon: 'user',
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
					tabBarActiveTintColor: '#3498db', // Màu khi active
					tabBarInactiveTintColor: '#7f8c8d', // Màu khi không active
					tabBarStyle: { 
						backgroundColor: '#FFFFFF',  // Màu nền của tab bar
						borderTopColor: '#e0e0e0',  // Màu viền trên của tab bar
					},
					headerStyle: {
						backgroundColor: '#FFFFFF', // Màu nền của header
					},
					headerTintColor: '#2c3e50', // Màu chữ của header
					headerTitleStyle: {
						fontWeight: 'bold',
					},
					headerShown: true,
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
