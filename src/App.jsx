import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import UserPagination from './components/UserPagination.jsx'
import Header from './components/header.jsx'
import Footer from './components/footer.jsx'
import { InfiniteScrolling } from './components/InfiniteScrolling.jsx'
import { SearchWithDebounce } from './components/SearchWithDebounce.jsx'
import LiveSearchAPI from './api/LiveSearchAPI.jsx'

import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <Header></Header>
        <LiveSearchAPI></LiveSearchAPI>
        <SearchWithDebounce></SearchWithDebounce>
        <InfiniteScrolling></InfiniteScrolling>
        <UserPagination></UserPagination>
        <Footer></Footer>
      </div>   
    </>
  )
}

export default App
