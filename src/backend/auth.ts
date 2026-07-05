import { supabase } from "./client";

function requireClient() {
  if (!supabase) throw new Error("Supabase environment variables are not configured.");
  return supabase;
}

export const authService = {
  signUp: async (email: string, password: string) => {
    const { data, error } = await requireClient().auth.signUp({ email, password });
    if (error) throw error;
    return data;
  },
  signIn: async (email: string, password: string) => {
    const { data, error } = await requireClient().auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  },
  signOut: async () => {
    const { error } = await requireClient().auth.signOut();
    if (error) throw error;
  }
};
