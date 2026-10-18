import Link from "next/link";
import { axiosInstance } from "@/axios/axiosconfig"; // Ensure this path is correct
import { CollegeRatingAPI } from "./backendapi";

export const instant = false;


interface College {
  _id: string;
  aishe_code: string;
  college_name: string;
  city: string;
  state: string;
  average_rating: number;
  review_count: number;
}

interface ApiResponse {
  data: College[];
  pagination: {
    page: number;
    totalPages: number;
    totalItems?: number;
  };
}

const EMPTY_RESPONSE: ApiResponse = {
  data: [],
  pagination: {
    page: 1,
    totalPages: 0,
    totalItems: 0,
  },
};

async function getColleges(query: string, page: number): Promise<ApiResponse> {
  // Matches the backend expectations: ?search=&page=&limit=
  const params = new URLSearchParams({
    search: query,
    page: String(page),
    limit: "6",
  });

  try {
    // const response = await axiosInstance.Get(
    //   `/dashbords/list/dashbord?${params.toString()}`
    // );
    const response = await axiosInstance.Get(CollegeRatingAPI(params.toString()));

    const result = response.data;

    if (!result || !Array.isArray(result.data)) {
      console.error("Unexpected college API response:", result);
      return EMPTY_RESPONSE;
    }

    // Fixed mapping: Read from result.meta instead of result.pagination
    return {
      data: result.data,
      pagination: {
        page: Number(result.meta?.page) || page,
        totalPages: Math.max(0, Number(result.meta?.totalPages) || 0),
        totalItems: Number(result.meta?.total) || 0,
      },
    };
  } catch (error) {
    console.error("Error fetching colleges:", error);
    return EMPTY_RESPONSE;
  }
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  // Opt out of static rendering so search parameters work dynamically
  // await connection();

  const params = await searchParams;
  const query = params.q ?? "";

  const parsedPage = Number(params.page);
  const currentPage = Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;

  const { data: colleges, pagination } = await getColleges(query, currentPage);

  const totalPages = pagination.totalPages;
  const previousPage = Math.max(1, currentPage - 1);
  const nextPage = currentPage + 1;

  return (
    <div className="min-h-screen bg-zinc-50 p-6 font-sans dark:bg-gray-900 sm:p-12">
      {/* Top Navigation Bar */}
      <nav className="mb-10 flex items-center justify-between">
        {/* Optional: Add a logo or app name here on the left */}
        <div className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
          {/* College Reviews */}
        </div>
        
        {/* Login Button on the right */}
        <Link
          href="auth/login" // Change to your actual login route (e.g., /student/login)
          className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"
        >
          Login
        </Link>
      </nav>
      <main className="mx-auto flex max-w-5xl flex-col gap-8">
        
        <header>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Colleges &amp; Ratings
          </h1>
          <p className="mt-1 text-zinc-600 dark:text-zinc-400">
            Browse institutions, average ratings, and student feedback.
          </p>
        </header>

        {/* Search Form */}
        <form
          method="GET"
          action="/"
          className="flex w-full max-w-md flex-wrap gap-2"
        >
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Search college, city, or AISHE..."
            className="min-w-0 flex-1 rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          />

          <button
            type="submit"
            className="rounded-lg bg-zinc-900 px-5 py-2 text-sm font-medium text-white hover:opacity-90 dark:bg-zinc-100 dark:text-zinc-900"
          >
            Search
          </button>

          {query && (
            <Link
              href="/"
              className="flex items-center rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-600 dark:border-zinc-700 dark:text-zinc-400"
            >
              Reset
            </Link>
          )}
        </form>

        {/* Grid Display */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {colleges.map((college) => (
            <article
              key={college._id}
              className="flex flex-col rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition-all hover:border-zinc-400 dark:border-zinc-800 dark:bg-[#121212] dark:hover:border-zinc-600"
            >
              <div className="mb-2 flex items-start justify-between gap-2">
                <h2 className="text-lg font-semibold leading-snug text-zinc-900 dark:text-zinc-50">
                  {college.college_name}
                </h2>
                <span className="whitespace-nowrap rounded bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                  {college.aishe_code}
                </span>
              </div>

              <p className="mb-6 text-sm text-zinc-500 dark:text-zinc-400">
                {[college.city, college.state].filter(Boolean).join(", ")}
              </p>

              <div className="mt-auto flex items-center justify-between border-t border-zinc-100 pt-3 dark:border-zinc-800">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm text-amber-500">★</span>
                  <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    {Number(college.average_rating) > 0
                      ? Number(college.average_rating).toFixed(1)
                      : "No ratings"}
                  </span>
                  <span className="text-xs text-zinc-500">
                    ({Number(college.review_count) || 0})
                  </span>
                </div>
                {/* <Link
                  href={`/colleges/${encodeURIComponent(college._id)}`}
                  className="text-xs font-medium text-blue-600 hover:underline dark:text-blue-400"
                >
                  View Reviews →
                </Link> */}
              </div>
            </article>
          ))}

          {colleges.length === 0 && (
            <div className="col-span-full py-16 text-center text-zinc-500 dark:text-zinc-400">
              No colleges available. Try adjusting your search.
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <nav
            aria-label="College pagination"
            className="mt-6 flex items-center justify-center gap-4"
          >
            {currentPage > 1 ? (
              <Link
                href={{
                  pathname: "/",
                  query: { ...(query ? { q: query } : {}), page: previousPage },
                }}
                className="rounded-md border border-zinc-300 px-4 py-2 text-sm text-zinc-800 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
              >
                Previous
              </Link>
            ) : (
              <span className="pointer-events-none rounded-md border border-zinc-300 px-4 py-2 text-sm opacity-40 dark:border-zinc-700">
                Previous
              </span>
            )}

            <span className="text-sm text-zinc-600 dark:text-zinc-400">
              Page {pagination.page} of {totalPages}
            </span>

            {currentPage < totalPages ? (
              <Link
                href={{
                  pathname: "/",
                  query: { ...(query ? { q: query } : {}), page: nextPage },
                }}
                className="rounded-md border border-zinc-300 px-4 py-2 text-sm text-zinc-800 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
              >
                Next
              </Link>
            ) : (
              <span className="pointer-events-none rounded-md border border-zinc-300 px-4 py-2 text-sm opacity-40 dark:border-zinc-700">
                Next
              </span>
            )}
          </nav>
        )}
      </main>
    </div>
  );
}