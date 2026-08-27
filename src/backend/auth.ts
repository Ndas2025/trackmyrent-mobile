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
  },
  requestAccountDeletion: async (reason: string) => {
    const client = requireClient();
    const {
      data: { user },
      error: userError
    } = await client.auth.getUser();

    if (userError) throw userError;
    if (!user?.id || !user.email) throw new Error("You need to be signed in before requesting account deletion.");

    const { error } = await client.from("account_deletion_requests").upsert({
      owner_id: user.id,
      email: user.email,
      reason,
      status: "requested",
      requested_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });

    if (error) throw error;
  }
};
