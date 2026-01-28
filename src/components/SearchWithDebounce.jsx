import { useEffect, useState } from "react"
export function SearchWithDebounce(){
    const [searchTerm, setSearchTerm] = useState('')
    const [debouncedSearch, setDebouncedSearch] = useState('')
    const [users, setUsers] = useState([])
    const [filteredUsers, setFilteredUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(()=>{
        const fetchAllUsers = async ()=>{
            try{
                setLoading(true)
                const response = await fetch(`https://jsonplaceholder.typicode.com/users`)

                if(!response.ok){
                    throw new Error("Failed to fetch the users")
                }
                const data = await response.json()
                setUsers(data)
                setFilteredUsers(data)
                setError(null)
            }
            catch(err){
                setError(err.message)
            }
            finally{
                setLoading(false)
            }
        }
        fetchAllUsers()
    },[])

    useEffect(()=>{
        const timer = setTimeout(()=>{
            setDebouncedSearch(searchTerm)
        }, 500)

        return () => {
            clearTimeout(timer)
        }

    }, [searchTerm])

    useEffect(()=>{
        if(!debouncedSearch.trim()){
            setFilteredUsers(users)
            return
        }

        const filtered = users.filter((user)=>{
            const searchLower = debouncedSearch.toLowerCase()
            const nameMatch = user.name.toLowerCase().includes(searchLower)
            const emailMatch = user.email.toLowerCase().includes(searchLower)
            return nameMatch || emailMatch
        })

        setFilteredUsers(filtered)
    }, [debouncedSearch, users])

    const handleChangeSearch = (event)=>{
        const value = event.target.value
        setSearchTerm(value)
    }

    const handleClearSearch = () => {
        setSearchTerm('');
        setDebouncedSearch('');
    };


    if(loading){
        return (
            <div>
                <p>Loading users...</p>
            </div>
        )
    }

    if(error){
        return (
            <div>
                <p>Error: {error}</p>
            </div>
        )
    }

    return (
        <>
        <div>
            <h2>Realtime search character by character</h2>

            <input
                type = "text"
                placeholder = "Search by name or email"
                value={searchTerm}
                onChange={handleChangeSearch}
            ></input>

            {searchTerm && (
                <button
                    onClick = {handleClearSearch}
                >x Clear</button>
            )}
        </div>

        <div>
            {debouncedSearch ? (
                <p>Searching for: <strong>"{debouncedSearch}"</strong></p>
            ) : 
                <p>Start typing to search</p>
            }
        </div>

        <p>
            Showing {filteredUsers.length} out of {users.length}
        </p>
        
        {filteredUsers.length > 0 ? (
            <div>
                {filteredUsers.map((user) => (
                    <div key={user.id} className="user-card">
                        <h3>
                            {highlightText(user.name, debouncedSearch)}
                        </h3>
                        <p>
                            {highlightText(user.email, debouncedSearch)}
                        </p>
                        <p>{user.company.name}</p>
                        <p>{user.website}</p>
                    </div>
                ))}
            </div>
        ) : (
            <p>
                No users found matching "{debouncedSearch}". Try a different search
            </p>
        )}
        </>
    )
}

function highlightText(text, highlight){
    if(!highlight.trim()){
        return text
    }

    const regex = new RegExp(`(${highlight})`, 'gi');
    const parts = text.split(regex)

    return (
        <span>
            {parts.map((part, index)=>regex.test(part)?(
                <strong key = {index} > {part} </strong>
            ):(
                <span key={index}>{part}</span>
            )
            )}
        </span>
    )
}