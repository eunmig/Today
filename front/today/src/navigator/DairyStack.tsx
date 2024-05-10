import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DiaryDetail from '../screens/diary/DiaryDetail';
import EditDiary from '../screens/diary/EditDiary';
import WriteDiary from '../screens/diary/WriteDiary';
import DiaryList from '../screens/diary/list/DiaryList';
import SelectImage from '../screens/diary/select/SelectImage';

import Logo from '../common/Logo';
import NotificationBadge from '../common/noti/Notification';
import NotificationScreen from '../screens/user/notification/NotificationScreen';
import { DiaryStackParam, RootProp } from '../types/navigatortype/stack';

const DiaryStack = createNativeStackNavigator<DiaryStackParam>();

export const DiaryNav = ({ navigation }: RootProp) => {
  return (
    <DiaryStack.Navigator
      initialRouteName="DiaryList"
      screenOptions={{
        headerTitleAlign: 'center',
        headerTitle: ({ children }) => <Logo />,
        headerRight: () => <NotificationBadge onPress={() => navigation.push('NotificationScreen')} />,
      }}>
      <DiaryStack.Screen name="DiaryList" component={DiaryList} />
      <DiaryStack.Screen name="SelectImage" component={SelectImage} />
      <DiaryStack.Screen name="EditDiary" component={EditDiary} />
      <DiaryStack.Screen name="WriteDiary" component={WriteDiary} />
      <DiaryStack.Screen name="DiaryDetail" component={DiaryDetail} />
      <DiaryStack.Screen name="NotificationScreen" component={NotificationScreen} />
    </DiaryStack.Navigator>
  );
};
