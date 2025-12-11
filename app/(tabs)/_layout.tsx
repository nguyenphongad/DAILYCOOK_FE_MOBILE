import React from 'react';
import { Link, Tabs } from 'expo-router';
import { Pressable, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { FontAwesome } from '@expo/vector-icons';

// Thêm interface cho tab menu
interface TabMenu {
	name: string;
	title: string;
	icon: React.ComponentProps<typeof FontAwesome>['name'];
}

// Quản lý menu bằng JSON với FontAwesome icons
const tabMenus: TabMenu[] = [
	{
		name: 'index',
		title: 'Thực đơn',
		icon: 'cutlery',
	},
	{
		name: 'about',
		title: 'Thông tin',
		icon: 'book',
	},
	{
		name: 'recordMeal',
		title: 'Ghi nhận',
		icon: 'calendar',
	},
	{
		name: 'shopping',
		title: 'Mua sắm',
		icon: 'shopping-cart',
	},
	{
		name: 'account',
		title: 'Tài khoản',
		icon: 'user',
	},
];

// Component FontAwesome icon
function TabBarIcon(props: {
	name: React.ComponentProps<typeof FontAwesome>['name'];
	color: string;
}) {
	return <FontAwesome size={17} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
	return (
		<>
			<StatusBar style="dark" />
			<Tabs
				screenOptions={{
					tabBarActiveTintColor: '#35A55E',
					tabBarInactiveTintColor: '#7f8c8d',
					tabBarStyle: { 
						backgroundColor: '#FFFFFF',
						borderTopColor: '#e0e0e0',
						marginTop: -50, 
					},
					headerStyle: {
						backgroundColor: '#FFFFFF',
					},
					headerTintColor: '#2c3e50',
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
							tabBarLabel: ({ focused }) => (
								<Text style={{ 
									fontSize: 12, 
									color: focused ? '#35A55E' : 'transparent',
									fontWeight: focused ? '600' : 'normal',
									marginTop: -2,
								}}>
									{focused ? tab.title : ''}
								</Text>
							),
							tabBarIcon: ({ focused }) => (
								<TabBarIcon 
									name={tab.icon} 
									color={focused ? '#35A55E' : '#7f8c8d'} 
								/>
							),
						}}
					/>
				))}
			</Tabs>
		</>
	);
}
