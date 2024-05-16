// Navigaior.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useEffect } from 'react';
import { Linking } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useTheme } from 'styled-components/native';
import { CalendarNav } from './CalendarStack';
import { DiaryNav } from './DairyStack';
import { UserNav } from './UserStack';

type BottomTabParamList = {
  MainScreen: undefined;
  CalendarNav: undefined;
  DiaryNav: undefined;
  UserNav: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();

function MainTab() {
  const theme = useTheme();

  useEffect(() => {
    console.log('여기 찍혔따');
    const test = async () => {
      const url = await AsyncStorage.getItem('pendingURL'); // 저장된 URL 가져오기
      console.log(url);
      if (url) {
        await Linking.openURL(url);
        await AsyncStorage.removeItem('pendingURL');
      }
    };
    test();
  }, []);

  return (
    <Tab.Navigator
      initialRouteName="CalendarNav"
      screenOptions={{
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: theme.colors.mainPink,
        tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle: {
          alignItems: 'center',
          justifyContent: 'center',
          height: 65,
        },
      }}>
      <Tab.Screen
        name="CalendarNav"
        component={CalendarNav}
        options={{
          tabBarIcon: ({ color }) => <Icon name="calendar" size={27} color={color} />,
        }}
      />
      <Tab.Screen
        name="DiaryNav"
        component={DiaryNav}
        options={{
          tabBarIcon: ({ color }) => <Icon name="book" size={27} color={color} />,
        }}
      />
      <Tab.Screen
        name="UserNav"
        component={UserNav}
        options={{
          tabBarIcon: ({ color }) => <Icon name="user" size={27} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

export default MainTab;
