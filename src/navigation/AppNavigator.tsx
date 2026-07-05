import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { BarChart3, Building2, CircleDollarSign, LayoutDashboard, MoreHorizontal, ReceiptText, Settings, Users, WalletCards } from "lucide-react-native";
import { colors, spacing, typography } from "../design";
import { DesignSystemPreview } from "../screens/DesignSystemPreview";
import { AddMemberScreen } from "../screens/AddMemberScreen";
import { DashboardScreen } from "../screens/DashboardScreen";
import { MemberDetailScreen } from "../screens/MemberDetailScreen";
import { MembersScreen } from "../screens/MembersScreen";
import { ExpensesScreen } from "../screens/ExpensesScreen";
import { PaymentsScreen } from "../screens/PaymentsScreen";
import { PlansScreen } from "../screens/PlansScreen";
import { ReportsScreen } from "../screens/ReportsScreen";
import { MoreScreen } from "../screens/MoreScreen";
import { PlaceholderScreen } from "../screens/PlaceholderScreen";
import type { MainTabParamList, RootStackParamList } from "./types";

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

const screens = {
  Dashboard: DashboardScreen,
  Members: MembersScreen,
  Payments: PaymentsScreen,
  Reports: ReportsScreen
};

const tabIcons = { Dashboard: LayoutDashboard, Members: Users, Payments: CircleDollarSign, Reports: BarChart3, More: MoreHorizontal };

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerTitleStyle: { ...typography.sectionTitle, color: colors.ink[900] },
        headerShadowVisible: false,
        headerStyle: { backgroundColor: colors.surface.card },
        tabBarActiveTintColor: colors.brand[700],
        tabBarInactiveTintColor: colors.ink[500],
        tabBarLabelStyle: { ...typography.caption, marginTop: 2 },
        tabBarStyle: { height: 64, paddingTop: spacing[2], paddingBottom: spacing[2], borderTopColor: colors.surface.line },
        tabBarIcon: ({ color, size }) => {
          const Icon = tabIcons[route.name];
          return <Icon color={color} size={size} strokeWidth={2.2} />;
        }
      })}
    >
      <Tab.Screen name="Dashboard" component={screens.Dashboard} options={{ headerLeft: () => <Building2 color={colors.brand[600]} size={22} style={{ marginLeft: spacing[4] }} /> }} />
      <Tab.Screen name="Members" component={screens.Members} />
      <Tab.Screen name="Payments" component={screens.Payments} />
      <Tab.Screen name="Reports" component={screens.Reports} />
      <Tab.Screen name="More" component={MoreScreen} />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShadowVisible: false, headerStyle: { backgroundColor: colors.surface.card }, headerTintColor: colors.ink[900], headerTitleStyle: typography.sectionTitle }}>
      <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
      <Stack.Screen name="Plans" component={PlansScreen} />
      <Stack.Screen name="Expenses" component={ExpensesScreen} />
      <Stack.Screen name="Settings">{() => <PlaceholderScreen title="Settings" description="Configure your business and app preferences." icon={Settings} />}</Stack.Screen>
      <Stack.Screen name="DesignSystem" component={DesignSystemPreview} options={{ title: "Design system" }} />
      <Stack.Screen name="AddMember" component={AddMemberScreen} options={{ title: "Add member" }} />
      <Stack.Screen name="MemberDetail" component={MemberDetailScreen} options={{ title: "Member details" }} />
    </Stack.Navigator>
  );
}
