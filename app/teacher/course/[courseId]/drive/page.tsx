import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import DriveConnectionForm from "./drive-connection-form";

type Props = {
  params: Promise<{ courseId: string }>;
};

async function DrivePageContent({ params }: Props) {
  await connection();

  const { courseId } = await params;
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

  if (profile?.role !== "teacher") {
    redirect("/dashboard");
  }

  const { data: course } = await supabase
    .from("courses")
    .select("id, course_code, title")
    .eq("id", courseId)
    .single();

  if (!course) notFound();

  const { data: source } = await supabase
    .from("course_drive_sources")
    .select("drive_folder_id, drive_folder_name")
    .eq("course_id", courseId)
    .maybeSingle();

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white px-6 py-5">
        <div className="mx-auto max-w-4xl">
          <Link href="/teacher" className="text-xl font-bold text-indigo-700">
            TeacherHelper
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-4xl px-6 py-10">
        <Link
          href="/teacher"
          className="text-sm font-medium text-indigo-600 hover:underline"
        >
          ← Back to Teacher Dashboard
        </Link>

        <div className="mt-8">
          <p className="text-sm font-semibold text-indigo-600">
            {course.course_code}
          </p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            Connect Google Drive
          </h1>

          <p className="mt-2 text-gray-600">{course.title}</p>
        </div>

        <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Course materials folder
          </h2>

          <p className="mt-2 text-sm text-gray-600">
            Paste the shared Google Drive folder link for this course.
            The folder should contain Lecture, Laboratory, and Assignment
            subfolders.
          </p>

          <div className="mt-5 rounded-lg bg-gray-50 p-4">
            <p className="text-sm font-semibold text-gray-700">
              Recommended folder structure
            </p>
            <pre className="mt-3 overflow-x-auto text-sm leading-7 text-gray-600">
{`CS101 - Introduction to Programming/
├── Lecture/
├── Laboratory/
└── Assignment/`}
            </pre>
          </div>

          <DriveConnectionForm
            courseId={course.id}
            initialFolderId={source?.drive_folder_id ?? ""}
            initialFolderName={source?.drive_folder_name ?? ""}
          />
        </div>
      </section>
    </main>
  );
}

export default function DrivePage({ params }: Props) {
  return <DrivePageContent params={params} />;
}
