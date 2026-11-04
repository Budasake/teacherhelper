import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";

type Course = {
  id: string;
  course_code: string;
  title: string;
  description: string | null;
  created_at: string;
};

async function TeacherContent() {
  await connection();

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", user.id)
    .single();

  if (profile?.role === "administrator") redirect("/admin");

  if (profile?.role !== "teacher") redirect("/dashboard");

  const { data: courseData, error } = await supabase
    .from("courses")
    .select("id, course_code, title, description, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 p-8">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-3xl font-bold text-gray-900">
            Teacher Dashboard
          </h1>
          <p className="mt-4 text-red-600">
            Could not load courses: {error.message}
          </p>
        </div>
      </main>
    );
  }

  const courses = (courseData ?? []) as Course[];

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-8 py-5">
          <Link href="/" className="text-xl font-bold text-indigo-700">
            TeacherHelper
          </Link>

          <span className="rounded-full bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700">
            Teacher Account
          </span>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-8 py-10">
        <div>
          <p className="text-sm font-medium text-indigo-600">
            TEACHER WORKSPACE
          </p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            Welcome, {profile.full_name || "Teacher"}
          </h1>

          <p className="mt-2 text-gray-600">
            Manage your assigned courses and learning materials.
          </p>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Assigned Courses</p>
            <p className="mt-3 text-3xl font-bold text-indigo-700">
              {courses.length}
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Account Role</p>
            <p className="mt-3 text-2xl font-bold text-gray-900">
              Teacher
            </p>
          </div>
        </div>

        <section className="mt-10">
          <div className="mb-5">
            <h2 className="text-xl font-semibold text-gray-900">
              My Courses
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Courses assigned to your account by the administrator.
            </p>
          </div>

          {courses.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center">
              <div className="text-4xl">📚</div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                No courses assigned yet
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Ask your administrator to assign a course to your account.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
                >
                  <span className="rounded-md bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                    {course.course_code}
                  </span>

                  <h3 className="mt-4 text-lg font-semibold text-gray-900">
                    {course.title}
                  </h3>

                  <p className="mt-2 min-h-12 text-sm text-gray-500">
                    {course.description || "No course description available."}
                  </p>

                  <div className="mt-5 border-t border-gray-100 pt-4">
                    <p className="text-xs text-gray-400">
                      Assigned course
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default function TeacherPage() {
  return (
    <Suspense fallback={<div className="p-10">Loading teacher dashboard...</div>}>
      <TeacherContent />
    </Suspense>
  );
}
