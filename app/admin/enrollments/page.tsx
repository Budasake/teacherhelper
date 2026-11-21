import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import EnrollmentManagement from "./enrollment-management";

type CourseRow = {
  id: string;
  course_code: string;
  title: string;
};

type AdminUserRow = {
  id: string;
  email: string | null;
  full_name: string | null;
  role: string;
  created_at: string;
};

type EnrollmentRow = {
  id: string;
  course_id: string;
  student_id: string;
  enrolled_at: string;
};

async function EnrollmentsContent() {
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

  const [courseResult, userResult, enrollmentResult] =
    await Promise.all([
      supabase
        .from("courses")
        .select("id, course_code, title")
        .order("course_code"),
      supabase.rpc("admin_list_users"),
      supabase
        .from("enrollments")
        .select("id, course_id, student_id, enrolled_at")
        .order("enrolled_at", { ascending: false }),
    ]);

  const error =
    courseResult.error ||
    userResult.error ||
    enrollmentResult.error;

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 p-8">
        <div className="mx-auto max-w-6xl">
          <Link href="/admin" className="text-indigo-600 hover:underline">
            ← Back to Admin Dashboard
          </Link>
          <h1 className="mt-6 text-3xl font-bold">
            Enrollment Management
          </h1>
          <p className="mt-4 text-red-600">{error.message}</p>
        </div>
      </main>
    );
  }

  const courses = (courseResult.data ?? []) as CourseRow[];

  const allUsers = (userResult.data ?? []) as AdminUserRow[];

  const students = allUsers
    .filter((item) => item.role === "student")
    .map((item) => ({
      id: item.id,
      full_name: item.full_name || "Unnamed student",
      email: item.email || "",
    }));

  const enrollments = (
    (enrollmentResult.data ?? []) as EnrollmentRow[]
  ).map((enrollment) => {
    const student = students.find(
      (item) => item.id === enrollment.student_id
    );

    // Include users who may have changed roles after enrollment.
    const enrolledUser = allUsers.find(
      (item) => item.id === enrollment.student_id
    );

    const course = courses.find(
      (item) => item.id === enrollment.course_id
    );

    return {
      ...enrollment,
      student_name:
        enrolledUser?.full_name || "Unknown student",
      student_email: enrolledUser?.email || "",
      course_title: course?.title || "Unknown course",
      course_code: course?.course_code || "",
    };
  });

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
            Enrollment Management
          </h1>
          <p className="mt-2 text-gray-600">
            Enroll students in courses and manage their access.
          </p>
        </div>

        <div className="mt-8">
          <EnrollmentManagement
            courses={courses}
            students={students}
            initialEnrollments={enrollments}
          />
        </div>
      </div>
    </main>
  );
}

export default function EnrollmentsPage() {
  return (
    <Suspense fallback={<div className="p-10">Loading enrollments...</div>}>
      <EnrollmentsContent />
    </Suspense>
  );
}
