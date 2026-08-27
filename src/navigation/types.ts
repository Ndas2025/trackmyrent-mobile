import type { NavigatorScreenParams } from "@react-navigation/native";

export type RootStackParamList = {
  Splash: undefined;
  Auth: undefined;
  Intro: undefined;
  AccountSetup: undefined;
  CategorySelect: undefined;
  SubscriptionSelect: undefined;
  MainTabs: NavigatorScreenParams<MainTabParamList> | undefined;
  Members: undefined;
  Payments: undefined;
  AddMember: undefined;
  AddExpense: undefined;
  AddPlan: undefined;
  PlanDetail: { planId: string };
  Premium: undefined;
  MemberDetail: { memberId: string };
  ExpenseDetail: { expenseId: string };
  Profile: undefined;
  DeleteAccount: undefined;
};

export type MainTabParamList = {
  Dashboard: undefined;
  Plan: undefined;
  Expense: undefined;
  Report: undefined;
};
