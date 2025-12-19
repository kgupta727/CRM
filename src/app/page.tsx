import Link from "next/link";

export default function Home() {
  return (
    <div className="grid gap-6">
      <section className="rounded-lg border bg-white p-6">
        <h1 className="text-2xl font-semibold">Welcome to the Internal CRM</h1>
        <p className="mt-2 text-zinc-600">
          Quickly register sales calls, generate leads, document meeting notes, and view
          team activity. Integrations (email, calls, WhatsApp) will come next.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link className="rounded bg-black px-4 py-2 text-white" href="/leads">
            New Lead
          </Link>
          <Link className="rounded border px-4 py-2" href="/activities">
            Log Activity
          </Link>
          <Link className="rounded border px-4 py-2" href="/analytics">
            View Analytics
          </Link>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border bg-white p-4">
          <h2 className="font-medium">Efficiency Tips</h2>
          <ul className="mt-2 list-disc pl-5 text-sm text-zinc-700">
            <li>Use quick actions to avoid context switching.</li>
            <li>Log brief notes immediately; enrich later.</li>
            <li>Pin overdue tasks for daily triage.</li>
          </ul>
        </div>
        <div className="rounded-lg border bg-white p-4">
          <h2 className="font-medium">Today&apos;s Focus</h2>
          <p className="mt-2 text-sm text-zinc-700">Add leads and capture activities.</p>
        </div>
        <div className="rounded-lg border bg-white p-4">
          <h2 className="font-medium">Upcoming</h2>
          <p className="mt-2 text-sm text-zinc-700">Email & WhatsApp integrations, click-to-call.</p>
        </div>
      </section>
    </div>
  );
}
