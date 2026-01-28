import { useEffect, useState } from "react"
import { getUsersPaginated } from './userService';

export function PaginatedList() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [users, setUsers] = useState([]);

    const POSTS_PER_PAGE = 10;
    const TOTAL_POSTS = 100;
    const totalPages = Math.ceil(TOTAL_POSTS / POSTS_PER_PAGE); 


    useEffect(() => {
        const fetchPosts = async () => {
            try{
                // const response = await fetch(
                // `https://reqres.in/api/users?page=${page}&per_page=${POSTS_PER_PAGE}`, 
                // { headers: { 'x-api-key': 'reqres_9c58e2a469fe4984bf1dc39255ee611d' } }
                // );
                const response = await getUsersPaginated(page, POSTS_PER_PAGE)

                const data = response.data.data;
                setUsers(data);
            } catch (err) {
                const errorMessage = err.response?.message || err.message || 'Failed to fetch the users';
                setError(errorMessage);
            } finally {
                setLoading = false;
            }
        };

        fetchPosts();
    },[page]);

    const handleNext = () => {
        setPage((prevPage) => Math.min(totalPages, prevPage+1));
    };

    const handlePrevious = () => {
        setPage((prevPage)=>Math.max(1, prevPage - 1));
    };

    const goToPage = (pageNumber) => {
        setPage(pageNumber);
    };

    return (
        <div>
            <h2>Paginated List</h2>
            <br />
            <strong>useEffect runs whenever 'page' changes</strong>

            <span>
                Page {page} of {totalPages}
            </span>

            <div>
                <button
                    onClick={handleNext}
                    disabled={page === totalPages || loading}
                >
                    Next
                </button>

                <button
                    onClick={handlePrevious}
                    disabled={page === 1 || loading}
                >
                    Previous
                </button>
            </div>

            {loading && <p>Loading Posts for page {page}</p>}
            {error && <p>Error: {error}</p>}

            {!loading && !error && (
                <div>
                    {users.map((user) => (
                        <div key={user.id}>
                            <h3>Post #{(page-1) * POSTS_PER_PAGE + users.indexOf(user) + 1}</h3>
                            {/* <h4>{user.title}</h4>
                            <p>{user.body}</p> */}
                            <img 
                            src={user.avatar} 
                            alt={`${user.first_name} ${user.last_name}`}
                            style={{ width: '60px', height: '60px', borderRadius: '50%' }}
                            />
                            <div>
                            <h3>{user.first_name} {user.last_name}</h3>
                            <p style={{ margin: '5px 0', color: '#666' }}>{user.email}</p>
                            <p style={{ margin: '5px 0', fontSize: '0.9em', color: '#888' }}>User ID: {user.id}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="page-jumper">
                <p>Jump to page:</p>
                <div className="page-buttons">
                {/* Create buttons for each page */}
                {[...Array(totalPages)].map((_, index) => {
                    const pageNum = index + 1;
                    return (
                    <button
                        key={pageNum}
                        onClick={() => goToPage(pageNum)}
                        className={`${page === pageNum ? 'active' : ''}`}
                        disabled={loading}
                    >
                        {pageNum}
                    </button>
                    );
                })}
                </div>
            </div>
        </div>
    );
};