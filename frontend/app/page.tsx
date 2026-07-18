import Twin from '@/components/twin';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f6f7f9] text-slate-900">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-5 sm:px-6 lg:px-8">
        <section className="mb-5 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-teal-700">
              Digital Twin
            </p>
            <h1 className="text-3xl font-semibold text-slate-950 sm:text-4xl">
              Behrad Zabihi
            </h1>
          </div>
          <p className="max-w-xl text-sm leading-6 text-slate-600 sm:text-right">
            A focused professional chat about data science, AI engineering, projects, and career fit.
          </p>
        </section>

        <div className="flex-1">
          <Twin />
        </div>
      </div>
    </main>
  );
}
