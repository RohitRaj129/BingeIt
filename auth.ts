import { supabase } from "@/lib/supabaseClient";

export async function signInWithGoogle(): Promise<void> {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/auth/callback`, // redirect URL after Google login
    },
  });

  if (error) {
    console.error("Google Sign-in Error:", error);
  }
}

export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Sign-out Error:", error);
  }
}
