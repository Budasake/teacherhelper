
import Link from "next/link";

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-white lg:grid lg:grid-cols-2">
      {/* Left panel */}
      <section className="hidden bg-indigo-700 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <Link href="/" className="text-2xl font-bold">
          TeacherHelper
        </Link>

        <div className="max-w-md">
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-indigo-200">
            Start learning smarter
          </p>
          <h1 className="text-5xl font-bold leading-tight">
            Your learning journey starts here.
          </h1>
          <p className="mt-6 text-lg leading-8 text-indigo-100">
            Join your courses, ask questions, and learn with an AI assistant
            that understands your course materials.
          </p>
        </div>

        <p className="text-sm text-indigo-200">
          © 2026 TeacherHelper. All rights reserved.
        </p>
      </section>

      {/* Registration form */}
      <section className="flex items-center justify-center px-6 py-12 sm:px-12">
        <div className="w-full max-w-md">
          <Link
            href="/"
            className="text-xl font-bold text-indigo-700 lg:hidden"
          >
            TeacherHelper
          </Link>
          <Link
            href="/"
            className="mb-8 inline-flex items-center text-sm text-slate-400 hover:text-indigo-600"
          >
            ← Back to home
          </Link>
          <div className="mt-8 lg:mt-0">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Create your account
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Register as a student to access your courses.
            </p>
          </div>

          <form className="mt-8 space-y-5">
            <div>
              <label htmlFor="fullName" className="mb-2 block text-sm font-medium text-gray-700">
                Full name
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="Enter your full name"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
                University email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="name@university.edu"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Create a password"
                required
                minLength={8}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
              />
              <p className="mt-2 text-xs text-gray-400">
                Use at least 8 characters.
              </p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-gray-700">
                Confirm password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Enter your password again"
                required
                minLength={8}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <button
              type="button"
              className="w-full rounded-lg bg-indigo-600 px-4 py-3 font-semibold text-white transition hover:bg-indigo-700"
            >
              Create student account
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-indigo-600 hover:text-indigo-700">
              Sign in
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
