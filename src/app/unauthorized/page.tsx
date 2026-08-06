import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
      <section className="w-full max-w-md rounded-xl bg-white p-8 text-center shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">Access denied</h1>
        <p className="mt-3 text-gray-600">
          You do not have permission to view this page.
        </p>
        <Link
          href="/login"
          className="mt-6 inline-flex rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
        >
          Go to login
        </Link>
      </section>
    </main>
  );
}
