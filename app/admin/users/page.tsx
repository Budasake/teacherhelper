
import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import UserManagement from "./user-management";

async function UsersContent() {
  await connection();

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "administrator") {
    redirect("/dashboard");
  }

  const { data, error } = await supabase.rpc("admin_list_users");

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 p-8">
        <div className="mx-auto max-w-6xl">
          <Link href="/admin" className="text-sm text-indigo-600 hover:underline">
            ← Back to Admin Dashboard
          </Link>
          <h1 className="mt-6 text-3xl font-bold text-gray-900">
            User Management
          </h1>
          <p className="mt-4 text-red-600">
            Could not load users: {error.message}
          </p>
        </div>
      </main>
    );
  }

  type AdminUserRow = {
    id: string;
    email: string | null;
    full_name: string | null;
    role: string;
    created_at: string;
  };

  const users = ((data ?? []) as AdminUserRow[]).map((item) => ({
    id: item.id,
    email: item.email ?? "",
    full_name: item.full_name ?? "",
    role: item.role as "student" | "teacher" | "administrator",
    created_at: item.created_at,
  }));

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/admin"
          className="text-sm font-medium text-indigo-600 hover:underline"
        >
          ← Back to Admin Dashboard
        </Link>

        <div className="mt-6">
          <h1 className="text-3xl font-bold text-gray-900">
            User Management
          </h1>
          <p className="mt-2 text-gray-600">
            View registered users and manage their account roles.
          </p>
        </div>

        <div className="mt-8">
          <UserManagement users={users} currentUserId={user.id} />
        </div>
      </div>
    </main>
  );
}

export default function UsersPage() {
  return (
    <Suspense
      fallback={
        <div className="p-10 text-gray-600">Loading users...</div>
      }
    >
      <UsersContent />
    </Suspense>
  );
}
