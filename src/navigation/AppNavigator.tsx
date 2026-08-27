import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { BarChart3, CircleDollarSign, LayoutDashboard, WalletCards } from "lucide-react-native";
import { colors, spacing, typography } from "../design";
import { CategorySelectionScreen } from "../screens/CategorySelectionScreen";
import { AccountSetupScreen } from "../screens/AccountSetupScreen";
import { AddMemberScreen } from "../screens/AddMemberScreen";
import { AddExpenseScreen } from "../screens/AddExpenseScreen";
import { AddPlanScreen } from "../screens/AddPlanScreen";
import { DashboardScreen } from "../screens/DashboardScreen";
import { ExpenseDetailScreen } from "../screens/ExpenseDetailScreen";
import { MemberDetailScreen } from "../screens/MemberDetailScreen";
import { ExpensesScreen } from "../screens/ExpensesScreen";
import { PlanDetailScreen } from "../screens/PlanDetailScreen";
import { PlansScreen } from "../screens/PlansScreen";
import { ProfileScreen } from "../screens/ProfileScreen";
import { ReportsScreen } from "../screens/ReportsScreen";
import { PremiumScreen } from "../screens/PremiumScreen";
import { SplashScreen } from "../screens/SplashScreen";
import { IntroScreen } from "../screens/IntroScreen";
import { SubscriptionSelectionScreen } from "../screens/SubscriptionSelectionScreen";
import type { MainTabParamList, RootStackParamList } from "./types";

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

const tabIcons = { Dashboard: LayoutDashboard, Plan: WalletCards, Expense: CircleDollarSign, Report: BarChart3 };

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.brand[700],
        tabBarInactiveTintColor: colors.ink[700],
        tabBarLabelStyle: { fontSize: 13, fontWeight: "700", lineHeight: 18, marginTop: spacing[1] },
        tabBarItemStyle: { minHeight: 68, paddingTop: spacing[2], paddingBottom: spacing[1] },
        tabBarStyle: { height: 88, paddingTop: spacing[1], paddingBottom: spacing[4], backgroundColor: colors.white, borderTopColor: colors.ink[300], borderTopWidth: 1 },
        tabBarIcon: ({ color, size }) => {
          const Icon = tabIcons[route.name];
          return <Icon color={color} size={25} strokeWidth={2.4} />;
        }
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Plan" component={PlansScreen} />
      <Tab.Screen name="Expense" component={ExpensesScreen} />
      <Tab.Screen name="Report" component={ReportsScreen} />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShadowVisible: false, headerStyle: { backgroundColor: colors.surface.card }, headerTintColor: colors.ink[900], headerTitleStyle: typography.sectionTitle }}>
      <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Intro" component={IntroScreen} options={{ headerShown: false }} />
      <Stack.Screen name="AccountSetup" component={AccountSetupScreen} options={{ headerShown: false }} />
      <Stack.Screen name="CategorySelect" component={CategorySelectionScreen} options={{ headerShown: false }} />
      <Stack.Screen name="SubscriptionSelect" component={SubscriptionSelectionScreen} options={{ headerShown: false }} />
      <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
      <Stack.Screen name="AddMember" component={AddMemberScreen} options={{ title: "Add member" }} />
      <Stack.Screen name="AddExpense" component={AddExpenseScreen} options={{ title: "Add expense" }} />
      <Stack.Screen name="AddPlan" component={AddPlanScreen} options={{ title: "Add plan" }} />
      <Stack.Screen name="PlanDetail" component={PlanDetailScreen} options={{ title: "Plan details" }} />
      <Stack.Screen name="Premium" component={PremiumScreen} options={{ title: "Premium" }} />
      <Stack.Screen name="MemberDetail" component={MemberDetailScreen} options={{ title: "Member details" }} />
      <Stack.Screen name="ExpenseDetail" component={ExpenseDetailScreen} options={{ title: "Expense details" }} />
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: "Profile" }} />
    </Stack.Navigator>
  );
}
