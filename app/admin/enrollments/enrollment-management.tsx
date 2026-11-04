"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Course = {
  id: string;
  course_code: string;
  title: string;
};

type Student = {
  id: string;
  full_name: string;
  email: string;
};

type Enrollment = {
  id: string;
  course_id: string;
  student_id: string;
  enrolled_at: string;
  student_name: string;
  student_email: string;
  course_title: string;
  course_code: string;
};

export default function EnrollmentManagement({
  courses,
  students,
  initialEnrollments,
}: {
  courses: Course[];
  students: Student[];
  initialEnrollments: Enrollment[];
}) {
  const [enrollments, setEnrollments] = useState(initialEnrollments);
  const [courseId, setCourseId] = useState("");
  const [studentId, setStudentId] = useState("");
  const [loading, setLoading] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();
  const supabase = createClient();

  async function createEnrollment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!courseId || !studentId) {
      setError("Please select both a course and a student.");
      return;
    }

    setLoading(true);
    setMessage("");
    setError("");

    const { data, error: insertError } = await supabase
      .from("enrollments")
      .insert({
        course_id: courseId,
        student_id: studentId,
      })
      .select("id, course_id, student_id, enrolled_at")
      .single();

    if (insertError) {
      setError(
        insertError.code === "23505"
          ? "This student is already enrolled in this course."
          : insertError.message
      );
      setLoading(false);
      return;
    }

    const student = students.find((item) => item.id === studentId);
    const course = courses.find((item) => item.id === courseId);

    if (student && course) {
      setEnrollments((current) => [
        {
          ...data,
          student_name: student.full_name,
          student_email: student.email,
          course_title: course.title,
          course_code: course.course_code,
        },
        ...current,
      ]);
    }

    setStudentId("");
    setCourseId("");
    setMessage("Student enrolled successfully.");
    setLoading(false);
    router.refresh();
  }

  async function removeEnrollment(enrollmentId: string) {
    const confirmed = window.confirm(
      "Are you sure you want to remove this enrollment?"
    );

    if (!confirmed) return;

    setRemovingId(enrollmentId);
    setMessage("");
    setError("");

    const { error: deleteError } = await supabase
      .from("enrollments")
      .delete()
      .eq("id", enrollmentId);

    if (deleteError) {
      setError(deleteError.message);
      setRemovingId(null);
      return;
    }

    setEnrollments((current) =>
      current.filter((item) => item.id !== enrollmentId)
    );

    setMessage("Enrollment removed successfully.");
    setRemovingId(null);
    router.refresh();
  }

  return (
    <div className="space-y-8">
      {message && (
        <p className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
          {message}
        </p>
      )}

      {error && (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {/* Create Enrollment */}
      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900">
          Enroll Student
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Select a student and assign them to a course.
        </p>

        <form onSubmit={createEnrollment} className="mt-6 space-y-5">
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Select Course
              </label>

              <select
                required
                value={courseId}
                onChange={(event) => setCourseId(event.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3"
              >
                <option value="">Choose a course</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.course_code} — {course.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Select Student
              </label>

              <select
                required
                value={studentId}
                onChange={(event) => setStudentId(event.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3"
              >
                <option value="">Choose a student</option>
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.full_name} — {student.email}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {courses.length === 0 && (
            <p className="text-sm text-amber-600">
              Create a course before enrolling students.
            </p>
          )}

          {students.length === 0 && (
            <p className="text-sm text-amber-600">
              No student accounts are available.
            </p>
          )}

          <button
            type="submit"
            disabled={loading || courses.length === 0 || students.length === 0}
            className="rounded-lg bg-indigo-600 px-6 py-3 font-medium text-white hover:bg-indigo-700 disabled:bg-gray-400"
          >
            {loading ? "Enrolling..." : "Enroll Student"}
          </button>
        </form>
      </section>

      {/* Existing Enrollments */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            Existing Enrollments
          </h2>

          <span className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700">
            {enrollments.length} enrollments
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-5 py-4">Student</th>
                <th className="px-5 py-4">Course</th>
                <th className="px-5 py-4">Enrolled Date</th>
                <th className="px-5 py-4">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {enrollments.map((enrollment) => (
                <tr key={enrollment.id}>
                  <td className="px-5 py-4">
                    <p className="font-medium text-gray-900">
                      {enrollment.student_name}
                    </p>
                    <p className="mt-1 text-gray-500">
                      {enrollment.student_email}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <p className="font-medium text-gray-900">
                      {enrollment.course_title}
                    </p>
                    <p className="mt-1 text-gray-500">
                      {enrollment.course_code}
                    </p>
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 text-gray-500">
                    {new Date(enrollment.enrolled_at).toLocaleDateString()}
                  </td>

                  <td className="px-5 py-4">
                    <button
                      onClick={() => removeEnrollment(enrollment.id)}
                      disabled={removingId === enrollment.id}
                      className="rounded-lg bg-red-50 px-4 py-2 font-medium text-red-600 hover:bg-red-100 disabled:opacity-50"
                    >
                      {removingId === enrollment.id ? "Removing..." : "Remove"}
                    </button>
                  </td>
                </tr>
              ))}

              {enrollments.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-5 py-10 text-center text-gray-500"
                  >
                    No enrollments yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
