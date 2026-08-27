import type { Expense, Payment, Plan } from "../data/FinanceContext";
import type { Member } from "../data/members";
import { supabase } from "./client";

function normalizeBillingCycle(value: unknown): Plan["billingCycle"] {
  if (value === "1 Month" || value === "3 Months" || value === "6 Months" || value === "1 Year") return value;
  if (value === "Monthly") return "1 Month";
  if (value === "Quarterly") return "3 Months";
  return "1 Month";
}

async function ownerId() {
  if (!supabase) return null;
  const { data } = await supabase.auth.getUser();
  return data.user?.id ?? null;
}

function parseCustomFields(value: unknown): Member["customFields"] {
  if (!Array.isArray(value)) return undefined;
  const fields = value
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const record = item as { label?: unknown; value?: unknown };
      if (typeof record.label !== "string" || typeof record.value !== "string") return null;
      return { label: record.label, value: record.value };
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  return fields.length ? fields : undefined;
}

export const backendRepository = {
  loadAll: async () => {
    if (!supabase || !(await ownerId())) return null;
    const [members, plans, payments, expenses] = await Promise.all([
      supabase.from("members").select("*").order("created_at", { ascending: false }),
      supabase.from("plans").select("*").order("created_at", { ascending: false }),
      supabase.from("payments").select("*").order("paid_at", { ascending: false }),
      supabase.from("expenses").select("*").order("spent_at", { ascending: false })
    ]);
    const error = members.error ?? plans.error ?? payments.error ?? expenses.error;
    if (error) throw error;
    return {
      members: (members.data ?? []).map((m) => ({
        id: m.id,
        name: m.name,
        category: m.category ?? undefined,
        business: m.business,
        planName: m.plan_name ?? undefined,
        phone: m.phone,
        unit: m.unit,
        batch: m.batch ?? undefined,
        roomType: m.room_type ?? undefined,
        groupName: m.group_name ?? undefined,
        customFields: parseCustomFields(m.custom_fields),
        monthlyRent: Number(m.monthly_rent),
        dueDay: m.due_day,
        status: m.status,
        joinedOn: m.joined_on,
        balance: Number(m.balance),
        billingMonth: m.billing_month ?? "July",
        billingYear: Number(m.billing_year ?? 2026)
      })) as Member[],
      plans: (plans.data ?? []).map((p) => ({
        id: p.id,
        name: p.name,
        amount: Number(p.amount),
        billingCycle: normalizeBillingCycle(p.billing_cycle),
        members: p.member_count,
        active: p.active,
        assignedMemberIds: Array.isArray((p as { assigned_member_ids?: unknown }).assigned_member_ids) ? ((p as { assigned_member_ids?: string[] }).assigned_member_ids ?? []) : []
      })) as Plan[],
      payments: (payments.data ?? []).map((p) => ({ id: p.id, memberId: p.member_id, amount: Number(p.amount), date: p.paid_at, method: p.method })) as Payment[],
      expenses: (expenses.data ?? []).map((e) => ({ id: e.id, title: e.title, category: e.category, amount: Number(e.amount), date: e.spent_at, recurrence: e.recurrence ?? "This month" })) as Expense[]
    };
  },
  saveMember: async (member: Member) => {
    const owner = await ownerId(); if (!supabase || !owner) return;
    const { error } = await supabase.from("members").upsert({
      id: member.id,
      owner_id: owner,
      name: member.name,
      category: member.category ?? null,
      business: member.business,
      plan_name: member.planName ?? null,
      phone: member.phone,
      unit: member.unit,
      batch: member.batch ?? null,
      room_type: member.roomType ?? null,
      group_name: member.groupName ?? null,
      custom_fields: member.customFields ?? [],
      monthly_rent: member.monthlyRent,
      due_day: member.dueDay,
      status: member.status,
      joined_on: member.joinedOn,
      balance: member.balance,
      billing_month: member.billingMonth,
      billing_year: member.billingYear
    });
    if (error) throw error;
  },
  updateMemberStatus: async (memberId: string, status: Member["status"], balance: number) => {
    if (!supabase) return;
    const { error } = await supabase.from("members").update({ status, balance }).eq("id", memberId);
    if (error) throw error;
  },
  markMemberPaid: async (memberId: string) => {
    await backendRepository.updateMemberStatus(memberId, "Paid", 0);
  },
  savePlan: async (plan: Plan) => {
    const owner = await ownerId();
    if (!supabase || !owner) return;
    const { error } = await supabase.from("plans").upsert({
      id: plan.id,
      owner_id: owner,
      name: plan.name,
      amount: plan.amount,
      billing_cycle: plan.billingCycle,
      member_count: plan.members,
      active: plan.active,
      assigned_member_ids: plan.assignedMemberIds
    });
    if (error) throw error;
  },
  deletePlan: async (planId: string) => { if (!supabase) return; const { error } = await supabase.from("plans").delete().eq("id", planId); if (error) throw error; },
  savePayment: async (payment: Payment) => { const owner = await ownerId(); if (!supabase || !owner) return; const { error } = await supabase.from("payments").upsert({ id: payment.id, owner_id: owner, member_id: payment.memberId, amount: payment.amount, paid_at: payment.date, method: payment.method }); if (error) throw error; },
  saveExpense: async (expense: Expense) => { const owner = await ownerId(); if (!supabase || !owner) return; const { error } = await supabase.from("expenses").upsert({ id: expense.id, owner_id: owner, title: expense.title, category: expense.category, amount: expense.amount, spent_at: expense.date, recurrence: expense.recurrence }); if (error) throw error; },
  deleteExpense: async (expenseId: string) => { if (!supabase) return; const { error } = await supabase.from("expenses").delete().eq("id", expenseId); if (error) throw error; }
};
