export type MemberStatus = "Paid" | "Pending" | "Overdue";

export type Member = {
  id: string;
  name: string;
  business: string;
  phone: string;
  unit: string;
  monthlyRent: number;
  dueDay: number;
  status: MemberStatus;
  joinedOn: string;
  balance: number;
};

export const initialMembers: Member[] = [
  { id: "m1", name: "Arun Kumar", business: "Kumar Textiles", phone: "+91 98765 43210", unit: "Shop 01", monthlyRent: 18500, dueDay: 5, status: "Paid", joinedOn: "12 Jan 2024", balance: 0 },
  { id: "m2", name: "Meera Nair", business: "Fresh Mart", phone: "+91 98204 11880", unit: "Shop 04", monthlyRent: 22000, dueDay: 5, status: "Pending", joinedOn: "03 Mar 2024", balance: 22000 },
  { id: "m3", name: "Vikram Shah", business: "Shah Electronics", phone: "+91 98920 77441", unit: "Shop 08", monthlyRent: 27500, dueDay: 3, status: "Overdue", joinedOn: "18 Sep 2023", balance: 27500 },
  { id: "m4", name: "Lakshmi Rao", business: "Lakshmi Tailors", phone: "+91 98450 22119", unit: "Shop 11", monthlyRent: 15000, dueDay: 8, status: "Paid", joinedOn: "09 Jun 2024", balance: 0 }
];

export const formatCurrency = (amount: number) => `₹${amount.toLocaleString("en-IN")}`;
