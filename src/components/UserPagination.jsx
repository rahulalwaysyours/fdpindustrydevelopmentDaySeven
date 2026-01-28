import { useEffect, useState } from "react";

export default function UserPagination() {
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const USERS_PER_PAGE = 6;

    useEffect(() => {
    const fetchUsers = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(
                `https://reqres.in/api/users?page=${page}&per_page=6`,
                {
                    headers: {
                        "x-api-key": import.meta.env.VITE_REQRES_API_KEY,
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Failed to fetch users");
            }

            const result = await response.json();
            setUsers(result.data);
            setTotalPages(result.total_pages);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    fetchUsers();
}, [page]);

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <h2 className="text-2xl font-bold text-center mb-6">
                User Pagination (ReqRes API)
            </h2>

            {loading && (
                <p className="text-center text-blue-600">
                    Loading users...
                </p>
            )}

            {error && (
                <p className="text-center text-red-600">
                    {error}
                </p>
            )}

            {!loading && !error && (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {users.map((user) => (
                            <div
                                key={user.id}
                                className="bg-white rounded-lg shadow p-4 text-center"
                            >
                                <img
                                    src={user.avatar}
                                    alt={user.first_name}
                                    className="w-24 h-24 mx-auto rounded-full mb-3"
                                />
                                <h3 className="text-lg font-semibold">
                                    {user.first_name} {user.last_name}
                                </h3>
                                <p className="text-sm text-gray-600">
                                    {user.email}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Pagination Controls */}
                    <div className="flex justify-center items-center gap-2 mt-8">
                        <button
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                        >
                            Previous
                        </button>

                        {[...Array(totalPages)].map((_, index) => {
                            const pageNum = index + 1;
                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => setPage(pageNum)}
                                    className={`px-4 py-2 rounded ${
                                        page === pageNum
                                            ? "bg-blue-600 text-white"
                                            : "bg-gray-200"
                                    }`}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}

                        <button
                            onClick={() =>
                                setPage((p) => Math.min(totalPages, p + 1))
                            }
                            disabled={page === totalPages}
                            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
