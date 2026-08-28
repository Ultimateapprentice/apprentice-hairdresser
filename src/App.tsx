import { Link, Route, Routes } from "react-router-dom";
import { Home, GraduationCap, ShieldCheck, Users } from "lucide-react";
import "./App.css";

function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-10">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-slate-500">
            Standalone platform
          </p>
          <h1 className="font-heading text-4xl font-bold tracking-tight">
            Apprentice Hairdresser
          </h1>
          <p className="mt-3 max-w-2xl font-body text-slate-600">
            Competency and compliance platform foundation. The application has
            been separated from Ivorey and is ready for feature migration.
          </p>
        </div>

        <section className="grid gap-4 md:grid-cols-3">
          <Feature icon={<GraduationCap />} title="Apprentice" text="Progress, activities and evidence." />
          <Feature icon={<ShieldCheck />} title="Assessment" text="Evidence review and unit sign-off." />
          <Feature icon={<Users />} title="Employer & RTO" text="Visibility, administration and reporting." />
        </section>

        <div className="mt-10 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-heading text-xl font-semibold">Migration foundation ready</h2>
          <p className="mt-2 text-slate-600">
            Read <code>SoT.md</code> before implementing the database, authentication,
            evidence storage and production workflows.
          </p>
        </div>
      </div>
    </main>
  );
}

function Feature({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 text-slate-700">{icon}</div>
      <h2 className="font-heading text-lg font-semibold">{title}</h2>
      <p className="mt-2 text-sm text-slate-600">{text}</p>
    </div>
  );
}

function NotFound() {
  return (
    <main className="min-h-screen bg-slate-50 p-10">
      <Link className="text-slate-700 underline" to="/">
        Return home
      </Link>
    </main>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
