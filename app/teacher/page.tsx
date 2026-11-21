
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
};

type DriveSource = {
  course_id: string;
  sync_status: string;
  last_synced_at: string | null;
};

async function TeacherDashboardContent() {
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
    .select("full_name, role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "teacher") {
    redirect("/dashboard");
  }

  const { data: courses, error } = await supabase
    .from("courses")
    .select("id, course_code, title, description")
    .eq("teacher_id", user.id)
    .order("created_at", { ascending: false });

  const courseList = (courses ?? []) as Course[];

  let driveSources: DriveSource[] = [];

  if (courseList.length > 0) {
    const { data: sources } = await supabase
      .from("course_drive_sources")
      .select("course_id, sync_status, last_synced_at")
      .in(
        "course_id",
        courseList.map((course) => course.id)
      );

    driveSources = (sources ?? []) as DriveSource[];
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link
            href="/"
            className="text-2xl font-bold text-indigo-700"
          >
            TeacherHelper
          </Link>

          <span className="rounded-full bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700">
            Teacher Workspace
          </span>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div>
          <p className="text-sm font-medium text-indigo-600">
            TEACHER DASHBOARD
          </p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            Welcome, {profile.full_name || "Teacher"}
          </h1>

          <p className="mt-2 text-gray-600">
            Manage your courses and connect your Google Drive
            learning materials.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <p className="text-sm text-gray-500">Assigned courses</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {courseList.length}
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <p className="text-sm text-gray-500">Connected Drive folders</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {driveSources.length}
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <p className="text-sm text-gray-500">Successfully synced</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {driveSources.filter(
                (source) => source.sync_status === "synced"
              ).length}
            </p>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-xl font-bold text-gray-900">
            My courses
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            These are the courses assigned to your account by the
            administrator.
          </p>

          {error ? (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
              Could not load your courses: {error.message}
            </div>
          ) : courseList.length === 0 ? (
            <div className="mt-6 rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">
              <div className="text-4xl">📚</div>
              <h3 className="mt-4 font-semibold text-gray-900">
                No courses assigned yet
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Ask your administrator to assign a course to your
                teacher account.
              </p>
            </div>
          ) : (
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {courseList.map((course) => {
                const source = driveSources.find(
                  (item) => item.course_id === course.id
                );

                return (
                  <div
                    key={course.id}
                    className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-indigo-600">
                          {course.course_code}
                        </p>

                        <h3 className="mt-2 text-xl font-bold text-gray-900">
                          {course.title}
                        </h3>
                      </div>

                      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                        Assigned
                      </span>
                    </div>

                    <p className="mt-3 min-h-10 text-sm text-gray-500">
                      {course.description || "No course description provided."}
                    </p>

                    <div className="mt-5 border-t border-gray-100 pt-4">
                      <p className="text-sm text-gray-500">
                        Google Drive status
                      </p>

                      <p className="mt-1 text-sm font-medium text-gray-800">
                        {source
                          ? source.sync_status.replace("_", " ")
                          : "Not connected"}
                      </p>

                      {source?.last_synced_at && (
                        <p className="mt-1 text-xs text-gray-400">
                          Last synced:{" "}
                          {new Date(source.last_synced_at).toLocaleString()}
                        </p>
                      )}

                      <Link
                        href={`/teacher/courses/${course.id}/drive`}
                        className="mt-5 inline-flex rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
                      >
                        {source ? "Manage Drive folder" : "Connect Drive folder"}
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default function TeacherDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          Loading teacher dashboard...
        </div>
      }
    >
      <TeacherDashboardContent />
    </Suspense>
  );
}
