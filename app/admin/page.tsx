import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";

async function AdminContent() {
  await connection();

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", user.id)
    .single();

  if (error || profile?.role !== "administrator") {
    redirect("/dashboard");
  }

  const sections = [
    {
      title: "User Management",
      description: "Manage student, teacher, and administrator accounts.",
      icon: "👥",
      href: "/admin/users",
    },
    {
      title: "Course Management",
      description: "Create courses and assign teachers.",
      icon: "📚",
      href: "/admin/courses",
    },
    {
      title: "Enrollment Management",
      description: "Manage student course enrollments.",
      icon: "🎓",
      href: "/admin/enrollments",
    },
    {
      title: "System Settings",
      description: "Configure the TeacherHelper platform.",
      icon: "⚙️",
      href: "/admin/settings",
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link href="/" className="text-xl font-bold text-indigo-700">
            TeacherHelper
          </Link>

          <span className="rounded-full bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700">
            Administrator
          </span>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-12">
        <p className="text-sm font-semibold text-indigo-600">
          ADMINISTRATION
        </p>

        <h1 className="mt-2 text-3xl font-bold text-gray-900">
          Welcome, {profile.full_name}
        </h1>

        <p className="mt-2 text-gray-500">
          Manage users, courses, enrollments, and platform settings.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {sections.map((section) => (
            <Link
              key={section.title}
              href={section.href}
              className="rounded-xl border border-gray-200 bg-white p-7 shadow-sm transition hover:border-indigo-300 hover:shadow-md"
            >
              <span className="text-3xl">{section.icon}</span>

              <h2 className="mt-5 text-xl font-semibold text-gray-900">
                {section.title}
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                {section.description}
              </p>

              <p className="mt-5 text-sm font-semibold text-indigo-600">
                Manage →
              </p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}

export default function AdminDashboard() {
  return (
    <Suspense fallback={<div className="p-10">Loading admin dashboard...</div>}>
      <AdminContent />
    </Suspense>
  );
}
