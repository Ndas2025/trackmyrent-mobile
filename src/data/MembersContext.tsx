import { createContext, type ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { initialMembers, type Member } from "./members";
import { backendRepository } from "../backend/repository";
import { useOnboarding } from "./OnboardingContext";

type NewMember = Omit<Member, "id" | "status" | "balance" | "joinedOn">;
type MembersContextValue = {
  members: Member[];
  addMember: (member: NewMember) => Member;
  markPaid: (memberId: string) => void;
  markUnpaid: (memberId: string) => void;
};
const MembersContext = createContext<MembersContextValue | null>(null);

export function MembersProvider({ children }: { children: ReactNode }) {
  const { ready, category } = useOnboarding();
  const [members, setMembers] = useState<Member[]>([]);

  useEffect(() => {
    if (!ready) return;

    let active = true;
    if (category !== "Others") {
      setMembers([]);
      return () => {
        active = false;
      };
    }

    backendRepository
      .loadAll()
      .then((data) => {
        if (!active) return;
        setMembers(data?.members.length ? data.members : initialMembers);
      })
      .catch(console.warn);

    return () => {
      active = false;
    };
  }, [category, ready]);

  const value = useMemo(() => ({
    members,
    addMember: (member: NewMember) => {
      const now = new Date();
      const created: Member = {
        ...member,
        id: `m${Date.now()}`,
        status: "Pending",
        balance: member.monthlyRent,
        joinedOn: now.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
        billingMonth: now.toLocaleDateString("en-US", { month: "long" }),
        billingYear: now.getFullYear()
      };
      setMembers((current) => [created, ...current]);
      backendRepository.saveMember(created).catch(console.warn);
      return created;
    },
    markPaid: (memberId: string) => {
      setMembers((current) => current.map((member) => member.id === memberId ? { ...member, status: "Paid", balance: 0 } : member));
      backendRepository.markMemberPaid(memberId).catch(console.warn);
    },
    markUnpaid: (memberId: string) => {
      setMembers((current) => current.map((member) => member.id === memberId ? { ...member, status: "Pending", balance: member.monthlyRent } : member));
    }
  }), [members]);
  return <MembersContext.Provider value={value}>{children}</MembersContext.Provider>;
}

export function useMembers() {
  const context = useContext(MembersContext);
  if (!context) throw new Error("useMembers must be used inside MembersProvider");
  return context;
}
