import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import CourseManagement from "./course-management";

type CourseRow = {
  id: string;
  course_code: string;
  title: string;
  description: string | null;
  teacher_id: string | null;
  created_at: string;
};

type AdminUserRow = {
  id: string;
  email: string | null;
  full_name: string | null;
  role: string;
  created_at: string;
};

async function CoursesContent() {
  await connection();

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "administrator") {
    redirect("/dashboard");
  }

  const { data: courseData, error: courseError } = await supabase
    .from("courses")
    .select("id, course_code, title, description, teacher_id, created_at")
    .order("created_at", { ascending: false });

  const { data: userData, error: userError } = await supabase.rpc(
    "admin_list_users"
  );

  if (courseError || userError) {
    return (
      <main className="min-h-screen bg-gray-50 p-8">
        <div className="mx-auto max-w-6xl">
          <Link href="/admin" className="text-indigo-600 hover:underline">
            ← Back to Admin Dashboard
          </Link>
          <h1 className="mt-6 text-3xl font-bold">Course Management</h1>
          <p className="mt-4 text-red-600">
            {courseError?.message || userError?.message}
          </p>
        </div>
      </main>
    );
  }

  const courses = (courseData ?? []) as CourseRow[];

  const teachers = ((userData ?? []) as AdminUserRow[])
    .filter((item) => item.role === "teacher")
    .map((item) => ({
      id: item.id,
      full_name: item.full_name || "Unnamed teacher",
      email: item.email || "",
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
            Course Management
          </h1>
          <p className="mt-2 text-gray-600">
            Create courses and assign teachers to manage them.
          </p>
        </div>

        <div className="mt-8">
          <CourseManagement
            initialCourses={courses}
            teachers={teachers}
          />
        </div>
      </div>
    </main>
  );
}

export default function CoursesPage() {
  return (
    <Suspense fallback={<div className="p-10">Loading courses...</div>}>
      <CoursesContent />
    </Suspense>
  );
}
