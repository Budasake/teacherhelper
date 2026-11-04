"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Course = {
  id: string;
  course_code: string;
  title: string;
  description: string | null;
  teacher_id: string | null;
  created_at: string;
};

type Teacher = {
  id: string;
  full_name: string;
  email: string;
};

export default function CourseManagement({
  initialCourses,
  teachers,
}: {
  initialCourses: Course[];
  teachers: Teacher[];
}) {
  const [courses, setCourses] = useState(initialCourses);
  const [courseCode, setCourseCode] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [selectedTeachers, setSelectedTeachers] = useState<
    Record<string, string>
  >({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();
  const supabase = createClient();

  async function createCourse(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    const { data, error: insertError } = await supabase
      .from("courses")
      .insert({
        course_code: courseCode.trim().toUpperCase(),
        title: title.trim(),
        description: description.trim() || null,
        teacher_id: teacherId || null,
      })
      .select(
        "id, course_code, title, description, teacher_id, created_at"
      )
      .single();

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    setCourses((current) => [data as Course, ...current]);
    setCourseCode("");
    setTitle("");
    setDescription("");
    setTeacherId("");
    setMessage("Course created successfully.");
    setLoading(false);
    router.refresh();
  }

  async function assignTeacher(courseId: string) {
    const selectedTeacher = selectedTeachers[courseId];

    setLoading(true);
    setMessage("");
    setError("");

    const { error: updateError } = await supabase
      .from("courses")
      .update({
        teacher_id: selectedTeacher || null,
      })
      .eq("id", courseId);

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    setCourses((current) =>
      current.map((course) =>
        course.id === courseId
          ? { ...course, teacher_id: selectedTeacher || null }
          : course
      )
    );

    setMessage("Teacher assignment updated successfully.");
    setLoading(false);
    router.refresh();
  }

  function getTeacherName(teacherId: string | null) {
    if (!teacherId) return "Not assigned";

    return (
      teachers.find((teacher) => teacher.id === teacherId)?.full_name ||
      "Unknown teacher"
    );
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

      {/* Create Course */}
      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900">
          Create New Course
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Add a course to the TeacherHelper platform.
        </p>

        <form onSubmit={createCourse} className="mt-6 space-y-5">
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Course Code
              </label>
              <input
                required
                value={courseCode}
                onChange={(event) => setCourseCode(event.target.value)}
                placeholder="e.g. CS101"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Course Title
              </label>
              <input
                required
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="e.g. Introduction to Programming"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Describe this course..."
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Assign Teacher (Optional)
            </label>
            <select
              value={teacherId}
              onChange={(event) => setTeacherId(event.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3"
            >
              <option value="">No teacher assigned</option>
              {teachers.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.full_name} — {teacher.email}
                </option>
              ))}
            </select>

            {teachers.length === 0 && (
              <p className="mt-2 text-sm text-amber-600">
                No teacher accounts exist yet. Create a teacher account
                through User Management first.
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-indigo-600 px-6 py-3 font-medium text-white hover:bg-indigo-700 disabled:bg-gray-400"
          >
            {loading ? "Please wait..." : "Create Course"}
          </button>
        </form>
      </section>

      {/* Existing Courses */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            Existing Courses
          </h2>
          <span className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700">
            {courses.length} courses
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-5 py-4">Course</th>
                <th className="px-5 py-4">Teacher</th>
                <th className="px-5 py-4">Assign Teacher</th>
                <th className="px-5 py-4">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {courses.map((course) => {
                const selectedTeacher =
                  selectedTeachers[course.id] ??
                  course.teacher_id ??
                  "";

                return (
                  <tr key={course.id}>
                    <td className="px-5 py-4">
                      <p className="font-semibold text-gray-900">
                        {course.title}
                      </p>
                      <p className="mt-1 text-gray-500">
                        {course.course_code}
                      </p>
                      {course.description && (
                        <p className="mt-1 max-w-xs text-xs text-gray-400">
                          {course.description}
                        </p>
                      )}
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {getTeacherName(course.teacher_id)}
                    </td>

                    <td className="px-5 py-4">
                      <select
                        value={selectedTeacher}
                        onChange={(event) =>
                          setSelectedTeachers((current) => ({
                            ...current,
                            [course.id]: event.target.value,
                          }))
                        }
                        className="min-w-40 rounded-lg border border-gray-300 bg-white px-3 py-2"
                      >
                        <option value="">No teacher</option>
                        {teachers.map((teacher) => (
                          <option key={teacher.id} value={teacher.id}>
                            {teacher.full_name}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="px-5 py-4">
                      <button
                        onClick={() => assignTeacher(course.id)}
                        disabled={
                          loading ||
                          selectedTeacher === (course.teacher_id ?? "")
                        }
                        className="rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700 disabled:bg-gray-300"
                      >
                        Save
                      </button>
                    </td>
                  </tr>
                );
              })}

              {courses.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-5 py-10 text-center text-gray-500"
                  >
                    No courses created yet. Create your first course above.
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
