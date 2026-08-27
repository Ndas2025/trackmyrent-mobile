import { createContext, type ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "./AuthContext";
import { initialMembers, type Member } from "./members";
import { backendRepository } from "../backend/repository";
import { useOnboarding } from "./OnboardingContext";

type NewMember = Omit<Member, "id" | "status" | "balance" | "joinedOn">;
type LoadState = "idle" | "loading" | "ready" | "error";
type MembersContextValue = {
  status: LoadState;
  errorMessage: string | null;
  members: Member[];
  addMember: (member: NewMember) => Promise<Member>;
  markPaid: (memberId: string) => Promise<void>;
  markUnpaid: (memberId: string) => Promise<void>;
  clearError: () => void;
};
const MembersContext = createContext<MembersContextValue | null>(null);

export function MembersProvider({ children }: { children: ReactNode }) {
  const { ready } = useOnboarding();
  const { loading: authLoading, session, isBackendConfigured } = useAuth();
  const [status, setStatus] = useState<LoadState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [members, setMembers] = useState<Member[]>([]);

  useEffect(() => {
    if (!ready || authLoading) return;

    let active = true;
    setErrorMessage(null);

    if (isBackendConfigured && !session) {
      setMembers([]);
      setStatus("ready");
      return () => {
        active = false;
      };
    }

    setStatus("loading");
    backendRepository
      .loadAll()
      .then((data) => {
        if (!active) return;
        if (!data) {
          setMembers(isBackendConfigured ? [] : initialMembers);
          setStatus("ready");
          return;
        }
        setMembers(data.members);
        setStatus("ready");
      })
      .catch((error) => {
        if (!active) return;
        console.warn(error);
        setMembers(isBackendConfigured ? [] : initialMembers);
        setStatus("error");
        setErrorMessage(error instanceof Error ? error.message : "We couldn't load members right now.");
      });

    return () => {
      active = false;
    };
  }, [authLoading, isBackendConfigured, ready, session]);

  const value = useMemo(() => ({
    status,
    errorMessage,
    members,
    clearError: () => setErrorMessage(null),
    addMember: async (member: NewMember) => {
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
      setErrorMessage(null);
      try {
        await backendRepository.saveMember(created);
      } catch (error) {
        setMembers((current) => current.filter((item) => item.id !== created.id));
        setErrorMessage(error instanceof Error ? error.message : "We couldn't save the member.");
        throw error;
      }
      return created;
    },
    markPaid: async (memberId: string) => {
      const currentMember = members.find((member) => member.id === memberId);
      if (!currentMember) return;
      setMembers((current) => current.map((member) => member.id === memberId ? { ...member, status: "Paid", balance: 0 } : member));
      setErrorMessage(null);
      try {
        await backendRepository.markMemberPaid(memberId);
      } catch (error) {
        setMembers((current) => current.map((member) => member.id === memberId ? currentMember : member));
        setErrorMessage(error instanceof Error ? error.message : "We couldn't update the payment status.");
        throw error;
      }
    },
    markUnpaid: async (memberId: string) => {
      const member = members.find((item) => item.id === memberId);
      if (!member) return;
      setMembers((current) => current.map((member) => member.id === memberId ? { ...member, status: "Pending", balance: member.monthlyRent } : member));
      setErrorMessage(null);
      try {
        await backendRepository.updateMemberStatus(memberId, "Pending", member.monthlyRent);
      } catch (error) {
        setMembers((current) => current.map((item) => item.id === memberId ? member : item));
        setErrorMessage(error instanceof Error ? error.message : "We couldn't update the payment status.");
        throw error;
      }
    }
  }), [errorMessage, members, status]);
  return <MembersContext.Provider value={value}>{children}</MembersContext.Provider>;
}

export function useMembers() {
  const context = useContext(MembersContext);
  if (!context) throw new Error("useMembers must be used inside MembersProvider");
  return context;
}
