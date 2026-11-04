
import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen bg-white">
      {/* Left section */}
      <section className="hidden w-1/2 flex-col justify-between bg-indigo-700 p-12 text-white lg:flex">
        <Link href="/" className="text-2xl font-bold">
          TeacherHelper
        </Link>

        <div className="max-w-lg">
          <p className="text-sm font-semibold uppercase tracking-widest text-indigo-200">
            AI-powered university learning
          </p>

          <h1 className="mt-6 text-5xl font-bold leading-tight">
            Your learning journey starts here.
          </h1>

          <p className="mt-6 text-lg leading-8 text-indigo-100">
            Connect with your courses, explore learning materials,
            and get support from your AI learning assistant.
          </p>

          <div className="mt-10 rounded-2xl border border-white/20 bg-white/10 p-6">
            <p className="text-lg font-medium">
              "Learn smarter with AI assistance."
            </p>
            <p className="mt-3 text-sm text-indigo-200">
              TeacherHelper AI Learning Platform
            </p>
          </div>
        </div>

        <p className="text-sm text-indigo-200">
          © 2026 TeacherHelper AI
        </p>
      </section>

      {/* Right section */}
      <section className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="mb-10 lg:hidden">
            <Link href="/" className="text-2xl font-bold text-indigo-700">
              TeacherHelper
            </Link>
          </div>

          <Link
            href="/"
            className="text-sm text-slate-400 hover:text-indigo-600"
          >
            ← Back to home
          </Link>

          <h2 className="mt-8 text-3xl font-bold tracking-tight">
            Welcome back
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            Sign in to continue to your learning workspace.
          </p>

          <form className="mt-9 space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold"
              >
                Email address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@university.edu"
                required
                className="w-full rounded-xl border border-slate-200 px-4 py-3.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
              />
            </div>

            <div>
              <div className="mb-2 flex justify-between">
                <label
                  htmlFor="password"
                  className="text-sm font-semibold"
                >
                  Password
                </label>

                <Link
                  href="/forgot-password"
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
                >
                  Forgot password?
                </Link>
              </div>

              <input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                required
                className="w-full rounded-xl border border-slate-200 px-4 py-3.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
              />
            </div>

            <button
              type="button"
              className="w-full rounded-xl bg-indigo-600 py-4 text-sm font-semibold text-white shadow-lg shadow-indigo-100 transition hover:bg-indigo-700"
            >
              Sign in →
            </button>
          </form>

          <div className="mt-8 border-t border-slate-100 pt-6 text-center">
            <p className="text-sm text-slate-500">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="font-semibold text-indigo-600 hover:text-indigo-700"
              >
                Create account
              </Link>
            </p>
          </div>

          <p className="mt-10 text-center text-xs text-slate-400">
            Secure access for students, teachers, and administrators.
          </p>
        </div>
      </section>
    </main>
  );
}

