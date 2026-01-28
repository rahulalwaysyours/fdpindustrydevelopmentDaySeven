import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import UserPagination from './components/UserPagination.jsx'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <UserPagination></UserPagination>
      </div>   
    </>
  )
}

export default App
