
import Link from "next/link";

const features = [
  {
    icon: "✦",
    title: "AI Learning Assistant",
    description:
      "Ask questions and receive explanations based on your actual course materials.",
  },
  {
    icon: "▤",
    title: "Course-Based Learning",
    description:
      "Access your enrolled courses, lectures, laboratory lessons, and assignments.",
  },
  {
    icon: "⌕",
    title: "Reliable Sources",
    description:
      "Explore the document and page references behind AI-generated answers.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* Navigation */}
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <Link href="/" className="text-2xl font-bold tracking-tight">
          <span className="text-indigo-600">Teacher</span>Helper
        </Link>

        <div className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
          <a href="#features" className="hover:text-indigo-600">
            Features
          </a>
          <a href="#about" className="hover:text-indigo-600">
            About
          </a>
        </div>

        <Link
          href="/login"
          className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >
          Sign in →
        </Link>
      </nav>

      {/* Hero */}
      <section className="mx-auto grid max-w-7xl items-center gap-16 px-6 py-20 lg:grid-cols-2 lg:py-28">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700">
            <span>✦</span>
            AI-powered university learning
          </div>

          <h1 className="mt-8 text-5xl font-bold leading-tight tracking-tight md:text-6xl">
            Learn smarter.
            <br />
            <span className="text-indigo-600">
              Learn with AI.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-500">
            Your personal AI learning assistant helps you understand
            university courses using learning materials approved by
            your teachers.
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            <Link
              href="/login"
              className="rounded-xl bg-indigo-600 px-7 py-4 font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700"
            >
              Get started →
            </Link>

            <a
              href="#features"
              className="rounded-xl border border-slate-200 px-7 py-4 font-semibold transition hover:bg-slate-50"
            >
              Explore features
            </a>
          </div>

          <p className="mt-6 text-sm text-slate-400">
            Designed for students and teachers.
          </p>
        </div>

        {/* Chat preview */}
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-2xl shadow-slate-200/60 md:p-8">
          <div className="flex items-center justify-between border-b border-slate-200 pb-5">
            <div>
              <h2 className="font-bold">AI Learning Assistant</h2>
              <p className="mt-1 text-xs text-slate-400">
                Your course assistant
              </p>
            </div>
            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
              ● Online
            </span>
          </div>

          <div className="space-y-6 py-8">
            <div className="ml-auto max-w-[85%] rounded-2xl rounded-tr-sm bg-indigo-600 p-4 text-sm leading-6 text-white">
              Can you explain the main topic of this course?
            </div>

            <div className="max-w-[90%] rounded-2xl rounded-tl-sm border border-slate-200 bg-white p-5">
              <p className="text-sm font-semibold">
                ✦ AI Assistant
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Of course! Based on your course syllabus, this course
                introduces its fundamental concepts and practical
                applications.
              </p>
              <div className="mt-4 rounded-xl bg-indigo-50 p-3">
                <p className="text-xs font-semibold text-indigo-700">
                  Source reference
                </p>
                <p className="mt-1 text-xs text-indigo-600">
                  Course Syllabus · Page 2
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-400">
            Ask a question about your course...
          </div>

          <p className="mt-3 text-center text-xs text-slate-400">
            Example conversation · Demonstration only
          </p>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-slate-50 px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-indigo-600">
              Platform features
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
              Everything you need for better learning
            </h2>
            <p className="mt-4 leading-7 text-slate-500">
              One platform connecting students, teachers, and
              course-specific artificial intelligence.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-slate-200 bg-white p-8 transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-2xl text-indigo-600">
                  {feature.icon}
                </div>
                <h3 className="mt-6 text-lg font-bold">
                  {feature.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-500">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="px-6 py-24">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold">
            Learning supported by teachers. Enhanced by AI.
          </h2>
          <p className="mt-6 leading-8 text-slate-500">
            TeacherHelper connects university course materials with
            AI technology. Teachers manage the learning resources,
            while students receive course-specific assistance
            whenever they need it.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 px-6 py-8">
        <div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-4 text-sm text-slate-400">
          <p>© 2026 TeacherHelper AI</p>
          <p>Teacher-Centered AI Learning Assistant System</p>
        </div>
      </footer>
    </main>
  );
}
