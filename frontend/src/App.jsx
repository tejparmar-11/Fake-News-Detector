import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'

import Home from './pages/Home'
import Analyze from './pages/Analyze'
import Trending from './pages/Trending'
import History from './pages/History'

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/analyze" element={<Analyze />} />
        <Route path="/trending" element={<Trending />} />
        <Route path="/history" element={<History />} />
      </Routes>

    </BrowserRouter>
  )
}