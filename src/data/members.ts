import type { OnboardingCategory } from "./OnboardingContext";

export type MemberStatus = "Paid" | "Pending" | "Overdue";

export type Member = {
  id: string;
  name: string;
  category?: OnboardingCategory;
  business: string;
  planName?: string;
  phone: string;
  unit: string;
  batch?: string;
  roomType?: string;
  groupName?: string;
  customFields?: Array<{ label: string; value: string }>;
  monthlyRent: number;
  dueDay: number;
  status: MemberStatus;
  joinedOn: string;
  balance: number;
  billingMonth: string;
  billingYear: number;
};

export const initialMembers: Member[] = [
  { id: "m1", name: "Naveen", category: "Building rent", business: "Team Member", planName: "Standard Shop", phone: "9898989898", unit: "Plan A-101", monthlyRent: 2000, dueDay: 5, status: "Pending", joinedOn: "12 Jan 2024", balance: 2000, billingMonth: "July", billingYear: 2026 },
  { id: "m2", name: "Nayan", category: "Gym", business: "Basic Fitness", planName: "Basic Fitness", batch: "Evening", phone: "9898989898", unit: "Batch Evening", monthlyRent: 3000, dueDay: 5, status: "Pending", joinedOn: "03 Mar 2024", balance: 3000, billingMonth: "July", billingYear: 2026 },
  { id: "m3", name: "Fayiz", category: "Tution centre", business: "Crash Course", planName: "Crash Course", batch: "10th", phone: "9898989898", unit: "Batch 10th", monthlyRent: 2500, dueDay: 3, status: "Pending", joinedOn: "18 Sep 2023", balance: 2500, billingMonth: "July", billingYear: 2026 },
  { id: "m4", name: "Ijaz", category: "Hostal/PG", business: "Double Sharing", planName: "Double Sharing", roomType: "Double sharing", phone: "9898989898", unit: "Room Double", monthlyRent: 4000, dueDay: 8, status: "Pending", joinedOn: "09 Jun 2024", balance: 4000, billingMonth: "July", billingYear: 2026 },
  { id: "m5", name: "Asif", category: "Others", business: "Custom Group", groupName: "Custom Group", customFields: [{ label: "Package", value: "Weekend" }], phone: "9898989898", unit: "Custom setup", monthlyRent: 3500, dueDay: 6, status: "Paid", joinedOn: "20 May 2024", balance: 0, billingMonth: "July", billingYear: 2026 }
];

export const formatCurrency = (amount: number) => `₹${amount.toLocaleString("en-IN")}`;
