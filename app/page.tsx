import UserTable from "@/components/UserTable";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 dark:bg-slate-950 sm:px-6 lg:px-10 lg:py-12">
      <div className="mx-auto w-full max-w-6xl">
        <UserTable />
      </div>
    </main>
  );
}
