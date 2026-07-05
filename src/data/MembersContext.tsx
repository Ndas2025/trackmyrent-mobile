import { createContext, type ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { initialMembers, type Member } from "./members";
import { backendRepository } from "../backend/repository";

type NewMember = Omit<Member, "id" | "status" | "balance" | "joinedOn">;
type MembersContextValue = { members: Member[]; addMember: (member: NewMember) => Member; markPaid: (memberId: string) => void };
const MembersContext = createContext<MembersContextValue | null>(null);

export function MembersProvider({ children }: { children: ReactNode }) {
  const [members, setMembers] = useState(initialMembers);
  useEffect(() => { backendRepository.loadAll().then((data) => { if (data?.members.length) setMembers(data.members); }).catch(console.warn); }, []);
  const value = useMemo(() => ({
    members,
    addMember: (member: NewMember) => {
      const created: Member = { ...member, id: `m${Date.now()}`, status: "Pending", balance: member.monthlyRent, joinedOn: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) };
      setMembers((current) => [created, ...current]);
      backendRepository.saveMember(created).catch(console.warn);
      return created;
    },
    markPaid: (memberId: string) => { setMembers((current) => current.map((member) => member.id === memberId ? { ...member, status: "Paid", balance: 0 } : member)); backendRepository.markMemberPaid(memberId).catch(console.warn); }
  }), [members]);
  return <MembersContext.Provider value={value}>{children}</MembersContext.Provider>;
}

export function useMembers() {
  const context = useContext(MembersContext);
  if (!context) throw new Error("useMembers must be used inside MembersProvider");
  return context;
}
